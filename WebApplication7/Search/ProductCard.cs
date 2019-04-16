using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace WebApplication7.Search
{
    public class ProductCard
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Brand => Facets.SingleOrDefault(x => x.Name == "Brand")?.Value ?? string.Empty;
        public CategoryNode Category { get; set; }
        public IList<Facet> Facets { get; set; }
        public DateTimeOffset DateAddedToStore { get; set; }

        public ProductCard() {
            Facets = new List<Facet>();
        }
    }

    [DebuggerDisplay("{Name}: {Value}")]
    public class Facet
    {
        public string Name { get; set; }
        public string Value { get; set; }

        public Facet(string name, string value)
        {
            Name = name;
            Value = value;
        }
    }
}
