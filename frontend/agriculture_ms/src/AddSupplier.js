import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  CardActions,

} from "@mui/material";
import {
  getDoc,
  collection,

  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

export default function AddSupplier() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState({
    city: "",
    country: "",
    postcode: "",
    province: "",
    street: "",
  });
  const [productsSold, setProductsSold] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRef = collection(db, "products");

        const productsSnap = await getDocs(productsRef);

        const products = productsSnap.docs.map((p) => ({
          id: p.id,
          ...p.data(),
        }));

        setProducts(products);
      } catch (err) {
        console.log("ERR GETTING DATA", err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangeLocation = (event, key) =>
    setLocation({
      ...location,
      [key]: event.target.value,
    });

  const handleChangeProductsSold = (event) =>
    setProductsSold(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to handle the submit event

    const manuDocRef = doc(db, "manufacturers", name);
    const setManuRef = setDoc(manuDocRef, {
      productsSold: productsSold,
      location: location,
      name: name,
    });

    productsSold.forEach(async (prod) => {
      console.log(prod);
      const prodRef = doc(db, "products", prod);

      const prodSnap = await getDoc(prodRef);

      if (!prodSnap.exists()) {
        console.log(`${prod} is new`);
        await setDoc(prodRef, {
          avgCost: 0,
          pricePer: 0,
          quantity: 0,
          sold: 0,
          totalValue: 0,
          category: [],
        });
      }
    });

    console.log("Added Supplier with id", setManuRef.id);
  };

  function capitalizeFirstLetter(string) {
    // Check if the string is not null or empty
    if (string && typeof string === "string") {
      let str = string.split(" ");
      let newStr = str.map((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      });
      return newStr.join(" ");
    } else {
      return string;
    }
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
              <h1>Add Supplier</h1>
              <Stack spacing={2}>
                <TextField
                  name="name"
                  label="Name"
                  color="success"
                  value={name}
                  onChange={handleChangeName}
                  required
                />
                {["city", "country", "postcode", "province", "street"].map(
                  (key) => (
                    <TextField
                      key={key}
                      name={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={location[key]}
                      onChange={(e) => handleChangeLocation(e, key)}
                      required
                    />
                  )
                )}
                <Autocomplete
                  multiple
                  id="productsSold"
                  options={products.map((product) => product.id)} // Available options
                  freeSolo
                  value={productsSold}
                  onChange={(event, newValue) => {
                    // Convert all new values to have first letter capitalized
                    const capitalizedProducts = newValue.map(
                      capitalizeFirstLetter
                    );

                    setProductsSold(capitalizedProducts);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Products Sold"
                      placeholder="Add product"
                    />
                  )}
                />

                <CardActions>
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    endIcon={<CancelIcon />}
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="tertiary"
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
}
