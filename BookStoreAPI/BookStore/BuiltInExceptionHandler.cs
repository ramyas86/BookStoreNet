using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;
using System.Net;

namespace BookStore;

public static class BuiltInExceptionHandler
{
    public static void AddErrorHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(apperror =>
        {
            apperror.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json"; ;
                var contextFeaure = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeaure != null)
                {
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        context.Response.StatusCode,
                        Message = "Something went wrong"
                    }));
                }
            });
        });
    }
}