import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme, TextField, Button, IconButton, InputAdornment, Box, Typography, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../../../public/logo/logoOrse.png";
import illustrConnect from "../../../public/signUp.png";
import { auth } from '../../data/firebaseConfig';
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

const providers = [{ id: 'credentials', name: 'Email and password' }];

const signIn = async (navigate, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Signing in with credentials: ${email}, ${password}`);
      if (email === email && password === password) {
        resolve({ error: null }); // Pas d'erreur si les identifiants sont corrects
        navigate("/dashboard/properties");
      } else {
        resolve({ error: 'Invalid credentials.' }); // Erreur si les identifiants sont incorrects
      }
    }, 300);
  });
};

export default function Login() {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false); // Nouvel état pour le spinner
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur
    setLoading(true); // Activer le spinner pendant la connexion

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigate("/dashboard/properties");
    } catch (error) {
      setError('Vérifier vos identifiants.');
      console.error("Erreur de connexion:", error.message);
    } finally {
      setLoading(false); // Désactiver le spinner après la tentative de connexion
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <div className='container'>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col">
            <AppProvider theme={theme}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                }}
              >
                <div className='d-flex justify-content-center mb-5'>
                  <img src={logo} alt="logo orse" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                </div>
                <Typography variant="h5" component="h1" sx={{ mb: 2, fontFamily: "sans-serif", fontSize: "40px" }}>
                  Se connecter
                </Typography>

                <form onSubmit={handleSubmit} className="p-2">
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Link to={"/resetpassword"}>Mot de passe oublié</Link>
                  {error && (
                    <Typography color="error" sx={{ mb: 2 }} className="alert alert-danger" role="alert">
                      {error}
                    </Typography>
                  )}
                  <Button
                    className='btn btn-primary w-100'
                    type="submit"
                    disabled={loading} // Désactiver le bouton pendant le chargement
                    variant="contained"
                    color="primary"
                    endIcon={loading ? <CircularProgress size={24} color="inherit" /> : null} // Afficher le spinner si en chargement
                  >
                    {loading ? '' : 'Connexion'}
                  </Button>
                </form>
              </Box>
            </AppProvider>
          </div>
          <div className="col d-none d-md-inline d-flex justify-content-center align-items-center">
            <img src={illustrConnect} alt="illustration de la connexion" className='w-100 ' />
          </div>
        </div>
      </div>
    </>
  );
}
