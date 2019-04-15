using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using WebApplication7.Search;

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
        [EnableCors("allow-local")]
        public IActionResult Get()
        {
            var s = new Seeker(Request.Query);
            var products = s.Search().ToList();

            Contextualize();
            var productsHtml = Render("Sections/ProductsSection", products);            

            // TODO: render additional sections that need to change and send back the html

            return Ok(new
            {
                sections = new
                {
                    products = productsHtml
                }
            });
        }

        private string Render(string sectionName, object model)
        {
            var productsHtml = _htmlHelper.Partial(sectionName, model);
            var sb = new StringBuilder();
            using (var writer = new StringWriter(sb))
            {                
                productsHtml.WriteTo(writer, HtmlEncoder.Default);
            }

            return sb.ToString();
        }

        private void Contextualize()
        {
            var viewContext = new ViewContext(ControllerContext, new FakeView(), ViewData, TempData, TextWriter.Null, new HtmlHelperOptions
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
