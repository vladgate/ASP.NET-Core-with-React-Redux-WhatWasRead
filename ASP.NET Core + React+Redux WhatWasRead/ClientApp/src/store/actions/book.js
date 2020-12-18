import {
   GET_BOOK_DETAILS_START, GET_BOOK_DETAILS_SUCCESS, GET_BOOK_DETAILS_ERROR, BOOK_DELETE_START, BOOK_DELETE_SUCCESS, BOOK_DELETE_ERROR,
   CREATE_BOOK_GET_START, CREATE_BOOK_GET_SUCCESS, CREATE_BOOK_GET_ERROR, 
   EDIT_BOOK_GET_ERROR, EDIT_BOOK_GET_SUCCESS, EDIT_BOOK_GET_START, BOOK_INPUT_CHANGED,
   SAVE_BOOK_START, SAVE_BOOK_ERROR, SAVE_BOOK_SUCCESS, BOOK_EDIT_INPUT_CHANGED, BOOK_COMMON_INPUT_CHANGED
} from "./actionTypes";

export function getBookDetails(bookId) {
   return async (dispatch) => {
      dispatch({ type: GET_BOOK_DETAILS_START });
      try {
         const response = await fetch(`api/books/details/${bookId}`);
         const bookData = await response.json();
         dispatch({
            type: GET_BOOK_DETAILS_SUCCESS,
            payload: bookData
         });
      }
      catch (e) {
         dispatch({
            type: GET_BOOK_DETAILS_ERROR,
            payload: "Возникла ошибка при загрузке данных."
         });
      }
   }
}

export function deleteBook(bookId, onSuccess) {
   return async (dispatch) => {
      try {
         dispatch({
            type: BOOK_DELETE_START
         });
         const response = await fetch(`/api/books/delete/${bookId}`, {
            method: "DELETE"
         });
         if (response.ok === true) {
            dispatch({
               type: BOOK_DELETE_SUCCESS
            });
            onSuccess();
         }
         else {
            dispatch({
               type: BOOK_DELETE_ERROR,
               payload: "Возникла ошибка при загрузке данных."
            });
         }
      } catch (e) {
         dispatch({
            type: BOOK_DELETE_ERROR,
            payload: "Возникла ошибка при загрузке данных."
         });
      }
   }
}

export function createBookGET() {
   return async (dispatch) => {
      try {
         dispatch({ type: CREATE_BOOK_GET_START });
         const response = await fetch(`/api/books/create`);
         const data = await response.json();
         dispatch({
            type: CREATE_BOOK_GET_SUCCESS,
            payload: data
         });
      } catch (e) {
         dispatch({
            type: CREATE_BOOK_GET_ERROR,
            payload: "Возникла ошибка при загрузке данных."
         });
      }
   }
}

export function bookInputChanged(name, value) {
   let type;
   if (name.includes('selected')) {
      type = BOOK_EDIT_INPUT_CHANGED;
   }
   else {
      type = BOOK_COMMON_INPUT_CHANGED
   }
   return {
      type: type,
      payload: { name: name, value: value }
   };
}

export function editBookGET(bookId) {
   return async (dispatch) => {
      if (!bookId) {
         dispatch({
            type: EDIT_BOOK_GET_ERROR,
            payload: "Неверный id"
         });
      }
      dispatch({ type: EDIT_BOOK_GET_START });
      try {
         const url = `/api/books/edit/${bookId}`;
         const response = await fetch(url);
         const data = await response.json();
         console.log("editBookGET data", data);
         dispatch({
            type: EDIT_BOOK_GET_SUCCESS,
            payload: data
         });
      } catch (e) {
         dispatch({
            type: EDIT_BOOK_GET_ERROR,
            payload: "Возникла ошибка при загрузке данных."
         });
      }
   };
}

export function saveBook(method, onSuccess) {
   return async (dispatch, getState) => {
      const state = getState().book;
      const body = {
         bookId: state.common.bookId,
         name: state.common.name,
         pages: state.common.pages,
         description: state.common.description,
         year: state.common.year,
         base64ImageSrc: state.common.base64ImageSrc,
         selectedLanguageId: state.edit.selectedLanguageId || state.create.allLanguages[0].languageId,
         selectedCategoryId: state.edit.selectedCategoryId || state.create.allCategories[0].categoryId,
         selectedAuthorsId: state.edit.selectedAuthorsId,
         selectedTagsId: state.edit.selectedTagsId
      };
      dispatch({ type: SAVE_BOOK_START });
      try {
         fetch('/api/books', {
            method: method,
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
         })
            .then(async (data) => {
               const response = await data.json();
               if (response.success) {
                  dispatch({
                     type: SAVE_BOOK_SUCCESS
                  });
                  onSuccess(response.bookId || body.bookId);
               }
               else if (response.errors) {
                  dispatch({
                     type: SAVE_BOOK_ERROR,
                     payload: response.errors
                  });
               }
            });
      }
      catch (e) {
         console.log(e);
      }
   };
}