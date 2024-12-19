var calcwidth = 500;
var state = "stopped";
var substate = "notcycling"; //used to resume on pause
var stopclock = true;
var val;
var distance;
var pauseddistance;
var x;
const statesDICT = {
    "stopped": {
        "session": "active",
        "break": "active",
        "stopped": "inactive",
        "paused": "inactive",
        "id": "stop"
    },
    "session": {
        "session": "inactive",
        "break": "active",
        "stopped": "active",
        "paused": "active",
        "id": "session"
    },
    "paused": {
        "session": "inactive",
        "break": "active",
        "stopped": "active",
        "paused": "inactive",
        "id": "pause"
    },
    "break": {
        "session": "active",
        "break": "inactive",
        "stopped": "active",
        "paused": "active",
        "id": "break"
    },
    "session_paused": {
        "session": "active",
        "break": "inactive",
        "stopped": "active",
        "paused": "inactive",
        "id": "break"
    },
    "break_paused": {
        "session": "inactive",
        "break": "active",
        "stopped": "inactive",
        "paused": "active",
        "id": "break"
    },
};
// const active_label = new RegExp("label-active");
// const inactive_label = new RegExp("label-inactive");
const active_label = "label-active";
const inactive_label = "label-inactive";
const active_color = "white";
const inactive_color = "gray";
// const paused_color = "purple"; //change later

function set_labels(state) {
    for (const [key, value] of Object.entries(statesDICT[state])) {
        if (key != "id") {
            if (value === "active") document.getElementById(statesDICT[key]["id"]).className = document.getElementById(statesDICT[key]["id"]).className.replace(inactive_label, active_label);
            if (value === "inactive") document.getElementById(statesDICT[key]["id"]).className = document.getElementById(statesDICT[key]["id"]).className.replace(active_label, inactive_label);
            $(".blabel").css("color", inactive_color);
            $("#sessiontime").css("color", inactive_color);
            $("#breaktime").css("color", inactive_color);
            // x = document.getElementById('sessiontime');
            // document.getElementById('sessiontime').setAttribute('style', 'color: gold');
        }
    }

    if(state === "stopped") {
        $(".blabel").css("color", active_color);
        $("#sessiontime").css("color", active_color);
        $("#breaktime").css("color", active_color);
    }
}

set_labels(state);

if ($(window).width() < 500) calcwidth = $(window).width();
$(".calc").css("max-width:", calcwidth);

function nextstate() {
    console.log("   function nextstate  state: " + state);
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
        } else {
            setTimeout(function () {
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
            setTimeout(function () {
                document.getElementById("display").innerHTML = "Recharging";
                document.getElementById("display2").innerHTML = "<br>";
                countdown(valbreak);
            }, 3000);
            return;
        } // end setTimeout
        else {
            substate = "cycle";
            document.getElementById("display").innerHTML = "Recharging";
            document.getElementById("display2").innerHTML = "<br>";
            countdown(valbreak);
            return;
        }
    }
} // end if state equals session()

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
    $(".blabel").css("color", inactive_color);
    $("#sessiontime").css("color", inactive_color);
    $("#breaktime").css("color", inactive_color);
    // Update the count down every 1 second
    x = setInterval(function () {
        // if (stopclock) return;
        now = new Date().getTime();
        distance = countDownDate - now;
        if ((distance / (60 * 1000) / val <= .1) || (distance <= (60 * 1000))) {
            if (state === "session") {
                $(".calc").css("background-color", "#ECB028");
                $(".blabel").css("color", inactive_color);
            }
        }
        if (distance <= (30 * 1000)) {
            if (state === "session") {
                
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
                console.log("state: ", state, "substate: ", substate);
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
            setTimeout(function () {
                nextstate();
            }, 12);
            return;
        }
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var minutes_remaining = Math.trunc(distance/(1000*60))

        // Output the result in an element with id="demo" and in the tab
        seconds_formatted = ("0" + seconds)
        document.getElementById("tab").innerHTML = minutes_remaining + ":" + seconds_formatted.slice(-2);
        if (state !== "paused")
            if (minutes_remaining > 1) {
                if (seconds < 31)
                    document.getElementById("demo").innerHTML = minutes_remaining + " minutes left";
                if (seconds > 30) document.getElementById("demo").innerHTML = minutes_remaining + 1 + " minutes left";
            }
        if (minutes_remaining === 1) {
            if (seconds > 30) document.getElementById("demo").innerHTML = minutes_remaining + 1 + " minutes left";
            if (seconds < 31) document.getElementById("demo").innerHTML = minutes_remaining + " minute left ";
        }
        if (minutes_remaining < 1) {
            document.getElementById("demo").innerHTML = seconds + " seconds left";
        }

        if (stopclock) {
            if (state === "stopped") {
                document.getElementById("display").innerHTML = "Clock Stopped";
                document.getElementById("display2").innerHTML = "<br>";
                document.getElementById("demo").innerHTML = "<br>";
                $(".calc").css("background-color", "black");
                document.getElementById("session").innerHTML = "Start Session";
                document.getElementById("break").innerHTML = "Start Break";
            }
            //           distance = -1;
            console.log("x: " + x + " state: " + state);
            clearInterval(x);
        }
    }, 1000);
} // end countdown

