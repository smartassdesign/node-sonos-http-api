var http = require('http');	
var SonosDiscovery = require('sonos-discovery');
var discovery = new SonosDiscovery();
var port = 5005;

var server = http.createServer(function (req, res) {
	
	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Cache-Control': 'no-cache' 
	});
	
	var params = req.url.substring(1).split('/');

	if (params.length < 2 && params[0] !== "zones") {
		return;
	} else if (params.length == 2 && params[0] == "preset") {
		// Handle presets
		var opt = {
			action: params[0],
			value: params[1]
		};
	} else if (params.length > 1) {
	

		var opt = {
			room: params[0],
			action: params[1],
			value: params[2]
		};

	} else {
		// guessing zones
		var opt = {
			action: params[0]
		}
	}

	console.log("received command", opt);

	var response = handleAction(opt);
	
	if (response) {
		var jsonResponse = JSON.stringify(response);
		res.write(new Buffer(jsonResponse));
	}

	res.end();
	
});

function handleAction(options) {

	if (options.action === "zones") {
		return discovery.getZones();
	}

	if (options.action == "preset") {
		// Apply preset
		var preset = JSON.parse(decodeURIComponent(options.value));
		discovery.applyPreset(preset);
	}

	var roomName = decodeURIComponent(options.room);
	var player = discovery.getPlayer(roomName);
	if (!player) return;

	console.log(options);

	switch (options.action.toLowerCase()) {
		case "play":
			player.coordinator.play();
			break;
		case "pause":
			player.coordinator.pause();
			break;
		case "volume":
			player.setVolume(options.value);
			break;
		case "state":
			return player.coordinator.state;
			break;
		case "seek":
			player.coordinator.seek(options.value);
			break;
		case "next":
			player.coordinator.nextTrack();
			break;
		case "previous":
			player.coordinator.previousTrack();
			break;
		case "setavtransport":
			player.setAVTransportURI(options.value);
	}

}

server.listen(port);

console.log("http server listening on port", port);