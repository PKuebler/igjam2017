import $ from "jquery";

// alles statische
export default function Chemtrails(storage) {
	var colors = ["rgba(126,186,255,1)","rgba(226,155,247,1)","rgba(161,239,148,1)"];

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
		ctx.fillStyle = "rgba(49,52,64,0.2)";
		ctx.fillRect(0,0,storage.config.size.w,storage.config.size.h);

		// ============================
		// Crasches
		// ============================
		if (storage.crashedPlanes.length > 0) {
			var pos = storage.crashedPlanes.shift();
			ctx.fillStyle = colors[pos.c];
//			ctx.fillRect(position.x, position.y, 10, 10);

			ctx.save();
			ctx.beginPath();
			ctx.translate(pos.x, pos.y);
			ctx.scale(0.5, 0.5);
			ctx.rotate(Math.random()*1.5);

			ctx.moveTo(0,0-55);
			ctx.lineTo(5,0-55);
			ctx.lineTo(10, 10-55);
			ctx.lineTo(10, 30-55);
			ctx.lineTo(45, 50-55);
			ctx.lineTo(50, 60-55);
			ctx.lineTo(10, 50-55);
//			ctx.lineTo(10, 90-55);
			ctx.lineTo(5, 95-55);
			ctx.lineTo(20, 105-55);
			ctx.lineTo(20, 110-55);
			ctx.lineTo(0, 105-55);
			ctx.lineTo(-20, 110-55);
			ctx.lineTo(-20, 105-55);
			ctx.lineTo(-5, 95-55);
//			ctx.lineTo(-10, 90-55);
			ctx.lineTo(-10, 50-55);
			ctx.lineTo(-50, 60-55);
			ctx.lineTo(-45, 50-55);
			ctx.lineTo(-10, 30-55);
			ctx.lineTo(-10, 10-55);
			ctx.lineTo(-5, 0-55);
			ctx.lineTo(0, 0-55);
			ctx.closePath();
//			ctx.stroke();
			ctx.fill();
			ctx.restore();

		}

		// ============================
		// Chemtrails
		// ============================
		ctx.fillStyle = "rgba(255,255,255,1)";
		storage.airplanes.forEach((airplane) => {
			if (airplane.onGround) {
				return;
			}
			ctx.fillRect(airplane.pos.x, airplane.pos.y, 5, 5);
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