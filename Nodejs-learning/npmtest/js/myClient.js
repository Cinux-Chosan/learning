


var opt = {
  url: 'http://localhost:80',
  data: { name: 'Zhang Jianjun'}
}

$('#sendMsg').click(function(){
  $.ajax(opt).then(function(data) {
    alert(data);
  });
});
