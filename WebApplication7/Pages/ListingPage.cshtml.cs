using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;

namespace WebApplication7.Pages
{
    public class ListingPageModel : PageModel
    {
        public CategorySection Categories { get; set; }
        public IList<FilterSection> Filters { get; set; }

        public IList<ProductCard> Products { get; set; }

        public void OnGet()
        {
            Categories = new CategorySection();
            Categories.Add(new CategoryNode("Hardbaits", "Crankbaits", "Rip Baits"));
            Categories.Add(new CategoryNode("Softbaits", "Worms", "Creatures", "Fish-like things"));
            Categories.Add(new CategoryNode("Jigs", "Heads", "Skirts"));

            Filters = new List<FilterSection>();
            Filters.Add(new FilterSection("Brand", "Rapala", "Karl's Amazing Baits", "Yo-Zuri"));
            Filters.Add(new FilterSection("Size", "2\"", "2.5\"", "3\""));
            Filters.Add(new FilterSection("Color", "Red", "Green", "Yellow"));

            Products = GenFu.A.ListOf<ProductCard>(6);
        }
    }
}