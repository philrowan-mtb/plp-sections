namespace WebApplication7
{
    public class SortOption
    {
        public SortOption(string title, string propertyName, string direction)
        {
            Title = title;
            PropertyName = propertyName;
            Direction = direction;
        }

        public string Title { get; set; }
        public string PropertyName { get; set; }
        public string Direction { get; set; }
    }
}