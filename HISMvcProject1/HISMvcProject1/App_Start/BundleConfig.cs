using System.Web;
using System.Web.Optimization;

namespace HIS
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // 20161125 Chris : bootstrap.js/css - 因為 layout 已引用 min 且 bootstrap.js 測試可能與 min 衝突發生錯誤因此停用 - "JavaScript 執行階段錯誤: 無法取得未定義或 Null 參考的屬性 'documentElement'".
            bundles.Add(new Bundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new Bundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      //停用 "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      //停用 "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
