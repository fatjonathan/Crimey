function noMatches() {
    //Creates the sorry message when there are no matching code sections.
    var sorryContainer, heading, headingText, message, messageText, link, linkText, linkDiv;
    sorryContainer = document.createElement("div");
    sorryContainer.setAttribute("id", "sorry");
    heading = document.createElement("h1");
    headingText = document.createTextNode("Sorry, no matching code sections");
    heading.appendChild(headingText);
    sorryContainer.appendChild(heading);
    message = document.createElement("p");
    message.setAttribute("class", "sorryText");
    messageText = document.createTextNode("Crimey has sentencing information for a long list of felony charges, but a few might be missing. If you have found a missing code section that you think should be included, please let me know.");
    message.appendChild(messageText);
    sorryContainer.appendChild(message);
    link = document.createElement("a");
    link.setAttribute("onclick", "noMatchesLink()");
    linkText = document.createTextNode("Clink to send missing code section");
    link.appendChild(linkText);
    linkDiv = document.createElement("p");
    linkDiv.setAttribute("class", "sorryLink");
    linkDiv.appendChild(link);
    sorryContainer.appendChild(linkDiv);
    document.getElementById("leonardo_answer").appendChild(sorryContainer);
}
function noMatchesLink() {
    //Called by noMathces() to generate the suggestion for missing code sections.
    var section = document.leonardo_form.section.value;
    document.location.href = "mailto:fattarsi@gmail.com?subject=Missing%20Code%20Section%20&body=I%20could%20not%20find%20section%20" + section + "%20in%20Crimey.";
}
function toYears(months) {
    //Converts number of months to years and remaining months.
    var y, m;
    if (months==16) {
        return months + "m"; 
    } else {
        y = Math.floor(months/12);
        m = months - (y*12);
        if (y==0) {
            return m + "m ";
        } else if (m==0) {
            return y + "y ";
        } else {
            return y + "y " + m + "m ";
        }
    }
}
function formatSentence(life, lt, mt, ut) {
    //Displays the sentence in the appropriate format in title div.
    if (life==="DEATH") {
        return "Death/LWOP";
    } else if (life==="LWOP") {
        return "LWOP";
    } else if (life==="LIFE" && mt<=0) {
        return "7y to life";
    } else if (life==="LIFE" && mt>0) {
        return toYears(mt) + " to life";
    } else if (lt<=0 && ut<=0) {
        return toYears(mt);
    } else {
        if (lt==16) {
            return 16 + "m - " + toYears(mt) + " - " + toYears(ut);
        } else {
            return toYears(lt) + " - " + toYears(mt) + " - " + toYears(ut);
        }
    }
}
function bitLabel(label) {
    //Creates label div above each bit.
    var div = document.createElement("div");
    div.setAttribute("class", "bitLabel");
    div.appendChild(document.createTextNode(label));
    return div;
}
function bitMaker(lit, text) {
    //Assembles the div for each of the bit functions.
    var box = document.createElement("div");
    if (lit===true) {
        box.setAttribute("class", "bit orange");
    } else {
        box.setAttribute("class", "bit not");
    }
    box.appendChild(text);
    return box;
}
function bitWobbler(bit) {
    var lit, small, large;
    if (bit==="w") {
        lit = true;
        small = document.createTextNode("W");
        large = document.createTextNode("Wobbler");
    } else {
        lit = false;
        small = document.createTextNode("N");
        large = document.createTextNode("No");
    }
    return [bitMaker(lit, small), bitMaker(lit, large)];
}
function bitRegister(bit) {
    var lit, small, large;
    if (bit==="290") {
        lit = true;
        small = document.createTextNode("R");
        large = document.createTextNode("Sex");
    } else if (bit==="186.30") {
        lit = true;
        small = document.createTextNode("R");
        large = document.createTextNode("Gang");
    } else if (bit==="457.1") {
        lit = true;
        small = document.createTextNode("R");
        large = document.createTextNode("Arson");
    } else if (bit==="11590") {
        lit = true;
        small = document.createTextNode("R");
        large = document.createTextNode("Narcotics");
    } else {
        lit = false;
        small = document.createTextNode("N");
        large = document.createTextNode("None");
    }
    return [bitMaker(lit, small), bitMaker(lit, large)];
}
function bitType(bit) {
    var lit, small, large;
    if (bit==="violent") {
        lit = true;
        small = document.createTextNode("V");
        large = document.createTextNode("Violent");
    } else if (bit==="serious") {
        lit = true;
        small = document.createTextNode("S");
        large = document.createTextNode("Serious");
    } else if (bit==="prop47") {
        lit = false;
        small = document.createTextNode("F");
        large = document.createTextNode("Prop 47")
    } else {
        lit = false;
        small = document.createTextNode("F");
        large = document.createTextNode("Felony")
    }
    return [bitMaker(lit, small), bitMaker(lit, large)];
}
function bitJorp(bit) {
    var lit, small, large;
    if (bit==="jail") {
        lit = false;
        small = document.createTextNode("J");
        large = document.createTextNode("Jail");
    } else {
        lit = true;
        small = document.createTextNode("P");
        large = document.createTextNode("Prison");
    }
    return [bitMaker(lit, small), bitMaker(lit, large)];
}
function seePunishment(punishment) {
    //Lists separate punishment statutes.
    if (punishment.length > 0) {
        return "  (see \u00A7 " + punishment + ")";
        }
    else {
        return "";
    }
}
function codeConverter(code) {
    //Converts the code to the form used in the hyperlink for the leginfo website.
    if (code==="Pen.Code") {
        return "PEN";
    } else if (code==="Health&Saf.Code") {
        return "HSC";
    } else if (code==="Veh.Code") {
        return "VEH";
    } else if (code==="Bus.&Prof.Code") {
        return "BPC";
    } else if (code==="Civ.Code") {
        return "CIV";
    } else if (code==="Corp.Code") {
        return "CORP";
    } else if (code==="Ed.Code") {
        return "EDC";
    } else if (code==="Ed.Code") {
        return "ELEC";
    } else if (code==="Fin.Code") {
        return "FIN";
    } else if (code==="Fish&G.Code") {
        return "FGC";
    } else if (code==="Food&Agr.Code") {
        return "FAC";
    } else if (code==="Gov.Code") {
        return "GOV";
    } else if (code==="Harb.&Nav.Code") {
        return "HNC";
    } else if (code==="Ins.Code") {
        return "INS";
    } else if (code==="Lab.Code") {
        return "LAB";
    } else if (code==="Mil.&Vet.Code") {
        return "MVC";
    } else if (code==="Prob.Code") {
        return "PROB";
    } else if (code==="Pub.Contract Code") {
        return "PCC";
    } else if (code==="Pub.Resources Code") {
        return "PRC";
    } else if (code==="Pub.Util.Code") {
        return "PUC";
    } else if (code==="Rev.&Tax.Code") {
        return "RTC";
    } else if (code==="Sts.&Hy.Code") {
        return "SHC";
    } else if (code==="Unemp.Ins.Code") {
        return "UIC";
    } else if (code==="Wat.Code") {
        return "WAT";
    } else if (code==="Welf.&Inst.Code") {
        return "WIC";
    } else {
        return "PEN"
    }
}
function creditsAt(match) {
	//Determines the rate at which credits are awarded after sentencing.
    if (match.life==="DEATH" || match.life==="LWOP" || (match.section == "187" && match.handling != "attempt")) {
        return "0%";
    } else if (match.type==="violent") {
        return "15%";
    } else {
        return "50%";
    }
}
function makesInfo(match, number) {
    //Creates the hidden info div that is displayed after the title div is clicked on.
    var info, section, link, linkAddress, linkText;
    info = document.createElement("div");
    info.setAttribute("class", "info");
    section = document.createElement("div");
    section.setAttribute("class", "section");
    link = document.createElement("a");
    linkAddress = "http://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=" + match.section + "&lawCode=" + codeConverter(match.code);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", linkAddress);
    linkText = document.createTextNode(match.code + " \u00A7 " + match.section + match.letter + match.subd + " " + seePunishment(match.punishment));
    link.appendChild(linkText);
    section.appendChild(link);
    info.appendChild(section);
    info.appendChild(controlCapsule(match, number));
    info.appendChild(bitLabel("Wobbles"));
    info.appendChild(bitLabel("Registration"));
    info.appendChild(bitLabel("Severity"));
    info.appendChild(bitLabel("Imprisonment"));
    info.appendChild(bitWobbler(match.wobbler)[1]);
    info.appendChild(bitRegister(match.register)[1]);
    info.appendChild(bitType(match.type)[1]);
    info.appendChild(bitJorp(match.jorp)[1]);
    return info;
}
function makesTitle(match) {
    //Creates the title div that is displayed before clicked on.
    var title, left, code, codeText, section, sectionText, triad, triadText, credits, creditsText, right;
    title = document.createElement("div");
    title.setAttribute("class", "title");
    left = document.createElement("div");
    left.setAttribute("class", "side left");
    code = document.createElement("p");
    code.setAttribute("class", "code");
    codeText = document.createTextNode(match.code + " \u00A7");
    code.appendChild(codeText);
    section = document.createElement("div");
    section.setAttribute("class", "title_item section");
    sectionText = document.createTextNode(match.section + match.letter + match.subd);
    section.appendChild(code);
    section.appendChild(sectionText);
    left.appendChild(section);
    title.appendChild(left);
    title.appendChild(left);
    right= document.createElement("div");
    right.setAttribute("class", "side right");
    triad = document.createElement("div");
    triad.setAttribute("class", "title_item triad");
    triadText = document.createTextNode(formatSentence(match.life, match.lt, match.mt, match.ut));
    triad.appendChild(triadText);
    right.appendChild(triad);
    credits = document.createElement("div");
    credits.setAttribute("class", "title_item credits");
    creditsText = document.createTextNode(creditsAt(match));
    credits.appendChild(creditsText);
    right.appendChild(credits);
    right.appendChild(bitJorp(match.jorp)[0]);
    right.appendChild(bitType(match.type)[0]);
    right.appendChild(bitRegister(match.register)[0]);
    right.appendChild(bitWobbler(match.wobbler)[0]);
    title.appendChild(right);
    return title;
}
function makesMatches(match, number) {
    //Creates the charge_container and calls for the title and info divs.
    var charge, title, info;
    charge = document.createElement("div");
    charge.setAttribute("class", "charge_container");
    charge.appendChild(makesTitle(match));
    charge.appendChild(makesInfo(match, number));
    document.getElementById("charges").appendChild(charge);
}
function zaszim() {
    var form, section, matches, i, number;
    document.getElementById("leonardo_answer").innerHTML = "";
    enhancementHack = [];
    form = document.createElement("form");
    form.setAttribute("name", "charges");
    form.setAttribute("id", "charges");
    document.getElementById("leonardo_answer").appendChild(form);
    section = document.leonardo_form.section.value;
    matches = codeAll.filter(function(matching) {
        return matching.section == section;
    });
    if (matches.length===0) {
        noMatches();
    } else {
        for(i=0; i<matches.length; i++) {
            number = matches.indexOf(matches[i]);
            makesMatches(matches[i], number);
        }
    }
}