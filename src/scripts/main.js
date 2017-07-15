import $ from "jquery";
import Map from "./graphics/map.js";
import Entities from "./graphics/entities.js";
import Airplanes from "./calculation/airplanes.js";
import Places from "./calculation/places.js";

// ============================
// fallback
// ============================
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

// ============================
// eigentliche spiel
// ============================
export default function() {
	const dom = $(".wrapper");

	// ============================
	// enthält die spieldaten, wird überall hin übergeben
	// ============================
	var storage = {
		config: {
			spawntime: 4000, // airplane alle 10 sek
			circleCenter: { x: 0, y: 0 }, // Kreis für warteschlange mitte
			circleRadius: 0, // Radius für wateschlangen Kreis
			maxAirplaneGasoline: 300,
			flyspeed: 0.0004
		},
		airplanes: [],
		runways: [],
		parkingslots: [],
		gates: []
	};

	// ============================
	// berechne die position, falls resize oder neu
	// ============================
	function updateStorage() {
		// warteschleifen
		storage.config.circleCenter.x = Math.floor(dom.width()/2);
		storage.config.circleCenter.y = Math.floor(dom.height()/2);
		storage.config.circleRadius = Math.floor(((dom.width() < dom.height())?dom.width():dom.height())/2)-80; // Radius für wateschlangen Kreis
		storage.config.circleRadiusStart = Math.floor(((dom.width() < dom.height())?dom.width():dom.height()));
	}
	updateStorage();

	// ============================
	// Erzeugt die Grafik Layer
	// ============================
	var map = Map(storage);
	var entities = Entities(storage);

	// ============================
	// Erzeuge Logik
	// ============================
	var airplanes = Airplanes(storage);
	var places = Places(storage);

	// ============================
	// füge einen platz hinzu
	// ============================
	// todo: anpassen an browsergröße?
	storage.runways.push(places.createRunway(Math.floor(dom.width()/2), Math.floor(dom.height()/2), 90 * Math.PI / 180));

	// ============================
	// update map
	// ============================
	map.resize();
	map.render();

	// ============================
	// Erzeuge Gameloop
	// ============================
	function tick(timestamp) {
		// Tick

		// update
		airplanes.update(timestamp);

		// render
		entities.render();

		requestAnimationFrame(tick);
	}

	// ============================
	// start
	// ============================
	tick();

	// ============================
	// resize vom Browser
	// ============================
	$(window).resize(function() {
		// zeichne neu
		updateStorage();

		map.resize();
		map.render();
		entities.resize();
		entities.render();
	});

	// ============================
	// testweise einen landen lassen
	// ============================
	var landingIndex = 0;
	setInterval(() => {
		if (storage.airplanes[landingIndex].command == "circle") {
			storage.airplanes[landingIndex].command = "goLanding";
			storage.airplanes[landingIndex].commandIndex = 0;
			landingIndex++;
		}
	}, 12000);

};