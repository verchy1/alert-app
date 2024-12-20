import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    NotificationsCart: []
};

export const Notifications = createSlice({
    name: "Notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const { id } = action.payload;
            state.NotificationsCart.push({
                id: nanoid(5), // Génère un identifiant unique
                idTask: id,
                message: action.payload.message, // Message de la notification
                date: new Date().toISOString(), // Date actuelle de création
                isRead: false // Statut par défaut "non lu"
            });
        },
        markAllAsRead: (state) => {
            state.NotificationsCart.forEach(notification => {
                notification.isRead = true;
            });
        },
        markAsRead: (state, action) => {
            const notification = state.NotificationsCart.find(notification => notification.id === action.payload);
            if (notification) { 
                notification.isRead = true; 
            }
        },
        deleteNotification(state, action) {
            state.NotificationsCart = state.NotificationsCart.filter(item => item.id !== action.payload);
        },
        setAlertsNotif: (state, action) => {
            state.NotificationsCart = action.payload;
        },
    }
});

// Actions
export const { addNotification, markAllAsRead, deleteNotification, setAlertsNotif, markAsRead } = Notifications.actions;
export default Notifications.reducer;
