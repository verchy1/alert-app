// file: utils/notifications.js
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { markAllAsRead } from '../../../features/Notifications';
import { db } from "../../../data/firebaseConfig"; // Assurez-vous que la référence `db` est correcte

export const handleNotificationClick = async (dispatch) => {
  try {
    // Récupérer toutes les notifications non lues
    const notificationsRef = collection(db, "notifications");
    const querySnapshot = await getDocs(notificationsRef);

    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const notificationData = docSnapshot.data();

      // Vérifiez si la notification n'est pas encore lue
      if (!notificationData.isRead) {
        const notificationRef = doc(db, "notifications", docSnapshot.id);
        return updateDoc(notificationRef, { isRead: true });
      }
      return null;
    });

    // Attendre que toutes les notifications soient mises à jour
    await Promise.all(updatePromises);

    // Mettre à jour l'état Redux pour refléter les changements
    dispatch(markAllAsRead());
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications :", error);
  }
};
