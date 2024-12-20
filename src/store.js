import { configureStore } from "@reduxjs/toolkit";
import connect from "./features/Connect";
import todo from "./features/todo"
import completTodo from "./features/completTodo"
import Archive from "./features/Archive";
import MessageArchive from "./features/MessageArchive";
import Notifications from "./features/Notifications";

export const store = configureStore({
    reducer : {
        connect,
        todo,
        completTodo,
        Archive,
        MessageArchive,
        Notifications
    }
})