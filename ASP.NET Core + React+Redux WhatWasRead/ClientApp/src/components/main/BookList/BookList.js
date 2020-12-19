import React from 'react';
import './BookList.css';
import BookRow from '../BookRow/BookRow';

const BookList = (props) => {
   if (!props.isLoading && props.books.length === 0) {
      return (<div style={{
         display: "flex",
         minHeight: "350px",
         width: "960px",
         alignItems: "center",
         justifyContent: "center"
      }}>
         <h2>По Вашему запросу ничего не найдено!</h2></div>);
   };
   const items = [];
   for (let i = 0; i < props.books.length; i += 2) {
      items.push(<BookRow key={i} book1={props.books[i]} book2={props.books[i + 1]} />);
   }
   return (<div id="books-list">{items}</div>);
}

export default BookList;
