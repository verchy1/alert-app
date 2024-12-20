import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import { useDispatch, useSelector } from "react-redux";
import ItemComplet from "./ItemComplet";
import { useEffect, useState, useRef } from 'react';
import { removeAlert } from '../../features/todo';
import { deleteNotification } from '../../features/Notifications';
import { collection, query, where, deleteDoc, doc, addDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";

export default function CompletTask() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.todo.todoCard); // Liste des tâches à surveiller
  const [completedTasks, setCompletedTasks] = useState([]); // Tâches terminées pour affichage
  const processedTaskIds = useRef(new Set()); // IDs des tâches déjà traitées

  // Charger les tâches complètes depuis Firestore au montage
  useEffect(() => {
    const loadCompletedTasks = async () => {
      const q = query(collection(db, "completedTasks"));
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedTasks(tasks);

      // Ajouter les IDs des tâches chargées dans le Set pour éviter les doublons
      tasks.forEach(task => processedTaskIds.current.add(task.id));
    };

    loadCompletedTasks();
  }, []);

  // Surveiller les tâches et détecter celles terminées
  useEffect(() => {
    const now = new Date(); // Date actuelle

    tasks.forEach(async (task) => {
      if (processedTaskIds.current.has(task.id)) return; // Ignore si déjà traité

      const valueToSplit = task.date || "";
      const endDateStr = valueToSplit.split(" - ")[1];

      if (!endDateStr) return; // Ignorer si pas de date de fin

      const [day, month, year] = endDateStr.split('/').map(Number);
      const endDate = new Date(year, month - 1, day);

      if (endDate <= now) {
        try {
          // Ajouter la tâche terminée dans Firestore
          const completedTask = {
            title: task.title,
            description: task.description,
            date: task.date,
            localite: task.localite,
            Observation: task.Observation,
            statut: true,
            completedAt: now.toISOString(),
          };
          const docRef = await addDoc(collection(db, "completedTasks"), completedTask);

          // Ajouter au Set pour empêcher de la re-traiter
          processedTaskIds.current.add(task.id);
          processedTaskIds.current.add(docRef.id);

          // Ajouter au state local pour l'affichage
          setCompletedTasks(prev => [...prev, { id: docRef.id, ...completedTask }]);

          // Supprimer la tâche initiale de Firestore et Redux
          await deleteDoc(doc(db, "alertes", task.id));
          dispatch(removeAlert(task.id));

          // Supprimer les notifications liées
          const notifQuery = query(collection(db, "notifications"), where("id", "==", task.id));
          const notifSnapshot = await getDocs(notifQuery);
          notifSnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(doc(db, "notifications", docSnapshot.id));
            dispatch(deleteNotification(docSnapshot.id));
          });
        } catch (error) {
          console.error("Erreur lors du traitement des tâches terminées :", error);
        }
      }
    });
  }, [tasks, dispatch]);

  return (
    <div className="d-flex flex-column align-items-start" style={{ margin: 0, padding: 15, height: '400px', overflowY: 'auto' }}>
      <div className="d-flex align-items-center p-0" style={{ width: '100%', margin: 0 }}>
        <LibraryAddCheckOutlinedIcon style={{ fontSize: 30, color: '#757575' }} />
        <h5 style={{ marginLeft: '8px' }} className="text-primary">Alerte complète</h5>
      </div>
      {
        completedTasks.length > 0 ? (
          completedTasks.map((item) => (
            <ItemComplet
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              date={item.date}
              localite={item.localite}
              Observation={item.Observation}
            />
          ))
        ) : (
          <p className='mt-4'>Aucune alerte complète à afficher</p>
        )
      }
    </div>
  );
}
