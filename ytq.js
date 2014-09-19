var _getV = function(URL) {
	var splitURL = URL.split("?");
	var imageURL = "";
	for (var i = 0; i < splitURL.length; i++) {
		if(splitURL[i].indexOf("v=") > -1){
			return splitURL[i].split("=")[1];
		}
	};
 }

//is up
var isUp = $.jStorage.get("joe_queue_is_up");
if(!isUp){
	isUp = false;
	$.jStorage.set("joe_queue_is_up", isUp);
}

//is shuffle
// var queueShuffle = $.jStorage.get("joe_queue_shuffle");
// console.log("shuffle",queueShuffle);
// if(!queueShuffle){
// 	queueShuffle = false;
// 	$.jStorage.set("joe_queue_is_up", queueShuffle);
// }

//queue 
var queueList = JSON.parse($.jStorage.get("joe_queue"));
if(!queueList){
	queueList = new Array();
	$.jStorage.set("joe_queue", JSON.stringify(queueList));
}

//current video in queue
var queuePosition = $.jStorage.get("joe_queue_position");
console.log(queuePosition);
if(!queuePosition){
	queuePosition = 0;
	$.jStorage.set("joe_queue_position", queuePosition);
}

var _Queue = {
	toggle:function(){
		if(isUp){
			$("#joe_queue_container").addClass("isDown");
			isUp = false;
		}else{
			$("#joe_queue_container").removeClass("isDown");
			isUp = true;
		}
		$.jStorage.set("joe_queue_is_up", isUp);
	},
	clear:function(){
		queueList = new Array();
		$.jStorage.deleteKey("joe_queue");
		$("#joe_queue").empty();
	},
	select:function($div){
		queuePosition = $($div).attr("joe-queue-pos");
		$.jStorage.set("joe_queue_position", queuePosition);
	},
	next:function(){
		queuePosition++;
		$.jStorage.set("joe_queue_position", queuePosition);
		document.location.href = "https://www.youtube.com/watch?v="+_getV(queueList[queuePosition]);
	},
	prev:function(){
		queuePosition--;
		$.jStorage.set("joe_queue_position", queuePosition);
		document.location.href = "https://www.youtube.com/watch?v="+_getV(queueList[queuePosition]);
	},
	// shuffle:function(){
	// 	queueShuffle = !queueShuffle;
	// 	$.jStorage.set("joe_queue_shuffle", queueShuffle);
	// 	$("#joe_queue_buttons_shuffle").toggleClass("isShuffle");
	// },
	append:function(url){
		var imageURL = _getV(url);

		var item = $('<a  class="joe_queue_list_item" joe-queue-pos="'+(queueList.length)+'" href="'+url+'"><img src="//i1.ytimg.com/vi/'+imageURL+'/default.jpg"></a>');
	
		item.css({
			"height":queueSize+"px"
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
	},
	insert:function(url){
		console.log(url);
		// shift all latter
		var i;
		for (var i = queueList.length - 1; i > queuePosition; i--) {
			queueList[i+1] = queueList[i]; 
		};
		//add after current
		queueList[i+1] = url;
		console.log("queueList", queueList)
		//save
		$.jStorage.set("joe_queue", JSON.stringify(queueList));
		
		//empty DOM queue
		$("#joe_queue").empty();
		// (re)populate DOM queue
		for(var x = 0; x < queueList.length; x++){
			console.log(queueList);
			var imageURL = _getV(queueList[x]);
			var item = $(
				'<a class="joe_queue_list_item" joe-queue-pos="'+x+'" href="'+queueList[x]+'">'+
					'<img src="//i1.ytimg.com/vi/'+imageURL+'/default.jpg">'+
				'</a>'
			);

			if(x == queuePosition)
				item.find("img").addClass("playing");

			$("#joe_queue").append(item);
		 }
	}
}




var queueButtonSize = 48;
var queueSize = 150;
var queueItemSize = 120;


//set up UI to inject
$("#footer-container").css({"height":+queueButtonSize+20});
var joe_queue_container = $(
	"<div id='joe_queue_container'>"+
		"<div id='joe_queue_buttons'>"+
			"<div id='joe_queue_buttons_show' class='joe_queue_buttons'><i class='fa fa-arrow-up'></i></div>"+
			"<div id='joe_queue_buttons_prev' class='joe_queue_buttons'><i class='fa fa-step-backward'></i></div>"+
			// "<div id='joe_queue_buttons_shuffle' class='joe_queue_buttons'><i class='fa fa-random'></i></div>"+
			"<div id='joe_queue_buttons_next' class='joe_queue_buttons'><i class='fa fa-step-forward'></i></div>"+
			"<div id='joe_queue_buttons_clear' class='joe_queue_buttons'><i class='fa fa-trash'></i></div>"+
			"<div style='clear: both;'></div>"+
		"</div>"+
		"<div id='joe_queue'></div>"+
	"</div>"
);
// if(queueShuffle)
// 	joe_queue_container.find("#joe_queue_buttons_shuffle").addClass("isShuffle");
$("#body").prepend(joe_queue_container);

//set state
console.log('isUp=', isUp, 'queueList[queuePosition] != "/"+document.location.href.split("/")[3]=', queueList[queuePosition] != "/"+document.location.href.split("/")[3] );
if(isUp && queueList[queuePosition] == "/"+document.location.href.split("/")[3]){
	$("#joe_queue_container").removeClass("isDown");
	isUp = true;
}else{
	$("#joe_queue_container").addClass("isDown");
	isUp = false;
}
$.jStorage.set("joe_queue_is_up", isUp);

//add queue button to all links
$.each($('a[href^="/watch?v="]'), function(index, link){
	var url = $(link).attr("href");
	$($(link).parent()).append($(
		"<div class='joe_add2queue_buttons'>"+
			"<button class='joe_add2queue_button_last' joe-queue-link="+url+">"+
				"<i class='fa fa-share'></i>"+
			"</button>"+
			"<button class='joe_add2queue_button_next' joe-queue-link="+url+">"+
				"<i class='fa fa-level-down'></i>"+
			"</button>"+
		"</div>"
	));
});
//on queue button press
$(".joe_add2queue_button_last").on("click", function(){
	_Queue.append($(this).attr("joe-queue-link"));
});
$(".joe_add2queue_button_next").on("click", function(){
	_Queue.insert($(this).attr("joe-queue-link"));
});


// populate DOM queue
for(var x = 0; x < queueList.length; x++){
	var imageURL = _getV(queueList[x]);
	var item = $(
		'<a class="joe_queue_list_item" joe-queue-pos="'+x+'" href="'+queueList[x]+'">'+
			'<img src="//i1.ytimg.com/vi/'+imageURL+'/default.jpg">'+
		'</a>'
	);
	if(x == queuePosition && queueList[x] == "/"+document.location.href.split("/")[3] )
		item.find("img").addClass("playing");

	$("#joe_queue").append(item);
 }

////Events
//show queue
$("#joe_queue_buttons_show").click(function(){
	console.log("isup-before",isUp);
	_Queue.toggle();
	console.log("isup-after",isUp);
 });
//clear queue
$("#joe_queue_buttons_clear").click(function(){
	_Queue.clear();
 });
$("#joe_queue_buttons_next").click(function(){
	_Queue.next();
 });
// $("#joe_queue_buttons_shuffle").click(function(){
// 	_Queue.shuffle();
//  });
$("#joe_queue_buttons_prev").click(function(){
	_Queue.prev();
 });

$(".joe_queue_list_item").click(function(){
	_Queue.select($(this));
 });

try{
	//on video end, play next
	var video = document.getElementsByTagName('video')[0];

	video.onended = function(e) {
		if(video.getAttribute("data-youtube-id") == _getV(queueList[queuePosition])){
			_Queue.next();
		}else{
			console.log("not the right video");
		}

	};
}catch(e){
	console.log("not a video");
}









