import { GET_DATA_START, GET_DATA_SUCCESS, GET_DATA_ERROR, GET_NEXT_BOOK_INFO_SUCCESS, MIN_PAGE_CHANGED, MAX_PAGE_CHANGED, LANGUAGE_CHECKED_CHANGED, AUTHOR_CHECKED_CHANGED, RESET_FILTER } from "./actionTypes";

export function getData(category, page, search = null, onNotFound) {
   return async (dispatch) => {
      dispatch({ type: GET_DATA_START });
      try {
         const url = `/api/books/list/${category || "all"}/page${page || 1}` + (search ? search : "");
         const response = await fetch(url);
         const data = await response.json();
         if (data.status === 404) {
            dispatch(getDataError());
            onNotFound();
         }
         else {
            dispatch(getDataSuccess(data, category, page));
         }
      }
      catch (e) {
         dispatch(getDataError());
      }
   }
}

export function getDataSuccess(data, category, page) {
   return {
      type: GET_DATA_SUCCESS,
      payload: { ...data, currentCategory: category, currentPage: page }
   }
}

export function getDataError() {
   return {
      type: GET_DATA_ERROR
   }
}

export function getNextBookInfo(category, currentPage, search) {
   return async (dispatch) => {
      dispatch({ type: GET_DATA_START });
      try {
         const url = `/api/books/listAppend?category=${category}&page=${currentPage + 1}` + (search ? '&' + search.substring(1) : "");
         const response = await fetch(url);
         const nextBookInfo = await response.json();
         dispatch(getNextBookInfoSuccess(nextBookInfo, currentPage + 1));
      }
      catch (e) {
         dispatch(getDataError());
      }
   }
}

export function getNextBookInfoSuccess(nextBookInfo, page) {
   return {
      type: GET_NEXT_BOOK_INFO_SUCCESS,
      payload: { data: nextBookInfo, currentPage: page }
   }
}

export function minPageChanged(newValue) {
   return {
      type: MIN_PAGE_CHANGED,
      payload: newValue
   }
}

export function maxPageChanged(newValue) {
   return {
      type: MAX_PAGE_CHANGED,
      payload: newValue
   }
}

export function changeLanguageChecked(langId) {
   return (dispatch, getState) => {
      const state = getState().main;
      const languages = state.leftPanelData.languages || [];
      for (let i = 0; i < languages.length; i++) {
         if (languages[i].languageId === langId) {
            languages[i].checked = !languages[i].checked;
            break;
         }
      }
      dispatch({
         type: LANGUAGE_CHECKED_CHANGED,
         payload: languages
      });
   }
}

export function changeAuthorChecked(authorId) {
   return (dispatch, getState) => {
      const state = getState().main;
      const authors = state.leftPanelData.authors || [];
      for (let i = 0; i < authors.length; i++) {
         if (authors[i].authorId === authorId) {
            authors[i].checked = !authors[i].checked;
            break;
         }
      }
      dispatch({
         type: AUTHOR_CHECKED_CHANGED,
         payload: authors
      });
   }

}

export function resetFilter() {
   return (dispatch, getState) => {
      const state = getState().main;
      const authors = state.leftPanelData.authors || [];
      for (let i = 0; i < authors.length; i++) {
         authors[i].checked = false;
      }
      const languages = state.leftPanelData.languages || [];
      for (let i = 0; i < languages.length; i++) {
         languages[i].checked = false;
      }
      dispatch({
         type: RESET_FILTER,
         payload: {
            authors: authors,
            languages: languages
         }
      });
   }
}