$('.qty').click(function () {
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
    } else if (val > valMax) {
        // If field value exceeds maximum,
        // ...set value to max
        $in.val(valMax);
        return false;
    }

    // Perform increment or decrement logic
    if ($t.data('func') == 'plus') {
        if (val < valMax) $in.val(val + 1);
    } else {
        if (val > valMin) $in.val(val - 1);
    }
});
$("#stop").click(function () {
    set_labels("stopped")
    document.getElementById("tab").innerHTML = "Pomodoro";
    if (state === "stopped") return;
    stopclock = true;
    state = "stopped";
    substate = "notcycling";
    clicked = false;
    document.getElementById("display").innerHTML = "Clock Stopped";
    document.getElementById("display2").innerHTML = "<br>";
    document.getElementById("demo").innerHTML = "<br>";
    $(".calc").css("background-color", "black");
    document.getElementById("session").innerHTML = "Start Session";
    document.getElementById("break").innerHTML = "Start Break";
    document.getElementById('stop').innerText = " ";
    document.getElementById('pause').innerText = " ";
    clearInterval(x);
});

$("#session").click(function () {
    console.log("state: ", state, "substate: ", substate);
    if ((state === "paused") && (substate === "break")) return;
    if (state === "session") return;
    set_labels("session")
    document.getElementById('stop').innerText="End Session";
    document.getElementById('pause').innerText="Pause"
    if (state === "stopped") {
        // https://www.w3docs.com/snippets/javascript/how-to-change-an-elements-class-with-javascript.html
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
        document.getElementById('stop').innerText="End Session";
        document.getElementById('pause').innerText="Pause";
        nextstate();
        return;
    }
    if (state === "paused") {
        console.log("state: ", state, "substate: ", substate);
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

$("#break").click(function () {
    console.log("state: ", state, "substate: ", substate);
    if ((state === "paused") && (substate === "session")) return;
    if (state === "break") return;
    set_labels("break");
    document.getElementById('stop').innerText="End Session"
    document.getElementById('pause').innerText = "Pause"
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
        console.log("state: ", state, "substate: ", substate)
        if (substate === "session") {
            document.getElementById("session").innerHTML = "Start Session";
            // console.log("x: " + x + " state: " + state);
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
}); // end #.break.click

$("#pause").click(function () {
    console.log("371 pause,", "state: ", state, "substate: ", substate);
    // if ((state === "stopped") || (state === "paused")) return;
    if (state === "stopped") return;
    if (state === "session") {
        $(".calc").css("background-color", "#c32aff");
        document.getElementById('stop').innerText="End Session";
        document.getElementById("pause").innerText=" ";
        pauseddistance = distance / (1000 * 60);
        substate = state;
        state = "paused";
        if (substate === "session") {
            document.getElementById("session").innerHTML = "Resume Session";
            set_labels("session_paused")
        }
        if (substate === "break") {
            document.getElementById("break").innerHTML = "Resume Break";
            set_labels("break_paused")
        }
        document.getElementById("display").innerHTML = "Clock Paused";
        document.getElementById("display2").innerHTML = "<br>";
        document.getElementById("demo").innerHTML = Math.floor(pauseddistance % (60)) + "m " +
            Math.floor((pauseddistance - Math.floor(pauseddistance % (60))) * 60) + "s ";
        stopclock = true;
        distance = -1;
        console.log("x: " + x + " state: " + state + " substate : " + substate);
        clearInterval(x);
        return;
    }
    if (state === "break") {
        $(".calc").css("background-color", "#c32aff");
        document.getElementById('stop').innerText = " ";
        document.getElementById("pause").innerText = "End Break ";
        pauseddistance = distance / (1000 * 60);
        substate = state;
        state = "paused";
        if (substate === "session") {
            document.getElementById("session").innerHTML = "Resume Session";
            set_labels("session_paused")
        }
        if (substate === "break") {
            document.getElementById("break").innerHTML = "Resume Break";
            set_labels("break_paused")
        }
        document.getElementById("display").innerHTML = "Clock Paused";
        document.getElementById("display2").innerHTML = "<br>";
        document.getElementById("demo").innerHTML = Math.floor(pauseddistance % (60)) + "m " +
            Math.floor((pauseddistance - Math.floor(pauseddistance % (60))) * 60) + "s ";
        stopclock = true;
        distance = -1;
        console.log("x: " + x + " state: " + state + " substate " + substate);
        clearInterval(x);
        return;
    };
});

/* global $*/