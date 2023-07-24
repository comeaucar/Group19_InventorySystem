/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://traderoll-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

async function authenticate(req, res, next) {
  const idToken = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(401).send("You are not authorized to access this resource.");
  }
}

const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");

const app = express();
app.use(cors());
app.use(express.json());
app.use(authenticate);

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Missing fields" });
    }

    const user = await admin.auth().createUser({
      email: email,
      password: password,
    });

    return res.status(201).send({ uid: user.uid });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// Create a product
app.post("/products", async (req, res) => {
  const newProduct = req.body;
  const productRef = db.collection("products").doc();
  await productRef.set(newProduct);
  res.status(201).send(`Created a new product: ${productRef.id}`);
});

// Get all products
app.get("/products", async (req, res) => {
  const snapshot = await db.collection("products").get();
  let products = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
    products.push({ id, ...data });
  });
  res.status(200).send(products);
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
  const productID = req.params.id;
  const product = await db.collection("products").doc(productID).get();
  if (!product.exists) {
    res.status(404).send("Product with the given ID not found");
  } else {
    res.status(200).send(product.data());
  }
});

// Update a product by ID
app.put("/products/:id", async (req, res) => {
  const body = req.body;
  const productRef = db.collection("products").doc(req.params.id);
  await productRef.update(body);
  res.status(200).send("Product updated successfully");
});

exports.api = functions.https.onRequest(app);