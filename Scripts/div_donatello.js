var daysPerYear = 365.25;  //Can't account for leap years.
var daysPerMonth = 30.42;  //This seems to be the most accurate way to calculate months.  After 300, it is off by only 1 day.

function totalDays() {
    //Adds up the total number of days in sentence from combination of years, months and days.
    var years, months, days;
    years = document.donatello_form.sentenceYears.value;
    months = document.donatello_form.sentenceMonths.value;
    days = document.donatello_form.sentenceDays.value;
    return Math.floor(years * daysPerYear) + Math.floor(months * daysPerMonth) + Number(days);
}

function convertYMD(days) {
    //Converts number of days to years, months and days.
	var totalYears, totalMonths, totalDays;
	totalYears = Math.floor(days / daysPerYear);
	totalMonths = Math.floor((days % daysPerYear) / daysPerMonth);
	totalDays = Math.floor(days - (totalYears * daysPerYear) - (totalMonths * daysPerMonth));
    if (days <= 0) {
        return "0d";
    } else if (days <= daysPerMonth) {
        return totalDays + "d";
    } else if (days <= daysPerYear) {
        return totalMonths + "m, " + totalDays + "d";
    } else {
        return totalYears + "y, " + totalMonths + "m, " + totalDays + "d";
    }
}

function outlaw() {
    //Returns the type of outlaw as "violent", "serious", "striker" or "felon".
    var i, offense, strike;
    for (i = 0; i < document.donatello_form.rsv.length; i++) {
        if (document.donatello_form.rsv[i].checked) {
            offense = document.donatello_form.rsv[i].value;
        }
    }
    for (i = 0; i < document.donatello_form.strike.length; i++) {
        if (document.donatello_form.strike[i].checked) {
            strike = document.donatello_form.strike[i].value;
        }
	}
    if (offense === "violent") {
        return "violent";
    } else if (offense === "violent" && strike === "has_Strike") {
        return "violent";
    } else if (offense === "serious" && strike === "no_Strike") {
        return "serious";
    } else if (offense === "serious" && strike === "has_Strike") {
        return "striker";
    } else if (offense === "felon" && strike === "has_Strike") {
        return "striker";
    } else {
        return "felon";
    }
}

function multiple(outlaw) {
    //[0 = pre-sentence credits, 1 = post-sentence credits, 2 = Prop 57 credits, 3 = paper parole, 4 = fire camp]
    var multiple;
    if (outlaw === "violent") {
        multiple = [0.15, 0.85, 0.8, 0.15, 0.5];
    } else if (outlaw === "serious") {
        multiple = [1, 0.5, 0.334, 0.15, 0.334];
    } else if (outlaw === "striker") {
        multiple = [1, 0.8, 0.667, 1, 0.334];
    } else {
        multiple = [1, 0.5, 0.334, 1, 0.334];
    }
    return multiple;
}

function percentString(outlaw) {
    //String version of multipe for display in text. 
    //[0 = conduct credits, 1 = time served at, 2 = prop 57 enhanced, 3 = fire camp]
    var add;
    if (outlaw === "violent") {
        add = ["15%", "85%", "20%", "50%"];
    } else if (outlaw === "serious") {
        add = ["50%", "50%", "66%", "66%"];
    } else if (outlaw === "striker") {
        add = ["50%", "80%", "33%", "66%"];
    } else {
        add = ["50%", "50%", "66%", "66%"];
    }
    return add;
}

function conductCredits(offender, actual) {
    //Calculates pre-sentence conduct credits at 15% (violent) or 2 for 2 (for all other).
    if (offender === "violent") {
        return Math.floor(actual * multiple(offender)[0]);
    } else {
        return Math.floor(actual / 2) * 2;
    }
}

function outDate(credits, conduct, sentence, multiple) {
    //Calculates number of days remaining in sentence.
    var totalCredits, time;
    totalCredits = credits + conduct;
    time = Math.floor((totalDays() - totalCredits) * multiple);
    return time;
}

function paperParole(sentence, credits, conduct, rate) {
    var totalCredits, daysNeeded;
    totalCredits = credits + conduct;
    daysNeeded = (sentence - totalCredits)/(1 + rate);
    return Math.round(daysNeeded);
}

function lineItem(classes, material) {
    //Assembles div for each line in the answer.
    var div, text;
    div = document.createElement("div");
    div.setAttribute("class", classes);
    text = document.createTextNode(material);
    div.appendChild(text);
    document.getElementById("donatello_answer").appendChild(div);
}

function calculate() {
    //Puts the answer together.
    var offender, credits, conduct, statutoryHeading, fiftysevenHeading, short;
    offender = outlaw();
    credits = Number(document.donatello_form.actualCredits.value);
    conduct = conductCredits(offender, credits);
    short = paperParole(totalDays(), credits, conduct, multiple(offender)[3]);
    statutoryHeading = document.createElement("h1");
    statutoryHeading.appendChild(document.createTextNode("Statutory Credits:"));
    fiftysevenHeading = document.createElement("h1");
    fiftysevenHeading.appendChild(document.createTextNode("Prop 57 Expanded Credits:"));
    document.getElementById("donatello_answer").innerHTML = "";
    document.getElementById("donatello_answer").appendChild(statutoryHeading);
    lineItem("line title max", "Maximum Time");
    lineItem("line time max", convertYMD(totalDays()));
    lineItem("line title actual", "Actual Credits");
    lineItem("line time actual", credits + "d");
    lineItem("line title conduct", "Conduct Credits (" + percentString(offender)[0] + ")");
    lineItem("line time conduct", conduct + "d");
    lineItem("line title min", "Minimum Time (" + percentString(offender)[1] + ")");
    lineItem("line time min", convertYMD(outDate(credits, conduct, totalDays(), multiple(offender)[1])));
    lineItem("line title parole", "Needed for Paper Parole");
    lineItem("line time parole", short + "d");
    document.getElementById("donatello_answer").appendChild(fiftysevenHeading);
    lineItem("line title prop", "Additional Credits");
    lineItem("line time prop", convertYMD(outDate(credits, conduct, totalDays(), multiple(offender)[1]) - outDate(credits, conduct, totalDays(), multiple(offender)[2])));
    lineItem("line title prop", "Expanded Minimum Time (" + percentString(offender)[2] + ")");
    lineItem("line time prop", convertYMD(outDate(credits, conduct, totalDays(), multiple(offender)[2])));
}

function clearIt() {
    document.donatello_form.reset();
    document.getElementById("donatello_answer").innerHTML = "";
}

$(document).ready(function() {
	$("#chart_toggle").click(function() {
		$("#chart").slideToggle("fast");
	});
});
$(document).ready(function() {
	$("#close").click(function() {
		$("#chart").slideToggle("fast");
	});
});