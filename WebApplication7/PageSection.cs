using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebApplication7
{
    public static class Jsonify
    {
        public static string ToJson(this object model) => JsonConvert.SerializeObject(model);
    }

    public abstract class PageObject
    {
        public abstract object ClientModel { get; }
    }

    public class ProductCard
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    public class FilterSection
    {
        public string Title { get; set; }
        public IList<FilterOption> Options { get; set; }

        public FilterSection()
        {

        }

        public FilterSection(string title, params string[] options)
        {
            Title = title;
            Options = new List<FilterOption>();
            if (options != null)
            {
                foreach (var option in options)
                {
                    Options.Add(new FilterOption(title, option));
                }
            }
        }
    }

    public class FilterOption : PageObject
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public override object ClientModel { get; }

        public FilterOption()
        {            
        }

        public FilterOption(string filterName, string filterValue)
        {
            Name = filterName;
            Value = filterValue;
            ClientModel = new
            {
                filter_name = filterName,
                filter_value = filterValue,
                attribute_id = GenFu.A.Random.Next()
            };
        }
    }

    public class CategorySection
    {
        public string Title { get; set; } = "Categories";

        public IList<CategoryNode> Categories { get; set; }

        public CategorySection()
        {
            Categories = new List<CategoryNode>();
        }

        public void Add(CategoryNode node)
        {
            Categories.Add(node);
        }
    }

    public class CategoryNode
    {
        public string Title { get; set; }

        public IList<CategoryNode> Categories { get; set; }

        public CategoryNode(string title, params string[] childrenNodeTitles)
        {
            Title = title;
            Categories = new List<CategoryNode>();
            if (childrenNodeTitles != null)
            {
                foreach (var c in childrenNodeTitles)
                {
                    Categories.Add(new CategoryNode(c));
                }
            }
        }
    }
}
