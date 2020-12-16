using ASP.NET_Core_React_Redux_WhatWasRead.App_Data;
using ASP.NET_Core_React_Redux_WhatWasRead.App_Data.EF;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace ASP.NET_Core_React_Redux_WhatWasRead
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         services.AddControllersWithViews();
         services.AddDbContext<WhatWasReadContext>();
         services.AddTransient<IRepository, EFRepository>();

         // In production, the React files will be served from this directory
         services.AddSpaStaticFiles(configuration =>
         {
            configuration.RootPath = "ClientApp/build";
         });
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }
         else
         {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
         }

         app.UseHttpsRedirection();
         app.UseStaticFiles();
         app.UseSpaStaticFiles();

         app.UseRouting();
         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
         });
         //app.UseEndpoints(endpoints =>
         //{
         //   endpoints.MapControllerRoute(
         //          name: "Default",
         //          pattern: "/",
         //          defaults: new { controller = "Books", action = "List" }); //page = 1, category = "all", accepts filter via querystring
         //   endpoints.MapControllerRoute(
         //          name: "ControllerIdAction",
         //          pattern: "{controller}/{action}/{id?}",
         //          defaults: new { controller = "Books", action = "Index" }, //page = 1, category = "all", accepts filter via querystring
         //          constraints: new { id = @"\d+" }
         //          );
         //   endpoints.MapControllerRoute(
         //          name: "CategoryPageRoute",
         //          pattern: "books/list/{category}/page{page}",
         //          defaults: new { controller = "Books", action = "List", category = "all", page = 1 }, //page = 1, category = "all", accepts filter via querystring
         //          constraints: new { page = @"\d+" }
         //          );
         //});

         app.UseSpa(spa =>
         {
            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment())
            {
               spa.UseReactDevelopmentServer(npmScript: "start");
            }
         });
      }
   }
}
