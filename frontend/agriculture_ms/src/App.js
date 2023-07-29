import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard"; // Assuming you have a Dashboard component
import Landing from "./Landing";
import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct";
import AddSupplier from "./AddSupplier";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import NavBar from "./NavBar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#af2727",
    },
    secondary: {
      main: "#818181",
    },
    tertiary: {
      main: "#7fdf72",
    },
    black: {
      main: "#000000",
    },
    money: {
      main: "#118C4F",
      contrastText: "#ffffff",
    },
  },
  overrides: {
    MuiSwitch: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
      },
      switchBase: {
        padding: 1,
        "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + $track": {
            opacity: 1,
            border: "none",
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        border: "1px solid #bdbdbd",
        backgroundColor: "#fafafa",
        opacity: 1,
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
    },
    MuiButton: {
      root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 48,
        padding: "0 30px",
      },
    },
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<NavBar />}>
                <Route
                  path="/dashboard"
                  element={<PrivateRoute Component={Dashboard} />}
                />
                <Route path="/landing" element={<Landing />} />
                <Route path="*" element={<Navigate to="/landing" replace />} />
                <Route
                  path="/addproduct"
                  element={<PrivateRoute Component={AddProduct} />}
                />
                <Route
                  path="/editproduct/:id"
                  element={<PrivateRoute Component={EditProduct} />}
                />
                <Route
                  path="/addsupplier"
                  element={<PrivateRoute Component={AddSupplier} />}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
