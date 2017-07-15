import $ from "jquery";
import Map from "./graphics/map.js";
import Entities from "./graphics/entities.js";
import Chemtrails from "./graphics/chemtrails.js";
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
			maxAirplaneGasoline: 150,
			gasolineUsage: 0.1,
			flyspeed: 0.0004,
			boardingSpeed: 0.05,
			size: { w: dom.width(), h: dom.height() }
		},
		currentMousePos: { x: -1, y: -1 },
		hoverObject: null,
		airplanes: [],
		runways: [],
		parkingslots: [],
		gates: [],
		crashedPlanes: []
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

		storage.config.size.w = dom.width();
		storage.config.size.h = dom.height();
	}
	updateStorage();

	// ============================
	// Erzeugt die Grafik Layer
	// ============================
	var chemtrails = Chemtrails(storage);
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
	storage.runways.push(places.createRunway(Math.floor(dom.width()/2)-120, Math.floor(dom.height()/2), 90 * Math.PI / 180));
	storage.gates.push(places.createGate(Math.floor(dom.width()/2)+50, Math.floor(dom.height()/2)-75, 0));
	storage.gates.push(places.createGate(Math.floor(dom.width()/2)+50, Math.floor(dom.height()/2), 0));
	storage.gates.push(places.createGate(Math.floor(dom.width()/2)+50, Math.floor(dom.height()/2)+75, 0));

	// ============================
	// update map
	// ============================
	map.resize();
	map.render();

	// ============================
	// Erzeuge Gameloop
	// ============================
	var lastChemtrails = 0;
	function tick(timestamp) {
		// Tick

		// update
		airplanes.update(timestamp);

		// render
		if (timestamp-lastChemtrails >= 100) {
			lastChemtrails = timestamp;
			chemtrails.render();
		}
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
	// mouse position
	// ============================
    $(document).mousemove(function(event) {
        storage.currentMousePos.x = event.pageX;
        storage.currentMousePos.y = event.pageY;
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