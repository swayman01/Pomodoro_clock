/* TODO
Brighten keys that are active and disable ones that aren't
  stopped: Start Session and Start Break active
  Session: Stop and Pause Active
  Break: Stop and Pause Active
  Pause Session: Resume Session and Stop Active
  Pause Break: Resume Break and Stop Active
*/

/* Save last time on stop
*/

/* Put time on tab
*/
var calcwidth = 500;
var state = "stopped"; //other options include paused, session, break
var substate = "notcycling"; //used to resume on pause
var stopclock = true;
var val;
var distance;
var pauseddistance;
var x;
if ($(window).width() < 500) calcwidth = $(window).width();
$(".calc").css("max-width:", calcwidth);

function nextstate() {
    console.log("nextstate - state: " + state);
    clicked = false;
    if (state === "break") {
        state = "session";
        stopclock = false;
        var valsession = parseInt(document.getElementById("sessiontime").value);
        document.getElementById("display").innerHTML = "DO NOT DISTURB";
        document.getElementById("display2").innerHTML = "Focused Work In Progress";
        if (substate === "notcycling") {
            countdown(valsession);
            return;
        }
        else {
            setTimeout(function() {
                countdown(valsession);
            }, 3000);
            return;
        }
    }
    if (state === "session") {
        state = "break";
        stopclock = false;
        var valbreak = parseInt(document.getElementById("breaktime").value);
        document.getElementById("display").innerHTML = "Time to Recharge";
        document.getElementById("display2").innerHTML = "<br>";
        if (substate === "cycle") {
            setTimeout(function() {
                document.getElementById("display").innerHTML = "Recharging";
                document.getElementById("display2").innerHTML = "<br>";
                countdown(valbreak);
            }, 3000);
            return;
        }
        else {
            substate = "cycle";
            document.getElementById("display").innerHTML = "Recharging";
            document.getElementById("display2").innerHTML = "<br>";
            countdown(valbreak);
            return;
        }
    }
}

function countdown() {
    val = arguments[0];
    var countDownDate = new Date().getTime() + 1000 * 60 * val;
    var now = new Date().getTime();
    distance = countDownDate - now;
    if ((state === "session") && ((distance / (60 * 1000) / val > .1) && (distance > (60 * 1000)))) {
        $(".calc").css("background-color", "#145214");
    }
    if ((state === "break") && (distance > (30 * 1000))) {
        $(".calc").css("background-color", "#90caf9");
    }
    //TODO - use inherit from .calc
    $("h1").css("color", "gray");
    $(".label").css("color", "gray");
    $(".blabel").css("color", "gray");
    $("#session").css("color", "gray");
    $("#sessiontime").css("color", "gray");
    $("#break").css("color", "gray");
    $("#breaktime").css("color", "gray");
    $("#stop").css("color", "gray");
    $("#pause").css("color", "gray");
    // Update the count down every 1 second
    x = setInterval(function() {
        now = new Date().getTime();
        distance = countDownDate - now;
        if ((distance / (60 * 1000) / val <= .1) || (distance <= (60 * 1000))) {
            if (state === "session") {
                $(".calc").css("background-color", "#ECB028");
                //TODO Remove with inherit .calc
                $("h1").css("color", "gray");
                $(".blabel").css("color", "gray");
                $("#session").css("color", "gray");
                $("#break").css("color", "gray");
                $("#stop").css("color", "gray");
                $("#pause").css("color", "gray");
            }
        }
        if (distance <= (30 * 1000)) {
            if (state === "session") {;
                $(".calc").css("background-color", "#FE5B35");
            }
            if (state === "break") {
                $(".calc").css("background-color", "#FD7D01");
            }
        }
        if (distance < 0) {
            console.log("x: " + x + " state: " + state);
            clearInterval(x);
            if (state === "paused") {
                document.getElementById("display").innerHTML = "Clock Paused";
                document.getElementById("display2").innerHTML = "<br>";
                distance = pauseddistance;
                console.log("pauseddistance: " + pauseddistance);
                document.getElementById("demo").innerHTML = Math.floor(pauseddistance % (60)) + "m " +
                    Math.floor((pauseddistance - Math.floor(pauseddistance % (60))) * 60) + "s ";
                stopclock = true;
                return;
            }
            if ((state === "session") || (state === "break")) {
                if (state === "session") {
                    document.getElementById("owl").play();
                    document.getElementById("demo").innerHTML = "(Owl Hooting)";
                }
                if (state === "break") {
                    document.getElementById("rooster").play();
                    document.getElementById("demo").innerHTML = "(Rooster Crowing)";
                }
            }
            setTimeout(function() {
                nextstate();
            }, 12);
            return;
        }
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        if (state !== "paused")
            if (minutes > 1) {
                if (seconds < 31)
                    document.getElementById("demo").innerHTML = minutes + " minutes left";
                if (seconds > 30) document.getElementById("demo").innerHTML = minutes + 1 + " minutes left";
            }
        if (minutes === 1) {
            if (seconds > 30) document.getElementById("demo").innerHTML = minutes + 1 + " minutes left";
            if (seconds < 31) document.getElementById("demo").innerHTML = minutes + " minute left ";
        }
        if (minutes < 1) {
            document.getElementById("demo").innerHTML = seconds + " seconds left";
        }

        if (stopclock) {
            if (state === "stopped") {
                document.getElementById("display").innerHTML = "Clock Stopped";
                document.getElementById("display2").innerHTML = "<br>";
                document.getElementById("demo").innerHTML = "<br>";
                $(".calc").css("background-color", "black");
                $(".label").css("color", "white");
                $("h1").css("color", "white");
                document.getElementById("session").innerHTML = "Start Session";
                document.getElementById("break").innerHTML = "Start Break";
            }
            //           distance = -1;
            console.log("x: " + x + " state: " + state);
            clearInterval(x);
        }
    }, 1000);
}

