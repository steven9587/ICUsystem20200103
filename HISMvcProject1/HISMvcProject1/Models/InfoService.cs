using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HISMvcProject1.Models
{
    public class InfoService
    {
        /// <summary>
        /// 取得DB連線字串
        /// </summary>
        /// <returns></returns>
        private string GetDBConnectionString()
        {
            return System.Configuration.ConfigurationManager.ConnectionStrings["DBConn"].ConnectionString.ToString();
        }

        /// <summary>
        /// GetDivision
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> GetDivision()
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT division_id as CodeID, 
	                               division_ename as CodeName 
                            FROM division_info;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapCodeName(dt);
        }
        /// <summary>
        /// GetDoctorName
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> GetDoctorName()
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT doctor_id as CodeID, 
	                               doctor_name as CodeName 
                            FROM doctor_info;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapCodeName(dt);
        }

        /// <summary>
        /// GetPatientData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public Models.InfoData GetPatientData(Models.InfoData data)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT pai.patient_bed as BedId,
                                  pai.patient_hisid as PatientId,
                                  pai.patient_division as DivisionId ,
                                  di.division_ename as DivisionName,
								  pai.PATEINT_ID as PatientIdNo,
								  CONVERT(char(10),pai.patient_birth,126) as PatientBirth,
								  CONVERT(char(10),pai.patient_inicu,126) as PatientInICU,
                                  CONVERT(char(10),pai.patient_admdt,126) as PatientAdmdt,
								  pai.patient_weight as PatientWeight,
								  pai.PATTIENT_HEIGHT as PatientHeight,
                                  pai.patient_name as PatientName,
                                  pai.patient_doctor_id as DoctorId,
                                  doi.doctor_name as DoctorName,
                                  ul.user_name as NurseName 
                           FROM PATIENT_INFO pai 
			               INNER JOIN DIVISION_INFO di 
                                ON pai.PATIENT_DIVISION = di.division_id
			               INNER JOIN doctor_info doi 
                                on pai.patient_doctor_id = doi.doctor_id
			               INNER JOIN user_login ul 
                                on pai.PATIENT_NURSE_ID_1 = ul.user_id
                            Where patient_hisid = @PatientId";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", data.PatientId));
                
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return MapData(dt);
        }

        private Models.InfoData MapData(DataTable dt)
        {
            Models.InfoData result = new Models.InfoData();
            result.BedId = (int)dt.Rows[0]["BedId"];
            result.PatientId = dt.Rows[0]["PatientId"].ToString();
            result.Division = dt.Rows[0]["DivisionName"].ToString();
            result.DivisionId = dt.Rows[0]["DivisionId"].ToString();
            result.PatientIdNo = dt.Rows[0]["PatientIdNo"].ToString();
            result.PatientBirth = dt.Rows[0]["PatientBirth"].ToString();
            result.PatientInICU = dt.Rows[0]["PatientInICU"].ToString();
            result.PatientAdmdt = dt.Rows[0]["PatientAdmdt"].ToString();
            result.PatientWeight = dt.Rows[0]["PatientWeight"].ToString();
            result.PatientHeight = dt.Rows[0]["PatientHeight"].ToString();
            result.PatientName = dt.Rows[0]["PatientName"].ToString();
            result.DoctorName = dt.Rows[0]["DoctorName"].ToString();
            result.NurseName = dt.Rows[0]["NurseName"].ToString();
            return result;
        }

       
        public List<Models.InfoData> GetInfoByCondtioin(Models.InfoData data)
        {

            DataTable dt = new DataTable();
            string sql = @"SELECT pai.patient_bed as BedId,
                                  pai.patient_division as DivisionId ,
                                  di.division_ename as DivisionName,
                                  pai.patient_hisid as PatientID,
                                  pai.patient_name as PatientName,
                                  pai.patient_doctor_id as DoctorId,
                                  doi.doctor_name as DoctorName,
                                  ul.user_name as NurseName 
                           FROM PATIENT_INFO pai 
			               INNER JOIN DIVISION_INFO di 
                                ON pai.PATIENT_DIVISION = di.division_id
			               INNER JOIN doctor_info doi 
                                on pai.patient_doctor_id = doi.doctor_id
			               INNER JOIN user_login ul 
                                on pai.PATIENT_NURSE_ID_1 = ul.user_id
                           WHERE (pai.patient_hisid LIKE ('%'+@PatientId+'%') OR @PatientId='' )AND
					             (pai.patient_division LIKE ('%'+@DivisionId+'%') OR @DivisionId='')AND
								 (pai.patient_doctor_id LIKE ('%'+@DoctorId+'%') OR @DoctorId='' )
                           ORDER BY pai.patient_bed";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@DivisionId", data.DivisionId == null ? string.Empty : data.DivisionId));
                cmd.Parameters.Add(new SqlParameter("@DoctorId", data.DoctorId == null ? string.Empty : data.DoctorId));
                cmd.Parameters.Add(new SqlParameter("@PatientId", data.PatientId == null ? string.Empty : data.PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookDataToListForSearch(dt);
        }
        private List<Models.InfoData> MapBookDataToListForSearch(DataTable InfoData)
        {
            List<Models.InfoData> resultModify = new List<InfoData>();
            foreach (DataRow row in InfoData.Rows)
            {
                resultModify.Add(new InfoData()
                {
                    BedId = (int)row["BedId"],
                    PatientId= row["PatientID"].ToString(),
                    Division = row["DivisionName"].ToString(),
                    PatientName = row["PatientName"].ToString(),
                    DoctorName = row["DoctorName"].ToString(),
                    NurseName = row["NurseName"].ToString(),
                });
            }
            return resultModify;
        }

        /// <summary>
        /// TubePartNameMap
        /// </summary>
        /// <returns></returns>
        private List<SelectListItem> MapCodeName(DataTable dt)
        {
            List<SelectListItem> result = new List<SelectListItem>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(new SelectListItem()
                {
                    Text = row["CodeName"].ToString(),
                    Value = row["CodeID"].ToString()
                });
            }
            return result;
        }
    }
}