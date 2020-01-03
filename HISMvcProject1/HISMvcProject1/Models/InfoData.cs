using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HISMvcProject1.Models
{
    public class InfoData
    {
        /// <summary>
        /// 病人編號
        /// </summary>
        ///[MaxLength(5)]
        [DisplayName("病人編號")]
        public string PatientId { get; set; }

        [DisplayName("病人床號")]
        public int BedId { get; set; } 
         
        [DisplayName("科別")]
        public string Division { get; set; }
        [DisplayName("科別Id")]
        public string DivisionId { get; set; }

        [DisplayName("病人名稱")]
        public string PatientName { get; set; }

        [DisplayName("醫生名稱")]
        public string DoctorName { get; set; }
        [DisplayName("醫生名稱ID")]
        public string DoctorId { get; set; }

        [DisplayName("護士名稱")]
        public string NurseName { get; set; }
        [DisplayName("身分證號碼")]
        public string PatientIdNo { get; set; }
        [DisplayName("出生年月日")]
        public string PatientBirth{ get; set; }
        [DisplayName("入ICU日")]
        public string PatientInICU { get; set; }
        [DisplayName("住院日")]
        public string PatientAdmdt { get; set; }
        [DisplayName("病人身高")]
        public string PatientHeight { get; set; }
        [DisplayName("病人體重")]
        public string PatientWeight { get; set; }

    }
}