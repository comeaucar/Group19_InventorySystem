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
  CardActions
} from "@mui/material";
import { getDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const pDocRef = doc(db, "products", id);
        const pSnap = await getDoc(pDocRef);

        setProduct({
          id: id,
          pricePer: pSnap.data().pricePer.toFixed(2),
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
      navigate("/dashboard");
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
              <h1>Edit {product.id}</h1>
              <Stack spacing={2}>
                <TextField
                  name="pricePer"
                  label="Price"
                  value={product.pricePer}
                  onChange={handleChange}
                  required
                />

                <CardActionArea>
                  <CardActions>
                    <Button
                      type="cancel"
                      variant="contained"
                      color="error"
                      disabled={isSaving}
                      endIcon={<CancelIcon />}
                      onClick={() => navigate('/dashboard')}
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
                </CardActionArea>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default EditProduct;
