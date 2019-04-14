using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication7
{
    [Route("api/search")]
    public class SearchController : Controller
    {
        [HttpGet("")]
        public IActionResult Get()
        {
            var s = new Seeker(Request.Query);
            var products = s.Search().ToList();

            // TODO: generate individual sections



            return Ok("hi");
        }
    }
}
