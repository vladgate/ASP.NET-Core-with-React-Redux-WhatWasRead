import React from 'react';
import './RightPanel.css';
import PagingWrapper from '../../main/PagingWrapper/PagingWrapper';
import BookList from '../BookList/BookList';
import { connect } from 'react-redux';

const RightPanel = (props) => {
   return (<div id="right-panel">
      <BookList books={props.bookInfo || []} isLoading={props.isLoading} />
      <PagingWrapper search={props.search} />
   </div>);
}

function mapStateToProps(state) {
   return {
      bookInfo: state.main.rightPanelData.bookInfo,
      currentPage: state.main.currentPage,
      currentCategory: state.main.currentCategory,
      isLoading: state.main.isLoading
   }
}

export default connect(mapStateToProps, null)(RightPanel);
