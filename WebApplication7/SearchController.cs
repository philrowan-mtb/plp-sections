using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using WebApplication7.Pages;

namespace WebApplication7
{
    [Route("api/search")]
    public class SearchController : Controller
    {
        private readonly IHtmlHelper _htmlHelper;

        public SearchController(IHtmlHelper htmlHelper)
        {
            _htmlHelper = htmlHelper;            
        }

        [HttpGet("")]
        public IActionResult Get()
        {
            var s = new Seeker(Request.Query);
            var products = s.Search().ToList();

            Contextualize();
            var productsHtml = _htmlHelper.Partial("Sections/ProductsSection", products);
            var sb = new StringBuilder();
            using var writer = new StringWriter(sb);
            productsHtml.WriteTo(writer, HtmlEncoder.Default);

            return Ok(new
            {
                sections = new
                {
                    products = sb.ToString()
                }
            });
        }

        void Contextualize()
        {
            var viewContext = new ViewContext(ControllerContext, new FakeView(), this.ViewData, this.TempData, TextWriter.Null, new HtmlHelperOptions
            {
                ClientValidationEnabled = false,
            });            
            ((IViewContextAware)_htmlHelper).Contextualize(viewContext);
        }
    }


    // see https://stackoverflow.com/questions/2537741/how-to-render-partial-view-into-a-string
    // also https://stackoverflow.com/questions/621235/using-htmlhelper-in-a-controller
    public class FakeView : IView
    {
        public string Path { get; }

        public Task RenderAsync(ViewContext context) => throw new NotImplementedException();
    }
}
