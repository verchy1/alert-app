import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    completCard: [

    ]
}

export const completTodo = createSlice({
    name: "completTodo",
    initialState,
    reducers: {
        addCompletTodo: (state, action) => {
            const { title, description, date, statut, autoPro, localite, Observation } = action.payload;
            state.completCard.push({
                id: nanoid(9),
                title,
                description,
                date: date,
                statut,                
                localite: localite,
                Observation: Observation
            });
        },
    }
    
})

export const {addCompletTodo} = completTodo.actions
export default completTodo.reducer