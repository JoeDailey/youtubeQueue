
var queueButtonSize = 48;
var queueSize = 150;
var queueItemSize = 120;
var isUp = false;
var queueList = JSON.parse($.jStorage.get("joe_queue"));

//add all to queue

if(queueList == undefined)
	queueList = new Array();

$("#body-container").css({"margin-bottom":queueButtonSize+"px"});
$("#footer-container").css({"padding-bottom":queueButtonSize+"px",
								"height":+queueButtonSize+20});

var joe_queue_container = $("<div id='joe_queue_container'><div id='joe_queue_buttons'><div id='joe_queue_buttons_show'>Queue</div><div id='joe_queue_buttons_clear'>clear</div><div style='clear: both;'></div></div><div id='joe_queue'></div></div>");


$("#body").prepend(joe_queue_container);

joe_queue_container.css({
				"width":"100%",
				"background":"#222222",
				"position":"fixed",
				"bottom":"0px",
				"z-index":1000
				});
$("#joe_queue_buttons").css({
				"width":"100%",
				"height":queueButtonSize+"px",
				"background":"#333333",
				"font-size":"48px",
				"cursor":"pointer", 
				"display":"inline"
				});
$("#joe_queue_buttons_clear").css({
				"height":queueButtonSize+"px",
				"background":"#333333",
				"font-size":"48px",
				"cursor":"pointer",
				"float":"right"
				});
console.log($("joe_queue_buttons_clear").width("width"));
$("#joe_queue_buttons_show").css({
				"width":document.width - ($("joe_queue_buttons_clear").css("width")+"").split("px")[0] + "px",
				"height":queueButtonSize+"px",
				"background":"#333333",
				"font-size":"48px",
				"cursor":"pointer",
				"float":"left"
				});
$("#joe_queue").css({
				"width":"100%",
				"height":"0px",
				"overflow-x":"auto",
				"overflow-y":"hidden"	
				});

$("#joe_queue_buttons_show").click(function(){
	if(isUp){
		$("#joe_queue").animate({"height":"0px"});
		isUp = false;
	}else{
		$("#joe_queue").animate({"height":queueSize+"px"});
		isUp = true;
	}
});


var queueUp = $('<button id="joe_queue_up">Queue</button>');

$("#watch-headline-title").append(queueUp);
var url = document.location.href;
url = url.split("v=")[1].split("&")[0];
queueUp.click({"url": url}, addItem);

console.log(queueList);
for(var i = 0; i < queueList.length; i++){
	var item = $('<a href="/watch?v='+queueList[i]+'"><img src="//i1.ytimg.com/vi/'+queueList[i]+'/default.jpg"></a>');
	
	item.css({
				"height":queueSize+"px",
				"display":"inline",
				"float":"left",
				"margin-bottom":"30px",
				"margin-top":"30px",
				"margin-left":"15px",
				"margin-right":"15px"
				});
	$("#joe_queue").append(item);
}

var openQueue = function() {
	$("#joe_queue").animate({"height":queueSize+"px"});
	$(".joe_queue_item").animate({"height":queueItemSize+"px"});
}
function addItem(params){
	var item = $('<a href="/watch?v='+params.data.url+'"><img src="//i1.ytimg.com/vi/'+params.data.url+'/default.jpg"></a>');
	
	item.css({
				"height":queueSize+"px",
				"display":"inline",
				"float":"left",
				"margin-bottom":"30px",
				"margin-top":"30px",
				"margin-left":"15px",
				"margin-right":"15px"
				});
	queueList.push(params.data.url);
	$.jStorage.set("joe_queue", JSON.stringify(queueList));
	$("#joe_queue").append(item);
}
window.onhashchange = function () {
	console.log("Asdfaasdfghjkl;kjhgfdfghjklkjhgfdsdfghjklkjhgfdsfghjklkeujvoinpwh9ihnrepvoikbrpverhbvpireubvrpiubrepvireuhvperqivhuberpvieh");
	if($("#joe_queue_up") == undefined){
		var queueUp = $('<button id="joe_queue_up">Queue</button>');

		$("#watch-headline-title").append(queueUp);
		var url = document.location.href;
		url = url.split("v=")[1].split("&")[0];
		queueUp.click({"url": url}, addItem);
	}
};