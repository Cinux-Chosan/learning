
function sp(tick_id, time) {
    var flag = setInterval(function() {
        $("#query_ticket").click();
        if (typeof tick_id == "string" && hasTick(tick_id)) {
            clearInterval(flag);
        } else if (tick_id instanceof Array) {
            tick_id.forEach(function(i) {
                if (hasTick(i)) {
                    clearInterval(flag);
                }
            });
        }


    }, time);
}

function hasTick(id) {
    if (($("#WZ_" + id).text().trim() != "" && $("#WZ_" + id).text() != "--" && $("#WZ_" + id).text() != '无') ||
        ($("#ZE_" + id).text().trim() != "" && $("#ZE_" + id).text() != "--" && $("#ZE_" + id).text() != "无") ||
        ($("#YW_" + id).text().trim() != "" && $("#YW_" + id).text() != "--" && $("#YW_" + id).text() != "无")
    ) {
        setTimeout(function(){
          $("#ticket_" + id).find("td:last-child > a").click();
        } ,0);
        return true;
    } else {
        return false;
    }
}

sp("6i000G131203", 200);
// sp(["6i000G131203","650000K81401"], 200);
