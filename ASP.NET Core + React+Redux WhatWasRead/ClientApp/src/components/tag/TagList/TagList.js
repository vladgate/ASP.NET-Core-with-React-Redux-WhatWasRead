import React from 'react';
import './TagList.css';
import { connect } from 'react-redux';
import { tagInputChanged, fetchTags, editTag, deleteTag, saveNewTag, saveEditedTag, cancelEditTag } from '../../../store/actions/tag';

class TagList extends React.Component {

   componentDidMount() {
      this.props.fetchData();
   }

   onNameForLabelsChanged(event) {
      this.props.inputChanged("addNameForLabels", event.target.value || "");
   }

   onNameForLinksChanged(event) {
      this.props.inputChanged("addNameForLinks", event.target.value || "");
   }

   onSaveNewTagClick(event) {
      this.props.saveNewTag();
   }

   onEditBtnClick(event, tagId) {
      this.props.editTag(tagId);
   }

   onSaveEditedBtnClick(event, tagId) {
      const nameForLabels = document.getElementById("edit-nameForLabels").value;
      const nameForLinks = document.getElementById("edit-nameForLinks").value;
      this.props.saveEditedTag(tagId, nameForLabels, nameForLinks);
   }

   onCancelEditBtnClick(event) {
      this.props.cancelEdit();
   }

   onDeleteBtnClick(event, tagId) {
      this.props.deleteTag(tagId);
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
               <button className="btn-cancel" onClick={(event) => this.onCancelEditBtnClick(event)}>Отмена</button>
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
                  <input type="text" value={this.props.addNameForLabels} onChange={(event) => this.onNameForLabelsChanged(event)} /></p>
               <p>
                  <label>Текст ссылки:</label>
                  <input type="text" value={this.props.addNameForLinks} onChange={(event) => this.onNameForLinksChanged(event)} /></p>
               <div className="errors">{this.props.saveErrors}</div>
            </div>
            <button className="btn btn-primary" onClick={(event) => (this.onSaveNewTagClick(event))}>Сохранить</button>

            <hr />
            <h2>Теги</h2>
            <div className="errors">{this.props.tableErrors}</div>
            <table>
               <thead>
                  <tr>
                     <th>Текст представления</th>
                     <th>Текст ссылки</th>
                     <th>Действия</th>
                  </tr>
               </thead>
               <tbody>
                  {this.props.tags.map((tag) => this.props.editTagId === tag.tagId ? this.renderForEdit(tag) : this.renderUsual(tag))}
               </tbody>
            </table>
         </div>);
   }
}

function mapStateToProps(state){
   return {
      addNameForLabels: state.tag.addNameForLabels,
      addNameForLinks: state.tag.addNameForLinks,
      saveErrors: state.tag.saveErrors,
      tableErrors: state.tag.tableErrors,
      tags: state.tag.tags,
      editTagId: state.tag.editTagId
   };
}

function mapDispatchToProps(dispatch) {
   return {
      fetchData: () => dispatch(fetchTags()),
      editTag: (tagId) => dispatch(editTag(tagId)),
      saveNewTag: () => dispatch(saveNewTag()),
      saveEditedTag: (tagId, nameForLabels, nameForLinks) => dispatch(saveEditedTag(tagId, nameForLabels, nameForLinks)),
      cancelEdit: () => dispatch(cancelEditTag()),
      deleteTag: (tagId) => dispatch(deleteTag(tagId)),
      inputChanged: (name, value) => dispatch(tagInputChanged(name, value)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagList);