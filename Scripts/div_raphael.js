$(document).on('click', '.title', function() {
    $(this).closest('.count_container').find('.info').slideToggle('fast');
});
function displayTerm(name) {
    //Displays imposed term when new count is added from addCount().
    var display, index, term;
    display = document.getElementById(name + "_display");
    index = pleading.map(function(i) {return i.name}).indexOf(name);
    term = document.createTextNode(pleading[index].imposed()[1]);
    display.appendChild(term);
    getsStrikes();
    getsJorp();
}
function getsStrikes() {
    //Counts number of serious or violent convictions ("strikes").
    var strikes, answer;
    document.getElementById("gets_strikes").innerHTML = "";
    //strikes = pleading.filter(function(i) {return i.charge.type==="serious" || i.charge.type==="violent"});
    strikes = pleading.filter(function(i) {return i.count===i.name && i.isAStrike()===true});
    answer = document.createTextNode(strikes.length);
    document.getElementById("gets_strikes").appendChild(answer);
}
function getsJorp() {
    //Indicates sentence will be served in Local Jail or State Prison.
    var strikes, answer;
    document.getElementById("gets_jorp").innerHTML = "";
    strikes = pleading.filter(function(i) {return i.charge.jorp==="prison"});
    if (strikes.length >= 1 || document.strikes_form.scheme.value != "none") {
        answer = document.createTextNode("State Prison");
    } else {
        answer = document.createTextNode("Local Jail");
    }
    document.getElementById("gets_jorp").appendChild(answer);
}
function strikeCount(num) {
    //Deletes charges.
    var target, charges, strikeFromDoc, position, strikeFromArray, nextPrincipal;
    target = "count" + num;
    //Deletes div from document.
    charges = document.getElementById("counts");
    strikeFromDoc = document.getElementById(target);
    charges.removeChild(strikeFromDoc);
    //Deletes object from pleading array.
    strikeFromArray = pleading.filter(function(i) {return i.count !== target});
    pleading = strikeFromArray;
    //Selects another principal if principal is deleted.
    if (principalHack===target && principalChargeOptions().length >= 1) {
        nextPrincipal = "principal_" + principalChargeOptions()[0].count;
        document.getElementById(nextPrincipal).checked = true;
        principalHack = principalChargeOptions()[0].count;
        principalUpdater(principalHack.slice(5));
    }
    //Resets countNumber if all counts are deleted.
    if (pleading.length===0) {
        document.getElementById("countNumber").value = 0;
        principalHack = "";
    }
    chargeCount();
    addItUp();
    getsStrikes();
    getsJorp();
}
function strikeEnhancement(count_num, enhancementId) {
    //Deletes enhancements.
    var enhancements, strike, position;
    //Deletes div from document.
    enhancements = document.getElementById(count_num + "_enhancements");
    strike = document.getElementById(enhancementId);
    enhancements.removeChild(strike);
    //Deletes object from pleading array.
    position = pleading.map(function(i) {return i.name}).indexOf(enhancementId);
    pleading.splice(position, 1);
    document.getElementById(count_num + "_display").innerHTML = "";
    displayTerm(count_num);
    addItUp();
}
function termSwitcher(name, term) {
    //Switches term value in pleading, similar to concurrent and attempt.
    var target, display;
    display = document.getElementById(name + "_display");
    display.innerHTML = "";
    target = pleading.map(function(x) {return x.name}).indexOf(name);
    pleading[target].selected = term;
    //Updates display.
    displayTerm(name);
}
function inputRadio(count_num, term, selected) {
    //Makes radio buttons (just like radio()).
    var container, check, text, radio, label;
    container = document.createElement("div");
    container.setAttribute("class", "button");
    if (selected==term || selected=="LIFE") {
        check = true;
    } else {
        check = false;
    }
    if (term > 0) {
        text = toYears(term);
        radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", count_num);
        radio.setAttribute("id", count_num + "_" + term);
        radio.setAttribute("value", term);
        radio.setAttribute("onchange", "termSwitcher('" + count_num + "', " + term + ")");
        radio.checked = check;
        container.appendChild(radio);
        label = document.createElement("label");
        label.setAttribute("for", count_num + "_" + term);
        label.setAttribute("class", "term");
        label.appendChild(document.createTextNode(text));
        container.appendChild(label);
    }
    return container;
}
function termForCount(count_num, charge, selected) {
    //Makes term div and sorts charges by handling (just like term()).
    var container, paragraph;
    container = document.createElement("div");
    container.setAttribute("class", "term");
    paragraph = document.createElement("p");
    if (charge.life==="DEATH") {
        paragraph.appendChild(document.createTextNode("Death/LWOP"));
        container.appendChild(paragraph);
    } else if (charge.life==="LWOP") {
        paragraph.appendChild(document.createTextNode("LWOP"));
        container.appendChild(paragraph);
    } else if (charge.life==="LIFE") {
        if (charge.mt > 0) {
            container.appendChild(inputRadio(count_num, charge.mt, selected));
        } else {
            container.appendChild(inputRadio(count_num, 84, selected));
        }
    } else {
        container.appendChild(inputRadio(count_num, charge.lt, selected));
        container.appendChild(inputRadio(count_num, charge.mt, selected));
        container.appendChild(inputRadio(count_num, charge.ut, selected));
    }
    return container;
}
function controlCounts(num, count, principal) {
    //Puts together controls for counts.
    var controls;
    controls = document.createElement("div");
    controls.setAttribute("class", "controls");
    controls.appendChild(inputPrincipal(num, count.charge, principal));
    controls.appendChild(inputConcurrent("count" + num, count.charge, count.concurrent));
    controls.appendChild(inputAttempt(num, count.charge, count.attempt));
    controls.appendChild(termForCount("count" + num, count.charge, count.selected));
    return controls;
}
function makesCountInfo(num, count, principal) {
    //Creates info div that contains all controls that appears after title is clicked.
    var container, strike, strikeLink, enhancements;
    container = document.createElement("div");
    container.setAttribute("class", "info");
    container.appendChild(controlCounts(num, count, principal));
    strike = document.createElement("div");
    strike.setAttribute("class", "delete boxLinks");
    strikeLink = document.createElement("a");
    strikeLink.setAttribute("onclick", "strikeCount(" + num + ")");
    strikeLink.appendChild(document.createTextNode("Delete Charge"));
    strike.appendChild(strikeLink);
    container.appendChild(strike);
    return container;
}
function makesCountTitle(num, count) {
    //Creates title div that is displayed after count is added to screen.
    var title, number, code, term;
    title = document.createElement("div");
    title.setAttribute("class", "title");
    number = document.createElement("div");
    number.setAttribute("class", "title_item number");
    number.appendChild(document.createTextNode("Count " + num));
    title.appendChild(number);
    code = document.createElement("div");
    code.setAttribute("class", "title_item code");
    code.appendChild(document.createTextNode(count.charge.code + " \u00A7" + count.charge.section + count.charge.subd));
    title.appendChild(code);
    term = document.createElement("div");
    term.setAttribute("class", "title_item term");
    term.setAttribute("id", "count" + num + "_display");
    //Term is appended from addCount later by displayTerm().
    title.appendChild(term);
    return title;
}
function makesCounts(num, count, principal) {
    //Creates the count_container div and calls for the title and info divs.
    var newCount, enhancementNumber, enhancementHolder;
    newCount = document.createElement("div");
    newCount.setAttribute("class", "count_container");
    newCount.setAttribute("id", "count" + num);
    newCount.appendChild(makesCountTitle(num, count));
    newCount.appendChild(makesCountInfo(num, count, principal));
    //Creates a counter for ehancement numbers, like the counter for counts in the document.
    enhancementNumber = document.createElement("input");
    enhancementNumber.setAttribute("type", "hidden");
    enhancementNumber.setAttribute("value", "0");
    enhancementNumber.setAttribute("id", "enhancementNumber_count" + num);
    newCount.appendChild(enhancementNumber);
    enhancements = document.createElement("div");
    enhancements.setAttribute("id", "count" + num + "_enhancements");
    newCount.appendChild(enhancements);
    document.getElementById("counts").appendChild(newCount);
}
function addCount(charge, principal, concurrent, attempt, selected) {
    //Adds counts to raphael.
    var countNumber, newNumber, name, newCharge, target;
    countNumber = document.getElementById("countNumber"); //(1)Grabs o4147400239599218ld number.
    newNumber = Number(document.getElementById("countNumber").value) + 1; //(2)Adds 1.
    countNumber.value = newNumber; //(3)Replaces old number.
    name = "count" + newNumber;
    newCharge = new chargeConstructor(name, name, concurrent, attempt, selected, charge);
    pleading.push(newCharge);
    target = pleading.filter(function(matching) {return matching.name == name});
    makesCounts(newNumber, target[0], principal);
    displayTerm(name);
    if (principal===true) {
        principalUpdater(principalHack.slice(5));
        principalHack = name;
    }
    chargeCount();
    addItUp();
}

