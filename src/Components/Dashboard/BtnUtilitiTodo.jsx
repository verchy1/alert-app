import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PendingIcon from '@mui/icons-material/Pending';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { AddArchive } from '../../features/Archive';
import { removeAlert, updateAlert } from '../../features/todo'; // Assurez-vous d'avoir une action updateAlert pour la mise à jour
import { setMessageArchive } from '../../features/MessageArchive';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../data/firebaseConfig';




const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.text.primary,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function BtnUtilitiTodo({ id, title, description, date, autoPro, localite, Observation }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [dateDebut, setDateDebut] = useState(dayjs());
  const [dateFin, setDateFin] = useState(dayjs());
  const [editedDescription, setEditedDescription] = useState(description);
  const [editeAutoPro, setEditeAutoPro] = useState(autoPro);
  const [editeObservation, setEditeObservation] = useState(Observation);
  const [Editelocalite, setEditeLocalite] = useState(localite);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSaveEdit = async () => {
    if (editedDescription === "" && editedTitle === "" || editedDescription === "" || editedTitle === "" || editeAutoPro === "" || Editelocalite === "" || editeObservation === "") {
      setSnackMessage("Veuillez entrer toutes les informations.");
      setSnackSeverity("error");
      setOpenSnackbar(true);
    } else if (dateFin.isBefore(dateDebut, 'day')) {
        setSnackMessage("La date de fin doit être après la date de début.");
        setSnackSeverity("error");
        setOpenSnackbar(true);
        return;
    } 
      try {
        // Mise à jour dans Firestore
        const alertRef = doc(db, 'alertes', id); // id est l'identifiant unique de l'alerte
        console.log(`modifier ${id}`);
        
        await updateDoc(alertRef, {
          title: editedTitle,
          description: editedDescription,
          date: `${dateDebut.format('DD/MM/YYYY')} - ${dateFin.format('DD/MM/YYYY')}`,
          statut: false, // Vous pouvez aussi mettre à jour d'autres champs comme "statut"
          autoPro: editeAutoPro,
          localite: Editelocalite,
          Observation: editeObservation
        });
  
        
      
  
        // Affichage d'une notification de succès
        setSnackMessage("Alerte mise à jour avec succès.");
        setSnackSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour dans Firestore :", error);
        setSnackMessage("Échec de la mise à jour. Veuillez réessayer.");
        setSnackSeverity("error");
        setOpenSnackbar(true);
      }
    
  };

  const handleDelete = async (id) => {
    try {
      // Supprimer dans Firestore
      await deleteDoc(doc(db, "alertes", id));

      // Supprimer dans Redux
      dispatch(removeAlert(id));

      // Afficher une notification de succès
      setSnackMessage(`L'élément "${title}" a été supprimé avec succès.`);
      setSnackSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSnackMessage("Échec de la suppression. Veuillez réessayer.");
      setSnackSeverity("error");
      setOpenSnackbar(true);
    }

  };

  return (
    <div>
      <PendingIcon style={{ fontSize: 30, color: "#0062a3", cursor: "pointer" }} onClick={handleClick} />
      <KeyboardArrowDownIcon style={{ fontSize: 0, color: "#0062a3", marginLeft: 0 }} />
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit} disableRipple>
          <EditIcon />
          Modifier
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleDelete(id)} disableRipple>
          <DeleteIcon />
          Supprimer
        </MenuItem>
      </StyledMenu>

      {/* Dialog de modification */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Modifier l'élément</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 2, width: '100%' }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Societe"
              type="text"
              fullWidth
              value={editedTitle}
              editedDescription
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Nº arrêté"
              type="text"
              fullWidth
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <Autocomplete
              disablePortal
              options={localiteOptions}
              sx={{ width: "100%" }}
              onChange={(event, newValue) => setEditeLocalite(newValue ? newValue.label : '')}
              renderInput={(params) => (
                <TextField {...params} value={localite} label="Localité" variant="outlined" />
              )}
            />
            <TextField
              margin="dense"
              label="Observation"
              type="text"
              fullWidth
              value={editeObservation}
              onChange={(e) => setEditeObservation(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']} sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <DatePicker
                  required
                  label="Date de début"
                  value={dateDebut}
                  onChange={(newValue) => setDateDebut(newValue)}
                />
                <DatePicker
                  required
                  label="Date de fin"
                  value={dateFin}
                  onChange={(newValue) => setDateFin(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Box display="flex" alignItems="center" justifyContent="start" sx={{ mt: 1, width: '100%' }}>
              <Checkbox checked={editeAutoPro} onChange={() => setEditeAutoPro(!editeAutoPro)} />
              <Typography>Autorisation provisoire</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="danger">
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
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