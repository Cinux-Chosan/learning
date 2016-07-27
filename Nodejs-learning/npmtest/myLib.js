exports.util =  {
    readObj: function readObj(obj, res) {
      res = res ? res : {
        write: function(data) {
        console.log(data);
      }
    };
        var count_f = 0,
            count_p = 0,
            arr_f = {},
            arr_p = {};
        for (e in obj) {
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
        res.write('<h1>Properties:' + count_p + '</h1>');
        res.write('<h1>Functions:' + count_f + '</h1>');
        res.write('<div>+++++++++++++++++++Properties++++++++++++++++++++</div>');
        for(e in arr_p) {
          res.write(e + ":" + obj[e] + "<br/>");
        }
        res.write('<div>++++++++++++++++++++Functions++++++++++++++++++++</div>');

        for(e in arr_f) {
          res.write(e + ":" + "function" + "<br/>");
        }

    }
}
