import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Stack } from "@mui/system";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { signOut } from "firebase/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "./firebase";

const NavBar = () => {
  const navigate = useNavigate(); // Moved inside the function component

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="black"
            variant="contained"
            onClick={() => navigate("/dashboard")}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "Montserrat Alternates, sans-serif",
              }}
            >
              HarvestHub
            </Typography>
          </Button>
          {auth.currentUser ? (
            <Box sx={{ marginLeft: "auto" }}>
              <Stack spacing={1} direction="row">
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate("/addproduct")}
                >
                  Add Product
                  <ControlPointIcon />
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate("/addsupplier")}
                >
                  Add Supplier
                  <ControlPointIcon />
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => signOut(auth)}
                >
                  Logout
                  <LogoutIcon />
                </Button>
              </Stack>
            </Box>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
      <Outlet /> {/* This is where child components will be rendered */}
    </Box>
  );
};

export default NavBar;
