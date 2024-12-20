import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme, TextField, Box, Typography } from '@mui/material';
import { auth } from '../../data/firebaseConfig';
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth"; // Importer la fonction de réinitialisation de mot de passe
import logo from "../../../public/logo/logoOrse.png";
import illustrConnect from "../../../public/signUp.png";

export default function ResetPassword() {
    const theme = useTheme();
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(null);
    const [message, setMessage] = React.useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        try {
            // Envoi de l'email de réinitialisation du mot de passe
            await sendPasswordResetEmail(auth, email);
            setMessage("Un e-mail de réinitialisation a été envoyé. Vérifiez votre boîte de réception.");
            setEmail("")
        } catch (error) {
            setError("Erreur lors de la réinitialisation. Vérifiez votre adresse e-mail.");
            console.error("Erreur de réinitialisation :", error.message);
        }
    };

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
                                <Typography variant="h5" component="h5" sx={{ mb: 2, fontFamily: "sans-serif", fontSize: "40px"}}>
                                    Réinitialiser mon mot de passe
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
                                    <button className='btn btn-primary w-100' type="submit">
                                        Réinitialiser
                                    </button>
                                </form>
                                
                                {message && (
                                    <Typography color="success" sx={{ mt: 2 }} className="alert alert-success" role="alert">
                                        {message}
                                    </Typography>
                                )}

                                {error && (
                                    <Typography color="error" sx={{ mt: 2 }} className="alert alert-danger" role="alert">
                                        {error}
                                    </Typography>
                                )}
                            </Box>
                        </AppProvider>
                    </div>
                </div>
            </div>
        </>
    );
}
