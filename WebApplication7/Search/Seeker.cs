using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace WebApplication7.Search
{
    public class Seeker
    {
        private static readonly IEnumerable<ProductCard> _products = FakeDataGenerator.CreateProducts(40).ToList();
        private readonly IQueryCollection _query;

        public Seeker(IQueryCollection query) => _query = query;

        public IEnumerable<ProductCard> Search()
        {
            var model = Parse();
            return Search(model);
        }

        private SearchModel Parse()
        {
            var model = new SearchModel();
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
            if (_query.ContainsKey("c"))
            {
                model.CategoryId = _query["c"];
            }
            return model;
        }

        private IEnumerable<ProductCard> Search(SearchModel model)
        {
            var qqq = _products;

            // category
            if (!string.IsNullOrWhiteSpace(model.CategoryId))
            {
                qqq = qqq.Where(x => x.Category.IsInTree(model.CategoryId));
            }

            // facets
            // TODO: fix and/or relationship for facets
            foreach (var facetQuery in model.Facets)
            {
                qqq = qqq.Where(x => x.Facets.Any(f => f.Name == facetQuery.Name && f.Value == facetQuery.Value));
            }
            return qqq.Take(model.ProductCount);
        }

        internal class SearchModel
        {
            public int ProductCount { get; set; } = 6;
            public IList<Facet> Facets { get; set; } = new List<Facet>();
            public StringValues CategoryId { get; internal set; }
        }
    }
}
