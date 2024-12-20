import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    isConnect: false
}

export const connect = createSlice({
    name: "connect",
    initialState,
    reducers: {
        ChangeConnect: (state, action) => {
            !state.isConnect
        }
    }
})

export const {ChangeConnect} = connect.actions
export default connect.reducer