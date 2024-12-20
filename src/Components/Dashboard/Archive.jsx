import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore
import { db } from '../../data/firebaseConfig'; // Assurez-vous d'importer la configuration Firebase

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Société', width: 150 },
  { field: 'description', headerName: 'Nº arrêté', width: 100 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'localite', headerName: 'Localité', width: 150 },
  { field: 'Observation', headerName: 'Observation', width: 100 }
];

export default function Archive() {
  const [rows, setRows] = useState([]);

  // Récupérer les données depuis Firestore
  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'alertes')); // Remplacez 'tasks' par le nom de votre collection
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(), // Récupérer les champs du document
        }));
        setRows(data);
        console.log(data);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données Firestore:', error);
      }
    };

    fetchArchiveData();
  }, []); // Le tableau vide assure que la récupération se fait une seule fois au montage du composant

  return (
    <Box sx={{ height: 470, width: '100%' }}>
      <p className="text-center fw-bolder fs-5">LISTE DES AUTORISATIONS SIGNEES ET DELIVREES PAR LE MEH</p>
      <DataGrid
        rows={rows} // Utilise les données récupérées
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
