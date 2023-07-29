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
  CardHeader,
  CardActionArea,
  CardActions,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  getDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  addDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { products as iProducts } from "./ProductsDummy";
import { manu as iManus } from "./manuSeed";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

const today = dayjs();
const yesterday = dayjs().subtract(1, "day");
const tomorrow = dayjs().add(1, "day");
const todayStartOfTheDay = today.startOf("day");

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = React.useState("");
  const [manu, setManu] = React.useState("");
  const [products, setProducts] = React.useState(iProducts);
  const [manus, setManus] = React.useState(iManus);
  const [filteredManus, setFilteredManus] = React.useState(iManus);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [qty, setQty] = React.useState(0);
  const [costPer, setCostPer] = React.useState(0);
  const [harvestDate, setHarvestDate] = React.useState(yesterday);
  const [expiryDate, setExpiryDate] = React.useState(tomorrow);

  const handleChange = (event) => {
    setProduct(event.target.value);

    const filteredManufacturers = manus.filter((m) => {
      return m.productsSold.includes(event.target.value);
    });

    setFilteredManus(filteredManufacturers);

    if (!filteredManufacturers.some((m) => m.name === manu)) {
      setManu("");
    }
  };

  const handleChangeManu = (event) => {
    setManu(event.target.value);
  };

  const handleChangeQty = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    const val = Math.floor(parseInt(value));
    setQty(value);
  };

  const handleChangeCostPer = (event) => {
    let value = event.target.value;
    if (value < 0) {
      value = 0;
    }
    setCostPer(value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const manusRef = collection(db, "manufacturers");
        const productsRef = collection(db, "products");

        const manusSnap = await getDocs(manusRef);
        const productsSnap = await getDocs(productsRef);

        const manus = manusSnap.docs.map((m) => ({
          id: m.id,
          ...m.data(),
        }));

        const products = productsSnap.docs.map((p) => ({
          id: p.id,
          ...p.data(),
        }));

        setManus(manus);
        setProducts(products);

        console.log(products);
      } catch (err) {
        console.log("ERR GETTING DATA", err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const productRef = doc(db, "products", product);

    const batchesRef = collection(productRef, "batches");

    const cp = parseFloat(costPer);
    const q = Math.floor(parseInt(qty));

    const newBatch = {
      costPerItem: cp,
      quantity: q,
      harvestDate: new Date(harvestDate).getTime(),
      expiryDate: new Date(expiryDate).getTime(),
      manufacturer: manu,
    };

    const productDoc = (await getDoc(productRef)).data();

    const locTotalValue = q * cp;

    const newAvgCost =
      (locTotalValue + productDoc.totalValue) / (productDoc.quantity + q);

    await updateDoc(productRef, {
      quantity: increment(q),
      avgCost: newAvgCost,
      totalValue: increment(locTotalValue),
      totalSpent: increment(locTotalValue),
    });
    const batchDocRef = await addDoc(batchesRef, newBatch);

    console.log("New batch added with id: ", batchDocRef.id);
    navigate("/dashboard");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <Container maxWidth="lg" sx={{ marginTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <Card color="primary" sx={{ width: "50%" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <h1>Add Product</h1>
              <Stack spacing={2}>
                <InputLabel id="selectProductLabel">Product</InputLabel>
                <Select
                  labelId="selectProductLabel"
                  color="success"
                  name="product"
                  value={product}
                  onChange={handleChange}
                  required
                >
                  {products.map((product, index) => {
                    return (
                      <MenuItem key={index} value={product.id}>
                        {product.id}
                      </MenuItem>
                    );
                  })}
                </Select>
                <InputLabel id="selectManuLabel">Supplier</InputLabel>
                <Select
                  labelId="selectManuLabel"
                  color="success"
                  name="manu"
                  value={manu}
                  onChange={handleChangeManu}
                  required
                >
                  {filteredManus.map((fManu, index) => {
                    return (
                      <MenuItem key={index} value={fManu.name}>
                        {fManu.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <DatePicker
                  label="Harvested"
                  id="harvestDate"
                  disableFuture
                  value={harvestDate}
                  onChange={(value) => setHarvestDate(value)}
                />
                <DatePicker
                  label="Expiry"
                  id="expiryDate"
                  value={expiryDate}
                  disablePast
                  onChange={(value) => setExpiryDate(value)}
                />
                <InputLabel id="qty">Quantity</InputLabel>
                <TextField
                  type="number"
                  value={qty}
                  id="qty"
                  onChange={handleChangeQty}
                  min="0"
                ></TextField>
                <InputLabel id="costPer">Cost/Item</InputLabel>
                <TextField
                  type="number"
                  value={costPer}
                  id="costPer"
                  onChange={handleChangeCostPer}
                  min="0"
                ></TextField>
                <CardActions>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    disabled={isSaving}
                    endIcon={<CancelIcon />}
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="tertiary"
                    disabled={isSaving}
                    endIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </CardActions>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AddProduct;
