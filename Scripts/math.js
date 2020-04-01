var pleading, enhancementHack, principalHack;

pleading = [];

function chargeConstructor(count, name, concurrent, attempt, selected, charge) {
    this.count = count;
    this.name = name;
    this.concurrent = concurrent;
    this.attempt = attempt;
    this.selected = selected;
    this.charge = charge;
    this.isAPartOf = function() {
        return pleading.filter(function(p) {return p.name == count});
    }
    this.isAStrike = function() {
        var strikes = pleading.filter(function(p) {return p.count == count && (p.charge.type==="serious" || p.charge.type==="violent")});
        if (strikes.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    this.imposed = function() {
        var principal, term, display;
        principal = principalSelected();
        if (this.charge.handling==="charge" || this.charge.handling==="attempt") {
            if (document.strikes_form.scheme.value != "none") {
                term = strikeLaw(this.count, this.concurrent, this.selected, this.charge, this.isAStrike())[0];
                display = strikeLaw(this.count, this.concurrent, this.selected, this.charge, this.isAStrike())[1];
            } else if (this.count===principal) {
                if (this.attempt===true) {
                    term = this.selected/2;
                } else {
                    term = this.selected;
                }
                display = toYears(term) + "*";
            } else if (this.concurrent===true) {
                term = 0;
                display = "Concurrent";
            } else if (this.charge.life==="DEATH" || this.charge.life==="LWOP") {
                term = 0;
                display = this.charge.life;
            } else if (this.charge.life==="LIFE") {
                if (this.charge.mt > 0) {
                    term = this.charge.mt;
                } else {
                    term = 84;
                }
                display = toYears(term) + " to life";
            } else {
                if (this.attempt===true) {
                    term = (this.charge.mt/2)/3;
                } else {
                    term = this.charge.mt/3;
                }
                display = toYears(term);
            }
        } else if (this.charge.handling==="enhancement") {
            if (this.butStayed()===true) {
                term = 0;
                display = "Concurrent";
            } else if (this.count===principal || this.madeLife()===true) {
                if (this.isAPartOf()[0].attempt===true) {
                    term = this.selected/2;
                } else {
                    term = this.selected;
                }
                display = toYears(term);
            } else if (this.charge.life==="DEATH" || this.charge.life==="LWOP") {
                term = 0;
                display = this.charge.life;
            } else if (this.charge.life==="LIFE" && this.charge.mt > 0) {
                term = this.charge.mt;
                display = toYears(term);
            } else if (this.charge.life==="LIFE" && this.charge.mt <= 0) {
                term = 84;
                display = toYears(84) + " to life";
            } else {
                if (this.isAPartOf()[0].attempt===true) {
                    term = (this.selected/3)/2;
                } else {
                    term = this.selected/3;
                }
                display = toYears(term);
            }
        } else if (this.charge.handling==="prior") {
            term = this.selected;
            display = toYears(term);
        }
        return [term, display];
    }
    this.butStayed = function() {
        var principal = principalSelected();
        if (this.concurrent===true) {
            return true;
        } else if (this.count===principal && this.isAPartOf().concurrent===true && this.concurrent===false) {
            return false;
        } else if (this.isAPartOf()[0].concurrent===true) {
            return true;
        } else {
            return false;
        }
    }
    this.madeLife = function() {
        var main = this.isAPartOf();
        if (this.charge.life.length > 0) {
            return true;
        } else if (main[0].charge.life.length > 0) {
            //Stops 654 on enhancements attached to indeterminate charges.
            return true;
        } else if (pleading.filter(function(p) {return p.count == count && p.charge.life.length > 0}).length > 0) {
            return true;
        } else if (this.isAStrike()===true && (document.strikes_form.scheme.value==="three_strikelaw" || document.strikes_form.scheme.value==="excluded_strikelaw")) {
            //Stops 654 on enhancements attached to three strikes charges.
            return true;
        } else {
            return false;
        }
    }
}
function addItUp() {
    //Adds all charges in pleading.
    var death, lwop, life, terms, total, answer;
    document.getElementById("raphael_total").innerHTML = "";
    death = pleading.filter(function(p) {return p.charge.life==="DEATH"});
    lwop = pleading.filter(function(p) {return p.charge.life==="LWOP"});
    life = pleading.filter(function(p) {return p.charge.life==="LIFE"});
    terms = pleading.map(function(p) {return Number(p.imposed()[0])});
    total = terms.reduce(function(sum, months) {return sum + months});
    if (death.length > 0) {
        answer = "Death/LWOP";
    } else if (lwop.length > 0) {
        answer = "LWOP";
    } else if (life.length > 0) {
        answer = toYears(total) + " to Life";
    } else {
        answer = toYears(total);
    }
    document.getElementById("raphael_total").appendChild(document.createTextNode(answer));
}