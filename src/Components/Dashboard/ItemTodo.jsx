import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { auth, db } from "../../data/firebaseConfig"; // Fichier de configuration Firebase
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";
import BtnAddTodo from "./BtnUtilitiTodo";
import CircularProgress from "@mui/material/CircularProgress";
import emailjs from "@emailjs/browser";
import customParseFormat from "dayjs/plugin/customParseFormat";

function ItemTodo({ id, title, description, date, autoPro, localite, Observation }) {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les notifications existantes
  const loadNotifications = async () => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("id", "==", id),
        where("deleted", "==", false), // Filtrer les notifications non supprimées
      );
      const querySnapshot = await getDocs(q);
      const loadedNotifications = querySnapshot.docs.map((doc) => doc.data());
      setNotifications(loadedNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour envoyer une notification
  const sendEmail = async (email, title, message) => {
    try {
      await emailjs.send(
        "service_ayxmd9h", // Remplacez par votre serviceID
        "template_xg1au5g", // Remplacez par votre templateID
        {
          user_email: email,
          user_name: title,
          message: message,
        },
        "25NiyMqUXsfnNIy2E", // Remplacez par votre publicKey
      );
      console.log("Email envoyé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email : ", error);
    }
  };

  const getCurrentUserEmail = () => {
    const user = auth.currentUser;
    if (user) {
      return user.email; // Renvoie l'email de l'utilisateur connecté
    } else {
      console.warn("Aucun utilisateur connecté !");
      return "orsealerte@gmail.com"; // Adresse email par défaut si l'utilisateur n'est pas connecté
    }
  };

  // Vérifier les dates et envoyer des notifications si nécessaire
  const checkAndSendNotifications = async () => {
    const now = dayjs();
    const endDateStr = (date || "").split(" - ")[1];
    const endDate = dayjs(endDateStr, "DD/MM/YYYY");
    const daysRemaining = endDate.startOf("day").diff(now.startOf("day"), "day");

    const userEmail = getCurrentUserEmail(); // Obtenir l'email de l'utilisateur connecté
    if (!userEmail) {
      console.error("Impossible d'envoyer la notification : Aucun utilisateur connecté.");
      return;
    }

    try {
      const notificationId = `${id}_${daysRemaining}`; // Créer un ID unique pour chaque notification

      const q = query(
        collection(db, "notifications"),
        where("notificationId", "==", notificationId),
        where("deleted", "==", false),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log(`Notification déjà envoyée pour l'ID: ${notificationId}`);
        return;
      }

      // Conditions d'envoi des notifications (6 mois et 1 mois avant l'expiration)
      if ([180, 30].includes(daysRemaining)) {
        const monthsRemaining = Math.floor(daysRemaining / 30); // Convertir les jours en mois
        const notificationMessage = `Rappel pour "${title}"\nAttention ! Il reste ${monthsRemaining} mois${monthsRemaining > 1 ? "s" : ""} pour l'autorisation "${title}".`;
        const timestamp = new Date().toISOString();

        // Enregistrer la notification dans Firestore
        await addDoc(collection(db, "notifications"), {
          notificationId: notificationId,
          message: notificationMessage,
          severity: "warning",
          timestamp: timestamp,
          daysRemaining: daysRemaining,
          isRead: false, // Ajouter un état "non lu"
          sent: true,
          deleted: false, // Assurez-vous d'ajouter ce champ
        });

        // Envoyer un email
        await sendEmail(userEmail, title, notificationMessage);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications :", error);
    }
  };

 
  /**
   * Calcule la couleur de l'alerte en fonction des dates.
   * @param {string} date - Date au format "DD/MM/YYYY - DD/MM/YYYY".
   * @returns {string} - Code couleur hexadécimal.
   */

  dayjs.extend(customParseFormat);

  function parseDate(dateString) {
    // Utilisez dayjs pour analyser la date directement
    const parsedDate = dayjs(dateString, "DD/MM/YYYY");
    if (!parsedDate.isValid()) {
      console.warn("Format de date invalide :", dateString);
      return null;
    }
    return parsedDate.toDate();
  }

  // Fonction pour obtenir la couleur d'alerte
  const getAlertColor = (date) => {
    if (!date || !date.includes(" - ")) {
      console.warn("Format de date invalide :", date);
      return "#B0B0B0"; // Gris par défaut si la chaîne est invalide
    }

    const now = dayjs();
    const endDateStr = date.split(" - ")[1]?.trim(); // Extraire et nettoyer la date de fin

    if (!endDateStr) {
      console.warn("Date de fin manquante :", date);
      return "#B0B0B0";
    }

    const endDate = dayjs(endDateStr, "DD/MM/YYYY");
    if (!endDate.isValid()) {
      console.warn("Date invalide après conversion avec dayjs :", endDateStr);
      return "#B0B0B0";
    }

    // Validation avec parseDate
    const parsedDate = parseDate(endDateStr);
    if (!parsedDate || isNaN(parsedDate)) {
      console.error("Date invalide après conversion par parseDate :", endDateStr);
      return "#B0B0B0";
    } else {
      console.log("Date valide :", parsedDate);
    }

    // Calculer la différence en jours
    const daysRemaining = endDate.startOf("day").diff(now.startOf("day"), "day");

    // Logique des couleurs
    if (daysRemaining <= 30) return "#FF0000"; // Rouge pour moins d'un mois
    if (daysRemaining <= 180) return "#FFA500"; // Orange pour moins de 6 mois
    if (daysRemaining <= 365 * 4.5) return "#05a301"; // Vert pour moins de 4 ans et demi

    return "#B0B0B0"; // Gris par défaut
  };

  // Exemple d'utilisation
  const exampleDate = date;
  console.log("Couleur d'alerte :", getAlertColor(exampleDate));

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    checkAndSendNotifications();
    const intervalId = setInterval(checkAndSendNotifications, 86400000); // 24 heures
    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className="row mt-2 p-2"
          style={{
            border: "1px solid rgba(161, 163, 171, 0.63)",
            borderRadius: "10px",
          }}
        >
          <div className="container">
            <div className="row d-flex align-items-center">
              <div className="col-2 col-md-1 d-flex justify-content-start">
                <CircleIcon
                  style={{
                    fontSize: "24px",
                    color: getAlertColor(date),
                  }}
                />
              </div>
              <div className="col-8 col-md-10 text-center">
                <p className="fw-bold mb-1" style={{ fontSize: "16px" }}>
                  {title}
                </p>
              </div>
              <div className="col-2 col-md-1 d-flex justify-content-end" style={{ cursor: "pointer" }}>
                <BtnAddTodo
                  id={id}
                  title={title}
                  description={description}
                  date={date}
                  autoPro={autoPro}
                  localite={localite}
                  Observation={Observation}
                />
              </div>
            </div>
            <div className="row text-center">
              <p
                className="fw-light p-1"
                style={{
                  fontSize: "14px",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {description} | {Observation} | {localite}
              </p>
            </div>
            <div className="row">
              <div className="col-6">
                <p style={{ fontSize: "13px" }}>
                  <span className="fw-bold">Status :</span> <span className="text-success">En cours...</span>
                </p>
              </div>
              <div className="col-6 text-end">
                <p className="text-secondary" style={{ fontSize: "13px" }}>
                  {date}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemTodo;
