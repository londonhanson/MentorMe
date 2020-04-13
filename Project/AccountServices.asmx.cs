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

            string sqlSelect = "SELECT accountId, accountType, email, password, firstName, lastName, bio, areaOfFocus, isAdmin FROM accounts WHERE email=@emailValue and password=@passValue";


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
                Session["accountType"] = sqlDt.Rows[0]["accountType"];
                Session["email"] = sqlDt.Rows[0]["email"];
                Session["firstName"] = sqlDt.Rows[0]["firstName"];
                Session["lastName"] = sqlDt.Rows[0]["lastName"];
                Session["bio"] = sqlDt.Rows[0]["bio"];
                Session["areaOfFocus"] = sqlDt.Rows[0]["areaOfFocus"];
                Session["isAdmin"] = sqlDt.Rows[0]["isAdmin"];

                // for later use
                Session["randomNumber"] = -1;
                account = "{" + "\"id\"" + ":" + "\"" + Session["id"] + "\"" + ","
                    + "\"accountType\"" + ":" + "\"" + Session["accountType"].ToString() + "\"" + ","
                    + "\"email\"" + ":" + "\"" + Session["email"].ToString() + "\"" + ","
                    + "\"firstName\"" + ":" + "\"" + Session["firstName"].ToString() + "\"" + ","
                    + "\"lastName\"" + ":" + "\"" + Session["lastName"].ToString() + "\"" + ","
                    + "\"bio\"" + ":" + "\"" + Session["bio"].ToString() + "\"" + ","
                    + "\"isAdmin\"" + ":" + "\"" + Session["isAdmin"] + "\"" + ","
                    + "\"areaOfFocus\"" + ":" + "\"" + Session["areaOfFocus"].ToString() + "\"" + "}";

            }
            //return the result!
            return account;
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public string SignUp(string email, string password, string firstName, string lastName, string accountType)
        {
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlAddAcct = "INSERT INTO accounts(email, password, firstName, lastName, accountType) VALUES(@emailValue, @passValue, @firstNameValue, @lastNameValue, @accountTypeValue)";
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
            sqlCommand.Parameters.AddWithValue("@accountTypeValue", HttpUtility.UrlDecode(accountType));

            sqlConnection.Open();
            string except = "";
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            { 
                except = e.Message.ToString();
                except = except.Substring(0, 9);
            }
            sqlConnection.Close();
            //return the result!
            return except;
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
                string sqlSelect = "select accountId, accountType, email, password, firstName, lastName, areaOfFocus, isAdmin from accounts order by accountId";

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
                        accountType = sqlDt.Rows[i]["accountType"].ToString(),
                        email = sqlDt.Rows[i]["email"].ToString(),
                        password = sqlDt.Rows[i]["password"].ToString(),
                        firstName = sqlDt.Rows[i]["firstName"].ToString(),
                        lastName = sqlDt.Rows[i]["lastName"].ToString(),
                        areaOfFocus = sqlDt.Rows[i]["areaOfFocus"].ToString(),
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
            if (Session["isAdmin"].ToString() == "True")
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

        [WebMethod(EnableSession = true)]
        public void UpdateAccount(string accountId, string email, string pass, string firstName, string lastName, string areaOfFocus, string accountType)
        {
            //WRAPPING THE WHOLE THING IN AN IF STATEMENT TO CHECK IF THEY ARE AN ADMIN!
            if (Session["isAdmin"].ToString() == "True")
            {
                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                //this is a simple update, with parameters to pass in values
                string sqlSelect = "update accounts set email=@emailValue, password=@passValue, firstName=@fnameValue, lastName=@lnameValue, " +
                    "areaOfFocus=@areaOfFocusValue, accountType=@accountTypeValue where accountId=@accountIdValue";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@accountIdValue", HttpUtility.UrlDecode(accountId));
                sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
                sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));
                sqlCommand.Parameters.AddWithValue("@fnameValue", HttpUtility.UrlDecode(firstName));
                sqlCommand.Parameters.AddWithValue("@lnameValue", HttpUtility.UrlDecode(lastName));
                sqlCommand.Parameters.AddWithValue("@areaOfFocusValue", HttpUtility.UrlDecode(areaOfFocus));
                sqlCommand.Parameters.AddWithValue("@accountTypeValue", HttpUtility.UrlDecode(accountType));

                sqlConnection.Open();
                //we're using a try/catch so that if the query errors out we can handle it gracefully
                //by closing the connection and moving on
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

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public void updateProfile(string email, string bio, string id)
        {
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlAddAcct = "UPDATE accounts SET email = @email, bio = @bio WHERE accountId=@accountIdValue";
            //"SELECT userName, password FROM accounts WHERE userName=@idValue and password=@passValue";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlAddAcct, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@email", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@bio", HttpUtility.UrlDecode(bio));
            sqlCommand.Parameters.AddWithValue("@accountIdValue", HttpUtility.UrlDecode(id));

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
        public Course[] GetCourses()
        {
            //GetCourses will display all courses to mentees when trying to join a new course

            //WE ONLY SHARE CLASSES WITH LOGGED IN USERS!
            if (Session["id"] != null)
            {
                DataTable sqlDt = new DataTable("courses");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select classId, mentorId, className, classDescription, classFocus from classes order by classId";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Courses.  Fill each course with
                //data from the rows, then dump them in a list.
                List<Course> courses = new List<Course>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    courses.Add(new Course
                    {
                        courseId = Convert.ToInt32(sqlDt.Rows[i]["classId"]),
                        mentorId = Convert.ToInt32(sqlDt.Rows[i]["mentorId"]),
                        courseName = sqlDt.Rows[i]["className"].ToString(),
                        courseDesc = sqlDt.Rows[i]["classDescription"].ToString(),
                        courseFocus = sqlDt.Rows[i]["classFocus"].ToString()
                    });
                }
                //convert the list of courses to an array and return!
                return courses.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Course[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public Message[] GetMessage()
        {
            //GetMesage will dispaly the message loged accound received. 

            //WE ONLY SHARE Message WITH LOGGED IN USERS!
            if (Session["id"] != null)
            {
                DataTable sqlDt = new DataTable("message");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "SELECT a.firstName, a.lastName, m.MessageID, m.SenderID, m.ReceiverID, m.DateAndTime, m.Message from accounts as a, message as m where a.accountId = m.SenderID and ReceiverID = @userid;";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@userid", HttpUtility.UrlDecode(Session["id"].ToString()));


                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Courses.  Fill each course with 
                //data from the rows, then dump them in a list.
                List<Message> Messages = new List<Message>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    Messages.Add(new Message
                    {
                        senderName = sqlDt.Rows[i]["firstName"].ToString() + " " + sqlDt.Rows[i]["lastName"].ToString(),
                        senderID = Convert.ToInt32(sqlDt.Rows[i]["SenderID"]),
                        receiverID = Convert.ToInt32(sqlDt.Rows[i]["ReceiverID"]),
                        msg = sqlDt.Rows[i]["message"].ToString(),
                        date = sqlDt.Rows[i]["DateAndTime"].ToString()
                    });
                }
                //convert the list of courses to an array and return!
                return Messages.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Message[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public Mentor[] GetMentor()
        {
            //GetMentor will dispaly all the mentors. 

            //WE ONLY SHARE mentors WITH LOGGED IN USERS!
            if (Session["id"] != null)
            {
                DataTable sqlDt = new DataTable("mentor");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "SELECT accountId, firstName, lastName, areaOfFocus from accounts where accountType = 'Mentor'";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);


                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Courses.  Fill each course with 
                //data from the rows, then dump them in a list.
                List<Mentor> Mentors = new List<Mentor>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    Mentors.Add(new Mentor
                    {

                        MentorName = sqlDt.Rows[i]["firstName"].ToString() + " " + sqlDt.Rows[i]["lastName"].ToString(),
                        MentorID = sqlDt.Rows[i]["accountId"].ToString(),
                        MentorArea = sqlDt.Rows[i]["areaOfFocus"].ToString()
                    });
                }
                //convert the list of courses to an array and return!
                return Mentors.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Mentor[0];
            }
        }


        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public void SendMessage(string targetID, string msg)
        {
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlAddAcct = "INSERT INTO message (SenderID, ReceiverID, Message) VALUES (@senderid, @targetID, @msg);";
            //"SELECT userName, password FROM accounts WHERE userName=@idValue and password=@passValue";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlAddAcct, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@targetID", HttpUtility.UrlDecode(targetID));
            sqlCommand.Parameters.AddWithValue("@msg", HttpUtility.UrlDecode(msg));
            sqlCommand.Parameters.AddWithValue("@senderid", HttpUtility.UrlDecode(Session["id"].ToString()));


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


    }
}
