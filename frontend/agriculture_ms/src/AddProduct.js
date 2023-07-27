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
} from "@mui/material";
import { getDoc, collection, updateDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = React.useState();
  const [products, setProducts] = React.useState([])
  const [manus, setManus] = React.useState([]);
 const [isLoading, setIsLoading] = React.useState(true);
 const [isSaving, setIsSaving] = React.useState(false);
 const [error, setError] = React.useState(null);

  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const manusRef = collection(db, 'manufacturers');
        const productsRef = collection(db, 'products');

        const manusSnap = await getDocs(manusRef);
        const productsSnap = await getDocs(productsRef);

        const manus = manusSnap.docs.map((m) => ({
          id: m.id,
          ...m.data()
        }));

        const products = productsSnap.docs.map((p) => ({
          id: p.id,
          ...p.data()
        }));

        setManus(manus);
        setProducts(products);

        console.log(products);
      } catch (err) {
        console.log('ERR GETTING DATA', err);
      }
      setIsLoading(false);
    }

    fetchData();
  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    // Code to add the product to Firestore
    // Then navigate back to the Dashboard
    navigate("/");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Card color="primary">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <h1>Add Product</h1>
              <Stack spacing={2}>
                <Select
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
                    Save
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
