import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase";
import { useNavigate } from "react-router-dom";

function Landing() {
    const auth = getAuth(app);
    const navigate = useNavigate();
  //login
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("email:", email);
    console.log("Password:", password);

    signInWithEmailAndPassword(auth, email, password).then((res) => {
      console.log('res',res);
      navigate("/dashboard");
    }).catch((err) => {
      console.log(err);
    })
  };
  // register
  const [emailR, setEmailR] = React.useState("");
  const [passwordR, setPasswordR] = React.useState("");
  const [passwordCR, setPasswordCR] = React.useState("");

  const handleEmailChangeR = (event) => {
    setEmailR(event.target.value);
  };

  const handlePasswordChangeR = (event) => {
    setPasswordR(event.target.value);
  };

  const handlePasswordChangeCR = (event) => {
    setPasswordCR(event.target.value);
  };

  const verifyPasswordsMatch = () => {
    if (passwordR === passwordCR) {
      return true;
    }

    return false;
  };

  const handleSubmitR = (event) => {
    event.preventDefault();

    console.log("email:", emailR);
    console.log("Password:", passwordR);
    if (verifyPasswordsMatch()) {
      createUserWithEmailAndPassword(auth, emailR, passwordR)
        .then((userCredential) => {
          console.log("USER CREATED", userCredential.user);

          // Use navigate to go to Dashboard
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  return (
    <Container maxWidth="lg">
      <Box
        id="bg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Card sx={{ minWidth: "50%" }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
              Register
            </Typography>
            <form onSubmit={handleSubmitR}>
              <Box mb={2}>
                <TextField
                  type="email"
                  id="emailR"
                  name="emailR"
                  required
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={emailR}
                  onChange={handleEmailChangeR}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="password"
                  id="passwordR"
                  name="passwordR"
                  required
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={passwordR}
                  onChange={handlePasswordChangeR}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="password"
                  id="passwordCR"
                  name="passwordCR"
                  required
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  value={passwordCR}
                  onChange={handlePasswordChangeCR}
                />
                <Button sx={{ marginTop: 5 }} type="submit" variant="contained">
                  Register
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "50%" }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  required
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  required
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Box>
              <Box mb={2} pl={7}>
                <FormControlLabel
                  control={<Checkbox id="remember" name="rememberme" />}
                  label="Remember Me"
                />
              </Box>
              <Box mb={2}>
                <Button>Forgot Password?</Button>
              </Box>
              <Box>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Landing;
