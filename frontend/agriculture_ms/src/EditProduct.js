import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  CardActions,
  InputAdornment,
  Snackbar,
  CardHeader,
  Typography,
  Chip,
  Grid
} from "@mui/material";
import {
  getDoc,
  updateDoc,
  doc,
  increment,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import SellIcon from "@mui/icons-material/Sell";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [sellQty, setSellQty] = React.useState(0);
  const [snack, setSnack] = React.useState({
    msg: "",
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [batches, setBatches] = React.useState([]);
  const [sales, setSales] = React.useState([]);

  const { open } = snack;

  React.useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const pDocRef = doc(db, "products", id);
        const pSnap = await getDoc(pDocRef);

        const batchesRef = collection(pDocRef, "batches");
        const salesRef = collection(pDocRef, "sales");

        const batchesSnap = await getDocs(batchesRef);
        const salesSnap = (await getDocs(salesRef)).docs;
        setBatches(batchesSnap.docs);
        let sales = salesSnap.map((saleDoc) => {
          return {
            id: saleDoc.id,
            data: saleDoc.data(),
          };
        });

        setSales(sales); // Use 'sales' instead of 'salesSnap.docs'

        console.log(sales);

        setProduct({
          id: id,
          pricePer: pSnap.data().pricePer.toFixed(2),
          quantity: pSnap.data().quantity,
          avgCost: pSnap.data().avgCost,
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const handleSubmitSell = async (event) => {
    setIsSaving(true);
    event.preventDefault();

    try {
      const productRef = doc(db, "products", product.id);
      const salesRef = collection(productRef, "sales");
      setSellQty(parseInt(sellQty));
      const sellValue = (sellQty * product.pricePer).toFixed(2);
      const newVal = (product.quantity - sellQty) * product.avgCost;

      const newSale = {
        productPrice: product.pricePer,
        numSold: parseInt(sellQty),
        timestamp: Date.now(),
        saleValue: parseFloat(sellValue),
      };

      await updateDoc(productRef, {
        sold: increment(sellValue),
        quantity: increment(sellQty * -1),
        totalValue: newVal,
        numSold: increment(sellQty),
      });

      const salesDocRef = await addDoc(salesRef, newSale);
      setSales([...sales, {id: salesDocRef.id, data: newSale}])
      setProduct({ ...product, quantity: product.quantity - sellQty });
      setSnack({
        ...snack,
        msg: `${sellQty} ${product.id} sold! (+$${sellValue})`,
        open: true,
      });
    } catch (err) {
      setSnack({ ...snack, msg: "Error selling product", open: true });
    } finally {
      setIsSaving(false);
    }

    setSellQty(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      // Save product details to Firestore
      const pDocRef = doc(db, "products", id);
      await updateDoc(pDocRef, {
        pricePer: parseFloat(product.pricePer),
      });

      // Then navigate back to the Dashboard
      setSnack({
        ...snack,
        msg: `Successfully updated price for ${product.id}`,
        open: true,
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={snack.msg}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <Button
            onClick={() => {
              setSnack({ ...snack, open: false });
            }}
          >
            Dismiss
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ marginTop: "10px" }}>
        {/* Edit and Sell Cards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Stack spacing={3}>
                {/* Edit Product */}
                <Card color="primary">
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <h1>Edit {product.id}</h1>
                      <Stack spacing={2}>
                        <TextField
                          name="pricePer"
                          label="Price"
                          type="number"
                          color="money"
                          value={product.pricePer}
                          onChange={handleChange}
                          required
                        />
                        <CardActions>
                          <Button
                            type="submit"
                            variant="contained"
                            color="tertiary"
                            disabled={isSaving}
                            endIcon={<AddIcon />}
                          >
                            Save
                          </Button>
                        </CardActions>
                      </Stack>
                    </form>
                  </CardContent>
                </Card>

                {/* Sell Product */}
                <Card color="primary">
                  <CardContent>
                    <form onSubmit={handleSubmitSell}>
                      <h1>Sell {product.id}</h1>
                      <Stack spacing={2}>
                        <TextField
                          color="money"
                          name="sellQty"
                          label="Quantity"
                          value={sellQty}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                /{product.quantity}
                              </InputAdornment>
                            ),
                          }}
                          error={sellQty > product.quantity}
                          onChange={(qty) => setSellQty(qty.target.value)}
                          required
                        />
                        <CardActions>
                          <Button
                            type="submit"
                            variant="contained"
                            color="tertiary"
                            disabled={isSaving}
                            endIcon={<SellIcon />}
                          >
                            Sell
                          </Button>
                        </CardActions>
                      </Stack>
                    </form>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* History Cards */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Purchase History */}
            <Card>
              <CardContent>
                <h1>Purchase History</h1>
                {batches.length > 0 ? (
                  batches.map((batchDoc) => {
                    const batch = batchDoc.data();
                    return (
                      <div key={batchDoc.id}>
                        <h2>Order ID: {batchDoc.id}</h2>
                        <p>
                          <strong>Cost Per Item:</strong> ${batch.costPerItem}
                        </p>
                        <p>
                          <strong>Harvest Date:</strong>{" "}
                          {new Date(batch.harvestDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Expiry Date:</strong>{" "}
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Manufacturer:</strong> {batch.manufacturer}
                        </p>
                        <p>
                          <strong>Quantity:</strong>{" "}
                          {batch.quantity
                            ? batch.quantity
                            : batch.orderQuantity}
                        </p>
                        <p>
                          <strong>Cost:</strong>{" "}
                          <Chip
                            color="money"
                            label={
                              "$" +
                              ((batch.quantity
                                ? batch.quantity
                                : batch.orderQuantity) *
                                batch.costPerItem).toFixed(2)
                            }
                          ></Chip>
                        </p>
                        <hr />
                      </div>
                    );
                  })
                ) : (
                  <p>No purchases yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Sale History */}
            <Card>
              <CardContent>
                <h1>Sale History</h1>
                {sales.length > 0 ? (
                  sales.map((saleDocM) => {
                    const saleDoc = saleDocM.data;
                    return (
                      <div key={saleDocM.id}>
                        <h2>Sale ID: {saleDocM.id}</h2>
                        <p>
                          <strong>Sale Price:</strong> ${saleDoc.productPrice}
                        </p>
                        <p>
                          <strong>Date Sold:</strong>{" "}
                          {new Date(saleDoc.timestamp).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {saleDoc.numSold}
                        </p>
                        <p>
                          <strong>Sale Value:</strong>{" "}
                          <Chip
                            color="money"
                            label={"$" + (parseFloat(saleDoc.saleValue).toFixed(2))}
                          ></Chip>
                        </p>
                        <hr />
                      </div>
                    );
                  })
                ) : (
                  <p>No sales yet.</p>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditProduct;
