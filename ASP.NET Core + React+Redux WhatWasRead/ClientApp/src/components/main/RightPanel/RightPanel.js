import React from 'react';
import './RightPanel.css';
import PagingWrapper from '../../main/PagingWrapper/PagingWrapper';
import BookList from '../BookList/BookList';
import { connect } from 'react-redux';

class RightPanel extends React.Component {

   render() {
      return (<div id="right-panel">
         <BookList books={this.props.bookInfo || []} isLoading={this.props.isLoading} />
         <PagingWrapper search={this.props.search} />
      </div>)
   }
}

function mapStateToProps(state) {
   state = state.main;
   return {
      bookInfo: state.rightPanelData.bookInfo,
      currentPage: state.currentPage,
      currentCategory: state.currentCategory,
      isLoading: state.isLoading
   }
}

export default connect(mapStateToProps, null)(RightPanel);
