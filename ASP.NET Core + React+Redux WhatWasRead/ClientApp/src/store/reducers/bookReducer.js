import {
   GET_BOOK_DETAILS_START, GET_BOOK_DETAILS_SUCCESS, GET_BOOK_DETAILS_ERROR, BOOK_DELETE_START, BOOK_DELETE_SUCCESS, BOOK_DELETE_ERROR,
   CREATE_BOOK_GET_START, CREATE_BOOK_GET_SUCCESS, CREATE_BOOK_GET_ERROR, EDIT_BOOK_GET_SUCCESS,
   SAVE_BOOK_START, SAVE_BOOK_SUCCESS, SAVE_BOOK_ERROR, EDIT_BOOK_GET_START, BOOK_COMMON_INPUT_CHANGED, BOOK_EDIT_INPUT_CHANGED
} from "../actions/actionTypes";

const defaultCommon = {
   bookId: 0,
   name: "",
   pages: 0,
   year: 0,
   description: "",
   base64ImageSrc: ""
};
const defaultDetails = {
   authorsOfBooks: "",
   bookTags: [],
   category: "",
   language: ""
};
const defaultCreate = {
   allAuthors: [],
   allTags: [],
   allCategories: [],
   allLanguages: [],
};
const defaultEdit = {
   selectedLanguageId: 0,
   selectedCategoryId: 0,
   selectedAuthorsId: [],
   selectedTagsId: []
};

const initialState = {
   common: defaultCommon,
   details: defaultDetails,
   create: defaultCreate,
   edit: defaultEdit,
   isLoading: false,
   errors: ""
};

export default function bookReducer(state = initialState, action) {
   console.log("bookReducer action", action);
   console.log("bookReducer state", state);
   switch (action.type) {
      case GET_BOOK_DETAILS_START:
         return {
            ...state,
            details: defaultDetails,
            common: defaultCommon,
            isLoading: true,
            errors: ""
         };
      case GET_BOOK_DETAILS_SUCCESS:
         return {
            ...state,
            common: {
               bookId: action.payload.bookId || 0,
               name: action.payload.name || "",
               pages: action.payload.pages || 0,
               year: action.payload.year || 0,
               description: action.payload.description || "",
               base64ImageSrc: action.payload.base64ImageSrc || ""
            },
            details: {
               authorsOfBooks: action.payload.authorsOfBooks || [],
               bookTags: action.payload.bookTags || [],
               category: action.payload.category || "",
               language: action.payload.language || ""
            },
            isLoading: false
         };
      case GET_BOOK_DETAILS_ERROR:
         return {
            ...state,
            errors: action.payload,
            isLoading: false
         };
      case BOOK_DELETE_START:
         return {
            ...state,
            isLoading: true,
            errors: ""
         };
      case BOOK_DELETE_SUCCESS:
         return {
            ...state,
            common: defaultCommon,
            details: defaultDetails,
            isLoading: false
         };
      case BOOK_DELETE_ERROR:
         return {
            ...state,
            errors: action.payload,
            isLoading: false
         };
      case CREATE_BOOK_GET_START:
         return {
            ...state,
            common: defaultCommon,
            details: defaultDetails,
            edit: defaultEdit,
            create: defaultCreate,
            isLoading: true,
            errors: ""
         };
      case CREATE_BOOK_GET_SUCCESS:
         return {
            ...state,
            create: {
               allAuthors: action.payload.authors || [],
               allTags: action.payload.tags || [],
               allCategories: action.payload.categories || [],
               allLanguages: action.payload.languages || []
            },
            isLoading: false
         };
      case CREATE_BOOK_GET_ERROR:
         return {
            ...state,
            errors: action.payload,
            isLoading: false
         };
      case EDIT_BOOK_GET_START:
         return {
            ...state,
            create: defaultCreate,
            edit: defaultEdit,
            isLoading: true,
            errors: ""
         };
      case EDIT_BOOK_GET_SUCCESS:
         return {
            ...state,
            isLoading: false,
            create: {
               allAuthors: action.payload.authors || [],
               allTags: action.payload.tags || [],
               allCategories: action.payload.categories || [],
               allLanguages: action.payload.languages || []
            },
            common: {
               bookId: action.payload.bookId || 0,
               name: action.payload.name || "",
               pages: action.payload.pages || 0,
               description: action.payload.description || "",
               year: action.payload.year || 0,
               base64ImageSrc: action.payload.base64ImageSrc || ""
            },
            edit: {
               selectedLanguageId: action.payload.selectedLanguageId || 0,
               selectedCategoryId: action.payload.selectedCategoryId || 0,
               selectedAuthorsId: action.payload.selectedAuthorsId || [],
               selectedTagsId: action.payload.selectedTagsId || []
            }
         };
      case SAVE_BOOK_START:
         return {
            ...state,
            isLoading: true,
            errors: ""
         };
      case SAVE_BOOK_SUCCESS:
         return {
            ...state,
            create: defaultCreate,
            edit: defaultEdit,
            common: defaultCommon,
            details: defaultDetails,
            isLoading: false
         };
      case SAVE_BOOK_ERROR:
         return {
            ...state,
            errors: action.payload,
            isLoading: false
         };
      case BOOK_COMMON_INPUT_CHANGED:
         return {
            ...state,
            common: {
               ...state.common, [action.payload.name]: action.payload.value
            }
         };
      case BOOK_EDIT_INPUT_CHANGED:
         return {
            ...state,
            edit: {
               ...state.edit, [action.payload.name]: action.payload.value
            }
         };
      default: return state;
   }
}