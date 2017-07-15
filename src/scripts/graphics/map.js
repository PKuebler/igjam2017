import $ from "jquery";

// alles statische
export default function Map(storage) {

	function resize() {
		ctx.canvas.width = dom.width();
		ctx.canvas.height = dom.height();
	}

	function render() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.strokeStyle = "#ffa500";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(20, 20);
		ctx.lineTo(20, 50);
		ctx.moveTo(50, 30);
		ctx.lineTo(10, 50);
		ctx.stroke();

		// landebahn
		ctx.fillStyle = "rgba(100,20,150,0.5)";
		storage.runways.forEach((runway) => {
			ctx.fillRect(runway.pos.x, runway.pos.y, runway.pos.w, runway.pos.h);			
		});
	}

	// Init
	const dom = $(".wrapper");
	const canvas = $("<canvas />");
	dom.append(canvas);

	const ctx = canvas[0].getContext("2d");
	resize();
	render();

	// public functions
	return {
		render,
		resize
	}
}