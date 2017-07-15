import $ from "jquery";
import Map from "./graphics/map.js";
import Entities from "./graphics/entities.js";
import Airplanes from "./calculation/airplanes.js";

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
	const dom = $(".wrapper");

	// Enthält alle Daten fürs Spiel
	var storage = {
		config: {
			spawntime: 2000, // airplane alle 10 sek
			circleCenter: { x: Math.floor(dom.width()/2), y: Math.floor(dom.height()/2) }, // Kreis für warteschlange mitte
			circleRadius: Math.floor(((dom.width() < dom.height())?dom.width():dom.height())/2)-80, // Radius für wateschlangen Kreis
			circleRadiusStart: Math.floor(((dom.width() < dom.height())?dom.width():dom.height())),
		},
		airplanes: [],
		runways: [{
			pos: { x: 100, y: 100, w: 200, h: 50 },
			airplanes: []
		}],
		parkingslots: [],
		gates: []
	};

	// Erzeugt die Grafik Layer
	var map = Map(storage);
	var entities = Entities(storage);

	// Erzeuge Logik
	var airplanes = Airplanes(storage);

	// Erzeuge Gameloop
	function tick(timestamp) {
		// Tick

		// update
		airplanes.update(timestamp);

		// render
		entities.render();

		requestAnimationFrame(tick);
	}

	// start
	tick();

	// resize vom Browser
	$(window).resize(function() {
		// zeichne neu
		storage.config.circleCenter.x = Math.floor(dom.width()/2);
		storage.config.circleCenter.y = Math.floor(dom.height()/2);
		storage.config.circleRadius = Math.floor(((dom.width() < dom.height())?dom.width():dom.height())/2)-80; // Radius für wateschlangen Kreis
		storage.config.circleRadiusStart = Math.floor(((dom.width() < dom.height())?dom.width():dom.height()));

		map.resize();
		map.render();
		entities.resize();
		entities.render();
	});

};