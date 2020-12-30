using ASP.NET_Core_React_Redux_WhatWasRead.App_Data;
using ASP.NET_Core_React_Redux_WhatWasRead.App_Data.DBModels;
using ASP.NET_Core_React_Redux_WhatWasRead.Controllers;
using ASP.NET_Core_React_Redux_WhatWasRead.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
   public class TagControllerTest
   {
      private Tag[] _tags = new Tag[3]
      {
         new Tag {TagId = 3, NameForLabels="Tag3", NameForLinks = "tag3"},
         new Tag {TagId = 1, NameForLabels="Tag1", NameForLinks = "tag1"},
         new Tag {TagId = 2, NameForLabels="A_Tag2", NameForLinks = "a_tag2"},
      };

      [Test]
      public void GetTags_ReturnsCorrectJsonResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);

         //Act
         TagsController target = new TagsController(mockRepo);
         IActionResult result = target.GetTags();
         int expectedCount = _tags.Count();

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(expectedCount, json.Count);
         Assert.AreEqual(2, json[0].TagId);
         Assert.AreEqual(1, json[1].TagId);
         Assert.AreEqual(3, json[2].TagId);
      }

      [Test]
      public void GetTag_IncorrectId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         int incorrectId = -1;
         //Act
         TagsController target = new TagsController(mockRepo);
         IActionResult result = target.GetTag(incorrectId);

         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void GetTag_CorrectId_ReturnsCorrectJsonResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         int incorrectId = 1;
         //Act
         TagsController target = new TagsController(mockRepo);
         IActionResult result = target.GetTag(incorrectId);

         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(1, json.TagId);
      }

      [Test]
      public void PutTag_InvalidModel_ReturnsJsonResultWithErrors()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         CreateEditTagViewModel invalidModel = new CreateEditTagViewModel();
         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PutTag(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Неверный идентификатор"));
         Assert.IsTrue(errors.Contains("Не указан текст представления тега"));
         Assert.IsTrue(errors.Contains("Не указан текст ссылки тега"));
      }

      [Test]
      public void PutTag_ValidModel_InvalidId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         CreateEditTagViewModel invalidModel = new CreateEditTagViewModel { TagId = 999, NameForLabels = "SomeNewNameForLabels", NameForLinks = "SomeNameForLinks" };
         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PutTag(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<BadRequestResult>(result);
      }

      [Test]
      public void PutTag_ValidModel_ValidId_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);

         CreateEditTagViewModel validModel = new CreateEditTagViewModel { TagId = 1, NameForLabels = "SomeNewNameForLabels", NameForLinks = "SomeNameForLinks" };
         Tag repoModel = _tags.Where(a => a.TagId == validModel.TagId).First();

         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PutTag(validModel);
         IActionResult result = task.Result;

         //Assert
         mockRepo.Received(1).SaveChangesAsync();
         Assert.AreEqual(validModel.NameForLabels, repoModel.NameForLabels);
         Assert.AreEqual(validModel.NameForLinks, repoModel.NameForLinks);
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
      }

      [Test]
      public void PutTag_ValidModel_ValidId_OnDbUpdateConcurrencyException_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         mockRepo.When((mock) => mock.SaveChangesAsync()).Do((mock) => throw new DbUpdateConcurrencyException());

         CreateEditTagViewModel validModel = new CreateEditTagViewModel { TagId = 1, NameForLabels = "SomeNewNameForLabels", NameForLinks = "SomeNameForLinks" };
         Tag repoModel = _tags.Where(a => a.TagId == validModel.TagId).First();

         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PutTag(validModel);
         IActionResult result = task.Result;

         //Assert
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Данные были оновлены"));
      }

      [Test]
      public void PostTag_InvalidModel_ReturnsJsonResultWithErrors()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         CreateEditTagViewModel invalidModel = new CreateEditTagViewModel();
         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PostTag(invalidModel);
         IActionResult result = task.Result;
         //Assert
         Assert.IsInstanceOf<JsonResult>(result);
         dynamic json = new DynamicWrapper(result);
         string errors = json.errors;
         Assert.IsTrue(errors.Contains("Не указан текст представления тега"));
         Assert.IsTrue(errors.Contains("Не указан текст ссылки тега"));
      }

      [Test]
      public void PostTag_ValidModel_ValidId_ReturnsOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);

         CreateEditTagViewModel validModel = new CreateEditTagViewModel { NameForLabels = "SomeNewNameForLabels", NameForLinks = "SomeNameForLinks" };

         //Act
         TagsController target = new TagsController(mockRepo);
         Task<IActionResult> task = target.PostTag(validModel);
         IActionResult result = task.Result;

         //Assert
         mockRepo.Received(1).AddTag(Arg.Any<Tag>());
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
         dynamic json = new DynamicWrapper(result);
         Assert.AreEqual(true, json.success);
      }

      [Test]
      public void DeleteTag_IncorrectId_ReturnsNotFound()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         int incorrectId = -1;
         //Act
         TagsController target = new TagsController(mockRepo);
         IActionResult result = target.DeleteTag(incorrectId).Result;
         //Assert
         Assert.IsInstanceOf<NotFoundResult>(result);
      }

      [Test]
      public void DeleteTag_CorrectId_ReturnsCorrectOkObjectResult()
      {
         //Arrange
         IRepository mockRepo = Substitute.For<IRepository>();
         mockRepo.Tags.Returns(_tags);
         int correctId = 1;
         //Act
         TagsController target = new TagsController(mockRepo);
         IActionResult result = target.DeleteTag(correctId).Result;
         //Assert
         mockRepo.Received(1).RemoveTag(Arg.Any<Tag>());
         mockRepo.Received(1).SaveChangesAsync();
         Assert.IsInstanceOf<OkObjectResult>(result);
      }
   }
}
