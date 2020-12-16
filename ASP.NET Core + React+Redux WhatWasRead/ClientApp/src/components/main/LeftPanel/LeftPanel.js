import React from 'react';
import './LeftPanel.css';
import { connect } from 'react-redux';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { getData, maxPageChanged, minPageChanged, changeLanguageChecked, changeAuthorChecked, resetFilter } from '../../../store/actions/actions';
import { AUTHOR_QUERY_WORD, LANGUAGE_QUERY_WORD, PAGES_QUERY_WORD } from '../../common';

class LeftPanel extends React.Component {

   onMinPagesChange(event) {
      const value = event.target.value;
      if (value.match(/^\d{1,4}$/)) {
         this.props.minPageChanged(value);
      }
   }

   onMaxPagesChange(event) {
      const value = event.target.value;
      if (value.match(/^\d{1,4}$/)) {
         this.props.maxPageChanged(value);
      }
   }

   onLanguageCheckedChange(event) {
      this.props.changeLanguageChecked(parseInt(event.target.id));
   }

   onAuthorCheckedChange(event) {
      this.props.changeAuthorChecked(parseInt(event.target.id));
   }

   onApplyFilterButtonClick(event) {
      const queryStringAr = [];
      const checkedLanguages = this.props.languages.filter(item => item.checked);
      const ar = [];
      for (let i = 0; i < checkedLanguages.length; i++) {
         ar.push(checkedLanguages[i].nameForLinks);
      }
      let qLang = "";
      if (ar.length > 0) {
         qLang = LANGUAGE_QUERY_WORD + "=" + ar.join(",");
         queryStringAr.push(qLang);
      }
      const checkedAuthors = this.props.authors.filter(item => item.checked);
      ar.length = 0;
      for (let i = 0; i < checkedAuthors.length; i++) {
         ar.push(checkedAuthors[i].authorId);
      }
      var qAuthors = "";
      if (ar.length > 0) {
         qAuthors = AUTHOR_QUERY_WORD + "=" + ar.join(",");
         queryStringAr.push(qAuthors);
      }
      const minExpected = this.props.minPagesExpected;
      const maxExpected = this.props.maxPagesExpected;
      const minActual = this.props.minPagesActual;
      const maxActual = this.props.maxPagesActual;

      if (minActual && maxActual && (minActual !== minExpected || maxActual !== maxExpected) && minActual <= maxActual) /*correct values*/ {
         const qPages = PAGES_QUERY_WORD + "=" + minActual + "-" + maxActual;
         queryStringAr.push(qPages);
      }
      const qString = queryStringAr.join("&");
      this.props.history.push(`/books/list/${this.props.category}/page1` + (qString ? "?" + qString : ""));
   }

   onResetFilterButtonClick(event) {
      this.props.resetFilter();
      this.props.history.push(`/books/list/${this.props.category}/page${this.props.page}`);
   }

   renderCategories() {
      const result = [];
      result.push(
         <li key={0} data-target="all">
            <NavLink to={`/`} activeClassName="selected" isActive={() => this.props.location.pathname === "/" || this.props.match.params.category === "all"}>Все</NavLink>
         </li>);
      if (this.props.data.categories) {
         result.push(this.props.data.categories.map((item) => {
            return (<li key={item.categoryId} data-target={item.nameForLinks}>
               <NavLink to={`/books/list/${item.nameForLinks}/page1`} activeClassName="selected" isActive={() => this.props.match.params.category === item.nameForLinks}>{item.nameForLabels}</NavLink>
            </li>)
         }));
      }
      return result;
   }

   renderLanguages() {
      if (!this.props.data.languages) {
         return null;
      }
      return this.props.data.languages.map((item) => {
         return (
            <li key={item.languageId} >
               <input className="filter-checkbox" type="checkbox" id={item.languageId} checked={item.checked} onChange={(event) => this.onLanguageCheckedChange(event)} />
               <Link className="filter-label" to={item.link}>{item.nameForLabels}</Link>
            </li>)
      })
   }

   renderAuthors() {
      if (!this.props.data.authors) {
         return null;
      }
      return this.props.data.authors.map((item) => {
         return (
            <li key={item.authorId} className="filter-li">
               <input className="filter-checkbox" type="checkbox" id={item.authorId} checked={item.checked} onChange={(event) => this.onAuthorCheckedChange(event)} />
               <Link className="filter-label" to={item.link}>{item.displayText}</Link>
            </li>)
      })
   }

   renderTags() {
      if (!this.props.data.tags) {
         return null;
      }
      return this.props.data.tags.map((item) => {
         return (
            <span key={item.tagId} className="tag-span" data-target={item.nameForLinks}>
               <Link to={`/books/list/all/page1?tag=${item.nameForLinks}`}>{item.nameForLabels}</Link>
            </span>)
      })
   }

   render() {
      return (
         <div id="left-panel">
            <h3>Категории книг</h3>
            <ul id="list">
               {this.renderCategories()}
            </ul>
            <h3>Фильтр</h3>

            <span className="filter-span">Язык:</span>
            <ul className="filter-ul" data-target={LANGUAGE_QUERY_WORD}>
               {this.renderLanguages()}
            </ul>

            <span className="filter-span">Автор:</span>
            <ul className="filter-ul" data-target={AUTHOR_QUERY_WORD}>
               {this.renderAuthors()}
            </ul>
            <div id="filter-pages" data-target={PAGES_QUERY_WORD} data-min={this.props.data.minPageExpected} data-max={this.props.data.maxPageExpected}>
               <span className="filter-span">Количество страниц:</span>
               <p>
                  <span> от: </span><input className="filter-page-count" id="min-pages" type="text" value={this.props.data.minPagesActual || this.props.data.minPagesExpected || 0} onChange={(event) => this.onMinPagesChange(event)} />
                  <span> до: </span><input className="filter-page-count" id="max-pages" type="text" value={this.props.data.maxPagesActual || this.props.data.maxPagesExpected || 0} onChange={(event) => this.onMaxPagesChange(event)} />
               </p>
            </div>
            <div className="btn-placeholder">
               <input className="filter-btn" type="button" value="Применить фильтр" onClick={(event) => this.onApplyFilterButtonClick(event)} />
            </div>
            <div className="btn-placeholder">
               <input className="filter-btn" type="button" value="Сбросить фильтр" onClick={(event) => this.onResetFilterButtonClick(event)} />
            </div>
            <div>
               <p className="tag-header">Поиск по тегу:</p>
               {this.renderTags()}
            </div>
         </div>
      )
   }
}
function mapStateToProps(state) {
   return {
      data: state.leftPanelData,
      category: state.currentCategory,
      page: state.currentPage,
      languages: state.leftPanelData.languages,
      authors: state.leftPanelData.authors,
      minPagesExpected: state.leftPanelData.minPagesExpected,
      maxPagesExpected: state.leftPanelData.maxPagesExpected,
      minPagesActual: state.leftPanelData.minPagesActual,
      maxPagesActual: state.leftPanelData.maxPagesActual
   }
}
function mapDispatchToProps(dispatch) {
   return {
      getData: (category, page, search) => dispatch(getData(category, page, search)),
      maxPageChanged: (newValue) => dispatch(maxPageChanged(newValue)),
      minPageChanged: (newValue) => dispatch(minPageChanged(newValue)),
      changeLanguageChecked: (langId) => dispatch(changeLanguageChecked(langId)),
      changeAuthorChecked: (authorId) => dispatch(changeAuthorChecked(authorId)),
      resetFilter: () => dispatch(resetFilter())
   };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftPanel));