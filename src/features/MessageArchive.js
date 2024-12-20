import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    MessageArchive: false,
    archiveMessage: ""
}

export const MessageArchive = createSlice({
    name: "MessageArchive",
    initialState,
    reducers : {
        setMessageArchive: (state, action) => {
            state.MessageArchive = !state.MessageArchive;
            state.archiveMessage = action.payload || "";
        }
    }
})

export const {setMessageArchive} = MessageArchive.actions
export default MessageArchive.reducer