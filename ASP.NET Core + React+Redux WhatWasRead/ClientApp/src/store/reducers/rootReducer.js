import { combineReducers } from "redux";
import mainReducer from "./mainReducer";
import bookReducer from "./bookReducer";

export default combineReducers({
   main: mainReducer,
   book: bookReducer
});