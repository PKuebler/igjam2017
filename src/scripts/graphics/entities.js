import $ from "jquery";

// alles das sich bewegt
export default function Entities(storage) {

	function resize() {
		ctx.canvas.width = dom.width();
		ctx.canvas.height = dom.height();
	}

	function render() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.strokeStyle = "#ffa500";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(210, 210);
		ctx.lineTo(210, 510);
		ctx.moveTo(510, 310);
		ctx.lineTo(110, 510);
		ctx.stroke();

		ctx.fillStyle = "#ffffff";

		storage.airplanes.forEach((airplane) => {
			ctx.fillRect(airplane.pos.x, airplane.pos.y, 10, 10);
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