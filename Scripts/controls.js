function whatGetsPrincipal(match) {
    //Returns the criteria for what can be a principal charge.
    return (match.handling==="charge" || match.handling==="attempt") && match.life==="";
}
function checkboxPrincipal(match, index) {
    //Makes checkboxe for principal term.
    var container, button, label;
    container = document.createElement("div");
    container.setAttribute("class", "button principal");
    if (whatGetsPrincipal(match)) {
        button = document.createElement("input");
        button.setAttribute("type", "checkbox");
        button.setAttribute("id", "principal" + index);
        button.setAttribute("name", "principal" + index);
        container.appendChild(button);
        label = document.createElement("label");
        label.setAttribute("for", "principal" + index);
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
function isPrincipal(match, index) {
    //Returns true/false if principal is checked in leonardo before Add Charge is clicked.
    var i;
    if ((whatGetsPrincipal(match)) && (document.getElementById("principal" + index).checked)) {
        return true;
    } else {
        return false;
    }
}
function whatGetsConcurrent(match) {
    //Returns the criteria for what can be concurrent.
    if (match.handling === "prior") {
        return false;
    } else if (match.life === "DEATH") {
        return false;
    } else {
        return true;
    }
    //return match.handling != "prior";
}
function checkboxConcurrent(match, index) {
    //Makes checkboxes for concurrent term.
    var container, button, label;
    container = document.createElement("div");
    container.setAttribute("class", "button concurrent");
    if (whatGetsConcurrent(match)===true) {
        button = document.createElement("input");
        button.setAttribute("type", "checkbox");
        button.setAttribute("id", "concurrent" + index);
        button.setAttribute("name", "concurrent" + index);
        container.appendChild(button);
        label = document.createElement("label");
        label.setAttribute("for", "concurrent" + index);
        label.appendChild(document.createTextNode("Concurrent"));
        container.appendChild(label);
    } else {
        container.classList.add("blank");
        container.appendChild(document.createTextNode("Concurrent"));
    }
    return container;
}
function isConcurrent(match, index) {
    //Returns true/false to pleading if concurrent is checked.
    if ((whatGetsConcurrent(match)===true) && (document.getElementById("concurrent" + index).checked)) {
        return true;
    } else {
        return false;
    }
}
function whatGetsAttempt(match) {
    //Returns the criteria for what can be an attempt.
    return match.handling==="charge" && match.attempt <= 1;
}
function checkboxAttempt(match, index) {
    //Makes checkboxes for attempt.
    var container, button, label;
    container = document.createElement("div");
    container.setAttribute("class", "button attempt");
    if (whatGetsAttempt(match)) {
        button = document.createElement("input");
        button.setAttribute("type", "checkbox");
        button.setAttribute("id", "attempt" + index);
        button.setAttribute("name", "attempt" + index);
        container.appendChild(button);
        label = document.createElement("label");
        label.setAttribute("for", "attempt" + index);
        label.appendChild(document.createTextNode("Attempt"));
        container.appendChild(label);
    }  else {
        button = document.createElement("div");
        button.setAttribute("class", "blank");
        button.appendChild(document.createTextNode("Attempt"));
        container.appendChild(button);
    }
    return container; 
}
function isAttempt(match, index) {
    //Returns true/false to pleading if attempt is checked.
    if ((whatGetsAttempt(match)) && (document.getElementById("attempt" + index).checked)) {
        return true;
    } else {
        return false;
    }
}
function radio(count, term, check) {
    //Makes radio buttons.
    var container, text, radio, label;
    container = document.createElement("div");
    container.setAttribute("class", "button");
    if (term > 0) {
        text = toYears(term);
        radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "charge" + count);
        radio.setAttribute("id", "charge" + count + "_" + term);
        radio.setAttribute("value", term);
        radio.checked = check;
        container.appendChild(radio);
        label = document.createElement("label");
        label.setAttribute("for", "charge" + count + "_" + term);
        label.setAttribute("class", "term");
        label.appendChild(document.createTextNode(text));
        container.appendChild(label);
    }
    return container;
}
function term(match, index) {
    //Makes term div and sorts charges by handling to determin term radio buttons.
    var container, paragraph, check;
    container = document.createElement("div");
    container.setAttribute("class", "term");
    paragraph = document.createElement("p");
    //Checks radio of life or only mt.
    if (match.life==="LIFE") {
        check = true;
    } else if (match.lt==0 && match.ut==0) {
        check = true;
    } else {
        check = false;
    }
    if (match.life==="DEATH") {
        paragraph.appendChild(document.createTextNode("Death/LWOP"));
        container.appendChild(paragraph);
    } else if (match.life==="LWOP") {
        paragraph.appendChild(document.createTextNode("LWOP"));
        container.appendChild(paragraph);
    } else if (match.life==="LIFE") {
        if (match.mt > 0) {
            container.appendChild(radio(index, match.mt, check));
        } else {
            container.appendChild(radio(index, 84, check));
        }
    } else {
        container.appendChild(radio(index, match.lt, check));
        container.appendChild(radio(index, match.mt, check));
        container.appendChild(radio(index, match.ut, check));
    }
    return container;
}
function selected(match, index) {
    //Pushes the selected term to pleading.
    var i,term;
    if (match.life.length > 0) {
        if (match.life==="DEATH" || match.life==="LWOP") {
            term = 0;
        } else if (match.life==="LIFE") {
            if (match.lt<=0 && match.ut<=0) {
                term = match.mt;
            } else {
                term = 84;
            }
        }
    } else {
        for (i=0; i < document.getElementsByName("charge" + index).length; i++) {
            if (document.getElementsByName("charge" + index)[i].checked) {
                term = document.getElementsByName("charge" + index)[i].value;
                break;
            } else {
                term = match.ut;
            }
        }
    }
    return term;
}
function addButton(match, index) {
    //Makes the button used for adding charges from leonardo to raphael.
    var text, id, button, plus, i, holder, heading;
    text = document.createTextNode("Add " + match.handling);
    button = document.createElement("a");
    plus = document.createElement("div");
    if (match.handling==="enhancement" && pleading.length===0) {
        //Enhancement when no charges have been added
        plus.setAttribute("class", "no_plus");
        plus.appendChild(document.createTextNode("No Charges"));
        button.appendChild(plus);
        return button;
    } else if (match.handling==="enhancement" && pleading.length > 0) {
        //Enhancement after charges have been added.
        holder = document.createElement("div");
        holder.setAttribute("class", "holder");
        heading = document.createElement("p");
        heading.appendChild(document.createTextNode("Add Enhancement:"));
        holder.appendChild(heading);
        for (i=0; i<pleading.length; i++) {
            if (pleading[i].charge.handling==="charge" || pleading[i].charge.handling==="attempt") {
                text = pleading[i].count;
                id = text + "_" + index;
                button = document.createElement("button");
                button.setAttribute("type", "button");
                button.setAttribute("id", text + "_" + index);
                button.setAttribute("onclick", "addEnhancement('" + text + "', '" + id + "', '" + index + "')");
                button.appendChild(document.createTextNode(text));
                holder.appendChild(button);
                enhancementHack.push([id, match, index,]);
            }
        }
        return holder;
    } else {
        //Adds charges.
        button.addEventListener("click", function() {addCount(match, isPrincipal(match, index), isConcurrent(match, index), isAttempt(match, index), selected(match, index))});
        plus.setAttribute("class", "plus");
        plus.appendChild(text);
        button.appendChild(plus);
        return button;
    }
}
function controlCapsule(match, index) {
    //Puts controls together in leonardo div.
    var controls;
    controls = document.createElement("div");
    controls.setAttribute("class", "controls");
    controls.appendChild(checkboxPrincipal(match, index));
    controls.appendChild(checkboxConcurrent(match, index));
    controls.appendChild(checkboxAttempt(match, index));
    controls.appendChild(term(match, index));
    controls.appendChild(addButton(match, index));
    return controls;
}