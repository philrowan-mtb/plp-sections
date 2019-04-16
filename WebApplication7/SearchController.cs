using Microsoft.AspNetCore.Cors;
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
using WebApplication7.Search;
using WebApplication7.Views.Shared.Sections;

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
            var results = s.Search();
            var products = results.Products.ToList();

            // this has to be called because IHtmlHelper is meant to work inside a view but not really meant to work inside a controller
            Contextualize();

            // TODO: render additional sections that need to change and send back the             
            return base.Ok(new
            {
                sections = new
                {
                    products = Render("Sections/ProductsSection", products),
                    activeFilters = new
                    {
                        html = Render("Sections/ActiveFiltersSection", results.ParsedQueryModel.Facets),
                        bind = true
                    },
                    filters = new
                    {
                        html = Render("Sections/FiltersSection", BuildFilters(results)),
                        bind = true
                    }
                }
            });
        }

        private IEnumerable<FiltersViewModel> BuildFilters(SearchResults results)
        {
            var activeFilters = results.ParsedQueryModel.Facets.ToList();            
            return results.AvailableFilters.Select(x => new FiltersViewModel
            {
                ActiveFilters = activeFilters,
                Section = x
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
