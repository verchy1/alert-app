import React, { useState, useEffect } from 'react';
import { Typography, TextField, Stack, Grid } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { auth } from '../../data/firebaseConfig';
import { updatePassword } from "firebase/auth";

function Profile() {
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupère l'email de l'utilisateur connecté
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleSave = async () => {
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword === "" || confirmPassword === "") {
      setError("Les mots de passe ne peuvent pas être vides.");
      return;
    }

    try {
      // Mise à jour du mot de passe de l'utilisateur connecté
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Mot de passe mis à jour avec succès.");
    } catch (error) {
      setError("Erreur lors de la mise à jour du mot de passe.");
      console.error("Erreur:", error.message);
    }
  };

  return (
    <div className='d-flex flex-column'>
      <Stack direction="column" alignItems="center" mb={3}>
        <ManageAccountsIcon sx={{ width: 80, height: 80, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Information du compte
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Utilisateur"
            variant="outlined"
            margin="normal"
            value={userEmail}
            disabled
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type='text'
            value={userEmail}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            variant="outlined"
            margin="normal"
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            variant="outlined"
            margin="normal"
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Grid>
      </Grid>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button className='btn btn-primary rounded-0' onClick={handleSave} style={{ width: "auto", padding: "10px 20px" }}>
          Sauvegarder
        </button>
      </div>
      {message && <Typography color="success" className="mt-3">{message}</Typography>}
      {error && <Typography color="error" className="mt-3">{error}</Typography>}
    </div>
  );
}

export default Profile;
