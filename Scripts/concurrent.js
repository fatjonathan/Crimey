function concurrentSwitcher(name) {
    //Switches concurrent true/false in pleading (same as Attempt).
    var target, updates, i;
    target = pleading.map(function(p) {return p.name}).indexOf(name);
    pleading[target].concurrent = !pleading[target].concurrent;
    document.getElementById(name + "_display").innerHTML = "";
    displayTerm(name);
    //Handles display for enhancements separately because box is not always checked.
    updates = pleading.filter(function(p) {return p.count===pleading[target].name});
    for (i=0; i < updates.length; i++) {
        document.getElementById(updates[i].name + "_display").innerHTML = "";
        displayTerm(updates[i].name);
    }
}
function inputConcurrent(name, charge, concurrent) {
    //Creates checkbox for concurrent charge and enhancements.
    var container, checkbox, label;
    container = document.createElement("div");
    container.setAttribute("class", "button concurrent");
    if (whatGetsConcurrent(charge)) {
        checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "concurrent_" + name);
        checkbox.setAttribute("onchange", "concurrentSwitcher('" + name + "')");
        checkbox.checked = concurrent;
        container.appendChild(checkbox);
        label = document.createElement("label");
        label.setAttribute("for", "concurrent_" + name);
        label.appendChild(document.createTextNode("Concurrent"));
        container.appendChild(label);  
    } else {
        container.classList.add("blank");
        container.appendChild(document.createTextNode("Concurrent"));
    }
    return container;
}