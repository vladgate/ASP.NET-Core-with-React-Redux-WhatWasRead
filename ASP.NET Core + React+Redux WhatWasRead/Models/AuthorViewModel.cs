using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASP.NET_Core_React_Redux_WhatWasRead.Models
{
   public class AuthorViewModel
   {
      public int AuthorId { get; set; }
      public string DisplayText { get; set; }
      public string Link { get; set; }
      public bool Checked { get; set; }
   }
}
