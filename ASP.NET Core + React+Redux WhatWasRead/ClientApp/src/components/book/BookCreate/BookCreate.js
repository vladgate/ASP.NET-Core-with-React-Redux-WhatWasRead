import React from 'react';

class BookCreate extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         name: "",
         pages: 0,
         description: "",
         year: 0,
         base64ImageSrc: "",
         selectedLanguageId: 0,
         selectedCategoryId: 0,
         selectedAuthorsId: [],
         selectedTagsId: [],
         authors: [],
         tags: [],
         categories: [],
         languages: [],
         errors: ""
      };
   }

   componentDidMount() {
      this.fetchData();
   }
   async fetchData() {
      const url = `/api/books/create`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({
         authors: data.authors || [],
         tags: data.tags || [],
         categories: data.categories || [],
         languages: data.languages || []
      });
   }

   onSaveClick(event) {
      const body = {
         name: this.state.name,
         pages: this.state.pages,
         description: this.state.description,
         year: this.state.year,
         selectedLanguageId: this.state.selectedLanguageId || this.state.languages[0].languageId,
         selectedCategoryId: this.state.selectedCategoryId || this.state.categories[0].categoryId,
         selectedAuthorsId: this.state.selectedAuthorsId,
         selectedTagsId: this.state.selectedTagsId,
         base64ImageSrc: this.state.base64ImageSrc
      };
      try {
         const url = `/api/books`;
         fetch(url, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
         })
            .then(async (data) => {
               const response = await data.json();
               if (response.success) {
                  this.props.history.push(`/books/details/${response.bookId}`);
               }
               else if (response.errors) {
                  this.setState({ errors: response.errors });
               }
            });
      }
      catch (e) {
         console.log(e);
      }
   }

   readURL(event) {
      if (event.target.files && event.target.files[0]) {
         let reader = new FileReader();
         reader.readAsDataURL(event.target.files[0]);
         reader.onload = () => {
            this.setState({ base64ImageSrc: reader.result });
         };
      }
   }

   onBookNameChange(event) {
      this.setState({ name: event.target.value });
   }

   onPagesChanged(event) {
      this.setState({ pages: parseInt(event.target.value) || 0 });
   }

   onYearChanged(event) {
      this.setState({ year: parseInt(event.target.value) || 0 });
   }

   onDescriptionChanged(event) {
      this.setState({ description: event.target.value });
   }

   onAuthorsChanged(event) {
      const selectedAuthorsId = Array.prototype.map.call(event.target.selectedOptions, (option) => parseInt(option.value));
      this.setState({ selectedAuthorsId });
   }

   onLanguageChanged(event) {
      this.setState({ selectedLanguageId: parseInt(event.target.value) || 0 });
   }

   onCategoryChanged(event) {
      this.setState({ selectedCategoryId: parseInt(event.target.value) || 0 });
   }

   onTagsChanged(event) {
      const selectedTagsId = Array.prototype.map.call(event.target.selectedOptions, (option) => parseInt(option.value));
      this.setState({ selectedTagsId });
   }

   render() {
      const book = this.state;
      return (
         <div className="BookEdit">
            <h2 style={{ marginLeft: "10px" }}>Добавление новой книги</h2>
            <hr />
            <div className="container-panel">
               <div className="left-side-panel">
                  <div style={{ position: "relative" }}>
                     <label>
                        <input type="file" accept=".jpg, .jpeg, .png" onChange={(event) => this.readURL(event)} />
                        <a>Выбрать изображение</a>
                     </label>
                  </div>
                  <img className="img-thumbnail" src={book.base64ImageSrc} alt="Нет изображения" />
               </div>
               <div className="right-side-panel">
                  <div className="container-horizontal">
                     <p>
                        <label className="book-edit-label">Название:</label>
                        <input type="text" value={book.name} onChange={(event) => this.onBookNameChange(event)} /></p>

                     <p>
                        <label className="book-edit-label">Авторы:</label>
                        <select multiple="multiple" size="10" onChange={(event) => this.onAuthorsChanged(event)}>
                           {book.authors ? book.authors.map((item) => <option key={item.authorId} value={item.authorId} selected={book.selectedAuthorsId.includes(item.authorId)}>{item.displayText}</option>) : null}
                        </select>
                     </p>

                     <p>
                        <label className="book-edit-label">Количество страниц:</label>
                        <input type="number" value={book.pages} onChange={(event) => this.onPagesChanged(event)} /></p>

                     <p>
                        <label className="book-edit-label">Год издания:</label>
                        <input type="number" value={book.year} onChange={(event) => this.onYearChanged(event)} /></p>

                     <p>
                        <label className="book-edit-label">Описание:</label>
                        <textarea value={book.description} onChange={(event) => this.onDescriptionChanged(event)}></textarea></p>

                     <p>
                        <label className="book-edit-label">Язык:</label>
                        <select onChange={(event) => this.onLanguageChanged(event)}>{book.languages ? book.languages.map((item) => <option key={item.languageId} value={item.languageId} selected={book.selectedLanguageId === item.languageId}>{item.nameForLabels}</option>) : null}</select></p>

                     <p>
                        <label className="book-edit-label">Категория:</label>
                        <select onChange={(event) => this.onCategoryChanged(event)}>{book.categories ? book.categories.map((item) => <option key={item.categoryId} value={item.categoryId} selected={book.selectedCategoryId === item.categoryId}>{item.nameForLabels}</option>) : null}</select></p>

                     <p>
                        <label className="book-edit-label">Теги:</label>
                        <select multiple="multiple" size="10" onChange={(event) => this.onTagsChanged(event)}>
                           {book.tags ? book.tags.map((item) =>
                              <option
                                 key={item.tagId}
                                 selected={book.selectedTagsId.includes(item.tagId)}
                                 value={item.tagId}>
                                 {item.nameForLabels}
                              </option>) : null}
                        </select>
                     </p>
                     <div className="errors">{book.errors}</div>
                  </div>
               </div>
               <div className="details-p">
                  <button className="btn btn-primary" onClick={(event) => (this.onSaveClick(event))}>Сохранить</button>
               </div>
            </div>
         </div>);
   }
}

export default BookCreate;