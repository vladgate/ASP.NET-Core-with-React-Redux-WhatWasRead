using System;
using System.Linq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Collections.Specialized;
using NSubstitute;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ASP.NET_Core_React_Redux_WhatWasRead.App_Data.DBModels;
using ASP.NET_Core_React_Redux_WhatWasRead.App_Data;
using ASP.NET_Core_React_Redux_WhatWasRead.Controllers;
using WhatWasRead_Core_React_Redux.NUnitTest.Helpers;
using ASP.NET_Core_React_Redux_WhatWasRead.Models;

namespace My_Progress_UnitTests
{
   [TestFixture]
   public class BooksControllerTest
   {

      #region InitVariables
      private Language[] _languages = new Language[3]
      {
         new Language {LanguageId = 3, NameForLabels="Ukrainian", NameForLinks = "ua"},
         new Language {LanguageId = 1, NameForLabels="English", NameForLinks = "en"},
         new Language {LanguageId = 2, NameForLabels="Russian", NameForLinks = "ru"},
      };

      private Author[] _authors = new Author[5]
{
         new Author {AuthorId = 3, FirstName = "F3", LastName="L3"},
         new Author {AuthorId = 1, FirstName = "F1", LastName="L1"},
         new Author {AuthorId = 5, FirstName = "F5", LastName="L5"},
         new Author {AuthorId = 2, FirstName = "F2", LastName="L2"},
         new Author {AuthorId = 4, FirstName = "F4", LastName="L4"},
};

      private Tag[] _tags = new Tag[3]
      {
         new Tag {TagId = 3, NameForLabels="Tag3", NameForLinks = "tag3"},
         new Tag {TagId = 1, NameForLabels="Tag1", NameForLinks = "tag1"},
         new Tag {TagId = 2, NameForLabels="Tag2", NameForLinks = "tag2"},
      };

      private Category[] _categories = new Category[3]
      {
        new Category() { CategoryId = 3, NameForLinks = "cat3", NameForLabels = "Category 3" },
        new Category() { CategoryId = 1, NameForLinks = "cat1", NameForLabels = "Category 1" },
        new Category() { CategoryId = 2, NameForLinks = "cat2", NameForLabels = "Category 2" },
      };

      private string _imageMimeType = "image/jpeg";

