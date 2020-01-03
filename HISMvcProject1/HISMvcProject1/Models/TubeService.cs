using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HISMvcProject1.Models
{
    public class TubeService
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
        /// GetTubePartName
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> GetTubePartName()
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT tube_part_id as CodeID, 
	                               tube_part as CodeName 
                            FROM tube_part;";
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
        /// InsertTube
        /// </summary>
        /// <returns></returns>
        public int InsertTube(Models.TubeData tube)
        {
            string sql = @"INSERT INTO TUBE_INSERT(Patient_ID,Tube_Name_ID,Tube_Part_ID,In_Body_Cm,Caliber,Sys_Date,Exp_Date,Tube_Note,Location_X,Location_Y) 
                           VALUES(@PatientID,@TubeNameID,@TubePartID,@InBodyCm,@Caliber,@SysDate,@ExpDate,@TubeNote,@LocationX,@LocationY)
                           SELECT SCOPE_IDENTITY(); 
                           ";

            int TubeID;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientID", tube.PatientID));
                cmd.Parameters.Add(new SqlParameter("@TubeNameID", tube.TubeNameID));
                cmd.Parameters.Add(new SqlParameter("@TubePartID", tube.TubePartID));
                cmd.Parameters.Add(new SqlParameter("@InBodyCm", tube.InBodyCm));
                cmd.Parameters.Add(new SqlParameter("@Caliber", tube.Caliber));
                cmd.Parameters.Add(new SqlParameter("@SysDate", tube.SysDate));
                cmd.Parameters.Add(new SqlParameter("@ExpDate", tube.ExpDate));
                if (tube.TubeNote == null)
                {
                    cmd.Parameters.Add(new SqlParameter("@TubeNote", ""));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@TubeNote", tube.TubeNote));
                }
                cmd.Parameters.Add(new SqlParameter("@LocationX", tube.LocationX));
                cmd.Parameters.Add(new SqlParameter("@LocationY", tube.LocationY));
                SqlTransaction Tran = conn.BeginTransaction();
                cmd.Transaction = Tran;
                try
                {
                    TubeID = Convert.ToInt32(cmd.ExecuteScalar());
                    Tran.Commit();
                }
                catch (Exception)
                {
                    Tran.Rollback();
                    throw;
                }
                finally
                {
                    conn.Close();
                }

            }
            return TubeID;
        }


        /// <summary>
        /// EditTube
        /// </summary>
        /// <returns></returns>
        public void EditTube(Models.TubeData tube)
        {
            DataTable dt = new DataTable();
            string sql = @"UPDATE TUBE_INSERT SET 
                            Patient_ID = @PatientID,
                            Tube_Name_ID = @TubeNameID,
                            Tube_Part_ID = @TubePartID,
                            In_Body_Cm = @InBodyCm,
                            Caliber = @Caliber,
                            Sys_Date = CONVERT(DATETIME, @SysDate),
                            Exp_Date = CONVERT(DATETIME, @ExpDate),
                            Tube_Note = @TubeNote 
                            WHERE Location_X = @LocationX AND Location_Y = @LocationY
                             AND patient_id = @PatientID ;";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.Parameters.Add(new SqlParameter("@PatientID", tube.PatientID));
                cmd.Parameters.Add(new SqlParameter("@TubeNameID", tube.TubeNameID));
                cmd.Parameters.Add(new SqlParameter("@TubePartID", tube.TubePartID));
                cmd.Parameters.Add(new SqlParameter("@InBodyCm", tube.InBodyCm));
                cmd.Parameters.Add(new SqlParameter("@Caliber", tube.Caliber));
                cmd.Parameters.Add(new SqlParameter("@SysDate", tube.SysDate));
                cmd.Parameters.Add(new SqlParameter("@ExpDate", tube.ExpDate));
                if (tube.TubeNote == null)
                {
                    cmd.Parameters.Add(new SqlParameter("@TubeNote", ""));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@TubeNote", tube.TubeNote));
                }
                cmd.Parameters.Add(new SqlParameter("@LocationX", tube.LocationX));
                cmd.Parameters.Add(new SqlParameter("@LocationY", tube.LocationY));
                SqlTransaction Tran = conn.BeginTransaction();
                cmd.Transaction = Tran;
               try
                {
                    Tran.Commit();
                    
                }
                catch (Exception)
                {
                    Tran.Rollback();
                    throw;
                }
                finally
                {
                    sqlAdapter.Fill(dt);
                    conn.Close();
                }

            }
        }


        /// <summary>
        /// DeleteTube
        /// </summary>
        /// <param name="BookID"></param>
        public void DeleteTube(Models.TubeData tube)
        {
            try  //針對SQL 做try catch
            {
                string sql = @"DELETE FROM tube_insert where location_x = @LocationX and location_y = @LocationY  AND patient_id = @PatientId ;";
                using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.Parameters.Add(new SqlParameter("@LocationX", tube.LocationX));
                    cmd.Parameters.Add(new SqlParameter("@LocationY", tube.LocationY));
                    cmd.Parameters.Add(new SqlParameter("@PatientId", tube.PatientID));
                    SqlTransaction Tran = conn.BeginTransaction();
                    cmd.Transaction = Tran;
                    try  //針對Transaction 做try catch
                    {
                        cmd.ExecuteNonQuery();
                        Tran.Commit();
                    }
                    catch (Exception)
                    {
                        Tran.Rollback();
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// GetTubeLocationX
        /// </summary>
        /// <returns></returns>
        public List<String> GetTubeLocationX(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT Location_X AS CodeID
	                       FROM tube_Insert
                           Where Patient_ID = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["CodeID"].ToString());

            }
            return result;
        }

        /// <summary>
        /// GetTubeLocationY
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        public List<String> GetTubeLocationY(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @"  SELECT Location_Y AS CodeID
	                         FROM tube_Insert
                             Where Patient_ID = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["CodeID"].ToString());

            }
            return result;
        }

        /// <summary>
        /// GetTubeCaliber
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        public List<String> GetTubeCaliber(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @"  select caliber as TubeCaliber
                             from tube_insert
                             Where Patient_ID = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["TubeCaliber"].ToString());

            }
            return result;
        }

        /// <summary>
        /// GetTubeInBodyCm
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        public List<String> GetTubeInBodyCm(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @"  select in_body_cm as TubeInBodym
                             from tube_insert
                             Where Patient_ID = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["TubeInBodym"].ToString());

            }
            return result;
        }

        /// <summary>
        /// GetTubeInsertName
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        public List<String> GetTubeInsertName(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @"  select tin.tube_name_id as TubeNameId, 
                             ti.tube_name as TubeName
                             from tube_insert tin 
                             left join tube_info ti on tin.tube_name_id = ti.tube_name_id
                             Where Patient_ID = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["TubeName"].ToString());

            }
            return result;
        }

        /// <summary>
        /// GetTubeData
        /// </summary>
        /// <param name="tubexy"></param>
        /// <returns></returns>
        public Models.TubeData GetTubeData(Models.TubeData tubexy)
        {
            DataTable dt = new DataTable();
            string sql = @"select ti.Tube_Info_id as TubeIfoId, 
		                          ti.tube_name_id as TubeId ,
		                          t.tube_name as TubeName,
		                          ti.tube_part_id as PartId,
		                          tp.tube_part as PartName,
		                          ti.in_body_cm as Inbodycm,
		                          ti.caliber as Caliber,
		                          CONVERT(char(10),ti.sys_date,126) as Sysdate,
		                          CONVERT(char(10),ti.exp_date,126) as Expdate,
		                          ti.tube_note as TubeNote
                          from tube_insert ti 
                          left join tube_part tp on ti.tube_part_id = tp.tube_part_id 
                          left join tube_info t on ti.tube_name_id = t.tube_name_id
                          where location_x = @LocationX and location_y = @LocationY
                          AND patient_id = @PatientId;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", tubexy.PatientID));
                cmd.Parameters.Add(new SqlParameter("@LocationX", tubexy.LocationX));
                cmd.Parameters.Add(new SqlParameter("@LocationY", tubexy.LocationY));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return MapEditData(dt);
        }
        private Models.TubeData MapEditData(DataTable dt)
        {
            Models.TubeData result = new Models.TubeData();
            result.TubePartID = dt.Rows[0]["PartId"].ToString();
            result.TubeNameID = dt.Rows[0]["TubeId"].ToString();
            result.SysDate = dt.Rows[0]["Sysdate"].ToString();
            result.ExpDate = dt.Rows[0]["Expdate"].ToString();
            result.Caliber = dt.Rows[0]["Caliber"].ToString();
            result.InBodyCm = dt.Rows[0]["Inbodycm"].ToString();
            result.TubeNote = dt.Rows[0]["TubeNote"].ToString();
            return result;
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

        /// <summary>
        /// PipeLine
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> GetPipeLine(Models.TubeData data)
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT Tube_Name_ID as TubeID,Tube_Name as TubeName 
                            FROM tube_info
                            where tube_part_id = @tubepartid
                           ;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                if (data.TubePartID == null)
                {
                    cmd.Parameters.Add(new SqlParameter("@tubepartid", ""));
                }
                else
                {
                    cmd.Parameters.Add(new SqlParameter("@tubepartid", data.TubePartID));
                }
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapTubeName(dt);
        }

        /// <summary>
        /// GetPipeLineStart
        /// </summary>
        /// <returns></returns>
        public List<SelectListItem> GetPipeLineStart()
        {
            DataTable dt = new DataTable();
            string sql = @" SELECT Tube_Name_ID as TubeID,Tube_Name as TubeName 
                            FROM tube_info
                           ;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapTubeName(dt);
        }
        /// <summary>
        /// PipeLineMap
        /// </summary>
        /// <returns></returns>
        private List<SelectListItem> MapTubeName(DataTable dt)
        {
            List<SelectListItem> result = new List<SelectListItem>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(new SelectListItem()
                {
                    Text = row["TubeName"].ToString(),
                    Value = row["TubeID"].ToString()
                });
            }
            return result;
        }


        /// <summary>
        /// GetTubeDate
        /// </summary>
        /// <returns></returns>
        public List<String> GetTubeDate(String PatientId)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT DATEDIFF(DAY, getdate(), Exp_Date) AS tubeDate 
                           from TUBE_INSERT
                           Where Patient_ID = @PatientId;";
            //string sql = @"SELECT Location_X AS CodeID FROM tube_Insert;";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PatientId", PatientId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }

            List<String> result = new List<String>();
            foreach (DataRow row in dt.Rows)
            {
                result.Add(row["tubeDate"].ToString());

            }
            return result;
        }

    }
}