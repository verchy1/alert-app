/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const dayjs = require("dayjs");
const emailjs = require("@emailjs/emailjs");

admin.initializeApp();
const db = admin.firestore();

// Fonction pour vérifier les alertes et envoyer des emails
exports.sendNotifications = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
    const now = dayjs();
    const alertsRef = db.collection("alertes");

    try {
        const snapshot = await alertsRef.get();
        if (snapshot.empty) {
            console.log("Aucune alerte trouvée.");
            return null;
        }

        const notificationsRef = db.collection("notifications");

        for (const doc of snapshot.docs) {
            const alert = doc.data();
            const endDateStr = (alert.date || "").split(" - ")[1];
            const endDate = dayjs(endDateStr, "DD/MM/YYYY");

            const daysRemaining = endDate.startOf("day").diff(now.startOf("day"), "day");

            // Conditions pour envoyer les notifications
            if ([25, 15, 5, 1].includes(daysRemaining)) {
                const notificationId = `${alert.id}_${daysRemaining}`;
                const notificationSnapshot = await notificationsRef
                    .where("notificationId", "==", notificationId)
                    .where("deleted", "==", false)
                    .get();

                if (!notificationSnapshot.empty) {
                    console.log(`Notification déjà envoyée pour : ${notificationId}`);
                    continue;
                }

                const notificationMessage = `Rappel pour "${alert.title}" : Il reste ${daysRemaining} jour(s).`;

                // Enregistrer la notification
                await notificationsRef.add({
                    notificationId: notificationId,
                    message: notificationMessage,
                    severity: "warning",
                    timestamp: new Date().toISOString(),
                    daysRemaining: daysRemaining,
                    isRead: false,
                    sent: true,
                    deleted: false,
                });

                // Envoyer l'email via EmailJS
                await emailjs.send(
                    "service_5wfmf26", // ID du service EmailJS
                    "template_xhfvlsc", // ID du template EmailJS
                    {
                        user_email: alert.email, // Adresse email depuis l'alerte
                        user_name: alert.title,
                        message: notificationMessage,
                    },
                    "zAxsxa-HMMw991jZH" // Clé publique EmailJS
                );

                console.log(`Notification envoyée : ${notificationMessage}`);
            }
        }
    } catch (error) {
        console.error("Erreur lors du traitement des notifications :", error);
    }

    return null;
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