//Enhancements - work a lot like adding counts.

function controlEnhancements(count_num, enhancementId, count) {
    //Makes controls for enhancements.
    var num, controls;
    num = count_num.slice(5);
    controls = document.createElement("div");
    controls.setAttribute("class", "controls");
    controls.appendChild(inputPrincipal(num, count.charge, false));
    controls.appendChild(inputConcurrent(enhancementId, count.charge, count.concurrent));
    controls.appendChild(inputAttempt(num, count.charge, count.attempt));
    controls.appendChild(termForCount(enhancementId, count.charge, count.selected));
    return controls;
}
function makesEnhancementInfo(count_num, name, count) {
    //Makes info for enhancements.
    var container, strike, strikeLink;
    container = document.createElement("div");
    container.setAttribute("class", "enhancement_info");
    container.appendChild(controlEnhancements(count_num, name, count));
    strike = document.createElement("div");
    strike.setAttribute("class", "delete boxLinks");
    strikeLink = document.createElement("a");
    strikeLink.setAttribute("onclick", "strikeEnhancement('" + count_num + "', '" + name + "')");    
    strikeLink.appendChild(document.createTextNode("Delete Enhancement"));
    strike.appendChild(strikeLink);
    container.appendChild(strike);
    return container;
}
function makesEnhancementTitle(count_num, name, count) {
    //Makes enhancement title, same as the count title.
    var title, number, code, term;
    title = document.createElement("div");
    title.setAttribute("class", "enhancement_title");
    number = document.createElement("div");
    number.setAttribute("class", "title_item number");
    title.appendChild(number); //Just a space holder.
    code = document.createElement("div");
    code.setAttribute("class", "title_item code");
    code.appendChild(document.createTextNode(count.charge.code + " \u00A7" + count.charge.section + count.charge.subd));
    title.appendChild(code);
    term = document.createElement("div");
    term.setAttribute("class", "title_item term");
    term.setAttribute("id", name + "_display");
    //Term is appended from addEnhancement later by displayTerm().
    title.appendChild(term);
    return title;
}
function makesEnhancements(count_num, name, count) {
    //Creates the container for enhancements, works like makesCounts.  Note enhancementNumber is just a number, enhancmentId is created and passed from here.
    var newEnhancement;
    newEnhancement = document.createElement("div");
    newEnhancement.setAttribute("class", "enhancement_container");
    newEnhancement.setAttribute("id", name);
    newEnhancement.appendChild(makesEnhancementTitle(count_num, name, count));
    newEnhancement.appendChild(makesEnhancementInfo(count_num, name, count));
    document.getElementById(count_num + "_enhancements").appendChild(newEnhancement);
}
function addEnhancement(count_num, hackId, index) {
    //Adds enhancement divs after add enhancement button is clicked (similar to addCount).
    var inputId, enhancementNumber, newNumber, name, hack, newEnhancement, target;
    inputId = "enhancementNumber_" + count_num; //Creates unique input like the countNumber in document.
    enhancementNumber = document.getElementById(inputId); //(1) Grabs old number.
    newNumber = Number(document.getElementById(inputId).value) + 1; //(2) Adds 1.
    enhancementNumber.value = newNumber; // (3) Replaces old number.
    name = count_num + "_enhancement" + newNumber;
    hack = enhancementHack.filter(function(temp) {return temp[0] == hackId;});
    newEnhancement = new chargeConstructor(count_num, name, isConcurrent(hack[0][1], hack[0][2]), false, selected(hack[0][1], hack[0][2]), hack[0][1]);
    pleading.push(newEnhancement);
    target = pleading.filter(function(matching) {return matching.name == name});
    makesEnhancements(count_num, name, target[0]);
    document.getElementById(count_num + "_display").innerHTML = "";
    displayTerm(count_num);
    displayTerm(name);
    addItUp();
}