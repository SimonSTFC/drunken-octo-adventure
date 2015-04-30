var username = "";

var socket = io();

$(document).keypress(function(e) {
    if(e.which == 13) {
		return submitMessage();
    }
});

$("form").submit(function(){
	return submitMessage();
});

socket.on("chat message", function(msg){

	addMessage(msg);
});

socket.on("new user", function(msg){
	$("#whose-online").append("<div class='row'> <div class='col-md-12'><i class='fa fa-comment' style='margin-right: 5px;'></i>"+msg+"</div></div>");
});

socket.on("remove user", function(msg){

	
	var numUsers = $("#whose-online .row").length;
	for(var i=1; i < numUsers+1; i++) {

		var text = $("#whose-online .row:nth-child("+i+")").text();
		text = $.trim(text);

		if(text === msg) {
			$("#whose-online .row:nth-child("+i+")").remove();
			break;
		}
	}
});

socket.on("current users", function(msg){
	for(var key in msg)
	{
		$("#whose-online").append("<div class='row'> <div class='col-md-12'><i class='fa fa-comment' style='margin-right: 5px;'></i>"+msg[key]+"</div></div>");
	}
});

socket.on("connect message", function(msg){
	addColouredMessage(msg, "#60B285");
});

socket.on("disconnect message", function(msg){
	addColouredMessage(msg, "#B2564D");
});

$("#username-button").click(function(){
	if($("#username").val() !== "") {
		username = $("#username").val();

		$("#requestUsername").hide();
		$("#messenger").show();
		$("#enter-message").show();

		addColouredMessage("You've entered the chat!", "#EEEEEE");
		socket.emit("new user", username);
	}
});

function addMessage(msg) {
	if($("#messages").is(":visible")) {
		$("#messages .row:last-child").css("margin-bottom", "0px");
		$("#messages").append("<div class='row'> <div class='col-md-12'>"+msg+"</div></div>");
		$("#messages .row:last-child").css("margin-bottom", "60px");
		$("html,body").animate({ scrollTop:  $(window).scrollTop() + $(window).height()});
	}
}

function addColouredMessage(msg, colour) {
	if($("#messages").is(":visible")) {
		$("#messages .row:last-child").css("margin-bottom", "0px");
		$("#messages").append("<div class='row'> <div class='col-md-12'>"+msg+"</div></div>");
		$("#messages .row:last-child").css("margin-bottom", "60px").css("background-color", colour);
		$("html,body").animate({ scrollTop:  $(window).scrollTop() + $(window).height()});
	}
}

function submitMessage() {
	var date = new Date();
	var msg = "<strong>" +  $("#username").val() + ": </strong>";
	msg += $("#m").val();
	msg += "<i class='timestamp'>"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"</i>";
	socket.emit("chat message", msg);
	addMessage(msg);
	$("#m").val("");
	return false;
}
