using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication7
{
    public class SectionController : Controller
    {               
        public IActionResult Filters()
        {
            var model = GenFu.A.ListOf<FilterSection>(3);    
            foreach (var s in model)
            {
                s.Options = GenFu.A.ListOf<FilterOption>(5);
            }
            return PartialView("Sections/FiltersSection", model);
        }
    }
}
