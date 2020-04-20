//place any global variables here! below

var accountData = JSON.parse(localStorage.getItem("account"))

function LogIn(email, pass) {
    document.getElementById("signbtn").style.display = "none";
    document.getElementById("spsignbtn").style.display = "block";

    var webMethod = "AccountServices.asmx/LogIn";

    var parameters = "{\"email\":\"" + encodeURI(email) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {

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

                $('#ModalExample').modal('toggle');
                $('#alertModal').modal('toggle');
                document.getElementById('alertBody').innerHTML = "Username and/or Password is Incorrect";
                $("#btnConfirm").click(function () {
                    $('#ModalExample').modal('toggle');
                    $('#alertModal').modal('toggle');
                });
                $("#btnCloseModal").click(function () {
                    $('#ModalExample').modal('toggle');
                    $('#alertModal').modal('toggle');
                });
                return false;
            }
        },
        error: function (e) {
            document.getElementById("signbtn").style.display = "block";
            document.getElementById("spsignbtn").style.display = "none";

            ErrorAlert();
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
            if (msg.d === "Duplicate") {
                $('#Signupform').modal('hide');
                $('#alertModal').modal('show');
                $("#btnConfirm").click(function () {
                    $('#alertModal').modal('hide');
                    $('#Signupform').modal('show');
                });
                document.getElementById('alertBody').innerHTML = "An account with this email already exists. Please try again.";
            }
            else {
                $('#Signupform').modal('hide');
                $('#alertModal').modal('toggle');
                document.getElementById('alertBody').innerHTML = "Account created, you can now login.";
                $("#btnConfirm").click(function () {
                    $('#Signupform').modal('hide');
                    $('#ModalExample').modal('show');
                });
                $("#btnCloseModal").click(function () {
                    location.replace("./index.html");
                });
            }
         },
        error: function (e) {
            $('#Signupform').modal('hide');
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Failed to create an account. Try again.";
            $("#btnConfirm").click(function () {
                location.reload();
            });

            $("#btnCloseModal").click(function () {
                location.reload();
            });
        }
    });
}

function LogOut() {
    var webMethod = "AccountServices.asmx/LogOut";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                
                $('#alertModal').modal('toggle');
                document.getElementById('alertBody').innerHTML = "You have successfully logged out.";
                $("#btnConfirm").click(function () {
                    location.replace("./index.html");
                });
                $("#btnCloseModal").click(function () {
                    location.replace("./index.html");
                });
            }
            else {
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function MentorNav() {
    // nav section
    var mode = document.getElementById("mode")
    var mentorform = document.getElementById('mentorform')
    var menteeform = document.getElementById('menteeform')
    var adminform = document.getElementById('adminform')

    //table section(right section)
    var videalluserform = document.getElementById('videalluserform')
    var profileform = document.getElementById('Example')
    var viewallclassform = document.getElementById('viewallclassform')
    var mycalssesformMentor = document.getElementById('mycalssesformMentor')
    var findMentorform = document.getElementById('findMentorform')
    var findClassform = document.getElementById('findClassform')
    var messageForm = document.getElementById('messageForm')
    var mycalssesformMentee = document.getElementById('mycalssesformMentee')
    var classmentoredit = document.getElementById('classRoom')




    DisplayData();
    if (accountData["isAdmin"] === "True") {
        LoadAccounts();
        mode.innerHTML = "Admin Mode"
        adminform.style.display = 'block';
        menteeform.style.display = 'none';
        mentorform.style.display = 'none';
        
        // right
        videalluserform.style.display = 'block';
        viewallclassform.style.display = 'none';
        mycalssesformMentor.style.display = 'none';
        findMentorform.style.display = 'none';
        profileform.style.display = 'none';
        findClassform.style.display = 'none';
        messageForm.style.display = 'none';
        mycalssesformMentee.style.display = 'none';
        classmentoredit.style.display = 'none';

    }
    else {
        if (accountData["accountType"] === "Mentee") {
            LoadCoursesForMentee()
            menteeform.style.display = 'block';
            mentorform.style.display = 'none';
            adminform.style.display = 'none';
            // right
            videalluserform.style.display = 'none';
            viewallclassform.style.display = 'none';
            mycalssesformMentor.style.display = 'none';
            findMentorform.style.display = 'none';
            profileform.style.display = 'none';
            findClassform.style.display = 'none';
            messageForm.style.display = 'none';
            mycalssesformMentee.style.display = 'block';
            classmentoredit.style.display = 'none';
        }
        else {
            LoadCoursesForMentor(0);
            menteeform.style.display = 'none';
            mentorform.style.display = 'block';
            adminform.style.display = 'none';
            // right
            videalluserform.style.display = 'none';
            viewallclassform.style.display = 'none';
            mycalssesformMentor.style.display = 'block';
            findMentorform.style.display = 'none';
            profileform.style.display = 'none';
            findClassform.style.display = 'none';
            messageForm.style.display = 'none';
            mycalssesformMentee.style.display = 'none';
            classmentoredit.style.display = 'none';
        }
    }
}



function switchforms(formname, element) {
    console.log(formname)
    var formList = ["classRoom", "viewallclassform", "mycalssesformMentor", "findMentorform", "findClassform", "messageForm", "mycalssesformMentee", "Example", "videalluserform"]

    formList.forEach(switchs)
    //buttonActive.forEach(switch2)
    function switchs(forms) {
        
        if (forms === formname) {
            document.getElementById(forms).style.display = "block"
            if (forms != "classRoom") {
                switch2()
                element.classList.add("active");
            }
        }
        else {
            document.getElementById(forms).style.display = "none"
        }
    }

    function switch2() {
        var buttonActive = document.getElementsByClassName('activesign')
        for (var i = 0; i < buttonActive.length; i++) {
            buttonActive[i].classList.remove("active")
        }
        
    }
}

var accountsArray;
var currentId;
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
    var areaProfile = document.getElementById("areaProfile")
    areaProfile.value = accountData['areaOfFocus']

    if (accountData["photo"] === "") {
        $("#userPhoto").attr("src", "img/Example.png");
    }
    else {
        var photoName = accountData["photo"];
        $("#userPhoto").attr("src", "img/" + photoName);
    }
}

