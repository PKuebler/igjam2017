import $ from "jquery";

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

		ctx.fillStyle = "rgba(100,20,150,0.5)";
		ctx.fillRect(300, 300, 50, 50);
	}

	// Init
	const dom = $(".wrapper");
	const canvas = $("<canvas />");
	dom.append(canvas);

	const ctx = canvas[0].getContext("2d");
	resize();
	render();

	return {
		render,
		resize
	}
}