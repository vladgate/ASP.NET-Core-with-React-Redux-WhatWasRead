import {
   GET_AUTHORS_START, GET_AUTHORS_SUCCESS, GET_AUTHORS_ERROR, EDIT_AUTHOR, CANCEL_EDIT_AUTHOR,
   SAVE_NEW_AUTHOR_START, SAVE_NEW_AUTHOR_SUCCESS, SAVE_NEW_AUTHOR_ERROR, SAVE_EDITED_AUTHOR_START, SAVE_EDITED_AUTHOR_SUCCESS, SAVE_EDITED_AUTHOR_ERROR, DELETE_AUTHOR_ERROR, AUTHOR_INPUT_CHANGED
} from "../actions/actionTypes";

const initialState = {
   authors: [],
   editAuthorId: 0,
   addLastName: "",
   addFirstName: "",
   saveErrors: "",
   tableErrors: ""
};

export default function authorReducer(state = initialState, action) {
   switch (action.type) {
      case GET_AUTHORS_START:
         return { ...state, tableErrors: "" }
      case GET_AUTHORS_SUCCESS:
         return { ...state, authors: action.payload || [] };
      case GET_AUTHORS_ERROR:
         return { ...state, tableErrors: action.payload };
      case EDIT_AUTHOR:
         return { ...state, editAuthorId: action.payload };
      case CANCEL_EDIT_AUTHOR:
         return { ...state, editAuthorId: 0 };
      case SAVE_NEW_AUTHOR_START:
         return { ...state, saveErrors: "" };
      case SAVE_NEW_AUTHOR_SUCCESS:
         return { ...state, addLastName: "", addFirstName: "" };
      case SAVE_NEW_AUTHOR_ERROR:
         return { ...state, saveErrors: action.payload };
      case SAVE_EDITED_AUTHOR_START:
         return { ...state, tableErrors: "" };
      case SAVE_EDITED_AUTHOR_SUCCESS:
         return { ...state, editAuthorId: 0 };
      case SAVE_EDITED_AUTHOR_ERROR:
         return { ...state, tableErrors: action.payload };
      case DELETE_AUTHOR_ERROR:
         return { ...state, tableErrors: action.payload };
      case AUTHOR_INPUT_CHANGED:
         return { ...state, [action.payload.name]: action.payload.value };
      default: return state;
   }
}