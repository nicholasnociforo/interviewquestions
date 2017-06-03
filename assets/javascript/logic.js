// Initialize Firebase
var config = {
    apiKey: "AIzaSyD15_MQCpSIeLmOaujqowZkF-djMIi0UlY",
    authDomain: "interviewquestions-ca991.firebaseapp.com",
    databaseURL: "https://interviewquestions-ca991.firebaseio.com",
    projectId: "interviewquestions-ca991",
    storageBucket: "interviewquestions-ca991.appspot.com",
    messagingSenderId: "139540148275"
};
firebase.initializeApp(config);

// START COPY OF LOGIC.JS FILE
// ******************************************************************
$(document).ready(function() {

    console.log(window.location.href);
    // call initial start screen
    if (window.location.href.match('index.html') != null) {
        console.log("index.html ready");

        initialScreen();
    };
    if (window.location.href.match('index3.html') != null) {
        console.log("index3.html ready");
        interviewQuestions.displayQuestion();

    };
});

// on mouseclick the new HTML screen is generated
$('body').on('click', '.btn-block', function(event){

    // $('.mainArea').hide();
    generateSecondHTML();

});
    

// function for creation of initial start screen
function initialScreen() {
    startScreen = "<div class='container'><form class='form-signin'>"
    startScreen += "<div class='welcome'>Welcome!</div>"
    startScreen += "<h4 class='form-signin-heading'>Please sign in</h4>"
    startScreen += "<label for='inputEmail' class='sr-only'>Email address</label>"
    startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='Email address' required autofocus>"
    startScreen += "<label for='inputPassword' class='sr-only'>Password</label>"
    startScreen += "<input type='password' id='inputPassword' class='form-control' placeholder='Password'>"
    startScreen += "<div class='checkbox'><label><input type='checkbox' value='remember-me'> Remember me</label></div>"
    startScreen += "<button class='btn btn-lg btn-primary btn-block' type='submit'>Sign in</button></form></div>";
    $('.mainArea').html(startScreen);

}

// function for creation of second page with subject options
function generateSecondHTML() {

  
    window.location.href = "index2.html";
    
    // $('.jumbotron').hide();

}

$('body').on('click', '.selector', function(event){
    console.log("click subject");
    if(interviewQuestions.processSubject()){
        generateThirdHTML();

    }

    // $('.mainArea').hide();

  });

function generateThirdHTML() {

    window.location.href = "index3.html";
    console.log("switch to index3");

    // $('.jumbotron').hide();

}


var angleStart = -360;

// jquery rotate animation
function rotate(li,d) {
    $({d:angleStart}).animate({d:d}, {
        step: function(now) {
            $(li)
               .css({ transform: 'rotate('+now+'deg)' })
               .find('label')
                  .css({ transform: 'rotate('+(-now)+'deg)' });
        }, duration: 0
    });
}

// show / hide the options
function toggleOptions(s) {
    $(s).toggleClass('open');
    var li = $(s).find('li');
    var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
    for(var i=0; i<li.length; i++) {
        var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
        $(s).hasClass('open') ? rotate(li[i],d) : rotate(li[i],angleStart);
    }
}

$('.selector button').click(function(e) {
    toggleOptions($(this).parent());
});

setTimeout(function() { toggleOptions('.selector'); }, 100);


//Setup linkedIn login
var liLogin = function() { // Setup an event listener to make an API call once auth is complete
    IN.UI.Authorize().params({"scope":["r_basicprofile", "r_emailaddress"]}).place();
    IN.Event.on(IN, 'auth', getProfileData);
}

var getProfileData = function() { // Use the API call wrapper to request the member's basic profile data
    IN.API.Profile("me").fields("id,firstName,lastName,email-address,picture-urls::(original),public-profile-url,location:(name)").result(function (me) {
        var profile = me.values[0];
        var id = profile.id;
        var firstName = profile.firstName;
        var lastName = profile.lastName;
        var emailAddress = profile.emailAddress;
        var pictureUrl = profile.pictureUrls.values[0];
        var profileUrl = profile.publicProfileUrl;
        var country = profile.location.name;

        /*var user = {
          emailId: emailAddress,
          profile: {
            fName: firstName,
            lName: lastName,
            pUrl: profileUrl
          }
        };*/

    });
}
// Handle the successful return from the API call
function onSuccess(data) {
    console.log(data);
}

// Handle an error response from the API call
function onError(error) {
    console.log(error);
}

//function to logout from the session
var liLogout = function() {
    IN.User.logout(callbackFunction);
    }

function callbackFunction() {
    alert("You have successfully logged out.")
    }


var questionArray = [];
var intervalId;

var myData;

