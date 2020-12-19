import React from 'react';
import './BookDetails.css';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getBookDetails, deleteBook } from '../../../store/actions/book';
import Loader from '../../common/Loader/Loader';

class BookDetails extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isWantDelete: false
      };
   }

   componentDidMount() {
      const id = parseInt(this.props.match.params.id);
      if (!id) {
         return;
      }
      this.props.fetchData(id);
   }

   async onDeleteConfirmed(event) {
      const onSuccess = () => {
         this.props.history.push('/');
      };
      this.props.deleteBook(this.props.common.bookId, onSuccess);
   }

   render() {
      return (
         <div className="BookDetails">
            {this.props.isLoading ? <Loader /> : null}
            <h2 style={{ marginLeft: "10px" }}>Подробнее</h2>
            <hr />
            <div className="container-panel">
               <div className="left-side-panel">
                  <img className="img-thumbnail" src={this.props.common.base64ImageSrc} alt={this.props.common.name} />
               </div>
               <div className="right-side-panel">
                  <dl className="dl-horizontal">
                     <p>
                        <dt className="dt-label">
                           <label>Название:</label>
                        </dt>
                        <dd>{this.props.common.name}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>{this.props.details.authorsOfBooks.includes(',') ? "Авторы:" : "Автор:"}</label>
                        </dt>
                        <dd>{this.props.details.authorsOfBooks}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Количество страниц:</label>
                        </dt>
                        <dd>{this.props.common.pages}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Описание:</label>
                        </dt>
                        <dd>{this.props.common.description}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Год издания:</label>
                        </dt>
                        <dd>{this.props.common.year}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Категория:</label>
                        </dt>
                        <dd>{this.props.details.category}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Язык:</label>
                        </dt>
                        <dd>{this.props.details.language}</dd></p>

                     <p>
                        <dt className="dt-label">
                           <label>Теги:</label>
                        </dt>

                        <dd>
                           {this.props.details.bookTags.map((item, index) => <Link
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
               <Link to={`/books/edit/${this.props.common.bookId}`}>Редактировать</Link> |
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

function mapStateToProps(state) {
   return {
      common: state.book.common,
      details: state.book.details,
      isLoading: state.book.isLoading
   };
}

function mapDispatchToProps(dispatch) {
   return {
      fetchData: (id) => dispatch(getBookDetails(id)),
      deleteBook: (id, onSuccess) => dispatch(deleteBook(id, onSuccess))
   };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookDetails));
