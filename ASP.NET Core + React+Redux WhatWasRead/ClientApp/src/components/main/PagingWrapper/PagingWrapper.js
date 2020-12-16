import React from 'react';
import './PagingWrapper.css';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNextBookInfo } from '../../../store/actions/actions';

class PagingWrapper extends React.Component {

   onBtnShowMoreClick(event) {
      this.props.getNextBookInfo(this.props.currentCategory, this.props.currentPage, this.props.search);
   }

   render() {
      const items = [];
      for (let i = 1; i <= this.props.totalPages; i++) {
         items.push(<NavLink key={i} exact to={`/books/list/${this.props.currentCategory}/page` + i + this.props.search} className="PageLink" activeClassName="selected" aria-current="page"
            isActive={(match, location) => {
               if (this.props.activePages.indexOf(i) !== -1) {
                  return true;
               }
               else {
                  return false;
               }
            }}
         >{i}</ NavLink>);
      }
      return (
         <div className='PagingWrapper'>
            <div className='bottom-paging'>{items}</div>
            <div><button id="btn-load-more" className="btn btn-success" disabled={this.props.totalPages === 0 || this.props.totalPages === this.props.currentPage} onClick={(event) => this.onBtnShowMoreClick(event)}>Показать еще</button></div>
         </div>);
   }
}

function mapStateToProps(state) {
   return {
      activePages: state.activePages,
      currentPage: state.currentPage,
      currentCategory: state.currentCategory,
      totalPages: state.rightPanelData.totalPages
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNextBookInfo: (category, currentPage, search) => dispatch(getNextBookInfo(category, currentPage, search))
   };
}
export default connect(mapStateToProps, mapDispatchToProps)(PagingWrapper);
