import $ from "jquery";

// alles statische
export default function Map(storage) {

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
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// ============================
		// landebahn
		// ============================
		ctx.fillStyle = "rgb(52,109,226)";
		storage.runways.forEach((runway) => {
			ctx.save();
			// todo: bugfix
			ctx.translate(runway.pos.x, runway.pos.y);
			ctx.rotate(runway.a);
			ctx.fillRect(0, 0, 200, 50);
			ctx.restore();
		});

		// ============================
		// ============================
		var angle = 0.02;
		var x = Math.floor(storage.config.circleCenter.x + (storage.config.circleRadius) * Math.cos(angle));
		var y = Math.floor(storage.config.circleCenter.y + (storage.config.circleRadius) * Math.sin(angle));
		ctx.strokeStyle = "#ffa500";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(storage.config.circleCenter.x, storage.config.circleCenter.y);
		ctx.lineTo(x, y);
		ctx.stroke();
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