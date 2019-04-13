using System.Collections.Generic;

namespace WebApplication7
{
    public class ProductCard
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public IList<Facet> Facets { get; set; }

        public ProductCard() {
            Facets = new List<Facet>();
        }
    }

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
