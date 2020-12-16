using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASP.NET_Core_React_Redux_WhatWasRead.Models
{
   public class RightPanelViewModel
   {
      public IEnumerable<BookShortInfo> BookInfo { get; set; }
      public int TotalPages { get; set; }
   }
}
