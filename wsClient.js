window.wsClient = function(ipPortUrl, cfg) {
	'use strict';

	var wsReady = false;
	var api;
	var wsConn = new WebSocket(ipPortUrl, []);

	var sendMessage = function(kind, o) {
		if (typeof o !== 'object') {
			o = {value: o};
		}
		o.kind = kind;

		var data = JSON.stringify(o);
		// console.log('|-> ' + data);
		wsConn.send(data);
	};

	// When the connection is open, send some data to the server
	wsConn.onopen = function () {
		wsReady = true;
		//console.log('WS CONNECTED!');
		if (cfg.onReady) {
			cfg.onReady(api);
		}
	};

	// Log errors
	wsConn.onerror = function(err) {
		// console.log('WS ERROR', err);
		if (cfg.onError) {
			cfg.onError(err);
		}
	};

	// Log messages from the server
	wsConn.onmessage = function(ev) {
		// console.log('|<- ' + ev.data);
		if (cfg.onMessage) {
			cfg.onMessage( JSON.parse(ev.data) );
		}
	};

	api = {
		sendMessage: sendMessage,
		isReady: function() {
			return wsReady;
		}
	};

	return api;
};
