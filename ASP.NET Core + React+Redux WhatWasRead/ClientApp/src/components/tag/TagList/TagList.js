import React from 'react';
import './TagList.css';

class TagList extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         tags: [],
         editTagId: 0,
         addNameForLabels: "",
         addNameForLinks: "",
         saveErrors: "",
         tableErrors: ""
      };
   }

   componentDidMount() {
      this.fetchData();
   }

   async fetchData() {
      const url = `/api/tags`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({
         tags: data || []
      });
   }

   onNameForLabelsChanged(event) {
      this.setState({ addNameForLabels: event.target.value });
   }

   onNameForLinksChanged(event) {
      this.setState({ addNameForLinks: event.target.value });
   }

   validateInput(nameForLabels, nameForLinks) {
      let errors = "";
      if (nameForLabels.trim().length < 1 || nameForLabels.trim().length > 50) {
         errors +="Текст представления тега должно состоять от 1 до 50 символов. "
      }
      if (nameForLinks.trim().length < 1 || nameForLinks.trim().length > 50) {
         errors += "Текст ссылки тега должен состоять от 1 до 50 символов. "
      }
      return errors;
   }

   onSaveNewTagClick(event) {
      const errors = this.validateInput(this.state.addNameForLabels, this.state.addNameForLinks);
      if (errors) {
         this.setState({ saveErrors: errors });
         return;
      }

      const body = {
         nameForLabels: this.state.addNameForLabels,
         nameForLinks: this.state.addNameForLinks
      };
      try {
         const url = `/api/tags`;
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
                     addNameForLabels: "",
                     addNameForLinks: "",
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

   async onEditBtnClick(event, tagId) {
      this.setState({ editTagId: tagId });
   }

   async onSaveEditedBtnClick(event, tagId) {
      const nameForLabels = document.getElementById("edit-nameForLabels").value;
      const nameForLinks = document.getElementById("edit-nameForLinks").value;
      const errors = this.validateInput(nameForLabels, nameForLinks);
      if (errors) {
         this.setState({ tableErrors: errors });
         return;
      }

      const body = {
         tagId: tagId,
         nameForLabels: nameForLabels,
         nameForLinks: nameForLinks
      };
      try {
         const url = `/api/tags`;
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
                  this.setState({ editTagId: 0 });
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

   async onDeleteBtnClick(event, tagId) {
      const id = parseInt(tagId);
      if (!id) {
         return;
      }
      const response = await fetch(`/api/tags/${tagId}`, {
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

   renderUsual(tag) {
      return (
         <tr key={tag.tagId}>
            <td>{tag.nameForLabels}</td>
            <td>{tag.nameForLinks}</td>
            <td>
               <button className="btn-edit" onClick={(event) => this.onEditBtnClick(event, tag.tagId)}>Редактировать</button>
               <span> | </span>
               <button className="btn-delete" onClick={(event) => this.onDeleteBtnClick(event, tag.tagId)}>Удалить</button>
            </td>
         </tr>);
   }

   renderForEdit(tag) {
      return (
         <tr key={tag.tagId}>
            <td><input defaultValue={tag.nameForLabels} id="edit-nameForLabels"></input></td>
            <td><input defaultValue={tag.nameForLinks} id="edit-nameForLinks"></input></td>
            <td>
               <button className="btn-edit" onClick={(event) => this.onSaveEditedBtnClick(event, tag.tagId)}>Сохранить</button>
               <span> | </span>
               <button className="btn-delete" onClick={(event) => this.onDeleteBtnClick(event, tag.tagId)}>Удалить</button>
            </td>
         </tr>);
   }

   render() {
      return (
         <div className="TagList">
            <h3>Добавить тег</h3>
            <hr />
            <div className="container-horizontal">
               <p>
                  <label>Текст представления:</label>
                  <input type="text" value={this.state.addNameForLabels} onChange={(event) => this.onNameForLabelsChanged(event)} /></p>
               <p>
                  <label>Текст ссылки:</label>
                  <input type="text" value={this.state.addNameForLinks} onChange={(event) => this.onNameForLinksChanged(event)} /></p>
               <div className="errors">{this.state.saveErrors}</div>
            </div>
            <button className="btn btn-primary" onClick={(event) => (this.onSaveNewTagClick(event))}>Сохранить</button>

            <hr />
            <h2>Теги</h2>
            <div className="errors">{this.state.tableErrors}</div>
            <table>
               <thead>
                  <tr>
                     <th>Текст представления</th>
                     <th>Текст ссылки</th>
                     <th>Действия</th>
                  </tr>
               </thead>
               <tbody>
                  {this.state.tags.map((tag) => this.state.editTagId === tag.tagId ? this.renderForEdit(tag) : this.renderUsual(tag))}
               </tbody>
            </table>
         </div>);
   }
}

export default TagList;