


var opt = {
  url: 'http://localhost:8888',
  data: { name: 'Zhang Jianjun'}
}

$('#sendMsg').click(function(){
  $.ajax(opt).then(function(data) {
    alert(data);
  });
});
