import React from 'react';
import './BookInfo.css';
import { Link } from 'react-router-dom';

const BookInfo = (props) => {
   return (<div className="book-info">
      <div className="book-img">
         <img src={`/api/books/getImage/${props.id}`} alt={props.name} />
      </div>
      <div className="book-name">
         <p>{props.name}</p>
      </div>
      <div className="book-authors">
         <p></p>{props.authors.includes(',') ? "Авторы: " : "Автор: "}{props.authors}
      </div>
      <div className="book-details">
         <Link to={`/books/details/${props.id}`}>Подробнее</Link>
      </div>
   </div>);
}
export default BookInfo;
