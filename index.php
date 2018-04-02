<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Waiting</title>
	<link rel="stylesheet" href="css/bootstrap.min.css" >

	<style>
		li{
			color: #F44336;
		    border: 1px solid #ddd;
		    border-radius: 20px;
		    padding: 10px;
		    background: #B0BEC5;
		    margin:10px; 
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>welcome</h1>
		<div class="row">
			<div class="col-md-4"></div>
			<div class="col-md-8">
				<ul id="messages"></ul>
				<form id="message-form" action="">
					<input name="message" type="text" placeholder="Message">
					<button>Send</button>
				</form>
				<button id="call">call</button>
			</div>
		</div>
	</div>
	<img id="call-img" src="ringing-img.gif" width="100px" alt="" style="display:none;"/>
	
    <audio id="callerAudio" controls loop style="display:none; ">
	  <source src="caller-tone.mp3" type="audio/mp3">
	</audio>

	<audio id="reciverAudio" controls loop style="display:none; ">
	  <source src="reciver-tone.mp3" type="audio/mp3">
	</audio>
	<script src="/socket.io/socket.io.js"></script>
	<script src="/js/libs/jquery-3.3.1.min.js"></script>
	<script src="/js/libs/bootstrap.min.js"></script>
	<script src="/js/index.js"></script>
</body>
</html>