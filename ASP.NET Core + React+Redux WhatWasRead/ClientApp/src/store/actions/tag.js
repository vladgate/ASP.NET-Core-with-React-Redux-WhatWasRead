import {
   TAG_INPUT_CHANGED, GET_TAGS_SUCCESS, GET_TAGS_ERROR, GET_TAGS_START, EDIT_TAG, CANCEL_EDIT_TAG, DELETE_TAG_ERROR,
   SAVE_NEW_TAG_SUCCESS, SAVE_NEW_TAG_ERROR, SAVE_NEW_TAG_START, SAVE_EDITED_TAG_ERROR, SAVE_EDITED_TAG_START, SAVE_EDITED_TAG_SUCCESS
} from "./actionTypes";

const apiUrl = '/api/tags';

export function fetchTags() {
   return async (dispatch) => {
      dispatch({ type: GET_TAGS_START });
      try {
         const response = await fetch(apiUrl);
         const data = await response.json();
         dispatch({
            type: GET_TAGS_SUCCESS,
            payload: data
         });
      } catch (e) {
         dispatch({
            type: GET_TAGS_ERROR,
            payload: "Возникла ошибка при загрузке."
         });
      }
   }
}

export function editTag(tagId) {
   return {
      type: EDIT_TAG,
      payload: tagId
   };
}

export function cancelEditTag() {
   return {
      type: CANCEL_EDIT_TAG
   };
}

export function deleteTag(tagId) {
   return async (dispatch) => {
      if (!tagId) {
         dispatch({ type: DELETE_TAG_ERROR, payload: "Неверный идентификатор." });
      }
      try {
         const response = await fetch(`/api/tags/${tagId}`, {
            method: 'DELETE'
         });
         const data = await response.json();
         if (data.success) {
            dispatch(fetchTags());
         }
         else if (data.errors) {
            dispatch({ type: DELETE_TAG_ERROR, payload: data.errors });
         }
      } catch (e) {
         dispatch({ type: DELETE_TAG_ERROR, payload: "Ошибка." });
      }
   }
}

export function tagInputChanged(name, value) {
   return {
      type: TAG_INPUT_CHANGED,
      payload: { name: name, value: value }
   };
}

export function saveNewTag() {
   return async (dispatch, getState) => {
      const state = getState().tag;
      const errors = validateTag(state.addNameForLabels, state.addNameForLinks);
      if (errors) {
         dispatch({ type: SAVE_NEW_TAG_ERROR, payload: errors });
         return;
      }
      const body = {
         nameForLabels: state.addNameForLabels,
         nameForLinks: state.addNameForLinks
      };
      dispatch({ type: SAVE_NEW_TAG_START });
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
                  dispatch({ type: SAVE_NEW_TAG_SUCCESS })
                  dispatch(fetchTags());
               }
               else if (response.errors) {
                  dispatch({ type: SAVE_NEW_TAG_ERROR, payload: response.errors });
               }
            });
      }
      catch (e) {
         dispatch({ type: SAVE_NEW_TAG_ERROR, payload: "Ошибка сохранения." });
      }
   };
}

export function saveEditedTag(tagId, nameForLabels, nameForLinks ) {
   return async (dispatch) => {
      const errors = validateTag(nameForLabels, nameForLinks);
      if (errors) {
         dispatch({ type: SAVE_EDITED_TAG_ERROR, payload: errors });
         return;
      }
      dispatch({ type: SAVE_EDITED_TAG_START });
      const body = {
         tagId: tagId,
         nameForLabels: nameForLabels,
         nameForLinks: nameForLinks
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
                  dispatch({ type: SAVE_EDITED_TAG_SUCCESS });
                  dispatch(fetchTags());
               }
               else if (response.errors) {
                  dispatch({ type: SAVE_EDITED_TAG_ERROR, payload: response.errors });
               }
            });
      }
      catch (e) {
         dispatch({ type: SAVE_EDITED_TAG_ERROR, payload: "Ошибка сохранения." });
      }
   };
}

function validateTag(nameForLabels, nameForLinks) {
   let errors = "";
   if (nameForLabels.trim().length < 1 || nameForLabels.trim().length > 50) {
      errors += "Текст представления тега должно состоять от 1 до 50 символов. "
   }
   if (nameForLinks.trim().length < 1 || nameForLinks.trim().length > 50) {
      errors += "Текст ссылки тега должен состоять от 1 до 50 символов. "
   }
   return errors;
}