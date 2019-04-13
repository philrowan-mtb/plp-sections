using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication7.Pages
{
    public class ListingPageModel : PageModel
    {
        public CategorySection Categories { get; set; }
        public IList<FilterSection> Filters { get; set; }

        public IList<ProductCard> Products { get; set; }

        public void OnGet()
        {
            Products = GenCon.CreateProducts(10).ToList();

            Categories = new CategorySection();
            Categories.Add(new CategoryNode("Hardbaits", "Crankbaits", "Rip Baits"));
            Categories.Add(new CategoryNode("Softbaits", "Worms", "Creatures", "Fish-like things"));
            Categories.Add(new CategoryNode("Jigs", "Heads", "Skirts"));

            Filters = new List<FilterSection>();

            var facetGroups = Products.SelectMany(x => x.Facets)
                .GroupBy(x => x.Name);

            foreach (var facetName in facetGroups)
            {
                var uniqueValues = facetName.Select(x => x.Value).Distinct().ToArray();
                Filters.Add(new FilterSection(facetName.Key, uniqueValues));
            }                       
        }
    }
}