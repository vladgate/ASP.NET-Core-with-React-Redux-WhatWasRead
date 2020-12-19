import React from 'react';
import './Layout.css';
import { Link } from 'react-router-dom';

const Layout = (props) => {
   return (
      <div>
         <div id="header">
            <h1>Что было прочитано</h1>
         </div>
         {props.children}
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

export default Layout;