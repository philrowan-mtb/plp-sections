using System;
using System.Collections.Generic;

namespace WebApplication7.Search
{
    internal static class FakeDataGenerator
    {
        private static readonly Random _random = new Random();

        public static IEnumerable<ProductCard> CreateProducts(int count)
        {            
            for (int i = 0; i < count; i++)
            {
                var p = new ProductCard
                {
                    Category = RandomCategory(),
                    Name = "Product " + (i + 1)
                };
                p.Facets.Add(new Facet("Color", RandomColor()));
                p.Facets.Add(new Facet("Size", RandomSize()));                
                yield return p;
            }                        
        }

        private static readonly CategoryNode _categories = new CategoryNode("root");
        private static readonly IList<CategoryNode> _leafs = new List<CategoryNode>();

        static FakeDataGenerator() {            
            var tackle = _categories.Add("Tackle");
            var hardbait = tackle.Add("Hard bait");
            _leafs.Add(hardbait.Add("Crank baits"));
            _leafs.Add(hardbait.Add("Hard swimbaits"));
            _leafs.Add(hardbait.Add("Rip baits"));

            var softbait = tackle.Add("Soft bait");
            _leafs.Add(softbait.Add("Worms"));
            _leafs.Add(softbait.Add("Creatures"));

            var jigs = tackle.Add("Jigs");
            _leafs.Add(jigs.Add("Heads"));
            _leafs.Add(jigs.Add("Skirts"));
            _leafs.Add(jigs.Add("Rigging"));
        }

        static CategoryNode RandomCategory() => _leafs[RandIndex(_leafs.Count)];

        private static readonly string[] _sizes = new string[]{
            "2\"",
            "2.5\"",
            "3\"",
            "3.5\"",
            "4\""
        };
        static string RandomSize() => _sizes[RandIndex(_sizes.Length)];        


        private static readonly string[] _colors = new string[]{
            "Red",
            "Green",
            "Yellow",
            "Blue",
            "Orange"
        };
        static string RandomColor() => _colors[RandIndex(_colors.Length)];

        static int RandIndex(int arrayLength) => (int)Math.Ceiling(_random.NextDouble() * arrayLength) - 1;
    }
}