      private Book[] CreateBooks()
      {
         Book book1 = new Book
         {
            BookId = 1,
            Category = _categories[0],
            CategoryId = _categories[0].CategoryId,
            Pages = 10,
            Description = "Desc1",
            Name = "Book1",
            Year = 2001,
            Language = _languages[0],
            LanguageId = _languages[0].LanguageId,
            ImageMimeType = _imageMimeType,
            ImageData = new byte[] { 1 },
         };
         book1.AuthorsOfBooks = new List<AuthorsOfBooks>() { new AuthorsOfBooks { AuthorId = _authors[0].AuthorId, Author = _authors[0], BookId = book1.BookId, Book = book1 } };
         book1.BookTags = new List<BookTags>() { new BookTags { TagId = _tags[0].TagId, Tag = _tags[0], BookId = book1.BookId, Book = book1 } };

         Book book2 = new Book
         {
            BookId = 2,
            Category = _categories[0],
            CategoryId = _categories[0].CategoryId,
            Pages = 20,
            Description = "Desc2",
            Name = "Book2",
            Year = 2002,
            Language = _languages[0],
            LanguageId = _languages[0].LanguageId,
            ImageMimeType = _imageMimeType,
            ImageData = new byte[] { 2 },
         };
         book2.AuthorsOfBooks = new List<AuthorsOfBooks>() { new AuthorsOfBooks { AuthorId = _authors[0].AuthorId, Author = _authors[0], Book = book2, BookId = book2.BookId }, new AuthorsOfBooks { AuthorId = _authors[1].AuthorId, Author = _authors[1], Book = book2, BookId = book2.BookId } };
         book2.BookTags = new List<BookTags>() { new BookTags { TagId = _tags[0].TagId, Tag = _tags[0], BookId = book2.BookId, Book = book2 }, new BookTags { TagId = _tags[1].TagId, Tag = _tags[1], BookId = book2.BookId, Book = book2 } };


         Book book3 = new Book
         {
            BookId = 3,
            Category = _categories[0],
            CategoryId = _categories[0].CategoryId,
            Pages = 30,
            Description = "Desc3",
            Name = "Book3",
            Year = 2003,
            Language = _languages[1],
            LanguageId = _languages[1].LanguageId,
            ImageMimeType = _imageMimeType,
            ImageData = new byte[] { 3 },
         };
         book3.AuthorsOfBooks = new List<AuthorsOfBooks>() { new AuthorsOfBooks { AuthorId = _authors[1].AuthorId, Author = _authors[1], BookId = book3.BookId, Book = book3 }, new AuthorsOfBooks { AuthorId = _authors[2].AuthorId, Author = _authors[2], Book = book3, BookId = book3.BookId }, new AuthorsOfBooks { AuthorId = _authors[3].AuthorId, Author = _authors[3], Book = book3, BookId = book3.BookId } };
         book3.BookTags = new List<BookTags>() { new BookTags { TagId = _tags[1].TagId, Tag = _tags[1], BookId = book3.BookId, Book = book3 }, new BookTags { TagId = _tags[2].TagId, Tag = _tags[2], Book = book3, BookId = book3.BookId, } };

         Book book4 = new Book
         {
            BookId = 4,
            Category = _categories[0],
            CategoryId = _categories[0].CategoryId,
            Pages = 40,
            Description = "Desc4",
            Name = "Book4",
            Year = 2004,
            Language = _languages[1],
            LanguageId = _languages[1].LanguageId,
            ImageMimeType = _imageMimeType,
            ImageData = new byte[] { 4 }
         };
         book4.AuthorsOfBooks = new List<AuthorsOfBooks>() { new AuthorsOfBooks { AuthorId = _authors[3].AuthorId, Author = _authors[3], BookId = book3.BookId, Book = book3 } };
         book4.BookTags = new List<BookTags>() { new BookTags { TagId = _tags[0].TagId, Tag = _tags[0], BookId = book3.BookId, Book = book3 }, new BookTags { TagId = _tags[1].TagId, Tag = _tags[1], Book = book3, BookId = book3.BookId } };

         Book book5 = new Book
         {
            BookId = 5,
            Category = _categories[1],
            CategoryId = _categories[1].CategoryId,
            Pages = 50,
            Description = "Desc5",
            Name = "Book5",
            Year = 2005,
            Language = _languages[2],
            LanguageId = _languages[2].LanguageId,
            ImageMimeType = _imageMimeType,
            ImageData = new byte[] { 5 },
         };
         book5.AuthorsOfBooks = new List<AuthorsOfBooks>() { new AuthorsOfBooks { AuthorId = _authors[3].AuthorId, Author = _authors[3], BookId = book3.BookId, Book = book3 }, new AuthorsOfBooks { AuthorId = _authors[4].AuthorId, Author = _authors[4], BookId = book3.BookId, Book = book3 } };
         book5.BookTags = new List<BookTags>() { new BookTags { TagId = _tags[2].TagId, Tag = _tags[2], BookId = book3.BookId, Book = book3 } };

         return new Book[] { book1, book2, book3, book4, book5 };
      }
      #endregion

      #region GetImage
      [Test]
      public void GetImage_ValidId_ReturnsCorrectByteArray()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);

