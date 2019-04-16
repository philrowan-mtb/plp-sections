using System.Collections.Generic;
using WebApplication7.Search;

namespace WebApplication7.Views.Shared.Sections
{
    public class FiltersViewModel
    {
        public FilterSection Section { get; set; }
        public IEnumerable<Facet> ActiveFilters { get; set; }
    }
}
