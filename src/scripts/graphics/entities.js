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
			// ============================
			// airplane
			// ============================
			//ctx.fillRect(airplane.pos.x, airplane.pos.y, 10, 10);
			if (airplane.isHover) {
				ctx.fillStyle = "#ff0000";
			}

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

			if (airplane.isHover) {
				ctx.fillStyle = "#ffffff";
			}
		});

		// ============================
		// sprit
		// ============================
		ctx.fillStyle = "rgb(155,158,163)";
		ctx.strokeStyle = "rgb(155,158,163)";
		ctx.lineWidth = 2;
		storage.airplanes.forEach((airplane) => {
			if (!airplane.onGround) {
				var h = Math.floor((airplane.gasoline / storage.config.maxAirplaneGasoline) * 20);
				ctx.fillRect(airplane.pos.x + 35, airplane.pos.y - h, 7, h);
				ctx.beginPath();
				ctx.rect(airplane.pos.x + 35, airplane.pos.y - 20, 7, 20);			
				ctx.stroke();
			}
		});

		// ============================
		// selected object
		// ============================
    	if (storage.selectedObject != null) {
    		var obj = storage.selectedObject;

    		if (obj.destroyed) {
    			storage.selectedObject = null;
    			return;
    		}

			ctx.strokeStyle = "#ffa500";
			ctx.lineWidth = 2;
			ctx.beginPath();
			// links
			ctx.moveTo(obj.pos.x - obj.size.w, obj.pos.y - obj.size.h);
			ctx.lineTo(obj.pos.x - obj.size.w, obj.pos.y - obj.size.h + Math.floor(obj.size.h/3));
			ctx.moveTo(obj.pos.x - obj.size.w, obj.pos.y + obj.size.h - Math.floor(obj.size.h/3));
			ctx.lineTo(obj.pos.x - obj.size.w, obj.pos.y + obj.size.h);
			// oben
			ctx.moveTo(obj.pos.x - obj.size.w, obj.pos.y - obj.size.h);
			ctx.lineTo(obj.pos.x - obj.size.w + Math.floor(obj.size.h/3), obj.pos.y - obj.size.h);
			ctx.moveTo(obj.pos.x + obj.size.w - Math.floor(obj.size.h/3), obj.pos.y - obj.size.h);
			ctx.lineTo(obj.pos.x + obj.size.w, obj.pos.y - obj.size.h);
			// rechts
			ctx.moveTo(obj.pos.x + obj.size.w, obj.pos.y - obj.size.h);
			ctx.lineTo(obj.pos.x + obj.size.w, obj.pos.y - obj.size.h + Math.floor(obj.size.h/3));
			ctx.moveTo(obj.pos.x + obj.size.w, obj.pos.y + obj.size.h - Math.floor(obj.size.h/3));
			ctx.lineTo(obj.pos.x + obj.size.w, obj.pos.y + obj.size.h);
			// unten
			ctx.moveTo(obj.pos.x - obj.size.w, obj.pos.y + obj.size.h);
			ctx.lineTo(obj.pos.x - obj.size.w + Math.floor(obj.size.w/3), obj.pos.y + obj.size.h);
			ctx.moveTo(obj.pos.x + obj.size.w - Math.floor(obj.size.w/3), obj.pos.y + obj.size.h);
			ctx.lineTo(obj.pos.x + obj.size.w, obj.pos.y + obj.size.h);
			ctx.stroke();
    	}

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
