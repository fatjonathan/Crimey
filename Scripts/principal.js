function principalChargeOptions() {
    //Filters pleading for charges that can be a principal charge.
    return pleading.filter(function(i) {return (i.charge.handling==="charge" || i.charge.handling==="attempt") && i.madeLife()===false});
}
function principalDefault(num, principal) {
    //Sets count as principal when added if no other potential princpal counts exist.
    if (principalChargeOptions().length === 1) {
        principalHack = "count" + num;
        return true;
    } else {
        return principal;
    }
}
function principalPicker() {
    //Selects a principal when none are selected (like Default, but for counts already added).
    var principal;
    if (principalChargeOptions().length > 0) {
        principal = principalChargeOptions()[0].name;
        document.getElementById("principal_" + principal).checked = true;
        principalHack = principal;
        displayTerm(principal);
    }
}
function principalSelected() {
    //Returns the name of the count that is the principal.
    var selected, count_num;
    if (principalChargeOptions().length >= 1) {
        countSelected = document.querySelector('input[name="principal"]:checked').value;
        count_num = "count" + countSelected;
    }
    return count_num;
}
function principalUpdater(num) {
    //Updates principal display when new principal is selected.
    var i, updates, targets;
    updates = pleading.filter(function(u) {return u.count===principalHack});
    for (i=0; i < updates.length; i++) {
        document.getElementById(updates[i].name + "_display").innerHTML = "";
        document.getElementById(updates[i].name + "_display").appendChild(document.createTextNode(updates[i].imposed()[1]));
    }
    targets = pleading.filter(function(t) {return t.count==="count" + num});
    for (i=0; i < targets.length; i++) {
        document.getElementById(targets[i].name + "_display").innerHTML = "";
        document.getElementById(targets[i].name + "_display").appendChild(document.createTextNode(targets[i].imposed()[1]));
    }
    //principalSelected();
    principalHack = "count" + num;
}
function inputPrincipal(num, charge, principal) {
    //Creates radio button for principal charge.
    var container, button, label;
    container = document.createElement("div");
    container.setAttribute("class", "button principal");
    container.setAttribute("id", "principal_container_count" + num);
    if (whatGetsPrincipal(charge)) {
        button = document.createElement("input");
        button.setAttribute("type", "radio");
        button.setAttribute("name", "principal");
        button.setAttribute("id", "principal_count" + num);
        button.setAttribute("value", num);
        //button.setAttribute("onchange", "principalSelector()");
        button.checked = principalDefault(num, principal);
        button.addEventListener("change", function() {principalUpdater(num)});
        container.appendChild(button);
        label = document.createElement("label");
        label.setAttribute("for", "principal_count" + num);
        label.appendChild(document.createTextNode("Principal"));
        container.appendChild(label);
    } else {
        button = document.createElement("div");
        button.setAttribute("class", "blank");
        button.appendChild(document.createTextNode("Principal"));
        container.appendChild(button);
    }
    return container;
}