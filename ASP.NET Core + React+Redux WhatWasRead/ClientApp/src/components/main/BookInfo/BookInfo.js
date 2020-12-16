import React from 'react';
import './BookInfo.css';
import { Link } from 'react-router-dom';

class BookInfo extends React.Component {

   render() {
      return (<div className="book-info">
         <div className="book-img">
            <img src={`/api/books/getImage/${this.props.id}`} alt={this.props.name} />
         </div>
         <div className="book-name">
            <p>{this.props.name}</p>
         </div>
         <div className="book-authors">
            <p></p>{this.props.authors.includes(',') ? "Авторы: " : "Автор: "}{this.props.authors}
         </div>
         <div className="book-details">
            <Link to={`/books/details/${this.props.id}`}>Подробнее</Link>
         </div>
      </div>);
   }
}

export default BookInfo;
