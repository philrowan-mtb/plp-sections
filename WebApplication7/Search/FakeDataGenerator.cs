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
                    Name = "Product " + (i + 1),
                    Price = Convert.ToDecimal(_random.NextDouble() * _random.Next(1, 10)),
                    DateAddedToStore = new DateTimeOffset(DateTime.Today).AddDays(-1 * _random.Next(60))
                };
                p.Facets.Add(new Facet("Color", RandomColor()));
                p.Facets.Add(new Facet("Size", RandomSize()));
                p.Facets.Add(new Facet("Brand", RandomBrand()));
                yield return p;
            }                        
        }

        private static readonly CategoryNode _categories = new CategoryNode("root");
        private static readonly CategoryNode[] _leafs;

        static FakeDataGenerator() {            
            var tackle = _categories.Add("Tackle");
            var hardbait = tackle.Add("Hard bait");
            var leafs = new List<CategoryNode>();
            leafs.Add(hardbait.Add("Crank baits"));
            leafs.Add(hardbait.Add("Hard swimbaits"));
            leafs.Add(hardbait.Add("Rip baits"));

            var softbait = tackle.Add("Soft bait");
            leafs.Add(softbait.Add("Worms"));
            leafs.Add(softbait.Add("Creatures"));

            var jigs = tackle.Add("Jigs");
            leafs.Add(jigs.Add("Heads"));
            leafs.Add(jigs.Add("Skirts"));
            leafs.Add(jigs.Add("Rigging"));

            _leafs = leafs.ToArray();
        }

        static CategoryNode RandomCategory() => RandElement(_leafs);

        private static readonly string[] _sizes = new string[]{
            "2\"",
            "2.5\"",
            "3\"",
            "3.5\"",
            "4\""
        };
        static string RandomSize() => RandElement(_sizes);

        private static readonly string[] _colors = new string[]{
            "Red",
            "Green",
            "Yellow",
            "Blue",
            "Orange"
        };
        static string RandomColor() => RandElement(_colors);

        private static readonly string[] _brands = new string[]{
            "Rapala",
            "Karl's Amazing Baits",
            "Yo-Zuri",
            "Biospawn",
            "Bagley",
            "Lucky John",
            "ACME Fishing Company"
        };
        static string RandomBrand() => RandElement(_brands);

        static T RandElement<T>(T[] source) => source[RandIndex(source.Length)];

        static int RandIndex(int arrayLength) => (int)Math.Ceiling(_random.NextDouble() * arrayLength) - 1;
    }
}
