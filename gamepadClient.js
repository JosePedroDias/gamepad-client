window.gamepadClient = function(cfg) {
	'use strict';
	
	var api;

	var gp = {
		axis:   new Array(cfg.nrAxis),
		button: new Array(cfg.nrButtons),
		hat:    new Array(cfg.nrHats)
	};

	var convertAxis = function(i) {
		return i / 32768;
	};

	var convertButton = function(i) {
		return !!i;
	};

	var convertHat = function(i) {
		switch (i) {
			case  0: return [ 0,  0];
			case  8: return [-1,  0];
			case  2: return [ 1,  0];
			case  1: return [ 0,  1];
			case  4: return [ 0, -1];
			case  9: return [-1,  1];
			case  3: return [ 1,  1];
			case  6: return [ 1, -1];
			case 12: return [-1, -1];
			default: return i;
		}
	};

	var ws;
	window.wsClient(cfg.ws, {
		onError: function(err) {
			//console.error(err);
			if (cfg.onError) {
				cfg.onError(err);
			}
		},
		onReady: function(api) {
			//console.warn('ready!');
			ws = api;
			if (cfg.onReady) {
				cfg.onReady(api);
			}
		},
		onMessage: function(o) {
			var ctn = gp[o.kind];
			if (!ctn) { return; }
			var v;
			if (o.kind === 'axis') {
				v = convertAxis(o.value);
			}
			else if (o.kind === 'hat') {
				v = convertHat(o.value);
			}
			else if (o.kind === 'button') {
				v = convertButton(o.value);
			}
			ctn[ o.which ] = v;
			o.value = v;
			if (cfg.onEvent) {
				cfg.onEvent(o)
			}
		}
	});

	api = {
		getState: function() {
			return gp;
		}
	};

	return api;
};

