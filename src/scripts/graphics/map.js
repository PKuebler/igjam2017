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
		ctx.textBaseline="top"; 
		ctx.font="10px 'Press Start 2P'";
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.fillStyle = "rgb(255,255,255)";
		storage.runways.forEach((runway) => {
			ctx.save();
			// todo: bugfix rotation
			ctx.translate(runway.pos.x, runway.pos.y);
			ctx.rotate(runway.a);
			ctx.fillText("Runway", -25, 32);
			ctx.beginPath();
			ctx.rect(-100, -25, 200, 50);
			ctx.moveTo(-95, -20);
			ctx.lineTo(-85, -20);
			ctx.moveTo(-95, -15);
			ctx.lineTo(-85, -15);
			ctx.moveTo(-95, -10);
			ctx.lineTo(-85, -10);
			ctx.moveTo(-95, -5);
			ctx.lineTo(-85, -5);
			ctx.moveTo(-95, 0);
			ctx.lineTo(-85, 0);
			ctx.moveTo(-95, 20);
			ctx.lineTo(-85, 20);
			ctx.moveTo(-95, 15);
			ctx.lineTo(-85, 15);
			ctx.moveTo(-95, 10);
			ctx.lineTo(-85, 10);
			ctx.moveTo(-95, 5);
			ctx.lineTo(-85, 5);
			ctx.moveTo(-75, 0);
			ctx.lineTo(-65, 0);
			ctx.moveTo(-55, 0);
			ctx.lineTo(-45, 0);
			ctx.moveTo(-35, 0);
			ctx.lineTo(-25, 0);
			ctx.moveTo(-15, 0);
			ctx.lineTo(-5, 0);
			ctx.moveTo(95, 0);
			ctx.lineTo(85, 0);
			ctx.moveTo(75, 0);
			ctx.lineTo(65, 0);
			ctx.moveTo(55, 0);
			ctx.lineTo(45, 0);
			ctx.moveTo(35, 0);
			ctx.lineTo(25, 0);
			ctx.moveTo(15, 0);
			ctx.lineTo(5, 0);
			ctx.stroke();
			ctx.restore();
		});

		// ============================
		// gates
		// ============================
		ctx.strokeStyle = "#ffa500";
		ctx.fillStyle = "#ffa500";
		ctx.lineWidth = 2;
		storage.gates.forEach((gate) => {
			ctx.save();
			// todo: bugfix rotation
			ctx.translate(gate.pos.x, gate.pos.y);
			ctx.rotate(gate.a);
			ctx.beginPath();
			ctx.rect(-25, -25, 50, 50);
			ctx.fillText("Gate", -25, 32);
			ctx.stroke();
			ctx.restore();
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