var editedAccount = new Array();
function LoadAccounts() {
    var webMethod = "AccountServices.asmx/GetAccounts";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
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
                        accountsArray[i].areaOfFocus + "</td><td>" + accountsArray[i].accountType + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-info\" data-toggle=\"modal\" data-target=\"#EditUser\" onclick='SetEstablishedDetails(" + JSON.stringify(accountsArray[i]) + ")'>" + "Edit" + "</button>" + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-warning\" onclick='DeleteAccount(" + accountsArray[i].id + ")'>" + "Delete" + "</button>" + "</td></tr>"

                    $("#accountsBox").append(acct);

                }
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function SetEstablishedDetails(account) {
    editedAccount = account;
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
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Account deleted.";
            $("#btnConfirm").click(function () {
                location.reload();
            });

            $("#btnCloseModal").click(function () {
                location.reload();
            });
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

// This function can be used later, I think to make it work, we just need to change the parameters and add more function in there.

function EditAccount(email, password, firstName, lastName, areaOfFocus, accountType) {
    event.preventDefault();
    console.log(editedAccount);

    if (email === "" || email === null) {
        email = editedAccount.email;
    }
    if (password === "" || password === null) {
        password = editedAccount.password;
    }
    if (firstName === "" || firstName === null) {
        firstName = editedAccount.firstName;
    }
    if (lastName === "" || lastName === null) {
        lastName = editedAccount.lastName;
    }
    if (areaOfFocus === "" || areaOfFocus === null) {
        areaOfFocus = editedAccount.areaOfFocus;
    }
    if (accountType === "" || accountType === null) {
        accountType = editedAccount.accountType;
    }

    var webMethod = "AccountServices.asmx/UpdateAccount";
    var parameters = "{\"accountId\":\"" + encodeURI(editedAccount.id) +
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
            $('#EditUser').modal('toggle');
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Account Updated.";
            $("#btnConfirm").click(function () {
                location.reload();
            });

            $("#btnCloseModal").click(function () {
                location.reload();
            });
            LoadAccounts();
            //document.getElementById("bioField").innerHTML = accountData["bio"];
        },
        error: function (e) {
            ErrorAlert();
        }
    });

}


function RetrieveUpdatedAccount() {
    currentId = parseInt(accountData["id"]);
    var webMethod = "AccountServices.asmx/RetrieveUpdatedAccount";
    var parameters = "{\"accountId\":\"" + encodeURI(currentId) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Profile saved.";
            $("#btnConfirm").click(function () {
                location.reload();
            });

            $("#btnCloseModal").click(function () {
                location.reload();
            });
        },
        error: function (e) {
            ErrorAlert();
        }
    });

}

// profile update

