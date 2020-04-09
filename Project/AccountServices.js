//place any global variables here! below

var accountData = JSON.parse(localStorage.getItem("account"))

function LogIn(email, pass) {
    document.getElementById("signbtn").style.display = "none";
    document.getElementById("spsignbtn").style.display = "block";
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
                console.log(msg.d)
                account = JSON.parse(msg.d);
                console.log(account)
            }
            if (account["email"] === email) {
                window.localStorage.setItem("account", msg.d);
                //alert("LogIn success");
                location.href = "./home.html"
            }
            else {
                document.getElementById("signbtn").style.display = "block";
                document.getElementById("spsignbtn").style.display = "none";
                alert("Username and/or Password is Incorrect");
                return false;
            }
        },
        error: function (e) {
            document.getElementById("signbtn").style.display = "block";
            document.getElementById("spsignbtn").style.display = "none";

            alert(msg.d);
        }
    });
    return true;
}


function SignUp(email, password, firstName, lastName, accountType) {
    var webMethod = "AccountServices.asmx/SignUp";
    var parameters = "{\"email\":\"" + encodeURI(email) +
        "\", \"password\":\"" + encodeURI(password) +
        "\",\"firstName\":\"" + encodeURI(firstName) +
        "\",\"lastName\":\"" + encodeURI(lastName) +
        "\",\"accountType\":\"" + encodeURI(accountType) + "\"}";

    $.ajax({
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
    });
}

//logs the user off both at the client and at the server

function LogOut() {
    var webMethod = "AccountServices.asmx/LogOut";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                //we logged off, so go back to logon page,
                //stop checking messages
                //and clear the chat panel
                alert("You have been signed out.");
                location.replace("./index.html");
            }
            else {
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

function MentorNav() {
    var mode = document.getElementById("mode")
    var mentorform = document.getElementById('mentorform')
    var menteeform = document.getElementById('menteeform')
    var adminform = document.getElementById('adminform')
    var videalluserform = document.getElementById('videalluserform')
    var profileform = document.getElementById('Example')

    DisplayData();
    if (accountData["isAdmin"] === "True") {
        LoadAccounts();
        mode.innerHTML = "Admin Mode"
        adminform.style.display = 'block';
        menteeform.style.display = 'none';
        mentorform.style.display = 'none';
        videalluserform.style.display = 'block';
        profileform.style.display = 'none';
    }
    else {
        if (accountData["accountType"] === "Mentee") {
            menteeform.style.display = 'block';
            mentorform.style.display = 'none';
            adminform.style.display = 'none';
            videalluserform.style.display = 'none';
            profileform.style.display = 'block';
        }
        else {
            menteeform.style.display = 'none';
            mentorform.style.display = 'block';
            adminform.style.display = 'none';
            videalluserform.style.display = 'none';
            profileform.style.display = 'block';
        }
    }
}

var accountsArray;
var currentId;
var accountData = JSON.parse(localStorage.getItem("account"))
function DisplayData() {
    
    console.log(accountData["email"]);
    document.getElementById("DisplayEmail").innerHTML = accountData["email"];
    document.getElementById("fullName").innerHTML = accountData["firstName"] + " " + accountData["lastName"];

    if (!accountData["bio"] == null || !accountData["bio"] == "") {
        document.getElementById("bioField").innerHTML = accountData["bio"];
        document.getElementById('Bio').value = accountData["bio"];
    }

    // profile form info display 
    var firstName = document.getElementById('first')
    firstName.innerHTML = accountData["firstName"]
    var lastName = document.getElementById('last')
    lastName.innerHTML = accountData["lastName"]
    var emailAddress = document.getElementById('inputEmail')
    emailAddress.value = accountData['email']
    
}

function LoadAccounts() {
    var webMethod = "AccountServices.asmx/GetAccounts";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                accountsArray = msg.d;
                $("#accountsBox").empty();
                // sort the id

                function compare(a, b) {
                    const IDA = a.accountID;
                    const IDB = b.accountID;
                    let comparison = 0;
                    if (IDA > IDB) {
                        comparison = 1;
                    } else if (IDA < IDB) {
                        comparison = -1;
                    }
                    return comparison;
                }
                accountsArray.sort(compare);
                for (var i = 0; i < accountsArray.length; i++) {
                    currentId = parseInt(accountsArray[i].accountID);
                    var acct;
                    acct = "<tr><th scope = \"row\">" + accountsArray[i].id + "</th ><td>" + accountsArray[i].email +
                        "</td><td>" + accountsArray[i].firstName + "</td><td>" + accountsArray[i].lastName + "</td><td>" +
                        accountsArray[i].areaOfFocus + "</td><td>" + "<button type=\"button\" class=\"btn btn-info\" data-toggle=\"modal\" data-target=\"#EditUser\">" + "Edit" + "</button>" + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-warning\" onclick='DeleteAccount(" + accountsArray[i].id + ")'>" + "Delete" + "</button>" + "</td></tr>"

                    $("#accountsBox").append(acct);
                }
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

function DeleteAccount(id) {
    var webMethod = "AccountServices.asmx/DeleteAccount";
    var parameters = "{\"id\":\"" + encodeURI(id) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert("Account Deleted");
            location.reload();
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

// This function can be used later, I think to make it work, we just need to change the parameters and add more function in there.

function EditAccount(email, password, firstName, lastName, areaOfFocus, accountType) {
    var webMethod = "AccountServices.asmx/UpdateAccount";
    var parameters = "{\"accountId\":\"" + encodeURI(currentId) +
        "\",\"email\":\"" + encodeURI(email) +
        "\",\"password\":\"" + encodeURI(password) +
        "\",\"firstName\":\"" + encodeURI(firstName) +
        "\",\"lastName\":\"" + encodeURI(lastName) +
        "\",\"areaOfFocus\":\"" + encodeURI(areaOfFocus) +
        "\",\"type\":\"" + encodeURI(accountType) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert("Account Updated.");
            location.reload();
        },
        error: function (e) {
            alert(e.msg);
        }
    });

}



// profile update
function update() {
    var email = document.getElementById("inputEmail").value
    var bio = document.getElementById("Bio").value
    var webMethod = "AccountServices.asmx/updateProfile";
    var parameters = "{\"email\":\"" + encodeURI(email) +
        "\", \"bio\":\"" + encodeURI(bio) +
        "\",\"id\":\"" + encodeURI(accountData['id']) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            alert("Profile Saved!");

            location.href = "home.html"
        },
        error: function (e) {
            alert("Failed to save your profile. Try again.");
        }
    });
}

function LoadCourses() {
    var webMethod = "AccountServices.asmx/GetCourses";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                accountsArray = msg.d;
                $("#coursesBox").empty();
                // sort the id

                function compare(a, b) {
                    const IDA = a.courseID;
                    const IDB = b.courseID;
                    let comparison = 0;
                    if (IDA > IDB) {
                        comparison = 1;
                    } else if (IDA < IDB) {
                        comparison = -1;
                    }
                    return comparison;
                }
                accountsArray.sort(compare);
                for (var i = 0; i < coursesArray.length; i++) {
                    currentId = parseInt(coursesArray[i].courseId);
                    var course;
                    course = "<tr><th scope = \"row\">" + coursesArray[i].courseId + "</th ><td>" + coursesArray[i].mentorId +
                        "</td><td>" + coursesArray[i].courseName + "</td><td>" + coursesArray[i].courseDesc + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-info\" data-toggle=\"modal\" data-target=\"#JoinCourse\">" + "Join" + "</button>" + "</td></tr>"

                    $("#coursesBox").append(course);
                }
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}
