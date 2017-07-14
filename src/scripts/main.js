import $ from "jquery";
import Map from "./map.js";
import Entities from "./entities.js";

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

export default function() {

	var storage = {
		airplanes: [],
		runways: [],
		parkingslots: [],
		gates: []
	};

	var map = Map(storage);
	var entities = Entities(storage);

	// resize
	$(window).resize(function() {
		map.resize();
		map.render();
		entities.resize();
		entities.render();
	});

};