$('.qty').click(function() {
    var $t = $(this),
        $in = $('input[name="' + $t.data('field') + '"]'),
        val = parseInt($in.val()),
        valMax = 100,
        valMin = 5;

    // Check if a number is in the field first
    if (isNaN(val) || val < valMin) {
        // If field value is NOT a number, or
        // if field value is less than minimum,
        // ...set value to 0 and exit function
        $in.val(valMin);
        return false;
    }
    else if (val > valMax) {
        // If field value exceeds maximum,
        // ...set value to max
        $in.val(valMax);
        return false;
    }

    // Perform increment or decrement logic
    if ($t.data('func') == 'plus') {
        if (val < valMax) $in.val(val + 1);
    }
    else {
        if (val > valMin) $in.val(val - 1);
    }
});
$("#stop").click(function() {
    stopclock = true;
    state = "stopped";
    substate = "notcycling";
    clicked = false;
    document.getElementById("display").innerHTML = "Clock Stopped";
    document.getElementById("display2").innerHTML = "<br>";
    document.getElementById("demo").innerHTML = "<br>";
    $(".calc").css("background-color", "black");
    $(".label").css("color", "white");
    $("h1").css("color", "white");
    document.getElementById("session").innerHTML = "Start Session";
    document.getElementById("break").innerHTML = "Start Break";
    //    distance = -1;
    console.log("x: " + x + " state: " + state);
    clearInterval(x);
});
$("#session").click(function() {
    if (state === "session") return;
    if (state === "stopped") {
        state = "break"; //for flip in nextstate
        substate === "notcycling";
        stopclock = false;
        //        setTimeout(function() {
        nextstate();
        //        }, 12);
        return;
    }
    if (state === "break") {
        clearInterval(x);
        substate === "notcycling";
        stopclock = true;
        //        setTimeout(function() {
        nextstate();
        //        }, 12);
        return;
    }
    if (state === "paused") {
        if (substate === "session") {
            document.getElementById("session").innerHTML = "Start Session";
            document.getElementById("display").innerHTML = "DO NOT DISTURB";
            document.getElementById("display2").innerHTML = "Focused Work In Progress";
            state = "session";
            substate = "cycling";
            stopclock = false;
            countdown(pauseddistance);
        }
        if (substate === "break") {
            document.getElementById("break").innerHTML = "Start Break";
            console.log("x: " + x + " state: " + state);
            //            clearInterval(x);
            //                setTimeout(function() {
            state = "break";
            substate = "notcycling";
            stopclock = false;
            nextstate();
            //                }, 12);
        }
    }
});

$("#break").click(function() {
    if (state === "break") return;
    if (state === "stopped") {
        state = "session"; //for flip in nextstate
        substate === "notcycling";
        stopclock = false;
        //        setTimeout(function() {
        nextstate();
        //        }, 12);
        return;
    }
    if (state === "session") {
        clearInterval(x);
        substate === "notcycling";
        stopclock = true;
        //        setTimeout(function() {
        nextstate();
        //        }, 12);
        return;
    }
    if (state === "paused") {
        if (substate === "session") {
            document.getElementById("session").innerHTML = "Start Session";
            //               stopclock = true;
            console.log("x: " + x + " state: " + state);
            //                clearInterval(x);
            state = "session";
            substate = "notcycling";
            stopclock = false;
            nextstate();
        }
        if (substate === "break") {
            document.getElementById("break").innerHTML = "Start Break";
            document.getElementById("display").innerHTML = "Recharging";
            document.getElementById("display2").innerHTML = "<br>";
            state = "break";
            substate = "cycling";
            stopclock = false;
            countdown(pauseddistance);
        }
    }
});
$("#pause").click(function() {
    if ((state === "stopped") || (state === "paused")) return;
    if ((state === "session") || (state === "break")) {
        pauseddistance = distance / (1000 * 60);
        substate = state;
        if (substate === "session") document.getElementById("session").innerHTML = "Resume Session";
        if (substate === "break") document.getElementById("break").innerHTML = "Resume Break";
        document.getElementById("display").innerHTML = "Clock Paused";
        document.getElementById("display2").innerHTML = "<br>";
        document.getElementById("demo").innerHTML = Math.floor(pauseddistance % (60)) + "m " +
            Math.floor((pauseddistance - Math.floor(pauseddistance % (60))) * 60) + "s ";
        state = "paused";
        stopclock = true;
        distance = -1;
        console.log("x: " + x + " state: " + state);
        clearInterval(x);
        return;
    }
});
/* global $*/
