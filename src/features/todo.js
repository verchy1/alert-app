import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    todoCard: []
};

export const todo = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addAlert: (state, action) => {
            const { title, description, dateDebut, dateFin, statut, autoPro, localite, Observation } = action.payload;
            state.todoCard.push({
                id: nanoid(8),
                title,
                description,
                date: `${dateDebut} - ${dateFin}`, // Formater les deux dates en une chaîne
                statut,
                autoPro: autoPro,
                localite: localite,
                Observation: Observation
            });
        },
        removeAlert: (state, action) => {
            state.todoCard = state.todoCard.filter(item => item.id !== action.payload);
        },
        updateAlert: (state, action) => {
            const { id, title, description, dateDebut, dateFin, autoPro, localite, Observation } = action.payload;
            const alert = state.todoCard.find(item => item.id === id);
            if (alert) {
                alert.title = title;
                alert.description = description;
                alert.dateDebut = dayjs(dateDebut); // Mettre à jour les dates avec dayjs
                alert.dateFin = dayjs(dateFin);
                alert.autoPro = autoPro;
                alert.localite = localite;
                alert.Observation = Observation;
            }
        },
        setAlerts: (state, action) => {
            state.todoCard = action.payload;
        },
    }
});

export const { addAlert, removeAlert, updateAlert, setAlerts } = todo.actions;
export default todo.reducer;


// titre = Societe
// description = Numero arrete
