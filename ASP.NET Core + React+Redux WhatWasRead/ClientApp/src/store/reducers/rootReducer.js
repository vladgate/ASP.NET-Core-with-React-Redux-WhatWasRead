import { combineReducers } from "redux";
import mainReducer from "./mainReducer";
import bookReducer from "./bookReducer";
import tagReducer from "./tagReducer";
import authorReducer from "./authorReducer";

export default combineReducers({
   main: mainReducer,
   book: bookReducer,
   tag: tagReducer,
   author: authorReducer
});