using ASP.NET_Core_React_Redux_WhatWasRead.App_Data;
using ASP.NET_Core_React_Redux_WhatWasRead.App_Data.DBModels;
using ASP.NET_Core_React_Redux_WhatWasRead.Controllers;
using ASP.NET_Core_React_Redux_WhatWasRead.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WhatWasRead_Core_React_Redux.NUnitTest.Helpers;

namespace My_Progress_UnitTests
{
   [TestFixture]
   public class AuthorControllerTest
   {
      private Author[] _authors = new Author[5]
      {
            new Author {AuthorId = 1, FirstName = "F1", LastName="L1"},
            new Author {AuthorId = 2, FirstName = "F2", LastName="L2"},
            new Author {AuthorId = 3, FirstName = "B_F3", LastName="b_L3"},
            new Author {AuthorId = 4, FirstName = "F4", LastName="L4"},
            new Author {AuthorId = 5, FirstName = "A_F5", LastName="a_L5"},
      };

      [Test]
      public void GetAuthors_ReturnsCorrectJsonResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);

         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         IActionResult result = target.GetAuthors();
         int expectedCount = _authors.Count();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(expectedCount, json.Count);
         Assert.AreEqual(5, json[0].AuthorId);
         Assert.AreEqual(3, json[1].AuthorId);
         Assert.AreEqual(1, json[2].AuthorId);
         Assert.AreEqual(2, json[3].AuthorId);
         Assert.AreEqual(4, json[4].AuthorId);
      }

      [Test]
      public void GetAuthor_IncorrectId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         int incorrectId = -1;
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         IActionResult result = target.GetAuthor(incorrectId);

         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void GetAuthor_CorrectId_ReturnsCorrectJsonResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         int incorrectId = 1;
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         IActionResult result = target.GetAuthor(incorrectId);

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(1, json.AuthorId);
      }

      [Test]
      public void PutAuthor_InvalidModel_ReturnsJsonResultWithErrors()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         CreateEditAuthorViewModel invalidModel = new CreateEditAuthorViewModel();
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PutAuthor(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Неверный идентификатор"));
         Assert.IsTrue(errors.Contains("Не указано имя автора"));
         Assert.IsTrue(errors.Contains("Не указана фамилия автора"));
      }

      [Test]
      public void PutAuthor_ValidModel_InvalidId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         CreateEditAuthorViewModel invalidModel = new CreateEditAuthorViewModel { AuthorId = 999, FirstName = "SomeFirstName", LastName = "SomeLastName" };
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PutAuthor(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<BadRequestResult>(result);
      }

      [Test]
      public void PutAuthor_ValidModel_ValidId_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         CreateEditAuthorViewModel validModel = new CreateEditAuthorViewModel { AuthorId = 1, FirstName = "SomeFirstName", LastName = "SomeLastName" };
         Author repoModel = _authors.Where(a => a.AuthorId == validModel.AuthorId).First();

         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PutAuthor(validModel);
         IActionResult result = task.Result;

         //Assert
         mockRepo.Received(1).SaveChangesAsync();
         Assert.AreEqual(validModel.FirstName, repoModel.FirstName);
         Assert.AreEqual(validModel.LastName, repoModel.LastName);
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
      }

      [Test]
      public void PutAuthor_ValidModel_ValidId_OnDbUpdateConcurrencyException_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         mockRepo.When((mock) => mock.SaveChangesAsync()).Do((mock) => throw new DbUpdateConcurrencyException());
         CreateEditAuthorViewModel validModel = new CreateEditAuthorViewModel { AuthorId = 1, FirstName = "SomeFirstName", LastName = "SomeLastName" };
         Author repoModel = _authors.Where(a => a.AuthorId == validModel.AuthorId).First();

         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PutAuthor(validModel);
         IActionResult result = task.Result;

         //Assert
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Данные были оновлены"));
      }

      [Test]
      public void PostAuthor_InvalidModel_ReturnsJsonResultWithErrors()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         CreateEditAuthorViewModel invalidModel = new CreateEditAuthorViewModel();
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PostAuthor(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Не указано имя автора"));
         Assert.IsTrue(errors.Contains("Не указана фамилия автора"));
      }

      [Test]
      public void PostAuthor_ValidModel_ValidId_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         CreateEditAuthorViewModel validModel = new CreateEditAuthorViewModel { FirstName = "SomeFirstName", LastName = "SomeLastName" };
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         Task<IActionResult> task = target.PostAuthor(validModel);
         IActionResult result = task.Result;
         //Assert
         mockRepo.Received(1).AddAuthor(Arg.Any<Author>());
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
      }

      [Test]
      public void DeleteAuthor_IncorrectId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         int incorrectId = -1;
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         IActionResult result = target.DeleteAuthor(incorrectId).Result;
         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void DeleteAuthor_CorrectId_ReturnsCorrectOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Authors.Returns(_authors);
         int correctId = 1;
         //Act
         AuthorsController target = new AuthorsController(mockRepo);
         IActionResult result = target.DeleteAuthor(correctId).Result;
         //Assert
         mockRepo.Received(1).RemoveAuthor(Arg.Any<Author>());
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
      }
   }
}
