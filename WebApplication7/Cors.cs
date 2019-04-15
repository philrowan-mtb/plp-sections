using Microsoft.AspNetCore.Cors.Infrastructure;

namespace WebApplication7
{
    public class Cors
    {
        public static CorsPolicy AllowLocal()
        {
            var policy = new CorsPolicyBuilder();

            policy.AllowAnyHeader();
            policy.WithOrigins("http://karlslocal.com");
            policy.WithMethods("OPTIONS", "HEAD", "GET");

            return policy.Build();
        }
    }
}
