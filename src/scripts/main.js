import $ from "jquery";

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

};