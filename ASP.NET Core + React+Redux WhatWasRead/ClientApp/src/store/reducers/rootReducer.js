import { combineReducers } from "redux";
import mainReducer from "./mainReducer";
import bookReducer from "./bookReducer";
import tagReducer from "./tagReducer";

export default combineReducers({
   main: mainReducer,
   book: bookReducer,
   tag: tagReducer
});