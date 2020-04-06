using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

//we need these to talk to mysql
using MySql.Data;
using MySql.Data.MySqlClient;
//and we need this to manipulate data from a db
using System.Data;

namespace accountmanager
{
	/// <summary>
	/// Summary description for AccountServices
	/// </summary>
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
	[System.Web.Script.Services.ScriptService]
	public class AccountServices : System.Web.Services.WebService
	{

        private string dbID = "ciscapstoners";
        private string dbPass = "!!Ciscapstoners";
        private string dbName = "ciscapstoners";

        private string getConString()
        {
            return "SERVER=107.180.1.16; PORT=3306; DATABASE=" + dbName + "; UID=" + dbID + "; PASSWORD=" + dbPass;
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public string LogIn(string email, string pass)
        {
            //we return this flag to tell them if they logged in or not
            string account = "";
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session

            string sqlSelect = "SELECT accountId, email, password, firstName, lastName, bio, department, isAdmin FROM accounts WHERE email=@emailValue and password=@passValue";


            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account
            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they 
                //are 1) logged in at all, and 2) and admin or not
                Session["id"] = sqlDt.Rows[0]["accountId"];
                Session["email"] = sqlDt.Rows[0]["email"];
                Session["firstName"] = sqlDt.Rows[0]["firstName"];
                Session["lastName"] = sqlDt.Rows[0]["lastName"];
                Session["bio"] = sqlDt.Rows[0]["bio"];
                Session["department"] = sqlDt.Rows[0]["department"];
                Session["isAdmin"] = sqlDt.Rows[0]["isAdmin"];

                // for later use
                Session["randomNumber"] = -1;
                account = "{" + "\"id\"" + ":" + "\"" + Session["id"] + "\"" + ","
                    + "\"email\"" + ":" + "\"" + Session["email"].ToString() + "\"" + ","
                    + "\"firstName\"" + ":" + "\"" + Session["firstName"].ToString() + "\"" + ","
                    + "\"lastName\"" + ":" + "\"" + Session["lastName"].ToString() + "\"" + ","
                    + "\"bio\"" + ":" + "\"" + Session["bio"].ToString() + "\"" + ","
                    + "\"isAdmin\"" + ":" + "\"" + Session["isAdmin"] + "\"" + ","
                    + "\"department\"" + ":" + "\"" + Session["department"].ToString() + "\"" + "}";

            }
            //return the result!
            return account;
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public void SignUp(string email, string password, string firstName, string lastName)
        {
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlAddAcct = "INSERT INTO accounts(email, password, firstName, lastName) VALUES(@emailValue, @passValue, @firstNameValue, @lastNameValue)";
            //"SELECT userName, password FROM accounts WHERE userName=@idValue and password=@passValue";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlAddAcct, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(password));
            sqlCommand.Parameters.AddWithValue("@firstNameValue", HttpUtility.UrlDecode(firstName));
            sqlCommand.Parameters.AddWithValue("@lastNameValue", HttpUtility.UrlDecode(lastName));

            sqlConnection.Open();

            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
            }
            catch (Exception)
            {

            }
            sqlConnection.Close();
            //return the result!
        }

        [WebMethod(EnableSession = true)]
        public bool LogOut()
        {
            //if they log off, then we remove the session.

            Session.Abandon();
            return true;
        }

        // Admin Access

        [WebMethod(EnableSession = true)]
        public Account[] GetAccounts()
        {
      
            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["id"] != null)
            {
                DataTable sqlDt = new DataTable("accounts");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select accountId, email, password, firstName, lastName, department, isAdmin from accounts order by accountId";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Account> accounts = new List<Account>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    accounts.Add(new Account
                    {
                        id = Convert.ToInt32(sqlDt.Rows[i]["accountId"]),
                        email = sqlDt.Rows[i]["email"].ToString(),
                        password = sqlDt.Rows[i]["password"].ToString(),
                        firstName = sqlDt.Rows[i]["firstName"].ToString(),
                        lastName = sqlDt.Rows[i]["lastName"].ToString(),
                        department = sqlDt.Rows[i]["department"].ToString(),
                        isAdmin = (bool)sqlDt.Rows[i]["isAdmin"]
                    });
                }
                //convert the list of accounts to an array and return!
                return accounts.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Account[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public void DeleteAccount(string id)
        {
            if (Session["isAdmin"].ToString() == "true")
            {
                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "delete from accounts where accountID=@idValue";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(id));

                sqlConnection.Open();
                try
                {
                    sqlCommand.ExecuteNonQuery();
                }
                catch (Exception e)
                {

                }
                sqlConnection.Close();
            }
        }

    }
}
