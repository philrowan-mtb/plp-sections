﻿using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication7.Search;
using WebApplication7.Views.Shared.Sections;
using static WebApplication7.Search.Seeker;

namespace WebApplication7.Pages
{
    public class ListingPageModel : PageModel
    {
        public IList<ProductCard> Products { get; set; }
        public CategorySection Categories { get; set; }
        public IEnumerable<FiltersViewModel> Filters { get; set; }
        public IList<Facet> ActiveFilters { get; set; }
        public SortOption ActiveSort { get; set; }
        public IList<SortOption> AvailableSort { get; set; }
        public string ActiveCategory { get; set; }
        public int TotalProductsCount { get; set; }

        public object State { get; set; }

        public void OnGet()
        {
            var s = new Seeker(Request.Query);
            var results = s.Search();
            Products = results.Products.ToList();
            TotalProductsCount = results.TotalProductsCount;
            // TODO: filters need to parse/compute before the list of products is actually filtered. 
            // we need to show all the filters in the category. with this approach I'm just showing the filters
            // available for the returned set of products. if those products are already filtered to e.g. Color=Red
            // then only the Red color filter will appear.

            BuildCategories(results.ParsedQueryModel.CategoryId);
            BuildFilters(results);
            BuildSort();
            BuildState(results.ParsedQueryModel);
        }

        private void BuildCategories(string categoryId)
        {
            Categories = new CategorySection();
            var pcs = Products.Select(x => x.Category).Select(x => x.Parent);
            foreach (var pc in pcs)
            {
                if (Categories.Categories.Contains(pc))
                {
                    continue;
                }
                if (pc.Id == categoryId)
                {
                    ActiveCategory = pc.Title;
                }
                Categories.Add(pc);
            }
        }

        private void BuildFilters(SearchResults results)
        {
            var activeFilters = results.ParsedQueryModel.Facets.ToList();        
            ActiveFilters = activeFilters;
            Filters = results.AvailableFilters.Select(x => new FiltersViewModel
            {
                ActiveFilters = activeFilters,
                Section = x
            });
        }

        private void BuildSort()
        {
            AvailableSort = new List<SortOption>
            {
                new SortOption("Brand: A-Z", "Brand", "asc"),
                new SortOption("Brand: Z-A", "Brand", "desc"),
                new SortOption("Price: Low - High", "Price", "asc"),
                new SortOption("Price: High - Low", "Price", "desc"),
                new SortOption("Newest", "DateAddedToStore", "desc")
            };
        }

        private void BuildState(SearchModel model)
        {
            var filters = model.Facets
                .GroupBy(x => x.Name)
                .ToDictionary(x => x.Key, x => x.Select(y => y.Value).ToArray());

            var sort = new
            {
                property = model.SortProperty,
                direction = model.SortDirection
            };

            var state = new
            {
                filters,
                model,
                category = model.CategoryId,
                productCount = model.ProductCount
            };

            State = state;
        }
    }
}