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
} from "@mui/material";
import {
  getDoc,
  updateDoc,
  doc,
  increment,
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

  const { open } = snack;

  React.useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const pDocRef = doc(db, "products", id);
        const pSnap = await getDoc(pDocRef);

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
      setSellQty(parseInt(sellQty));
      const sellValue = (sellQty * product.pricePer).toFixed(2);
      const newVal = (product.quantity - sellQty) * product.avgCost;

      await updateDoc(productRef, {
        sold: increment(sellValue),
        quantity: increment(sellQty * -1),
        totalValue: newVal,
        numSold: increment(sellQty),
      });
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Button
                type="cancel"
                variant="contained"
                color="error"
                disabled={isSaving}
                endIcon={<CancelIcon />}
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
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
      </Box>
    </Container>
  );
};

export default EditProduct;
