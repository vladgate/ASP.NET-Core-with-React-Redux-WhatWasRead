import React from 'react';
import './AuthorList.css';

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
      this.fetchData();
   }

   async fetchData() {
      const url = `/api/authors`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({
         authors: data || []
      });
   }

   onFirstNameChanged(event) {
      this.setState({ addFirstName: event.target.value });
   }

   onLastNameChanged(event) {
      this.setState({ addLastName: event.target.value });
   }
   validateInput(lastName, firstName) {
      let errors = "";
      if (lastName.trim().length < 2 || lastName.trim().length > 30) {
         errors += "Фамилия автора должна состоять от 2 до 30 символов. "
      }
      if (firstName.trim().length < 2 || firstName.trim().length > 30) {
         errors += "Имя автора должно состоять от 2 до 30 символов. "
      }
      return errors;
   }

   onSaveNewAuthorClick(event) {
      const errors = this.validateInput(this.state.addLastName, this.state.addFirstName);
      if (errors) {
         this.setState({ saveErrors: errors });
         return;
      }

      const body = {
         lastName: this.state.addLastName,
         firstName: this.state.addFirstName
      };
      try {
         const url = `/api/authors`;
         fetch(url, {
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
                  this.setState({
                     addFirstName: "",
                     addLastName: "",
                     saveErrors: "",
                     tableErrors: ""
                  });
                  this.fetchData();
               }
               else if (response.errors) {
                  this.setState({ saveErrors: response.errors });
               }
            });
      }
      catch (e) {
         console.log(e);
      }
   }

   async onEditBtnClick(event, authorId) {
      this.setState({ editAuthorId: authorId });
   }

   async onSaveEditedBtnClick(event, authorId) {
      const lastName = document.getElementById("edit-lastName").value;
      const firstName = document.getElementById("edit-firstName").value;
      const errors = this.validateInput(lastName, firstName);
      if (errors) {
         this.setState({ tableErrors: errors });
         return;
      }

      const body = {
         authorId: authorId,
         lastName: lastName,
         firstName: firstName
      };
      try {
         const url = `/api/authors`;
         fetch(url, {
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
                  this.setState({ editAuthorId: 0 });
                  this.fetchData();
               }
               else if (response.errors) {
                  this.setState({ tableErrors: response.errors });
               }
            });
      }
      catch (e) {
         console.log(e);
      }
   }

   async onDeleteBtnClick(event, authorId) {
      const id = parseInt(authorId);
      if (!id) {
         return;
      }
      const response = await fetch(`/api/authors/${authorId}`, {
         method: 'DELETE'
      })
      const data = await response.json();
      if (data.success) {
         this.setState({ tableErrors: "" });
         this.fetchData();
      }
      else if (data.errors) {
         this.setState({ tableErrors: data.errors });
      }
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
                  <input type="text" value={this.state.addLastName} onChange={(event) => this.onLastNameChanged(event)} /></p>
               <p>
                  <label>Имя:</label>
                  <input type="text" value={this.state.addFirstName} onChange={(event) => this.onFirstNameChanged(event)} /></p>
               <div className="errors">{this.state.saveErrors}</div>
            </div>
            <button className="btn btn-primary" onClick={(event) => (this.onSaveNewAuthorClick(event))}>Сохранить</button>

            <hr />
            <h2>Авторы</h2>
            <div className="errors">{this.state.tableErrors}</div>
            <table>
               <thead>
                  <tr>
                     <th>Фамилия</th>
                     <th>Имя</th>
                     <th>Действия</th>
                  </tr>
               </thead>
               <tbody>
                  {this.state.authors.map((author) => this.state.editAuthorId === author.authorId ? this.renderForEdit(author) : this.renderUsual(author))}
               </tbody>
            </table>
         </div>);
   }
}

export default AuthorList;