var interviewQuestions = {

    // Results
    correctCount: 0,
    incorrectCount: 0,
    unansweredCount: 0,

    // Timer initialization
    timer: 0,
    maxTime: 30,

    // Question var
    currentQuestion: 0,
    userAnswers: [],
    maxQuestions: 10,


    // initialScreen: function() {
    //     startScreen = "<div class='container'><form class='form-signin'>";
    //     startScreen += "<h2 class='form-signin-heading'>Please sign in</h2>";
    //     startScreen += "<label for='firstName' class='sr-only'>First Name</label>";
    //     startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='First Name' required autofocus>";
    //     startScreen += "<label for='lastName' class='sr-only'>Last Name</label>";
    //     startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='Last Name' required autofocus>";
    //     startScreen += "<label for='inputEmail' class='sr-only'>Email address</label>";
    //     startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='Email address' required autofocus>";
    //     startScreen += "<label for='inputPassword' class='sr-only'>Password</label>";
    //     startScreen += "<input type='password' id='inputPassword' class='form-control' placeholder='Password'>";
    //     startScreen += "<div class='checkbox'>";
    //     startScreen += "<label><input type='checkbox' value='remember-me'> Remember me</label>";
    //     startScreen += "</div>";
    //     startScreen += "<button id='signin' class='btn btn-lg btn-primary btn-block' type='submit'>Sign in</button></form></div>";
    //     $(".mainArea").html(startScreen);

    // },
    // displaySubject: function() {
    //     newHTML = "<p>Please choose a subject:</p>";

    //     newHTML += "<div class='btn-group-vertical' role='subject'>";

    //     newHTML += "<button type='button' class='btn btn-default btn-lg subjectBtn' name='subject' id='html' value='html.json'>HTML</button>";
    //     console.log (newHTML);
    //     newHTML += "<button type='button' class='btn btn-default btn-lg subjectBtn' name='subject' id='css' value='css.json'>CSS</button>";
    //     newHTML += "<button type='button' class='btn btn-default btn-lg subjectBtn' name='subject' id='javascript' value='javascript.json'>Javascript</button>";
    //     newHTML += "<button type='button' class='btn btn-default btn-lg subjectBtn' name='subject' id='jQuery' value='jquery.json'>JQuery</button>";
    //     newHTML += "</div>";

    //     // newHTML += "<label><input type='radio' name='subject' id='html' value='html.json'>HTML</label><br>";
    //     // newHTML += "<label><input type='radio' name='subject' id='css' value='css.json'>CSS</label><br>";
    //     // newHTML += "<label><input type='radio' name='subject' id='javascript' value='javascript.json'>Javascript</label><br>";
    //     // newHTML += "<label><input type='radio' name='subject' id='jQuery' value='jquery.json'>JQuery</label><br>";

    //     newHTML += "<button id='submitSubject' class='btn btn-lg btn-primary btn-block' type='submit'>Submit</button></form>";
    //     $(".mainArea").html(newHTML);

    // },

    processSubject: function() {

        var temp = $('input[type="checkbox"]:checked').val();
        // var temp = $(".subjectBtn.active").val();
        console.log(temp);

        if(typeof temp == 'undefined') {
            console.log("temp is undefined");
            return false;
        }
        var queryURL = './assets/json/' + temp;
        sessionStorage.setItem('queryURL', queryURL);
        console.log(queryURL);
        return true;
    },
    displayQuestion: function() {
        // $(".mainArea2").empty();
        // console.log(myData);
        // console.log(questionNum);
        // var questionLine = $("<p>");
        // questionLine.text(myData[questionNum].question);
        // $(".mainArea2").append(questionLine);
        // console.log(myData[questionNum].question);

        // $(".mainArea2").append("<div class='btn-group-vertical' role='question'>");

        // for(var i = 0; i < myData[questionNum].choices.length; i++) {


        //     var answerChoice = "<button type='button' class='btn btn-default btn-lg addressBtn' ";
        //     answerChoice += "value='" + parseInt(i + 1) + "'";  // value '0' is unanswered
        //     answerChoice += " name='question" + parseInt(questionNum) + "'>";
        //     answerChoice += myData[questionNum].choices[i];
        //     answerChoice += "</button>";
        //     $(".mainArea2").append(answerChoice);
        //     console.log(answerChoice);
        //     console.log(myData[questionNum].choices[i]);
        // }
        // $(".mainArea2").append("</div>");

        // if(questionNum === "0") {
        //     $(".mainArea2").append("<button id='prevButton' class='btn btn-sm btn-primary btn-block'>Prev</button>");
        // }
        // if(questionNum === myData.length) {
        //     $(".mainArea2").append("<button id='nextButton' class='btn btn-sm btn-primary btn-block'>Next</button>");
        // }

        queryURL = sessionStorage.getItem('queryURL');
        console.log(queryURL);
        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "json",
            success: function(result) {
                myData = result.interview;

                // $(".mainArea2").empty();
                // console.log(myData);
                // console.log(interviewQuestions.currentQuestion);
                // var questionLine = $("<p>");
                // questionLine.text(myData[interviewQuestions.currentQuestion].question);
                // $(".mainArea2").append(questionLine);
                // console.log(myData[interviewQuestions.currentQuestion].question);

                // $(".mainArea2").append("<div class='btn-group-vertical' role='question'>");

                // for(var i = 0; i < myData[interviewQuestions.currentQuestion].choices.length; i++) {


                //     var answerChoice = "<button type='button' class='btn btn-default btn-lg addressBtn' ";
                //     answerChoice += "value='" + parseInt(i + 1) + "'";  // value '0' is unanswered
                //     answerChoice += " name='question" + parseInt(interviewQuestions.currentQuestion) + "'>";
                //     answerChoice += myData[interviewQuestions.currentQuestion].choices[i];
                //     answerChoice += "</button>";
                //     $(".mainArea2").append(answerChoice);
                //     console.log(answerChoice);
                //     console.log(myData[interviewQuestions.currentQuestion].choices[i]);
                // }
                // $(".mainArea2").append("</div>");

                // if(interviewQuestions.currentQuestion === "0") {
                //     $(".mainArea2").append("<button id='prevButton' class='btn btn-sm btn-primary btn-block'>Prev</button>");
                // }
                // if(interviewQuestions.currentQuestion === myData.length) {
                //     $(".mainArea2").append("<button id='nextButton' class='btn btn-sm btn-primary btn-block'>Next</button>");
                // }

                $(".mainArea").empty();
                console.log(result.interview.length);
                for(var j = 0; j < result.interview.length; j++) {

                    var questionLine = $("<p>");
                    questionLine.text(result.interview[j].question);
                    $(".mainArea").append(questionLine);
                    // console.log(result.interview[j].question);

                    for(var i = 0; i < result.interview[j].choices.length; i++) {

                        var answerChoice = $("<input>");
                        answerChoice.attr("value", i + 1);  // value '0' is unanswered
                        answerChoice.attr("type","radio");
                        answerChoice.attr("name","question" + j);
                        answerChoice.attr("class", "radioButtons");
                        $(".mainArea").append(answerChoice);
                        $(".mainArea").append("<b> " + result.interview[j].choices[i] + "</b><br>");

                        // console.log(result.interview[j].choices[i]);
                    }
                }
                $(".mainArea").append("<button id='doneButton' class='btn btn-lg btn-primary btn-block'>Done</button>");

            },
            error: function(result){
                console.log("Unable to get data");
            }
            
        });
    },
    displayResults: function() {

        // clearInterval(intervalId);
        // $("#timer").text("");
        console.log(myData);

        console.log(myData.length);

        for(i = 0; i < myData.length; i++) {

            var name = "question" + i;
            var temp = $('input[name="' + name + '"]:checked').val();
            console.log(temp);
            console.log(myData[i].correct);

            if(isNaN(temp)) {
                interviewQuestions.unansweredCount++;
            }
            else if (temp === myData[i].correct) {
                interviewQuestions.correctCount++;
            }
            else {
                interviewQuestions.incorrectCount++;
            }
        }

        $(".mainArea").empty();
        console.log("done");

        $(".mainArea").append("<h2>All Done!</h2>");
        $(".mainArea").append("<h2>Correct Answers: " + interviewQuestions.correctCount + "</h2>");
        $(".mainArea").append("<h2>Incorrect Answers: " + interviewQuestions.incorrectCount + "</h2>");
        $(".mainArea").append("<h2>Unanswered: " + interviewQuestions.unansweredCount + "</h2>");
        $(".mainArea").append("<button id='resetButton' class='btn btn-lg btn-primary btn-block'>Reset</button>");

    }

    // decrement: function() {

    //     timer -= 1;

    //     $("#timer").text("Time Remaining:  " + timer + " secs");

    //     if (timer === 0) {
    //       clearInterval(intervalId);
    //       interviewQuestions.displayResults();
    //     }
    // }


}




// $("body").on("click", "#doneButton", function(event){

//     event.preventDefault();

//     interviewQuestions.displayResults();


// }); 

// $("body").on("click", "#resetButton", function(event){

//     event.preventDefault();

//     interviewQuestions.unansweredCount = 0;
//     interviewQuestions.correctCount = 0;
//     interviewQuestions.incorrectCount = 0;

//     interviewQuestions.displaySubject();


// }); 

$("body").on("click", ".subjectBtn", function(event){

    $('.btn-group-vertical > .btn').removeClass('active');
    $(this).addClass('active');
    console.log("subject button selected");

});

$("body").on("click", ".addressBtn", function(event){

    $('.btn-group-vertical > .btn').removeClass('active');
    $(this).addClass('active');
    console.log("address button selected");

});

$("body").on("click", ".prevButton", function(event){

    interviewQuestions.currentQuestion--;
    interviewQuestions.displayQuestion(interviewQuestions.currentQuestion);
    console.log("prev button pressed");

});

$("body").on("click", ".nextButton", function(event){

    interviewQuestions.currentQuestion++;
    interviewQuestions.displayQuestion(interviewQuestions.currentQuestion);
    console.log("next button pressed");

});