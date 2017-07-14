import $ from "jquery";
import Map from "./graphics/map.js";
import Entities from "./graphics/entities.js";

// Fallback
window.requestAnimFrame = (() => {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function update(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

// eigentliches Game
export default function() {

	// Enthält alle Daten fürs Spiel
	var storage = {
		airplanes: [],
		runways: [],
		parkingslots: [],
		gates: []
	};

	// Erzeugt die Grafik Layer
	var map = Map(storage);
	var entities = Entities(storage);

	// Erzeuge Gameloop
	function tick(timestamp) {
		// Tick

		entities.render();

		requestAnimationFrame(tick);
	}

	// start
	tick();

	// resize vom Browser
	$(window).resize(function() {
		// zeichne neu
		map.resize();
		map.render();
		entities.resize();
		entities.render();
	});

};