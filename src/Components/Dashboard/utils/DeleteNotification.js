// file: utils/notifications.js
import { doc, deleteDoc } from "firebase/firestore";
import { deleteNotification} from '../../../features/Notifications';
import { db } from "../../../data/firebaseConfig"; // Assurez-vous que la référence `db` est correcte

export const handleDeleteNotification = async (notificationId, dispatch) => {
  try {
    console.log("ID à supprimer :", notificationId); // Affichez l'ID de notification
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);

    // Mise à jour de Redux
    dispatch(deleteNotification(notificationId));
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification :", error);
  }
};
