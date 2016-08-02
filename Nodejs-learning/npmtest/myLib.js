exports.util =  {
    readObj: function readObj(obj, res) {
      res = res ? res : {
        write: function (data) {
        console.log(data);
      }
    };
        var count_f = 0,
            count_p = 0,
            count_tmp = 0,
            arr_f = {},
            arr_p = {};
        for (var e in obj) {
            if (typeof obj[e] == "function") {
                //res.write(e + ":" + "function" + "<br/>");
                arr_f[e] = obj[e];
                count_f++;
            } else {
                //res.write(e + ":" + obj[e] + "<br/>");
                arr_p[e] = obj[e]
                count_p++;
            }
        }
        res.write('<html><body>');
        res.write('<h1>Properties:' + count_p + '</h1>');
        res.write('<h1>Functions:' + count_f + '</h1>');
        res.write('<div>+++++++++++++++++++Properties++++++++++++++++++++</div>');
        for(var e in arr_p) {
          res.write(count_tmp++ + '........' + e + ":" + obj[e] + "<br/>");
        }
        res.write('<div>++++++++++++++++++++Functions++++++++++++++++++++</div>');
        count_tmp = 0;
        for(var e in arr_f) {
          res.write(count_tmp++ + '........' + e + ":" + "function" + "<br/>");
        }
        res.write('</body></html>');

    }
}
