//place any global variables here! below

function LogIn(email, pass) {
    //the url of the webservice we will be talking to
    var webMethod = "AccountServices.asmx/LogIn";

    var parameters = "{\"email\":\"" + encodeURI(email) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

    //jQuery ajax method
    $.ajax({
        //post is more secure than get, and allows
        //us to send big data if we want.  really just
        //depends on the way the service you're talking to is set up, though

        type: "POST",
        //the url is set to the string we created above
        url: webMethod,
        //same with the data
        data: parameters,
        //these next two key/value pairs say we intend to talk in JSON format

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //jQuery sends the data and asynchronously waits for a response.  when it
        //gets a rmesponse, it calls the function apped to the success key here
        success: function (msg) {
            //the server response is in the msg object passed in to the function here

            if (msg.d === "") {
                account = { "email": "none" };
            }
            else {
                account = JSON.parse(msg.d);


            }
            if (account["email"] === email) {
                window.localStorage.setItem("account", msg.d);
                
                alert("LogIn success");
                location.href = "./home.html"
            }
            else {
                //document.getElementById("signbtn").style.display = "block";
                //document.getElementById("spsignbtn").style.display = "none";
                alert("Username and/or Password Is Incorrect");
                return false;
            }
            
        },
        error: function (e) {
            //document.getElementById("signbtn").style.display = "block";
            //document.getElementById("spsignbtn").style.display = "none";

            alert(msg.d);
        }
    });
    return true;
}


function SignUp(email, password, firstName, lastName) {
    var webMethod = "AccountServices.asmx/SignUp";
    var parameters = "{\"email\":\"" + encodeURI(email) + "\", \"password\":\"" + encodeURI(password) + "\",\"firstName\":\"" + encodeURI(firstName) + "\",\"lastName\":\"" + encodeURI(lastName) + "\"}";


    type: "POST",
    url: webMethod,
    data: parameters,
    contentType: "application/json; charset=utf-8",
    dataType: "json",

   success: function (msg) {
        alert("Account created, you can now login.");

        location.href = "index.html"
         },
    error: function (e) {
    alert("Failed to create an account. Try again.");
    }
}