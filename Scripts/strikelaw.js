function strikeLaw(count, concurrent, selected, charge, strike) {
    //Calculates exposure based on one and three strike sentencing schemes.
    var principal, scheme, term, display, option, i, ii, iii;
    principal = principalSelected();
    scheme = document.strikes_form.scheme.value;
    if (scheme==="one_strikelaw") {
        if (count===principalSelected()) {
            term = selected * 2;
            display = toYears(term) + "*";
        } else if (concurrent===true) {
            term = 0;
            display = "Concurrent";
        } else if (charge.life==="DEATH" || charge.life==="LWOP") {
            term = 0;
            display = charge.life;
        } else if (charge.life==="LIFE") {
            if (charge.mt > 0) {
                term = charge.mt * 2;
            } else {
                term = 84 * 2;
            }
            display = toYears(term) + " to life";
        } else {
            term = (charge.mt/3) * 2;
            display = toYears(term);
        }
    } else if (scheme==="three_strikelaw") {
        if (charge.life==="DEATH" || charge.life==="LWOP") {
            term = 0;
            display = charge.life;
        } else if (charge.life==="LIFE") {
            ii = 300;
            if (charge.mt > 0) {
                iii = charge.mt;
            } else {
                iii = 84;
            }
            term = Math.max(ii, iii);
            display = toYears(term) + " to life";
        } else if (charge.type==="violent" || charge.type==="serious" || strike===true) {
            option = pleading.filter(function(a) {return a.count===count}).map(function(b) {return Number(b.selected)});
            i = selected * 3;
            ii = 300;
            iii = option.reduce(function(sum, months) {return sum + months});
            term = Math.max(i, ii, iii);
            display = toYears(term) + " to life";
        } else if (count===principal) {
            term = selected * 2;
            display = toYears(term) + "*";
        } else {
            term = (charge.mt/3) * 2;
            display = toYears(term);
        }
    } else if (scheme==="excluded_strikelaw") {
        if (charge.life==="DEATH" || charge.life==="LWOP") {
            term = 0;
            display = charge.life;
        } else if (charge.life==="LIFE") {
            ii = 300;
            if (charge.mt > 0) {
                iii = charge.mt;
            } else {
                iii = 84;
            }
            term = Math.max(ii, iii);
            display = toYears(term) + " to life";
        } else {
            option = pleading.filter(function(a) {return a.count===count}).map(function(b) {return Number(b.selected)});
            i = selected * 3;
            ii = 300;
            iii = option.reduce(function(sum, months) {return sum + months});
            term = Math.max(i, ii, iii);
            display = toYears(term) + " to life";
        }
    }
    return [term, display];
}
function strikeLawUpdate() {
    //Updates display when strike scheme is selected.
    var list, i, term, principal, next;
    list = pleading.map(function(l) {return l.name});
    principalPicker();
    for (i=0; i < list.length; i++) {
        document.getElementById(list[i] + "_display").innerHTML = "";
        displayTerm(list[i]);
    }
    addItUp();
}