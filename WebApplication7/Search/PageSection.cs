﻿using System;
using System.Collections.Generic;

namespace WebApplication7.Search
{
    public class FilterSection
    {
        public string Title { get; set; }
        public IList<Facet> Options { get; set; }

        public FilterSection(string title, params string[] options)
        {
            Title = title;
            Options = new List<Facet>();
            if (options != null)
            {
                foreach (var option in options)
                {
                    Options.Add(new Facet(title, option));
                }
            }
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
        public string Id { get; set; }

        public string Title { get; set; }

        public CategoryNode Parent { get; set; }

        public IList<CategoryNode> Categories { get; set; }

        public CategoryNode(CategoryNode parent, string title, params string[] childrenNodeTitles)
            : this(title, childrenNodeTitles)
        {
            Parent = parent;            
        }

        public CategoryNode(string title, params string[] childrenNodeTitles)
        {
            Id = title.Replace(" ", "").ToLower();
            Title = title;
            Categories = new List<CategoryNode>();
            if (childrenNodeTitles != null)
            {
                foreach (var c in childrenNodeTitles)
                {
                    Categories.Add(new CategoryNode(this, c));
                }
            }
        }

        public CategoryNode Add(string title)
        {
            var node = new CategoryNode(this, title);
            Categories.Add(node);
            return node;
        }

        public bool IsInTree(string categoryId)
        {
            return IsInTreeRecursive(categoryId, this);
        }

        private static bool IsInTreeRecursive(string categoryId, CategoryNode node)
        {
            if (node == null) return false;

            if (node.Id == categoryId) return true;

            return IsInTreeRecursive(categoryId, node.Parent);
        }
    }
}
