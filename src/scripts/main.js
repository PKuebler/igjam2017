import $ from "jquery";
import Map from "./map.js";

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

	var map = Map();

	// resize
	$(window).resize(function() {
		map.resize();
		map.render();
	});

};