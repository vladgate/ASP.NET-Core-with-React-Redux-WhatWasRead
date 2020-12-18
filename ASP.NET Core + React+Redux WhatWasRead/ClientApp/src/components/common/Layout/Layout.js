import React from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Layout extends React.Component{

   render() {
      return (
         <div>
            <div id="header">
               <h1>Что было прочитано</h1>
            </div>
            {this.props.children }
            <hr />
            <div id="footer">
               <div id="footer-menu">
                  <Link to="/">На главную</Link><span> | </span>
                  <Link to="/books/create">Добавить прочтенную книгу</Link><span> | </span>
                  <Link to="/authors">Авторы</Link><span> | </span>
                  <Link to="/tags">Теги</Link>
               </div>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {
      totalPages: state.totalPages
   }
}

export default connect(mapStateToProps)(Layout);