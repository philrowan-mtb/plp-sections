using System.Collections.Generic;

namespace WebApplication7.Views.Shared.Sections
{
    public class FiltersViewModel
    {
        public FilterSection Section { get; set; }
        public IEnumerable<FilterOption> ActiveFilters { get; set; }
    }
}
