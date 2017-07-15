import $ from "jquery";

// alles das sich bewegt
export default function Entities(storage) {

	function resize() {
		ctx.canvas.width = dom.width();
		ctx.canvas.height = dom.height();
	}

	function render() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 4;
		ctx.fillStyle = "#ffffff";

		storage.airplanes.forEach((airplane) => {
			//ctx.fillRect(airplane.pos.x, airplane.pos.y, 10, 10);
			ctx.save();
			ctx.beginPath();
			ctx.translate(airplane.pos.x, airplane.pos.y);
			ctx.scale(0.5, 0.5);
			ctx.rotate(airplane.viewDirection);

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
