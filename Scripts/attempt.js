function attemptSwitcher(num) {
    //Switches attempt true/false in pleading (same as Concurrent).
    var target, updates, i;
    target = pleading.map(function(x) {return x.count}).indexOf("count" + num);
    pleading[target].attempt = !pleading[target].attempt;
    updates = pleading.filter(function(p) {return p.count===pleading[target].name});
    for (i=0; i < updates.length; i++) {
        document.getElementById(updates[i].name + "_display").innerHTML = "";
        displayTerm(updates[i].name);
    }
}
function inputAttempt(num, charge, attempt) {
    //Creates checkbox for attempt.
    var container, checkbox, label;
    container = document.createElement("div");
    container.setAttribute("class", "button attempt");
    if (whatGetsAttempt(charge)) {
        checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "attempt_count" + num);
        checkbox.setAttribute("onchange", "attemptSwitcher(" + num + ")");
        checkbox.checked = attempt;
        container.appendChild(checkbox);
        label = document.createElement("label");
        label.setAttribute("for", "attempt_count" + num);
        label.appendChild(document.createTextNode("Attempt"));
        container.appendChild(label);
    } else {
        container.classList.add("blank");
        container.appendChild(document.createTextNode("Attempt"));        
    }
    return container;
}
function attemptMod(charge) {
    charge.handling = "attempt";
    charge.life = "";
    charge.lt = 60;
    charge.mt = 72;
    charge.ut = 108;
    return [charge.ut, charge];
}
function attemptConverter(attempt, charge) {
    //This works but it won't change the "selected" term in the pleading.
    //It seems like a lot of work for so few charges.
    //When I come back to this, start with addCharge and figure out a way to change
    //the "selected" term from there.  Probably not from the addButton().
    var sub;
    if (attempt===true && charge.attempt.length && charge.attempt != "not664") {
        sub = codeAll.filter(function(c) {return c.attempt===charge.attempt + "_selected"});
        return sub;
    } else {
        return charge;
    }
}