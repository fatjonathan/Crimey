//Navigates between screen when some are hidden.
$(document).ready(function() {
    //Used when opened.
    var reveal = $(".controls:checked").val();
    if ($(window).width() < 600) {
        $(".screen").hide();
        $("#"+reveal).show();
    } else {
        $(".screen").show();
    }
});
$(window).resize(function() {
    //Used when resized.
    var reveal = $(".controls:checked").val();
    if ($(window).width() < 600) {
        $(".screen").hide();
        $("#"+reveal).show();
    } else {
        $(".screen").show();
    }
});
$(document).change(function() {
    //Used to toggle between screens when hidden.
    var reveal = $(".controls:checked").val();
    $(".controls", function() {
        $(".screen").hide();
        $("#"+reveal).show();
    });
});
$(document).on('click', '.title', function() {
    //Displays the info div when the title div is clicked in Leonardo.
    $(this).closest('.charge_container').find('.info').slideToggle('fast');
});
$(document).on('click', '.enhancement_title', function() {
    //Does the same thing as the above for enhancements in Raphael.
    $(this).closest('.enhancement_container').find('.enhancement_info').slideToggle('fast');
});
$(document).on('click', '#strikes_title', function() {
    //Does the same thing as the above for strikes.
    $(this).closest('#strikes').find('#strikes_info').slideToggle('fast');
});

function chargeCount() {
    //Displays number of counts in tab.  Called by addCount() and strikeCount().
    var counts = pleading.filter(function(i) {return i.charge.handling == "charge" || i.charge.handling == "attempt"}).length;
    if (pleading.length===0) {
        document.getElementById("chargeCount").innerHTML = "Charges";
    } else {
        document.getElementById("chargeCount").innerHTML = "Charges <span>(" + counts + ")</span>";
    }
}