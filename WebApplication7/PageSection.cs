using System;
using System.Collections.Generic;

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
                    Options.Add(new FilterOption(title, option));
                }
            }
        }
    }

    public class FilterOption
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public object ClientModel { get; }
        
        public FilterOption(string filterName, string filterValue)
        {
            Id = Guid.NewGuid();
            Name = filterName;
            Value = filterValue;
            ClientModel = new
            {
                name = Name,
                value = Value,
                id = Id
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
