using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace WebApplication7.Search
{
    public class Seeker
    {
        private static readonly IEnumerable<ProductCard> _products = FakeDataGenerator.CreateProducts(1000).ToList();
        private readonly IQueryCollection _query;

        public Seeker(IQueryCollection query) => _query = query;

        public SearchResults Search()
        {
            var model = Parse();
            return Search(model);
        }

        private SearchModel Parse()
        {
            var model = new SearchModel();
            // facets
            foreach (var key in _query.Keys)
            {
                if (key.StartsWith("f_"))
                {
                    var v = _query[key];
                    var vv = _query[key].ToString().Split('|', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var vvv in vv)
                    {
                        model.Facets.Add(new Facet(key.Substring(2), vvv));
                    }
                }
            }
            // category
            if (_query.ContainsKey("c"))
            {
                model.CategoryId = _query["c"];
            }
            // sort
            if (_query.ContainsKey("s_p"))
            {
                model.SortProperty = _query["s_p"];
                if (_query.ContainsKey("s_d"))
                {
                    model.SortDirection = _query["s_d"];
                }
            }
            // product count
            if (_query.ContainsKey("pc"))
            {
                if (int.TryParse(_query["pc"], out var productCount))
                {
                    model.ProductCount = productCount;
                }
            }
            return model;
        }

        private SearchResults Search(SearchModel model)
        {
            var results = new SearchResults
            {
                ParsedQueryModel = model
            };
            var qqq = _products;

            // category
            if (!string.IsNullOrWhiteSpace(model.CategoryId))
            {
                qqq = qqq.Where(x => x.Category.IsInTree(model.CategoryId));
            }

            // total count in the category without additional filters
            results.TotalProductsCount = _products.Count();

            // available filters based on selected category
            results.AvailableFilters = BuildFilters(qqq);

            // facets            
            var namedFacets = model.Facets.GroupBy(x => x.Name);
            foreach (var facet in namedFacets)
            {
                qqq = qqq.Where(x => x.Facets.Any(f => f.Name == facet.Key && facet.Any(nf => f.Value == nf.Value)));
            }

            // sort                        
            Func<ProductCard, object> sortKeySelector = x => x.Brand;
            switch (model.SortProperty)
            {
                case "Price":
                    sortKeySelector = x => x.Price;
                    break;
                case "Brand":
                    sortKeySelector = x => x.Brand;
                    break;
                case "DateAddedToStore":
                    sortKeySelector = x => x.DateAddedToStore;
                    break;
            }
            if (model.SortDirection == "desc")
            {
                qqq = qqq.OrderByDescending(sortKeySelector);
            }
            else
            {
                qqq = qqq.OrderBy(sortKeySelector);
            }
            results.Products = qqq.Take(model.ProductCount);
            return results;
        }

        private IEnumerable<FilterSection> BuildFilters(IEnumerable<ProductCard> products)
        {
            var availableFilters = new List<FilterSection>();

            var facetGroups = products.SelectMany(x => x.Facets)
                .GroupBy(x => x.Name);

            foreach (var facetName in facetGroups)
            {
                var uniqueValues = facetName.Select(x => x.Value).Distinct().ToArray();
                availableFilters.Add(new FilterSection(facetName.Key, uniqueValues));
            }

            return availableFilters;
        }
    }

    public class SearchModel
    {
        public int ProductCount { get; set; } = 9;
        public IList<Facet> Facets { get; set; } = new List<Facet>();
        public string CategoryId { get; set; }
        public string SortDirection { get; set; } = "desc";
        public string SortProperty { get; set; }
    }

    public class SearchResults
    {
        public IEnumerable<ProductCard> Products { get; set; }
        public IEnumerable<FilterSection> AvailableFilters { get; set; }
        public SearchModel ParsedQueryModel { get; set; }
        public int TotalProductsCount { get; set; }
    }
}