function update() {
    var email = document.getElementById("inputEmail").value
    var bio = document.getElementById("Bio").value
    var area = document.getElementById("areaProfile").value
    var webMethod = "AccountServices.asmx/updateProfile";
    var parameters = "{\"email\":\"" + encodeURI(email) +
        "\", \"bio\":\"" + encodeURI(bio) +
        "\",\"id\":\"" + encodeURI(accountData['id']) +
        "\", \"area\":\"" + encodeURI(area) +"\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            RetrieveUpdatedAccount();
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function updateClass(id) {
    var className = document.getElementById("CName").value
    var ClassDes = document.getElementById("inputDescription").value
    var classID = id
    var ClassArea = document.getElementById("areaClass").value
    var zoom = document.getElementById("ZLink").value
    var drive = document.getElementById("GLink").value

    var webMethod = "AccountServices.asmx/updateClass";
    var parameters = "{\"className\":\"" + encodeURI(className) +
        "\", \"ClassDes\":\"" + encodeURI(ClassDes) +
        "\",\"ClassArea\":\"" + encodeURI(ClassArea) +
        "\", \"classID\":\"" + encodeURI(classID) +
        "\",\"zoom\":\"" + encodeURI(zoom) +
        "\",\"drive\":\"" + encodeURI(drive) +"\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Class Saved!";
            $("#btnConfirm").click(function () {
                location.reload();
            });

            $("#btnCloseModal").click(function () {
                location.reload();
            });
        },
        error: function (e) {
            ErrorAlert();
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
                coursesArray = msg.d;

                $("#classDisplay").empty();

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
                coursesArray.sort(compare);
                for (var i = 0; i < coursesArray.length; i++) {
                    currentId = parseInt(coursesArray[i].courseId);
                    var course;
                    course = "<tr><th scope = \"row\">" + coursesArray[i].courseId + "</th ><td>" + coursesArray[i].mentorName +
                    
                        "</td><td>" + coursesArray[i].courseName + "</td><td>" + coursesArray[i].courseDesc + "</td><td>" + coursesArray[i].courseFocus + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-info\" onclick = \"JoinCourse(" + coursesArray[i].courseId + ")" + "\">" + "Join" + "</button>" + "</td></tr>"
                    $("#classDisplay").append(course);
                    $("#allClassDisplay").append(course);
                }
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function LoadCoursesDetial(classNumber) {
    var webMethod = "AccountServices.asmx/GetCourseForMentor";
    var parameters = "{\"classid\":\"" + encodeURI(classNumber) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                coursesArray = msg.d;

                document.getElementById("CName").value = coursesArray[0].courseName;
                document.getElementById("inputDescription").innerHTML = coursesArray[0].courseDesc;
                document.getElementById("areaClass1").value = coursesArray[0].courseFocus;
                document.getElementById("ZLink").value = coursesArray[0].zoom;
                document.getElementById("GLink").value = coursesArray[0].drive;
                document.getElementById("saveclas").setAttribute("onclick", "updateClass(" + coursesArray[0].courseId + ")")
                document.getElementById("delClass").setAttribute("onclick", "DeleteClass(" + coursesArray[0].courseId + ")")
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function DeleteClass(id) {
    if (confirm("Do You Want To Delete This Class?")) {
        var webMethod = "AccountServices.asmx/DelClass";
        var parameters = "{\"courseId\":\"" + encodeURI(id) + "\"}";
        $.ajax({
            type: "POST",
            url: webMethod,
            data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                $('#alertModal').modal('toggle');
                document.getElementById('alertBody').innerHTML = "Class deleted.";
                $("#btnConfirm").click(function () {
                    location.reload();
                });

                $("#btnCloseModal").click(function () {
                    location.reload();
                });
            },
            error: function (e) {
                ErrorAlert();
            }
        });
    }
}

function LoadCoursesLinks(classNumber) {
    var webMethod = "AccountServices.asmx/GetLinks";
    var parameters = "{\"id\":\"" + encodeURI(classNumber) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                LinkArray = msg.d;
                document.getElementById("zoomlink").setAttribute("href", LinkArray[0])
                document.getElementById("drivelink").setAttribute("href", LinkArray[1])
            }
            if (LinkArray[0] === "") {
                document.getElementById("zoomlink").setAttribute("onclick", "worrning()")
                document.getElementById("zoomlink").setAttribute("href", "#")
                document.getElementById("zoomlink").setAttribute("target", "_self")

            }
            if (LinkArray[1] === "") {
                document.getElementById("drivelink").setAttribute("onclick", "worrning()")
                document.getElementById("drivelink").setAttribute("href", "#")
                document.getElementById("drivelink").setAttribute("target", "_blank")
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function worrning() {
    alert("Selected Link Does not Exist. Please Contact Your Mentor.")
}

function LoadCoursesForMentor(id) {
    console.log("running")
    var webMethod = "AccountServices.asmx/GetCourseForMentor";
    var parameters = "{\"classid\":\"" + encodeURI(id)+ "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            coursesArray = msg.d;
            if (msg.d.length > 0) {

                $("#mycalssesformMentorDisplay").empty();
                var course;
                for (var i = 0; i < coursesArray.length; i++) {
                    currentId = parseInt(coursesArray[i].courseId);
                    
                    var num = i + 1;
                    course = "<tr><th scope = \"row\">" + num + "</th ><td>" + coursesArray[i].courseName + "</td><td>" + coursesArray[i].courseDesc + "</td><td>" + coursesArray[i].courseFocus + "</td><td>" + 
                        "<button type=\"button\" class=\"btn btn-warning\" data-toggle=\"modal\" data-target=\"#ShowMentees\" onclick = \"LoadMentee(" + coursesArray[i].courseId + ")\">" + "Mentees" + "</button>" + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-success \" data-toggle=\"modal\" data-target=\"#links\" onclick = \"LoadCoursesLinks(" + coursesArray[i].courseId + ")" + "\">" + "Zoom/Drive" + "</button>" + "</td><td>"+
                        "<button type=\"button\" class=\"btn btn-info \" onclick = \"switchforms('classRoom', this); LoadCoursesDetial(" + coursesArray[i].courseId + ")"+ "\">" + "Edit" + "</button>" + "</td></tr>"
                    $("#mycalssesformMentorDisplay").append(course);
                }
            }
            else {
                document.getElementById("ClassTableMentor").style.display = "none";
                course = "<p class=\"text-center font-weight-bold\" style=\"font-size:20px;\">You Don't Have A Class. Please Start A New Class!</p>"
                $("#coursePlace").append(course);
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}



function LoadMessage() {
    var webMethod = "AccountServices.asmx/GetMessage";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                messageArray = msg.d;
                $("#messageDisplay").empty();

                for (var i = 0; i < messageArray.length; i++) {
                    var message;
                    message = "<tr><th scope = \"row\">" + messageArray[i].senderName + "</th ><td>" + messageArray[i].msg +
                        "</td><td>" + messageArray[i].date + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-info\" data-toggle=\"modal\" data-target=\"#SendMessage\" onclick = \"GetSender(" + messageArray[i].senderID + ", '" + messageArray[i].senderName + "', '" + messageArray[i].msg + "')\">" + "Reply" + "</button>" + "</td></tr>"
                    $("#messageDisplay").append(message);
                }
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}




function LoadMentor() {
    var webMethod = "AccountServices.asmx/GetMentor";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                console.log(msg.d);
                mentorArray = msg.d;
                $("#findMentorDisplay").empty();

                for (var i = 0; i < mentorArray.length; i++) {
                    var mentors;
                    mentors = "<tr><th scope = \"row\">" + mentorArray[i].MentorName + "</th ><td>" + mentorArray[i].MentorArea +
                        "</td><td>" + "<button type=\"button\" class=\"btn btn-info\" data-toggle=\"modal\" data-target=\"#SendMessage\" onclick = \"GetReceiver(" + mentorArray[i].MentorID + ", '" +  mentorArray[i].MentorName + "')\">" + "Send Message" + "</button>" + "</td></tr>"
                    $("#findMentorDisplay").append(mentors);
                }
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}


function LoadMentee(id) {
    var webMethod = "AccountServices.asmx/GetMentee";
    var parameters = "{\"ClassId\":\"" + encodeURI(id) + "\"}";
    $("#MenteesDisplay").empty();
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        data: parameters,
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            if (msg.d.length > 0) {
                document.getElementById("menteetboday").style.display = "block"
                document.getElementById("nomentorMSG").style.display = "none"
                console.log(msg.d);
                menteeArray = msg.d;

                for (var i = 0; i < menteeArray.length; i++) {
                    var mentors;
                    mentors = "<tr><th scope = \"row\">" + menteeArray[i].userId + "</th ><td>" + menteeArray[i].firstName +
                        "</td><td>" + "<button type=\"button\"  class=\"btn btn-info \" data-toggle=\"modal\" data-target=\"#SendMessage\" onclick = \"GetReceiver(" + menteeArray[i].userId + ", '" + menteeArray[i].firstName + "')\">" + "Send Message" + "</button>" + "</td></tr>"
                    $("#MenteesDisplay").append(mentors);
                }
            }
            else {
                document.getElementById("menteetboday").style.display = "none"
                document.getElementById("nomentorMSG").style.display = "block"
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchbox");
    filter = input.value.toUpperCase();
    table = document.getElementById("courseTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


var receiver;
function GetReceiver(targetID, name) {
    document.getElementById("ShowMessagepop").click();
    var head = document.getElementById("MSGhead")
    var lableName = document.getElementById("receiverName")
    head.innerHTML = "Send Message"
    lableName.innerHTML = "Message to " + name
    receiver = targetID;
    console.log(receiver)
}


function GetSender(senderID, senderName, senderMessage) {
    
    var head = document.getElementById("MSGhead")
    var lableName = document.getElementById("receiverName")
    var replyMessage = document.getElementById("displayReplyTo")
    head.innerHTML = "Reply to Message"
    replyMessage.innerHTML = "'" + senderMessage + "'"
    lableName.innerHTML = "Reply to " + senderName
    receiver = senderID;
}

function SendMessage(msg) {
    var webMethod = "AccountServices.asmx/SendMessage";
    var parameters = "{\"targetID\":\"" + encodeURI(receiver) +
        "\", \"msg\":\"" + encodeURI(msg) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            $("#SendMessage").modal("hide");
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Message Sent!";
            $("#btnConfirm").click(function () {
                location.reload();
            });
            $("#btnCloseModal").click(function () {
                location.reload();
            });

        },
        error: function (e) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Failed to Send the Message. Try again.";
        }
    });
}

function StartNewClass(className, classDescription, classFocus, zoomLink, GoogleDrive) {
    var webMethod = "AccountServices.asmx/StartNewClass";
    console.log(classFocus)
    var parameters = "{\"className\":\"" + encodeURI(className) +
        "\",\"classDescription\":\"" + encodeURI(classDescription) +
        "\",\"classFocus\":\"" + encodeURI(classFocus) +
        "\",\"zoomLink\":\"" + encodeURI(zoomLink) +
        "\", \"GoogleDrive\":\"" + encodeURI(GoogleDrive) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Class Created! View The Class In My Classes Tab!";
            $("#btnConfirm").click(function () {
                location.reload();
            });
            $("#btnCloseModal").click(function () {
                location.reload();
            });
        },
        error: function (e) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Failed to Create a class. Try again.";

        }
    });

}

