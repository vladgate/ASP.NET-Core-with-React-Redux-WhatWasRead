import React from 'react';
import './BookRow.css';
import BookInfo from '../BookInfo/BookInfo';

class BookRow extends React.Component {
   render() {
      const items = [];
      items.push(this.createBookInfo(this.props.book1));
      if (this.props.book2) {
         items.push(this.createBookInfo(this.props.book2));
      }
      return (<div className="book-row">
         {items} 
      </div>);
   }

   createBookInfo(book) {
      return (<BookInfo key={book.bookId} id={book.bookId} name={book.name} authors={book.authors} />);
   }
 }

export default BookRow;
