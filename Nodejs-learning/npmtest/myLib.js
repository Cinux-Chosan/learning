exports.util =  {
    readObj: function readObj(obj, res) {
        var count_f = 0,
            count_p = 0;
        for (e in obj) {
            if (typeof obj[e] == "function") {
                res.write(e + ":" + "function" + "<br/>");
                count_f++;
            } else {
                res.write(e + ":" + obj[e] + "<br/>");
                count_p++;
            }
        }
        res.write('<h1>Properties:' + count_p + '</h1>');
        res.write('<h1>Functions:' + count_f + '</h1>');
    }
}
