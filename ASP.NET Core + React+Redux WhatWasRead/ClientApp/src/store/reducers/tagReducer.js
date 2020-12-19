import {
   INPUT_CHANGED, GET_TAGS_START, GET_TAGS_SUCCESS, GET_TAGS_ERROR, EDIT_TAG, DELETE_TAG_SUCCESS, DELETE_TAG_ERROR,
   SAVE_NEW_TAG_ERROR, SAVE_NEW_TAG_START, SAVE_NEW_TAG_SUCCESS, SAVE_EDITED_TAG_START, SAVE_EDITED_TAG_ERROR, SAVE_EDITED_TAG_SUCCESS, CANCEL_EDIT_TAG
} from "../actions/actionTypes";

const initialState = {
   tags: [],
   editTagId: 0,
   addNameForLabels: "",
   addNameForLinks: "",
   saveErrors: "",
   tableErrors: ""
};

export default function tagReducer(state = initialState, action) {
   switch (action.type) {
      case GET_TAGS_START:
         return { ...state, tableErrors: "" }
      case GET_TAGS_SUCCESS:
         return { ...state, tags: action.payload || [] };
      case GET_TAGS_ERROR:
         return { ...state, tableErrors: action.payload };
      case EDIT_TAG:
         return { ...state, editTagId: action.payload };
      case CANCEL_EDIT_TAG:
         return { ...state, editTagId: 0 };
      case SAVE_NEW_TAG_START:
         return { ...state, saveErrors: "" };
      case SAVE_NEW_TAG_SUCCESS:
         return { ...state, addNameForLabels: "", addNameForLinks: "" };
      case SAVE_NEW_TAG_ERROR:
         return { ...state, saveErrors: action.payload };
      case SAVE_EDITED_TAG_START:
         return { ...state, tableErrors: "" };
      case SAVE_EDITED_TAG_SUCCESS:
         return { ...state, editTagId: 0 };
      case SAVE_EDITED_TAG_ERROR:
         return { ...state, tableErrors: action.payload };
      case DELETE_TAG_SUCCESS:
         return { ...state };
      case DELETE_TAG_ERROR:
         return { ...state, tableErrors: action.payload };
      case INPUT_CHANGED:
         return { ...state, [action.payload.name]: action.payload.value };
      default: return state;
   }
}