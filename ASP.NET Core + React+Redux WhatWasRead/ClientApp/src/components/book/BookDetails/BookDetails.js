import React from 'react';
import './BookDetails.css';
import { Link } from 'react-router-dom';

class BookDetails extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         bookData: {
            bookId: 0,
            name: "",
            language: "",
            pages: 0,
            description: "",
            category: "",
            year: 0,
            authorsOfBooks: "",
            bookTags: []
         },
         isWantDelete: false
      };
   }
   async fetchData() {
      const id = parseInt(this.props.match.params.id);
      if (!id) {
         return;
      }
      const url = `api/books/details/${id}`;
      const response = await fetch(url);
      const newState = await response.json();
      this.setState({ bookData: newState });
   }

   componentDidMount() {
      this.fetchData();
   }

   async onDeleteConfirmed(event) {
      const response = await fetch(`/api/books/delete/${this.state.bookData.bookId}`, {
         method: "DELETE"
      })

      if (response.ok === true) {
         this.props.history.push('/');
      }
   }

   render() {
      const book = this.state.bookData;
      return (<div className="BookDetails">
         <h2 style={{ marginLeft: "10px" }}>Подробнее</h2>
         <hr />
         <div className="container-panel">
            <div className="left-side-panel">
               <img className="img-thumbnail" src={`/api/books/GetImage/${this.props.match.params.id}`} alt={book.name} />
            </div>
            <div className="right-side-panel">
               <dl className="dl-horizontal">
                  <p>
                     <dt className="dt-label">
                        <label>Название:</label>
                     </dt>
                     <dd>{book.name}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>{book.authorsOfBooks.includes(',') ? "Авторы:" : "Автор:"}</label>
                     </dt>
                     <dd>{book.authorsOfBooks}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>Количество страниц:</label>
                     </dt>
                     <dd>{book.pages}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>Описание:</label>
                     </dt>
                     <dd>{book.description}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>Год издания:</label>
                     </dt>
                     <dd>{book.year}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>Категория:</label>
                     </dt>
                     <dd>{book.category}</dd></p>

                  <p>
                     <dt className="dt-label">
                        <label>Язык:</label>
                     </dt>
                     <dd>{book.language}</dd>
                  </p>

                  <p>
                     <dt className="dt-label">
                        <label>Теги:</label>
                     </dt>

                     <dd>
                        {book.bookTags.map((item,index) => <Link
                           key={index}
                           className="tag-a"
                           to={`/books/list/all/page1?tag=${item.nameForLinks}`}>
                           {item.nameForLabels}
                        </Link>)}
                     </dd>
                  </p>
               </dl>
            </div>
         </div>
         <div className="details-p">
            <Link to={`/books/edit/${book.bookId}`}>Редактировать</Link> |
            <a href={'void(0)'}
               onClick={(event) => {
                  event.preventDefault();
                  this.setState({ isWantDelete: true })
               }}>Удалить</a>
            {this.state.isWantDelete ?
               <div>
                  <span>Вы действительно хотите удалить насовсем эту книгу?</span>
                  <button onClick={(event) => (this.onDeleteConfirmed(event))}>Да</button>
                  <button onClick={(event) => (this.setState({ isWantDelete: false }))}>Нет</button>
               </div> : null}
         </div>

      </div>);
   }
}

export default BookDetails;
