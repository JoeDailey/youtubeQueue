//functions
var openQueue = function() {
	$("#joe_queue").animate({"height":queueSize+"px"});
	$(".joe_queue_item").animate({"height":queueItemSize+"px"});
 }
var addItem = function(url){
	var imageURL = getV(url);

	var item = $('<a  class="joe_queue_list_item" joe-queue-pos="'+(queueList.length)+'" href="'+url+'"><img src="//i1.ytimg.com/vi/'+imageURL+'/default.jpg"></a>');
	
	item.css({
				"height":queueSize+"px",
				"display":"inline-block",
				"padding-left":"15px",
				"padding-right":"15px"
				});

	$(item.children("img")).css({
		"height":"100px",
		"margin-top":"20px",
	});

	queueList.push(url);
	$.jStorage.set("joe_queue", JSON.stringify(queueList));
	$("#joe_queue").append(item);
	$(".joe_queue_list_item").click(function(){
		queuePosition = $(this).attr("joe-queue-pos");
		$.jStorage.set("joe_queue_position", queuePosition);
	});
 }
 var getV = function(URL){
 	var splitURL = URL.split("?");
	var imageURL = "";
	for (var i = 0; i < splitURL.length; i++) {
		if(splitURL[i].indexOf("v=") > -1){
			return splitURL[i].split("=")[1];
		}
	};
 }



var queueButtonSize = 48;
var queueSize = 150;
var queueItemSize = 120;

var isUp = $.jStorage.get("joe_queue_is_up");
console.log(isUp);
if(!isUp){
	isUp = false;
	$.jStorage.set("joe_queue_is_up", isUp);
}
var queueList = JSON.parse($.jStorage.get("joe_queue"));
if(!queueList){
	queueList = new Array();
	$.jStorage.set("joe_queue", JSON.stringify(queueList));
}

var queuePosition = $.jStorage.get("joe_queue_position");
console.log(queuePosition);
if(!queuePosition){
	queuePosition = 0;
	$.jStorage.set("joe_queue_position", queuePosition);
}

// setInterval(function(){
// 	console.log(queueList);
// }, 500);


//set up UI to inject
$("#body-container").css({"margin-bottom":queueButtonSize+"px"});
$("#footer-container").css({"padding-bottom":queueButtonSize+"px", "height":+queueButtonSize+20});
var joe_queue_container = $("<div id='joe_queue_container'><div id='joe_queue_buttons'><div id='joe_queue_buttons_show'>Queue</div><div id='joe_queue_buttons_clear'>clear</div><div style='clear: both;'></div></div><div id='joe_queue'></div></div>");
//add to DOM
$("#body").prepend(joe_queue_container);
//set CSS
joe_queue_container.css({
				"width":"100%",
				"background":"rgba(0,0,0,0.95)",
				"position":"fixed",
				"bottom":"-8px",
				"z-index":2000000000
				});
$("#joe_queue_buttons").css({
				"width":"100%",
				"height":queueButtonSize+"px",
				"color":"white",
				"font-size":"48px",
				"cursor":"pointer", 
				"display":"inline"
				});
$("#joe_queue_buttons_clear").css({
				"padding-right":"10px",
				"height":queueButtonSize+"px",
				"color":"white",
				"font-size":"48px",
				"cursor":"pointer",
				"float":"right",
				"position":"relative",
				"top": "10px"
				});
$("#joe_queue_buttons_show").css({
				"padding-left":"10px",
				"width":document.width - ($("joe_queue_buttons_clear").css("width")+"").split("px")[0] + "px",
				"height":queueButtonSize+"px",
				"color":"white",
				"font-size":"48px",
				"cursor":"pointer",
				"float":"left",
				"position":"relative",
				"top": "10px"
				});
if(isUp){
	$("#joe_queue").css({
		"width":"100%",
		"height":queueSize+"px",
		"overflow-x":"scroll",
		"overflow-y":"hidden",
    	"white-space": "nowrap",
		"display": "inline-block"
	});
 }else{
	$("#joe_queue").css({
		"width":"100%",
		"height":"0px",
		"overflow-x":"scroll",
		"overflow-y":"hidden",
    	"white-space": "nowrap",
		"display": "inline-block"
	});
 }


//add queue button to all links
$.each($('a[href^="/watch?v="]'), function(index, link){
	var url = $(link).attr("href");
	$($(link).parent()).append($("<button class='joe-queue-button' joe-queue-link="+url+">Queue</button>"));
});
//on queue button press
$(".joe-queue-button").click(function(){
	addItem($(this).attr("joe-queue-link"));
});



// populate DOM queue
for(var x = 0; x < queueList.length; x++){
	console.log(queueList);
	var imageURL = getV(queueList[x]);
	var item = $('<a class="joe_queue_list_item" joe-queue-pos="'+x+'" href="'+queueList[x]+'"><img src="//i1.ytimg.com/vi/'+imageURL+'/default.jpg"></a>');

	item.css({
		"height":100+"px",
		"display":"inline",
		"padding-left":"15px",
		"padding-right":"15px"
	});
	if(x == queuePosition){
		$(item.children("img")).css({
			"height":"100px",
			"margin-top":"20px",
			"box-shadow":"rgba(255, 255, 255, 0.2) 0px 0px 20px"
		});
	}else{
		$(item.children("img")).css({
			"height":"100px",
			"margin-top":"20px",
			"opacity":0.5,
		});
	}
	$("#joe_queue").append(item);
 }

////Events
//show queue
$("#joe_queue_buttons_show").click(function(){
	if(isUp){
		$("#joe_queue").animate({"height":"0px"});
		isUp = false;
	}else{
		$("#joe_queue").animate({"height":queueSize+"px"});
		isUp = true;
	}
	$.jStorage.set("joe_queue_is_up", isUp);
 });
//clear queue
$("#joe_queue_buttons_clear").click(function(){
	queueList = new Array();
	$.jStorage.deleteKey("joe_queue");
	$("#joe_queue").empty();
 });

$(".joe_queue_list_item").click(function(){
	queuePosition = $(this).attr("joe-queue-pos");
	$.jStorage.set("joe_queue_position", queuePosition);
});

try{
	//on video end, play next
	var video = document.getElementsByTagName('video')[0];

	video.onended = function(e) {
		if(video.getAttribute("data-youtube-id") == getV(queueList[queuePosition])){
			queuePosition++;
			$.jStorage.set("joe_queue_position", queuePosition);
			document.location.href = "https://www.youtube.com/watch?v="+getV(queueList[queuePosition]);
		}else{
			console.log("not the right video");
		}

	};
}catch(e){
	console.log("not a video");
}








