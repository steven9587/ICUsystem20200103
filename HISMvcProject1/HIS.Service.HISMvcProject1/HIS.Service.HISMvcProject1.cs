﻿/*
  HISMvcProject1DbContext

    Author : DESKTOP-L2FG7C1
    Date   : 2019/11/24 07:00

    實作事項

    ．HISMvcProject1DbContext

      開發時期 DbContext, 用於工具程式讀取個體 Metadata 使用, 請勿應用於線上程式碼.
*/

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using HIS.Entity.Models;
using HIS.Entity.ViewModels;
using HIS.Mvc;
using HIS.Service.HISMvcProject1.ViewModels;
using HIS.Systems;

namespace HIS.Service.HISMvcProject1
{
  /// <summary>
  /// HISMvcProject1 DbContext.
  /// </summary>
  public partial class HISMvcProject1DbContext : DbContext
  {
  }

  /// <summary>
  /// HISMvcProject1 DbContext.
  /// </summary>
  [Obsolete("開發時期 DbContext, 用於工具程式讀取個體 Metadata 使用, 請勿應用於線上程式碼.")]
  public partial class HISMvcProject1DbContext : DbContext
  {
    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }

    public HISMvcProject1DbContext() : base(new Oracle.ManagedDataAccess.Client.OracleConnection("Data Source=medincom;User ID=cms;Password=cms"), true)
    {
      Database.SetInitializer<HISMvcProject1DbContext>(null); // 停用 Code First 內建資料庫建置程序(因為目前系統不使用) - See SetInitializer(strategy), Go To Definition - ..., or null to disable initialization for the given context type.
    }
  }
}

namespace HIS.Service.HISMvcProject1.ViewModels
{
  class HISMvcProject1Class1
  {
  }
}
