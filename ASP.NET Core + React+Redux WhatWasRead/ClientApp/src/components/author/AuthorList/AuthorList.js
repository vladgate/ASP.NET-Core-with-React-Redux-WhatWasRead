import React from 'react';
import './AuthorList.css';
import { connect } from 'react-redux';
import { fetchAuthors, editAuthor, saveNewAuthor, saveEditedAuthor, cancelEditAuthor, deleteAuthor, authorInputChanged } from '../../../store/actions/author';

class AuthorList extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         authors: [],
         editAuthorId: 0,
         addFirstName: "",
         addLastName: "",
         saveErrors: "",
         tableErrors: ""
      };
   }

   componentDidMount() {
      this.props.fetchData();
   }

   onFirstNameChanged(event) {
      this.props.inputChanged("addFirstName", event.target.value || "");
   }

   onLastNameChanged(event) {
      this.props.inputChanged("addLastName", event.target.value || "");
   }

   onSaveNewAuthorClick(event) {
      this.props.saveNewAuthor();
   }

   onEditBtnClick(event, authorId) {
      this.props.editAuthor(authorId);
   }

   onSaveEditedBtnClick(event, authorId) {
      const lastName = document.getElementById("edit-lastName").value;
      const firstName = document.getElementById("edit-firstName").value;
      this.props.saveEditedAuthor(authorId, lastName, firstName);
   }

   onCancelEditBtnClick(event) {
      this.props.cancelEdit();
   }

   onDeleteBtnClick(event, authorId) {
      this.props.deleteAuthor(authorId);
   }

   renderUsual(author) {
      return (
         <tr key={author.authorId}>
            <td>{author.lastName}</td>
            <td>{author.firstName}</td>
            <td>
               <button className="btn-edit" onClick={(event) => this.onEditBtnClick(event, author.authorId)}>Редактировать</button>
               <span> | </span>
               <button className="btn-delete" onClick={(event) => this.onDeleteBtnClick(event, author.authorId)}>Удалить</button>
            </td>
         </tr>);
   }

   renderForEdit(author) {
      return (
         <tr key={author.authorId}>
            <td><input defaultValue={author.lastName} id="edit-lastName"></input></td>
            <td><input defaultValue={author.firstName} id="edit-firstName"></input></td>
            <td>
               <button className="btn-edit" onClick={(event) => this.onSaveEditedBtnClick(event, author.authorId)}>Сохранить</button>
               <span> | </span>
               <button className="btn-cancel" onClick={(event) => this.onCancelEditBtnClick(event)}>Отмена</button>
               <span> | </span>
               <button className="btn-delete" onClick={(event) => this.onDeleteBtnClick(event, author.authorId)}>Удалить</button>
            </td>
         </tr>);
   }

   render() {
      return (
         <div className="AuthorList">
            <h3>Добавить автора</h3>
            <hr />
            <div className="container-horizontal">
               <p>
                  <label>Фамилия:</label>
                  <input type="text" value={this.props.addLastName} onChange={(event) => this.onLastNameChanged(event)} /></p>
               <p>
                  <label>Имя:</label>
                  <input type="text" value={this.props.addFirstName} onChange={(event) => this.onFirstNameChanged(event)} /></p>
               <div className="errors">{this.props.saveErrors}</div>
            </div>
            <button className="btn btn-primary" onClick={(event) => (this.onSaveNewAuthorClick(event))}>Сохранить</button>

            <hr />
            <h2>Авторы</h2>
            <div className="errors">{this.props.tableErrors}</div>
            <table>
               <thead>
                  <tr>
                     <th>Фамилия</th>
                     <th>Имя</th>
                     <th>Действия</th>
                  </tr>
               </thead>
               <tbody>
                  {this.props.authors.map((author) => this.props.editAuthorId === author.authorId ? this.renderForEdit(author) : this.renderUsual(author))}
               </tbody>
            </table>
         </div>);
   }
}
function mapStateToProps(state) {
   return {
      addLastName: state.author.addLastName,
      addFirstName: state.author.addFirstName,
      saveErrors: state.author.saveErrors,
      tableErrors: state.author.tableErrors,
      authors: state.author.authors,
      editAuthorId: state.author.editAuthorId
   };
}

function mapDispatchToProps(dispatch) {
   return {
      fetchData: () => dispatch(fetchAuthors()),
      editAuthor: (authorId) => dispatch(editAuthor(authorId)),
      saveNewAuthor: () => dispatch(saveNewAuthor()),
      saveEditedAuthor: (authorId, lastName, firstName) => dispatch(saveEditedAuthor(authorId, lastName, firstName)),
      cancelEdit: () => dispatch(cancelEditAuthor()),
      deleteAuthor: (authorId) => dispatch(deleteAuthor(authorId)),
      inputChanged: (name, value) => dispatch(authorInputChanged(name, value)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorList);