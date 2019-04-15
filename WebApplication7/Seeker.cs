using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace WebApplication7
{
    public class Seeker
    {
        private static IEnumerable<ProductCard> _products = GenCon.CreateProducts(100).ToList();
        private IQueryCollection _query;

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
            return model;
        }

        private IEnumerable<ProductCard> Search(SearchModel model)
        {
            var qqq = _products;
            
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
        }
    }
}
