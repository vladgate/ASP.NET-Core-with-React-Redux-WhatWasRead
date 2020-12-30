import React from 'react';
import './BookEditOrCreate.css';
import { connect } from 'react-redux';
import { createBookGET, editBookGET, saveBook, bookInputChanged } from '../../../store/actions/book';
import { withRouter } from 'react-router';

class BookEditOrCreate extends React.Component {
   componentDidMount() {
      this.ensureGetDate();
   }

   componentDidUpdate(prevProps) {
      if (prevProps.isCreate !== this.props.isCreate) {
         this.ensureGetDate();
      }
   }

   ensureGetDate() {
      if (this.props.isCreate) {
         this.props.fetchDataForCreate();
      }
      else {
         this.props.fetchDataForEdit(parseInt(this.props.match.params.id));
      }
   }

   onSaveClick(event) {
      const onSuccess = (id) => this.props.history.push(`/books/details/${id}`);
      if (this.props.isCreate) {
         this.props.saveBook('POST', onSuccess)
      }
      else {
         this.props.saveBook('PUT', onSuccess)
      };
   }

   readURL(event) {
      event.persist();
      if (event.target.files && event.target.files[0]) {
         let reader = new FileReader();
         reader.readAsDataURL(event.target.files[0]);
         reader.onload = () => {
            this.props.inputChanged("base64ImageSrc", reader.result);
         };
      }
   }

   onBookNameChanged(event) {
      this.props.inputChanged("name", event.target.value);
   }

   onPagesChanged(event) {
      this.props.inputChanged("pages", parseInt(event.target.value) || 0);
   }

   onYearChanged(event) {
      this.props.inputChanged("year", parseInt(event.target.value) || 0);
   }

   onDescriptionChanged(event) {
      this.props.inputChanged("description", event.target.value);
   }

   onAuthorsChanged(event) {
      const selectedAuthorsId = Array.prototype.map.call(event.target.selectedOptions, (option) => parseInt(option.value));
      this.props.inputChanged("selectedAuthorsId", selectedAuthorsId);
   }

   onLanguageChanged(event) {
      this.props.inputChanged("selectedLanguageId", parseInt(event.target.value) || 0);
   }

   onCategoryChanged(event) {
      this.props.inputChanged("selectedCategoryId", parseInt(event.target.value) || 0);
   }

   onTagsChanged(event) {
      const selectedTagsId = Array.prototype.map.call(event.target.selectedOptions, (option) => parseInt(option.value));
      this.props.inputChanged("selectedTagsId", selectedTagsId);
   }

   render() {
      return (
         <div className="BookEditOrCreate">
            <h2 style={{ marginLeft: "10px" }}>{this.props.isCreate ? "Добавление новой книги" : "Редактирование информации о книге"}</h2>
            <hr />
            <div className="container-panel">
               <div className="left-side-panel">
                  <div style={{ position: "relative" }}>
                     <label>
                        <input type="file" accept=".jpg, .jpeg, .png" onChange={(event) => this.readURL(event)} />
                        <a>{this.props.common.base64ImageSrc ? "Изменить изображение" : "Выбрать изображение"}</a>
                     </label>
                  </div>
                  <img className="img-thumbnail" src={this.props.common.base64ImageSrc} alt="Нет изображения" />
               </div>
               <div className="right-side-panel">
                  <div className="container-horizontal">
                     <p>
                        <label >Название:</label>
                        <input type="text" value={this.props.common.name} onChange={(event) => this.onBookNameChanged(event)} /></p>

                     <p>
                        <label className="book-edit-label">Авторы:</label>
                        <select multiple="multiple" size="10" onChange={(event) => this.onAuthorsChanged(event)}>
                           {this.props.authors ? this.props.authors.map((item) => <option key={item.authorId} value={item.authorId} selected={this.props.edit.selectedAuthorsId.includes(item.authorId)}>{item.displayText}</option>) : null}
                        </select>
                     </p>

                     <p>
                        <label className="book-edit-label">Количество страниц:</label>
                        <input type="number" value={this.props.common.pages} onChange={(event) => this.onPagesChanged(event)} /></p>

                     <p>
                        <label className="book-edit-label">Год издания:</label>
                        <input type="number" value={this.props.common.year} onChange={(event) => this.onYearChanged(event)} /></p>

                     <p>
                        <label className="book-edit-label">Описание:</label>
                        <textarea value={this.props.common.description} onChange={(event) => this.onDescriptionChanged(event)}></textarea></p>

                     <p>
                        <label className="book-edit-label">Язык:</label>
                        <select onChange={(event) => this.onLanguageChanged(event)}>{this.props.languages ? this.props.languages.map((item) => <option key={item.languageId} value={item.languageId} selected={this.props.edit.selectedLanguageId === item.languageId}>{item.nameForLabels}</option>) : null}</select></p>

                     <p>
                        <label className="book-edit-label">Категория:</label>
                        <select onChange={(event) => this.onCategoryChanged(event)}>{this.props.categories ? this.props.categories.map((item) => <option key={item.categoryId} value={item.categoryId} selected={this.props.edit.selectedCategoryId === item.categoryId}>{item.nameForLabels}</option>) : null}</select></p>

                     <p>
                        <label className="book-edit-label">Теги:</label>
                        <select multiple="multiple" size="10" onChange={(event) => this.onTagsChanged(event)}>
                           {this.props.tags ? this.props.tags.map((item) =>
                              <option
                                 key={item.tagId}
                                 selected={this.props.edit.selectedTagsId.includes(item.tagId)}
                                 value={item.tagId}>
                                 {item.nameForLabels}
                              </option>) : null}
                        </select>
                     </p>
                     <div className="errors">{this.props.errors}</div>
                  </div>
               </div>
               <div className="details-p">
                  <button className="btn btn-primary" onClick={(event) => (this.onSaveClick(event))}>Сохранить</button>
               </div>
            </div>
         </div>);
   }
}

function mapStateToProps(state) {
   return {
      common: state.book.common,
      edit: state.book.edit,
      authors: state.book.create.allAuthors,
      tags: state.book.create.allTags,
      categories: state.book.create.allCategories,
      languages: state.book.create.allLanguages,
      isLoading: state.book.isLoading,
      errors: state.book.errors
   };
}

function mapDispatchToProps(dispatch) {
   return {
      fetchDataForCreate: () => dispatch(createBookGET()),
      fetchDataForEdit: (id) => dispatch(editBookGET(id)),
      saveBook: (method, onSuccess) => dispatch(saveBook(method, onSuccess)),
      inputChanged: (name, value) => dispatch(bookInputChanged(name, value))
   };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookEditOrCreate));