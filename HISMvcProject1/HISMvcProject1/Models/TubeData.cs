using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HISMvcProject1.Models
{
    public class TubeData
    {


        /// <summary>
        /// 病人編號
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("病人編號")]
        public string PatientID { get; set; }

        /// <summary>
        /// 管路位置
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("管路位置")]
        public string TubePartName { get; set; }


        [DisplayName("管路位置ID")]
        [Required(ErrorMessage = "此欄位必填")]
        public string TubePartID { get; set; }

        /// <summary>
        /// 管路名稱
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("管路名稱")]
        public string TubeName { get; set; }

        [DisplayName("管路名稱ID")]
        [Required(ErrorMessage = "此欄位必填")]
        public string TubeNameID { get; set; }

        /// <summary>
        /// 放置日期
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("放置日期")]
        public string SysDate { get; set; }

        /// <summary>
        /// 到期日期
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("到期日期")]
        public string ExpDate { get; set; }

        /// <summary>
        /// 管路口徑
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("管路口徑")]
        [Required(ErrorMessage = "此欄位必填")]
        public string Caliber { get; set; }

        /// <summary>
        /// 放入公分數
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("放入公分數")]
        [Required(ErrorMessage = "此欄位必填")]
        public string InBodyCm { get; set; }

        /// <summary>
        /// 備註
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("備註")]
        public string TubeNote { get; set; }


        /// <summary>
        /// Location_X
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("X座標")]
        public int LocationX { get; set; }


        /// <summary>
        /// Location_Y
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("Y座標")]
        public int LocationY { get; set; }
    }
}