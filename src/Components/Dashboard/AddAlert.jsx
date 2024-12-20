import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../features/todo';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { db } from '../../data/firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddAlert() {
    const [dateDebut, setDateDebut] = useState(dayjs());
    const [dateFin, setDateFin] = useState(dayjs());
    const [titre, setTitre] = useState("");
    const [Description, setDescription] = useState("");
    const [autoPro, setAutoPro] = useState(false);
    const [Observation, setObservation] = useState("");
    const [localite, setLocalite] = useState("");
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification que tous les champs sont remplis
        if (!Description || !titre || !Observation || !dateDebut || !dateFin) {
            setSnackMessage("Veuillez entrer toutes les informations.");
            setSnackSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        // Vérification que la date de fin est supérieure ou égale à la date de début
        if (dateFin.isBefore(dateDebut, 'day')) {
            setSnackMessage("La date de fin doit être après la date de début.");
            setSnackSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        try {
            // Ajoutez l'alerte à Firestore
            await addDoc(collection(db, "alertes"), {
                title: titre,
                description: Description,
                date: `${dateDebut.format('DD/MM/YYYY')} - ${dateFin.format('DD/MM/YYYY')}`,
                autoPro,
                localite,
                Observation,
                statut: false
            });

            setSnackMessage("Alerte ajoutée avec succès.");
            setSnackSeverity("success");
            setOpenSnackbar(true);

            // Réinitialisation des champs après l'ajout
            setDescription("");
            setTitre("");
            setAutoPro(false);
            setObservation("");
            setLocalite("");
            setDateDebut(dayjs());
            setDateFin(dayjs());

        } catch (error) {
            console.error("Erreur lors de l'ajout de l'alerte:", error);
            setSnackMessage("Erreur lors de l'ajout de l'alerte.");
            setSnackSeverity("error");
            setOpenSnackbar(true);
        }
    };


    const handleSnackbarClose = () => setOpenSnackbar(false);
    const handleDialogClose = () => setOpenDialog(false);
    const handleEdit = () => setOpenDialog(true);

    return (
        <div>
            <AddIcon style={{ fontSize: 30, color: "#0062a3" }} onClick={handleEdit} />
            <form onSubmit={handleSubmit}>
                <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
                    <DialogTitle>Ajouter une alerte.</DialogTitle>
                    <DialogContent>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Société"
                                type="text"
                                fullWidth
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                margin="dense"
                                label="Nº arrêté"
                                type="text"
                                fullWidth
                                value={Description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Autocomplete
                                disablePortal
                                options={localiteOptions}
                                fullWidth
                                onChange={(event, newValue) => setLocalite(newValue ? newValue.label : '')}
                                renderInput={(params) => <TextField {...params} label="Localité" />}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                margin="dense"
                                label="Observation"
                                type="text"
                                fullWidth
                                value={Observation}
                                onChange={(e) => setObservation(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker', 'DatePicker']} sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                                    <DatePicker
                                        required
                                        label="Date de début"
                                        value={dateDebut}
                                        onChange={(newValue) => setDateDebut(newValue)}
                                        sx={{ width: '100%' }}
                                    />
                                    <DatePicker
                                        required
                                        label="Date de fin"
                                        value={dateFin}
                                        onChange={(newValue) => setDateFin(newValue)}
                                        sx={{ width: '100%' }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Box display="flex" alignItems="center" justifyContent="start" sx={{ mt: 1, width: '100%' }}>
                                <Checkbox checked={autoPro} onChange={() => setAutoPro(!autoPro)} />
                                <Typography>Autorisation provisoire</Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
                    </DialogActions>
                </Dialog>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackSeverity}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}


const localiteOptions = [
    { label: 'Brazzaville' },
    { label: 'Pointe-Noire' },
    { label: 'Dolisie' },
    { label: 'Nkayi' },
    { label: 'Ouesso' },
    { label: 'Impfondo' },
    { label: 'Madingou' },
    { label: 'Sibiti' },
    { label: 'Owando' },
    { label: 'Djambala' },
    { label: 'Kinkala' },
    { label: 'Mossendjo' },
    { label: 'Gamboma' },
    { label: 'Loubomo' },
    { label: 'Makoua' },
    { label: 'Lékana' },
    { label: 'Ewo' },
    { label: 'Etoumbi' },
    { label: 'Ngabé' },
    { label: 'Liranga' },
    { label: 'Oyo' },
    { label: 'Mossaka' },
    { label: 'Betou' },
    { label: 'Kelle' },
    { label: 'Mbomo' },
    { label: 'Sembé' },
    { label: 'Souanké' },
    { label: 'Ngoko' },
    { label: 'Loukoléla' },
    { label: 'Boko' },
    { label: 'Kindamba' },
    { label: 'Kibangou' },
    { label: 'Mouyondzi' },
    { label: 'Loudima' },
    { label: 'Mfouati' },
    { label: 'Vindza' },
    { label: 'Tchitondi' },
    { label: 'Mindouli' },
    { label: 'Mayoko' },
    { label: 'Mbinda' },
    { label: 'Zanaga' }
];

