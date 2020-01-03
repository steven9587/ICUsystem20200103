using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace HIS
{
  public class MvcApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      AreaRegistration.RegisterAllAreas();
      GlobalConfiguration.Configure(WebApiConfig.Register);
      FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
      RouteConfig.RegisterRoutes(RouteTable.Routes);
      BundleConfig.RegisterBundles(BundleTable.Bundles);
      // 開放外部應用程式開啟目前應用程式中包含 Form AntiForgeryToken 的 View, 否則此類型的 View 執行時將引發例外 : 
      // - Refused to display 'http://localhost:xxxx/XXXXX/Edit' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'.
      // *不包含 AntiForgeryToken 的 View 執行時無此問題.
      // *AntiForgeryConfig.SuppressXFrameOptionsHeader Property
      //  https://msdn.microsoft.com/en-us/library/system.web.helpers.antiforgeryconfig.suppressxframeoptionsheader(v=vs.111).aspx
      AntiForgeryConfig.SuppressXFrameOptionsHeader = true;
    }
  }
}
