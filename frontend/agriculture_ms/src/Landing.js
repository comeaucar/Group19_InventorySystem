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
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { app } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";

function Landing() {
    const auth = getAuth(app);
    const navigate = useNavigate();
  //login
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordsDontMatch, setPasswordDontMatch] = React.useState(false)
  const [emailInUse, setEmailInUse] = React.useState(false);
  const [emailR, setEmailR] = React.useState("");
  const [passwordR, setPasswordR] = React.useState("");
  const [passwordCR, setPasswordCR] = React.useState("");
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [passwordResetSnack, setPasswordResetSnack] = React.useState(null)

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
      setLoginFailed(true);
    })
  };
  // register
  


  const handleEmailChangeR = (event) => {
    setEmailInUse(false);
    setEmailR(event.target.value);
  };

  const handlePasswordChangeR = (event) => {
    setPasswordDontMatch(false)
    setPasswordR(event.target.value);
  };

  const handlePasswordChangeCR = (event) => {
    setPasswordDontMatch(false);
    setPasswordCR(event.target.value);
  };

  const verifyPasswordsMatch = () => {
    if (passwordR === passwordCR) {
      return true;
    }
    setPasswordDontMatch(true);
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
          console.log(error.code);
          if (error.code.split('/')[1] == 'email-already-in-use') {
            setEmailInUse(true);
          }
        });
    } else {
      console.log("Passswords Do Not Match")
    }
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email).then((res) => {
      setPasswordResetSnack(true);
    }).catch((err) => {
      console.log(err);
    })
  }


  return (
    <Container maxWidth="lg">
      <Snackbar open={passwordResetSnack} autoHideDuration={6000} message="Password reset email sent!" onClose={() => setPasswordResetSnack(false)}/>
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
              {emailInUse ? <Typography>Email already in use!</Typography> : ''}
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
                {passwordsDontMatch ? <Typography>Passwords do not match.</Typography> : ''}
                <Button sx={{ marginTop: 5 }} type="submit" variant="contained">
                  Register
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: "50%", marginTop: 5 }}>
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
              <Box mb={2}>
                <Button onClick={resetPassword}>Forgot Password?</Button>
              </Box>
              {loginFailed ? <Typography>User not found</Typography> : ''}
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
