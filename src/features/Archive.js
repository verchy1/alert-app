import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    ArchiveCart: [
    ]
}

export const Archive = createSlice({
    name: "Archive",
    initialState,
    reducers: {
        AddArchive: (state, action) => {
            const { id, title, description, date, autoPro, localite, Observation} = action.payload;
            state.ArchiveCart.push({
                id: id,
                title: title,
                description: description,
                date: date,
                autoPro: autoPro,
                localite: localite, 
                Observation: Observation,
                statut: false
            });
        }
    }
})


export const { AddArchive } = Archive.actions
export default Archive.reducer