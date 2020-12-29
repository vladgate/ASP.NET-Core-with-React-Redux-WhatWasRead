import { GET_DATA_START, GET_DATA_SUCCESS, GET_NEXT_BOOK_INFO_SUCCESS, GET_DATA_ERROR, MIN_PAGE_CHANGED, MAX_PAGE_CHANGED, LANGUAGE_CHECKED_CHANGED, AUTHOR_CHECKED_CHANGED, RESET_FILTER } from "../actions/actionTypes"

const initialState = {
   leftPanelData: {
      authors: [],
      categories: [],
      languages: [],
      tags: [],
      maxPagesActual: 0,
      maxPagesExpected: 0,
      minPagesActual: 0,
      minPagesExpected: 0,
   },
   rightPanelData: {
      bookInfo: [],
      totalPages: 0
   },
   currentPage: 1,
   currentCategory: "all",
   currentTag: "",
   activePages: [1],
   isLoading: false
}

export default function mainReducer(state = initialState, action) {
   switch (action.type) {
      case GET_DATA_START: {
         return { ...state, isLoading: true }
      }
      case GET_DATA_SUCCESS:
         return {
            ...state,
            leftPanelData: action.payload.leftPanelData,
            rightPanelData: action.payload.rightPanelData,
            currentCategory: action.payload.currentCategory || "all",
            currentPage: action.payload.currentPage || 1,
            activePages: [action.payload.currentPage || 1],
            isLoading: false
         };
      case GET_DATA_ERROR:
         return {
            ...state, rightPanelData: { bookInfo: [], totalPages: 0 }, isLoading: false
         };
      case GET_NEXT_BOOK_INFO_SUCCESS:
         return {
            ...state,
            rightPanelData: { ...state.rightPanelData, bookInfo: [...state.rightPanelData.bookInfo, ...action.payload.data] },
            currentPage: action.payload.currentPage,
            activePages: state.activePages.concat(action.payload.currentPage),
            isLoading: false
         };
      case LANGUAGE_CHECKED_CHANGED:
         return {
            ...state, leftPanelData: { ...state.leftPanelData, languages: action.payload }
         };
      case AUTHOR_CHECKED_CHANGED:
         return {
            ...state, leftPanelData: { ...state.leftPanelData, authors: action.payload }
         };
      case RESET_FILTER:
         return {
            ...state, leftPanelData: { ...state.leftPanelData, authors: action.payload.authors, languages: action.payload.languages }
         };
      case MAX_PAGE_CHANGED:
         return {
            ...state, leftPanelData: { ...state.leftPanelData, maxPagesActual: action.payload }
         };
      case MIN_PAGE_CHANGED:
         return { ...state, leftPanelData: { ...state.leftPanelData, minPagesActual: action.payload } };

      default: return state
   }
}