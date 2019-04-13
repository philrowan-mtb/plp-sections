using System;
using System.Collections.Generic;

namespace WebApplication7
{
    internal static class GenCon
    {
        private static Random _random = new Random();

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

        private static readonly string[] _categories = new string[]{
            "Hard bait",
            "Soft bait",
            "Medium bait",            
        };
        static string RandomCategory() => _categories[RandIndex(_categories.Length)];

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
