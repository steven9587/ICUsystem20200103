using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using HIS.Mvc;
using HIS.Mvc.Controller;
using HIS.Entity.Models;
using HIS.Systems;

namespace HISMvcProject1.Controllers
{
    public class MenuController : Controller
    {
        public MenuController()
        {
        }

        // GET: Menu
        public ActionResult Index(string fileMode)
        {
            //IQueryable<MenuClass> Menus;
            //string sFileName;
            ////
            //fileMode = HISSystem.EmptyTo(fileMode, "N").ToUpper(); // FileMode
            //sFileName = (fileMode == "Y") ? HISPath.CheckPath(this.App_Data) + "Menu.dat" : "";
            //Menus = this.ServiceClient.Read(sFileName);
            //if (fileMode == "AAA")
            //  Menus = Menus.Where(menu => menu.Level == 0); // 示範 : 單一條件
            //if (fileMode == "BBB")
            //  Menus = Menus.Where(menu => menu.Level > 0 && menu.Level > 1); // 示範 : AND
            //if (fileMode == "CCC")
            //  Menus = Menus.Where(menu => menu.Level != 0 || menu.Level != 1); // 示範 : OR

            // TODO: Menu
            IEnumerable<MenuClass> Menus;
            Menus = new List<MenuClass>();

            //
            return PartialView(Menus);
        }
    }
}
