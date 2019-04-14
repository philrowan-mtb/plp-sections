using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Linq;
using WebApplication7.Views.Shared.Sections;
using static WebApplication7.Seeker;

namespace WebApplication7.Pages
{
    public class ListingPageModel : PageModel
    {
        public IList<ProductCard> Products { get; set; }
        public CategorySection Categories { get; set; }
        public IEnumerable<FiltersViewModel> Filters { get; set; }
        public IList<FilterOption> ActiveFilters { get; set; }
        public SortOption ActiveSort { get; set; }
        public IList<SortOption> AvailableSort { get; set; }
        public string ActiveCategory { get; set; }

        public object State { get; set; }

        public void OnGet()
        {
            var s = new Seeker(Request.Query);
            Products = s.Search().ToList();

            Categories = new CategorySection();
            Categories.Add(new CategoryNode("Hardbaits", "Crankbaits", "Rip Baits"));
            Categories.Add(new CategoryNode("Softbaits", "Worms", "Creatures", "Fish-like things"));
            Categories.Add(new CategoryNode("Jigs", "Heads", "Skirts"));

            BuildFilters();
            BuildSort();
            BuildState();
        }

        private void BuildFilters()
        {
            var availableFilters = new List<FilterSection>();

            var facetGroups = Products.SelectMany(x => x.Facets)
                .GroupBy(x => x.Name);

            foreach (var facetName in facetGroups)
            {
                var uniqueValues = facetName.Select(x => x.Value).Distinct().ToArray();
                availableFilters.Add(new FilterSection(facetName.Key, uniqueValues));
            }

            // TODO: build active filters from query string
            ActiveFilters = new List<FilterOption>();            

            Filters = availableFilters.Select(x => new FiltersViewModel
            {
                ActiveFilters = ActiveFilters,
                Section = x
            });
        }

        private void BuildSort()
        {
            AvailableSort = new List<SortOption>();
            AvailableSort.Add(new SortOption("Brand: A-Z", "Brand", "asc"));
            AvailableSort.Add(new SortOption("Brand: Z-A", "Brand", "desc"));
            AvailableSort.Add(new SortOption("Price: Low - High", "Price", "asc"));
            AvailableSort.Add(new SortOption("Price: High - Low", "Price", "desc"));
            AvailableSort.Add(new SortOption("Newest", "DateAddedToStore", "desc"));
        }

        private void BuildState()
        {
            var filters = ActiveFilters
                .GroupBy(x => x.Name)
                .ToDictionary(x => x.Key, x => x.Select(y => y.Value).ToArray());

            var state = new
            {
                filters = filters
            };

            State = state;
        }
    }
}