function JoinCourse(courseId) {
    var webMethod = "AccountServices.asmx/AddToCourse";

    var parameters = "{\"courseId\":\"" + encodeURI(courseId) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (msg) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Class Added! View The Class In My Classes Tab!";
        },
        error: function (e) {
            $('#alertModal').modal('toggle');
            document.getElementById('alertBody').innerHTML = "Failed to join class. Try again.";
        }
    });
}

function LoadCoursesForMentee() {
    console.log("running")
    var webMethod = "AccountServices.asmx/GetCourseForMentee";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            coursesArray = msg.d;
            if (msg.d.length > 0) {

                $("#classesMentee").empty();
                var course;
                for (var i = 0; i < coursesArray.length; i++) {
                    currentId = parseInt(coursesArray[i].courseId);
                    var num = i + 1;
                    course = "<tr><th scope = \"row\">" + num + "</th ><td>" + coursesArray[i].courseName + "</td><td>" + coursesArray[i].courseDesc + "</td><td>" + coursesArray[i].courseFocus + "</td><td>" +
                        "<button type=\"button\" class=\"btn btn-success \" data-toggle=\"modal\" data-target=\"#links\" onclick = \"LoadCoursesLinks(" + coursesArray[i].courseId + ")" + "\">" + "Zoom/Drive" + "</button>" + "</td><tr>"
                    $("#classesMentee").append(course);
                }
            }
            else {
                document.getElementById("menteeCoursePlace").style.display = "none";
                course = "<p class=\"text-center font-weight-bold\" style=\"font-size:20px;\">You Don't Have A Class. Please Join A New Class!</p>"
                $("#mycalssesformMentee").append(course);
            }
        },
        error: function (e) {
            ErrorAlert();
        }
    });
}

function ErrorAlert() {
    $('#alertModal').modal('toggle');
    document.getElementById('alertBody').innerHTML = "Something went wrong.";
    $("#btnConfirm").click(function () {
        location.replace("./index.html");
    });
    $("#btnCloseModal").click(function () {
        location.replace("./index.html");
    });
}
