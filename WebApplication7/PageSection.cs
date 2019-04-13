using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication7
{    
    public class FilterSection
    {
        public string Title { get; set; }
        public IList<FilterOption> Options { get; set; }

        public FilterSection(string title, params string[] options)
        {
            Title = title;
            Options = new List<FilterOption>();
            if (options != null)
            {
                foreach (var option in options)
                {
                     Options.Add(new FilterOption(option));
                }
            }
        }
    }

    public class FilterOption
    {
        public string Name { get; set; }

        public FilterOption(string name)
        {
            Name = name;
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
