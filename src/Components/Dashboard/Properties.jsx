import * as React from 'react';
import TaskStatut from "./TaskStatut";
import Todo from "./Todo";
import CompletTask from "./CompletTask";
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
import { useSelector, useDispatch } from "react-redux";
import { setMessageArchive } from '../../features/MessageArchive';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Properties() {
  const isNotificationActive = useSelector(state => state.MessageArchive.MessageArchive);
  const archiveMessage = useSelector(state => state.MessageArchive.archiveMessage);
  const todo = useSelector(state => state.todo.todoCard)
  const dispatch = useDispatch();
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  

  const dataSeries = [
    { name: 'Tâches Complètes', value: 40 },
    { name: 'Tâches En Cours', value: 30 },
    { name: 'Tâches À Faire', value: 20 },
    { name: 'Tâches Annulées', value: 10 },
  ];

  React.useEffect(() => {
    if (isNotificationActive) {
      setSnackMessage(archiveMessage);
      setSnackSeverity("success");
      setOpenSnackbar(true);

      // Remettre `MessageArchive` à `false` après 3 secondes
      const timerArchive = setTimeout(() => {
        dispatch(setMessageArchive());
      }, 3000);

      return () => clearTimeout(timerArchive); // Nettoyer le timer
    }
  }, [isNotificationActive, archiveMessage, dispatch]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="contenair">
      <div className="row">
        <div className="col">
          <div className="container ">
            <div className="row p-3 mt-4 mt-md-0" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "white" }}>
              <div className="col">
                <div className="d-flex align-items-center p-0 justify-content-between" style={{ width: '100%', margin: 0 }}>
                  <DataUsageOutlinedIcon style={{ fontSize: 30, color: '#757575' }} />
                  <h5 style={{ marginLeft: '8px' }} className="text-primary">Alerte statistique</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}> {/* Ajoutez un style ici pour définir une hauteur minimale si nécessaire */}
                  <TaskStatut series={dataSeries} />
                </div>
              </div>
            </div>

            <div className="row mt-4 p-3" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "white" }}>
              <CompletTask />
            </div>
          </div>
        </div>
        <div className="col mt-3 mt-md-0 p-3" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "white" }}>
          <Todo />
          <div className='d-flex justify-content-between mt-2 text-secondary' style={{ fontSize: "13px" }}>
            <p>Total</p>
            <p>{todo.length}</p>
          </div>
        </div>

      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackSeverity}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
