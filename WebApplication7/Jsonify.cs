using Newtonsoft.Json;

namespace WebApplication7
{
    public static class Jsonify
    {
        public static string ToJson(this object model) => JsonConvert.SerializeObject(model);
    }
}
