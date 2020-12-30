import React from 'react';
import './MainPage.css';
import LeftPanel from '../../main/LeftPanel/LeftPanel';
import RightPanel from '../../main/RightPanel/RightPanel';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getData } from '../../../store/actions/main';
import Loader from '../../common/Loader/Loader';

class MainPage extends React.Component {
   componentDidMount() {
      this.ensureGetData();
   }
   componentDidUpdate(prevProps, prevState) {
      if (this.props.location.pathname !== prevProps.location.pathname || this.props.location.search !== prevProps.location.search) {
         this.ensureGetData();
      }
   }

   ensureGetData() {
      this.props.getData(this.props.match.params.category, parseInt(this.props.match.params.page), this.props.location.search, () => this.props.history.push('/'));
   }

   render() {
      return (
         <div id="main-page">
            <LeftPanel />
            <RightPanel search={this.props.location.search} />
            {this.props.isLoading ? <Loader /> : null}
         </div>
      );
   }
}
function mapStateToProps(state) {
   return {
      isLoading: state.main.isLoading
   }
}
function mapDispatchToProps(dispatch) {
   return {
      getData: (category, page, search, onNotFound) => dispatch(getData(category, page, search, onNotFound))
   };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage));