         //Act
         BooksController controller = new BooksController(mockRepo);
         FileContentResult actualResult = controller.GetImage(5);
         byte[] actual = actualResult.FileContents;
         string mimeType = actualResult.ContentType;
         //Assert
         Assert.AreEqual(new byte[] { 5 }, actual);
         Assert.AreEqual(_imageMimeType, mimeType);
      }

      [Test]
      public void GetImage_InvalidId_ReturnsNull()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);

         //Act
         BooksController controller = new BooksController(mockRepo);
         int nonExistId = 10;
         FileResult actualResult = controller.GetImage(nonExistId);
         //Assert
         Assert.IsNull(actualResult);
      }

      #endregion
      #region Details
      [Test]
      public void Details_InvalidId_ReturnsHttpNotFoundView()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int invalidId = 999;
         mockRepo.FindBook(invalidId).Returns(null as Book);

         //Act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Details(invalidId);

         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void Details_ValidId_ReturnsCorrectJsonResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int validId = 1;
         Book expected = books.Where(b => b.BookId == validId).FirstOrDefault();
         mockRepo.FindBook(validId).Returns(expected);

         //Act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Details(validId);

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(validId, json.BookId);

      }
      #endregion
      #region Delete
      [Test]
      public void Delete_InvalidId_ReturnsNotFoundResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int invalidId = 999;

         //act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Delete(invalidId).Result;

         //assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void Delete_ValidId_ReturnsOkObjectResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int validId = 1;
         Book expectedBook = books.Where(b => b.BookId == validId).FirstOrDefault();
         mockRepo.FindBook(validId).Returns(expectedBook);
         mockRepo.RemoveBook(Arg.Any<Book>());

         //act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Delete(validId).Result;
         RedirectToActionResult result2 = result as RedirectToActionResult;

         //assert
         mockRepo.Received(1).RemoveBook(expectedBook);
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
      }

      #endregion
      #region Edit
      [Test]
      public void EditGET_InvalidId_ReturnsHttpNotFound()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int invalidId = 999;

         //act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Edit(invalidId);

         //assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void Edit_GET_ValidId_ReturnsCorrectModelInJsonResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int validId = 1;
         Book editedBook = books.Where(b => b.BookId == validId).FirstOrDefault();
         mockRepo.FindBook(validId).Returns(editedBook);
         mockRepo.Authors.Returns(_authors);
         mockRepo.Tags.Returns(_tags);
         mockRepo.Categories.Returns(_categories);
         mockRepo.Languages.Returns(_languages);

         //act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Edit(validId);
         dynamic model = new DynamicWrapper(result);

         //assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(editedBook.LanguageId, model.SelectedLanguageId);
         Assert.AreEqual(editedBook.CategoryId, model.SelectedCategoryId);
         Assert.AreEqual(editedBook.AuthorsOfBooks.Select(a => a.AuthorId).AsEnumerable(), model.SelectedAuthorsId);
         Assert.AreEqual(editedBook.BookTags.Select(a => a.TagId).AsEnumerable(), model.SelectedTagsId);
         Assert.AreEqual(_authors.Count(), model.Authors.Count());
         Assert.AreEqual(_tags.Count(), model.Tags.Count());
         Assert.AreEqual(_categories.Count(), model.Categories.Count());
         Assert.AreEqual(_languages.Count(), model.Languages.Count());
      }

      [Test]
      public void Edit_PUT_InvalidModel_ReturnsJsonResultWithErrors()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);

         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = new CreateEditBookViewModel();
         IActionResult result = controller.Edit(model).Result;

         //assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Неверный идентификатор"));
         Assert.IsTrue(errors.Contains("Не указано название книги"));
         Assert.IsTrue(errors.Contains("Количество страниц должно быть в диапазоне от 1 до 5000"));
         Assert.IsTrue(errors.Contains("Не указано описание книги"));
         Assert.IsTrue(errors.Contains("Год должен быть в диапазоне от 1980 до 2050"));
         Assert.IsTrue(errors.Contains("Не выбрана обложка книги"));
         Assert.IsTrue(errors.Contains("Не указан язык"));
         Assert.IsTrue(errors.Contains("Не указана категория"));
         Assert.IsTrue(errors.Contains("Не указано авторство книги"));
      }

      [Test]
      public void Edit_PUT_ValidModelInvalidBookId_ReturnsHttpBadRequest()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int invalidId = 999;
         Book editedBook = books.Where(b => b.BookId == invalidId).FirstOrDefault();

         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = new CreateEditBookViewModel { BookId = invalidId };
         IActionResult result = controller.Edit(model).Result;

         //assert
         Assert.IsInstanceOf<BadRequestResult>(result);
      }

      [Test]
      public void Edit_PUT_ValidModelValidId_ReturnsOkObjectResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         int validId = 1;
         Book editedBook = books.Where(b => b.BookId == validId).FirstOrDefault();

         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = CreateCreateEditBookViewModel(editedBook, mockRepo);
         IActionResult result = controller.Edit(model).Result;

         //assert
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
         Assert.AreEqual(1, json.BookId);
      }

      private CreateEditBookViewModel CreateCreateEditBookViewModel(Book book, IRepository repository)
      {
         if (book == null)
         {
            throw new ArgumentNullException(nameof(book));
         }
         if (repository == null)
         {
            throw new ArgumentNullException(nameof(repository));
         }
         CreateEditBookViewModel model = new CreateEditBookViewModel();
         model.BookId = book.BookId;
         model.Name = book.Name;
         model.Pages = book.Pages;
         model.Description = book.Description;
         model.Year = book.Year;
         model.Base64ImageSrc = String.Format("data:{0};base64,{1}", book.ImageMimeType, Convert.ToBase64String(book.ImageData));
         model.SelectedLanguageId = book.LanguageId;
         model.SelectedCategoryId = book.CategoryId;
         model.SelectedAuthorsId = book.AuthorsOfBooks.Select(a => a.AuthorId).ToList();
         model.SelectedTagsId = book.BookTags.Select(a => a.TagId).ToList();
         return model;
      }

      #endregion
      #region Create
      [Test]
      public void Create_GET_ReturnsCorrectOrderInJsonResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         mockRepo.Tags.Returns(_tags);
         mockRepo.Categories.Returns(_categories);
         mockRepo.Languages.Returns(_languages);

         //act
         BooksController controller = new BooksController(mockRepo);
         IActionResult result = controller.Create();

         //assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(_authors.Count(), json.Authors.Count);
         Assert.AreEqual(_tags.Count(), json.Tags.Count);
         Assert.AreEqual(_categories.Count(), json.Categories.Count);
         Assert.AreEqual(_languages.Count(), json.Languages.Count);
         Assert.AreEqual(1, json.Languages[0].LanguageId);
         Assert.AreEqual(1, json.Tags[0].TagId);
         Assert.AreEqual(1, json.Categories[0].CategoryId);
         Assert.AreEqual(1, json.Authors[0].AuthorId);
      }

      [Test]
      public void Create_POST_ValidModel_ReturnsOkObjectResult()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         List<Book> books = CreateBooks().ToList();
         Book newBook = new Book { Name = "NewBook" };
         mockRepo.Books.Returns(books);
         int counter = 0;
         mockRepo.When(b => b.AddBook(Arg.Any<Book>())).Do(Callback.First(b => books.Add(newBook)).AndAlways(x => counter++));
         mockRepo.Authors.Returns(_authors);
         mockRepo.Tags.Returns(_tags);

         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = CreateCreateEditBookViewModel(newBook, mockRepo);
         IActionResult result = controller.Create(model).Result;

         //assert
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
         Assert.AreEqual(newBook.Name, books.Last().Name);
         Assert.IsTrue(counter == 1);
      }

      [Test]
      public void Create_POST_InvalidMimeType_ReturnJsonResultWithErrors()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book newBook = new Book { Name = "NewBook" };
         mockRepo.Authors.Returns(_authors);
         mockRepo.Tags.Returns(_tags);
         mockRepo.Categories.Returns(_categories);
         mockRepo.Languages.Returns(_languages);

         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = CreateCreateEditBookViewModel(newBook, mockRepo);
         model.Base64ImageSrc = null;
         IActionResult result = controller.Create(model).Result;

         //assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Изображение имеет неверный формат"));
      }

      [Test]
      public void Create_POST_InvalidModel_ReturnJsonResultWithErrors()
      {
         //arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book newBook = new Book();
         //act
         BooksController controller = new BooksController(mockRepo);
         CreateEditBookViewModel model = new CreateEditBookViewModel();
         IActionResult result = controller.Create(model).Result;

         //assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Неверный идентификатор"));
         Assert.IsTrue(errors.Contains("Не указано название книги"));
         Assert.IsTrue(errors.Contains("Количество страниц должно быть в диапазоне от 1 до 5000"));
         Assert.IsTrue(errors.Contains("Не указано описание книги"));
         Assert.IsTrue(errors.Contains("Год должен быть в диапазоне от 1980 до 2050"));
         Assert.IsTrue(errors.Contains("Не выбрана обложка книги"));
         Assert.IsTrue(errors.Contains("Не указан язык"));
         Assert.IsTrue(errors.Contains("Не указана категория"));
         Assert.IsTrue(errors.Contains("Не указано авторство книги"));
      }
      #endregion
      #region List

      [Test]
      public void List_DefaultParameters_ReturnsCorrectCountOfBooks()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;
         int booksPerPage = 4;

         //Act
         IActionResult result = target.List().Result;
         BookListViewModel model = (result as JsonResult).Value as BookListViewModel;

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(booksPerPage, model.RightPanelData.BookInfo.Count());
         Assert.AreEqual(5, model.RightPanelData.BookInfo.First().BookId); // correct order
         Assert.AreEqual(2, model.RightPanelData.TotalPages);

         Assert.AreEqual(_authors.Count(), model.LeftPanelData.Authors.Count());
         Assert.AreEqual(_tags.Count(), model.LeftPanelData.Tags.Count());
         Assert.AreEqual(_languages.Count(), model.LeftPanelData.Languages.Count());
         Assert.AreEqual(_categories.Count(), model.LeftPanelData.Categories.Count());
      }

      [Test]
      public void List_InvalidCategory_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Categories.Returns(_categories);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         string invalidCategory = "invalidCategory";
         int page = 1;

         //Act
         IActionResult result = target.List(page, invalidCategory).Result;

         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [TestCase("cat1", 1, 4)]
      [TestCase("cat1", 2, 0)]
      public void List_ValidCategoryNoFilter_ReturnsCorrectCountOfBooksOnParticularPage(string category, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.List(page, category).Result;

         BookListViewModel model = ((JsonResult)result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("cat1", "lang", "en", 1, 2)]
      [TestCase("cat1", "lang", "en", 2, 0)]
      public void List_ValidCategoryWithFilter_ReturnsCorrectCountOfBooksOnParticularPage(string category, string queryKey, string queryValue, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(queryCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.List(page, category).Result;
         BookListViewModel model = ((JsonResult)result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("cat1", 1, 4, 0)]
      [TestCase("cat1", 1, 3, 1)]
      public void List_ValidCategoryNoFilter_ReturnsCorrectOrderOfBooks(string category, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books);

         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         BookListViewModel model = ((JsonResult)target.List(page, category).Result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [TestCase("cat1", "lang", "en", 1, 1, 1)]
      [TestCase("cat1", "lang", "en", 1, 2, 0)]
      public void List_ValidCategoryWithFilter_ReturnsCorrectOrderOfBooks(string category, string queryKey, string queryValue, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         BookListViewModel model = ((JsonResult)target.List(page, category).Result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [Test]
      public void List_InvalidTag_ReturnsNotFoundView()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Categories.Returns(_categories);
         BooksController target = new BooksController(mockRepo);

         //IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         string invalidTag = "invalidTag";
         int page = 1;

         //Act
         IActionResult result = target.List(page, invalidTag).Result;

         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [TestCase("tag1", 1, 3)]
      [TestCase("tag1", 2, 0)]
      public void List_ValidTagNoFilter_ReturnsCorrectCountOfBooksOnParticularPage(string tag, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.List(page, null, tag).Result;
         BookListViewModel model = ((JsonResult)result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();
         
         //Assert
         Assert.IsInstanceOf<ViewResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("tag1", "lang", "en", 1, 2)]
      [TestCase("tag1", "lang", "en", 2, 0)]
      public void List_ValidTagWithFilter_ReturnsCorrectCountOfBooksOnParticularPage(string tag, string queryKey, string queryValue, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(queryCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.List(page, null, tag).Result;
         BookListViewModel model = ((JsonResult)result).Value as BookListViewModel;
         BookShortInfo[] booksResult = model.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.IsInstanceOf<ViewResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("tag1", 1, 4, 0)]
      [TestCase("tag1", 1, 2, 1)]
      public void List_ValidTagNoFilter_ReturnsCorrectOrderOfBooks(string tag, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books);

         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         BookListViewModel result = ((JsonResult)target.List(page, null, tag).Result).Value as BookListViewModel;
         BookShortInfo[] booksResult = result.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [TestCase("tag1", "lang", "en", 1, 1, 1)]
      [TestCase("tag1", "lang", "en", 1, 2, 0)]
      public void List_ValidTagWithFilter_ReturnsCorrectOrderOfBooks(string tag, string queryKey, string queryValue, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         BookListViewModel result = ((JsonResult)target.List(page, null, tag).Result).Value as BookListViewModel;
         BookShortInfo[] booksResult = result.RightPanelData.BookInfo.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }


      #endregion
      #region ListToAppend

      [Test]
      public void ListAppend_DefaultParameters_ReturnsCorrectCountOfBooks()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;
         int page = 2;
         //Act
         IActionResult result = target.ListAppend(page).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(1, model.Count());
      }

      [Test]
      public void ListAppend_DefaultParameters_ReturnsCorrectOrderOfBooks()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;
         int page = 1;
         //Act
         IActionResult result = target.ListAppend(page).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();
         //Assert
         Assert.IsInstanceOf<ViewComponentResult>(result);
         Assert.AreSame(books[4], booksResult[0]);
         Assert.AreSame(books[3], booksResult[1]);
         Assert.AreSame(books[2], booksResult[2]);
         Assert.AreSame(books[1], booksResult[3]);
      }

      [Test]
      public void ListAppend_InValidCategory_ReturnsEmptyResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Categories.Returns(_categories);
         BooksController target = new BooksController(mockRepo);
         string invalidCategory = "invalidCategory";
         int page = 1;

         //Act
         IActionResult result = target.ListAppend(page, invalidCategory).Result;

         //Assert
         Assert.IsInstanceOf<EmptyResult>(result);
      }

      [Test]
      public void ListAppend_WhenNoBooksInResult_ReturnsEmptyResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;
         int page = 3;
         //Act
         IActionResult result = target.ListAppend(page).Result;

         //Assert
         Assert.IsInstanceOf<EmptyResult>(result);
      }

      [TestCase("cat1", 1, 4)]
      public void ListAppend_ValidCategoryNoFilter_ReturnsCorrectCountOfBooksOnParticularPage(string category, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, category).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("cat1", "lang", "en", 1, 2)]
      public void ListAppend_ValidCategoryWithFilter_ReturnsCorrectCountOfBooksOnParticularPage(string category, string queryKey, string queryValue, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(queryCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, category).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.IsInstanceOf<ViewComponentResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("cat1", 1, 4, 0)]
      [TestCase("cat1", 1, 3, 1)]
      public void ListAppend_ValidCategoryNoFilter_ReturnsCorrectOrderOfBooks(string category, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books);

         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, category).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [TestCase("cat1", "lang", "en", 1, 1, 1)]
      [TestCase("cat1", "lang", "en", 1, 2, 0)]
      public void ListAppend_ValidCategoryWithFilter_ReturnsCorrectOrderOfBooks(string category, string queryKey, string queryValue, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Categories.Returns(_categories);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, category).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [Test]
      public void ListAppend_InValidTag_ReturnsEmptyResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Categories.Returns(_categories);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         string invalidTag = "invalidTag";
         int page = 1;

         //Act
         IActionResult result = target.ListAppend(page, invalidTag).Result;

         //Assert
         Assert.IsInstanceOf<EmptyResult>(result);
      }

      [TestCase("tag1", 1, 3)]
      public void ListToAppend_ValidTagNoFilter_ReturnsCorrectCountOfBooksOnParticularPage(string tag, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, null, tag).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("tag1", "lang", "en", 1, 2)]
      public void ListAppend_ValidTagWithFilter_ReturnsCorrectCountOfBooksOnParticularPage(string tag, string queryKey, string queryValue, int page, int expectedCount)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(queryCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, null, tag).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.IsInstanceOf<ViewComponentResult>(result);
         Assert.AreEqual(expectedCount, booksResult.Count());
      }

      [TestCase("tag1", 1, 4, 0)]
      [TestCase("tag1", 1, 2, 1)]
      public void ListToAppend_ValidTagNoFilter_ReturnsCorrectOrderOfBooks(string tag, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books);

         BooksController target = new BooksController(mockRepo);
         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, null, tag).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }

      [TestCase("tag1", "lang", "en", 1, 1, 1)]
      [TestCase("tag1", "lang", "en", 1, 2, 0)]
      public void ListToAppend_ValidTagWithFilter_ReturnsCorrectOrderOfBooks(string tag, string queryKey, string queryValue, int page, int bookId, int bookIndex)
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         Book[] books = CreateBooks();
         mockRepo.Tags.Returns(_tags);
         mockRepo.Books.Returns(books.Where(b => b.Language.NameForLinks == queryValue)); //apply filter
         NameValueCollection queryCollection = new System.Collections.Specialized.NameValueCollection();
         queryCollection.Add(queryKey, queryValue);
         mockRepo.UpdateBooksFromFilterUsingRawSql(queryCollection, Arg.Any<string>(), Arg.Any<string>()).Returns(mockRepo.Books);
         BooksController target = new BooksController(mockRepo);

         IBooksRequestManager mockRequestManager = Substitute.For<IBooksRequestManager>();
         NameValueCollection emptyCollection = new System.Collections.Specialized.NameValueCollection();
         mockRequestManager.GetQueryString(Arg.Any<BooksController>()).Returns(emptyCollection);
         target.BooksRequestManager = mockRequestManager;

         //Act
         IActionResult result = target.ListAppend(page, null, tag).Result;
         IEnumerable<BookShortInfo> model = ((JsonResult)result).Value as IEnumerable<BookShortInfo>;
         BookShortInfo[] booksResult = model.ToArray();

         //Assert
         Assert.AreEqual(bookId, booksResult[bookIndex].BookId);
      }


      #endregion
   }
}
