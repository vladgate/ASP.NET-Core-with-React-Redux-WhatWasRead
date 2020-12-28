using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using System.Reflection;
using System.Text;

namespace WhatWasRead_Core_React_Redux.NUnitTest.Helpers
{
   internal sealed class DynamicWrapper : DynamicObject
   {
      private readonly object _wrappedObject;
      private readonly Type _type;
      public DynamicWrapper([NotNull] object value)
      {
         if (value == null)
         {
            throw new ArgumentNullException(nameof(value));
         }
         if (value is ObjectResult result)
         {
            _wrappedObject = result.Value;
         }
         else if (value is JsonResult json)
         {
            _wrappedObject = json.Value;
         }
         else
         {
            _wrappedObject = value;
         }
         _type = _wrappedObject.GetType();
      }
      public override bool TryGetMember(GetMemberBinder binder, out object result)
      {
         PropertyInfo propertyInfo = _type.GetProperty(binder.Name);
         if (propertyInfo == null)
         {
            result = null;
            return false;
         }
         result = propertyInfo.GetValue(_wrappedObject);
         return true;
      }
      public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
      {
         MethodInfo methodInfo = _type.GetMethod(binder.Name);
         if (methodInfo == null)
         {
            result = null;
            return false;
         }
         result = methodInfo.Invoke(_wrappedObject, args);
         return true;
      }
      public DynamicWrapper this[int index]
      {
         get
         {
            PropertyInfo indexer = _type.GetProperty("Item");
            return new DynamicWrapper(indexer.GetValue(_wrappedObject, new object[] { index }));
         }
      }
   }
}
