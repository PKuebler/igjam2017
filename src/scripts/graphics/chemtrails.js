import $ from "jquery";

// alles statische
export default function Chemtrails(storage) {

	// ============================
	// wenn browser größe ändert
	// ============================
	function resize() {
		ctx.canvas.width = dom.width();
		ctx.canvas.height = dom.height();
	}

	// ============================
	// rendert
	// ============================
	function render() {
		// ============================
		// Leere Zeichenfläche
		// ============================
		ctx.fillStyle = "rgba(49,52,64,0.3)";
		ctx.fillRect(0,0,storage.config.size.w,storage.config.size.h);

		// ============================
		// Chemtrails
		// ============================
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		storage.airplanes.forEach((airplane) => {
			if (airplane.onGround) {
				return;
			}
			ctx.fillRect(airplane.pos.x, airplane.pos.y, 10, 10);
		});
	}

	// ============================
	// Init
	// ============================
	const dom = $(".wrapper");
	const canvas = $("<canvas />");
	dom.append(canvas);

	const ctx = canvas[0].getContext("2d");
	resize();
	render();

	// ============================
	// public functions
	// ============================
	return {
		render,
		resize
	}
}