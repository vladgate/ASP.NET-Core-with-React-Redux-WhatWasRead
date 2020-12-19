import {
   GET_AUTHORS_START, GET_AUTHORS_SUCCESS, GET_AUTHORS_ERROR, EDIT_AUTHOR, CANCEL_EDIT_AUTHOR, DELETE_AUTHOR_ERROR, AUTHOR_INPUT_CHANGED,
   SAVE_NEW_AUTHOR_ERROR, SAVE_NEW_AUTHOR_START, SAVE_NEW_AUTHOR_SUCCESS, SAVE_EDITED_AUTHOR_ERROR, SAVE_EDITED_AUTHOR_START, SAVE_EDITED_AUTHOR_SUCCESS
} from "./actionTypes";

const apiUrl = '/api/authors';

export function fetchAuthors() {
   return async (dispatch) => {
      dispatch({ type: GET_AUTHORS_START});
      try {
         const response = await fetch(apiUrl);
         const data = await response.json();
         dispatch({
            type: GET_AUTHORS_SUCCESS,
            payload: data
         });
      } catch (e) {
         dispatch({
            type: GET_AUTHORS_ERROR,
            payload: "Возникла ошибка при загрузке."
         });
      }
   }
}

export function editAuthor(authorId) {
   return {
      type: EDIT_AUTHOR,
      payload: authorId
   };
}

export function cancelEditAuthor() {
   return {
      type: CANCEL_EDIT_AUTHOR
   };
}

export function deleteAuthor(authorId) {
   return async (dispatch) => {
      if (!authorId) {
         dispatch({ type: DELETE_AUTHOR_ERROR, payload: "Неверный идентификатор." });
      }
      try {
         const response = await fetch(`/api/authors/${authorId}`, {
            method: 'DELETE'
         });
         const data = await response.json();
         if (data.success) {
            dispatch(fetchAuthors());
         }
         else if (data.errors) {
            dispatch({ type: DELETE_AUTHOR_ERROR, payload: data.errors });
         }
      } catch (e) {
         dispatch({ type: DELETE_AUTHOR_ERROR, payload: "Ошибка удаления." });
      }
   }
}

export function authorInputChanged(name, value) {
   return {
      type: AUTHOR_INPUT_CHANGED,
      payload: { name: name, value: value }
   };
}

export function saveNewAuthor() {
   return async (dispatch, getState) => {
      const state = getState().author;
      const errors = validateAuthor(state.addLastName, state.addFirstName);
      if (errors) {
         dispatch({ type: SAVE_NEW_AUTHOR_ERROR, payload: errors });
         return;
      }
      const body = {
         lastName: state.addLastName,
         firstName: state.addFirstName
      };
      dispatch({ type: SAVE_NEW_AUTHOR_START });
      try {
         fetch(apiUrl, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
         })
            .then(async (data) => {
               const response = await data.json();
               if (response.success) {
                  dispatch({ type: SAVE_NEW_AUTHOR_SUCCESS })
                  dispatch(fetchAuthors());
               }
               else if (response.errors) {
                  dispatch({ type: SAVE_NEW_AUTHOR_ERROR, payload: response.errors });
               }
            });
      }
      catch (e) {
         dispatch({ type: SAVE_NEW_AUTHOR_ERROR, payload: "Ошибка сохранения." });
      }
   };
}

export function saveEditedAuthor(authorId, lastName, firstName ) {
   return async (dispatch) => {
      const errors = validateAuthor(lastName, firstName);
      if (errors) {
         dispatch({ type: SAVE_EDITED_AUTHOR_ERROR, payload: errors });
         return;
      }
      dispatch({ type: SAVE_EDITED_AUTHOR_START });
      const body = {
         authorId: authorId,
         lastName: lastName,
         firstName: firstName
      };
      try {
         fetch(apiUrl, {
            method: 'PUT',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
         })
            .then(async (data) => {
               const response = await data.json();
               if (response.success) {
                  dispatch({ type: SAVE_EDITED_AUTHOR_SUCCESS });
                  dispatch(fetchAuthors());
               }
               else if (response.errors) {
                  dispatch({ type: SAVE_EDITED_AUTHOR_ERROR, payload: response.errors });
               }
            });
      }
      catch (e) {
         dispatch({ type: SAVE_EDITED_AUTHOR_ERROR, payload: "Ошибка сохранения." });
      }
   };
}

function validateAuthor(lastName, firstName) {
   let errors = "";
   if (lastName.trim().length < 2 || lastName.trim().length > 30) {
      errors += "Фамилия автора должна состоять от 2 до 30 символов. "
   }
   if (firstName.trim().length < 2 || firstName.trim().length > 30) {
      errors += "Имя автора должно состоять от 2 до 30 символов. "
   }
   return errors;
}