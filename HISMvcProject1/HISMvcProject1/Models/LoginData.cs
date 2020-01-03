using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HISMvcProject1.Models
{
    public class LoginData
    {
        /// <summary>
        /// 使用者ID
        /// </summary>
        ///[MaxLength(5)]
        //[DisplayName("使用者ID")]
        //    public int UserID { get; set; }

        /// <summary>
        /// 使用者帳號
        /// </summary>
        [Required(ErrorMessage = "Please enter your Username.")]
        [DisplayName("使用者帳號")]
        public string Username { get; set; }

        /// <summary>
        /// 使用者密碼
        /// </summary>
        [Required(ErrorMessage = "Please enter your Password.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }


    }


}