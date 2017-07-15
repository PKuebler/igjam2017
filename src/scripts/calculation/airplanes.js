function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function(storage) {
	// ============================
	// create airplane
	// ============================
	function createPlane() {
		// einflug winkel
		var incomingDegress = getRandomArbitrary(0, 360 * Math.PI / 180);

		// ausflug winkel
		var outcomingDegress = getRandomArbitrary(0, 360 * Math.PI / 180);

		// start entfernung
		var currentCircleDistance = 800;

		return {
			name: "Airplane",
			pos: { x: 0, y: 0 },
			size: { w: 10, h: 10},

			// in / out
			incomingDegress,
			outcomingDegress,

			// circle
			currentDegress: incomingDegress,
			currentCircleDistance,
			randomCircleDistance: getRandomInt(0, 60),

			// fly
			gasoline: 500,
			onGround: false,
			destroyed: false,

			// action
			command: "incoming",
			commandIndex: null
		}
	}

	// ============================
	// collision detection
	// ============================
	function isCollide(a, b) {
		return !(
		        ((a.pos.y + a.size.h) < (b.pos.y)) ||
		        (a.pos.y > (b.pos.y + b.size.h)) ||
		        ((a.pos.x + a.size.w) < b.pos.x) ||
		        (a.pos.x > (b.pos.x + b.size.w))
		    );		
	}
	function collision() {
		storage.airplanes.forEach((airplane) => {
			// zerstört oder in der luft?
			if (airplane.destroyed || !airplane.onGround) {
				// nicht prüfen
				return;
			}
			// prüfe ob es mit anderem collidiert
			storage.airplanes.forEach((otherAirplane) => {
				if (otherAirplane === airplane && !otherAirplane.onGround) {
					// mit sich selbst nicht prüfen und nur mit airplanes in der luft
					return;
				}

				if (isCollide(airplane, otherAirplane)) {
					airplane.destroyed = true;
					otherAirplane.destroyed = true;
				}
			});
		});
	}
	// ============================
	// incoming
	// ============================
	function incoming(airplane) {
		// kreis kleiner ziehen
		airplane.currentCircleDistance = Math.max(
			airplane.currentCircleDistance - 1,
			(storage.config.circleRadius + airplane.randomCircleDistance)
		);

		// ist kreis erreicht?
		if (airplane.currentCircleDistance == (storage.config.circleRadius + airplane.randomCircleDistance)) {
			// setze neuen command
			return airplane.command = "circle";
		}

		// start position
		airplane.pos.x = Math.floor(
					storage.config.circleCenter.x + 
					airplane.currentCircleDistance * Math.cos(airplane.incomingDegress)
				);
		airplane.pos.y = Math.floor(
					storage.config.circleCenter.y +
					airplane.currentCircleDistance * Math.sin(airplane.incomingDegress)
				);

	}
	// ============================
	// circle
	// ============================
	var fullDegress = (360 * Math.PI / 180);
	function circle(airplane) {
		// im kreis fliegen
		airplane.currentDegress = (airplane.currentDegress + 0.004) % fullDegress;

		// neue position ausrechnen
		airplane.pos.x = Math.floor(
			storage.config.circleCenter.x + 
			(storage.config.circleRadius + airplane.randomCircleDistance) * 
			Math.cos(airplane.currentDegress)
		);
		airplane.pos.y = Math.floor(
			storage.config.circleCenter.y + 
			(storage.config.circleRadius + airplane.randomCircleDistance) *
			Math.sin(airplane.currentDegress)
		);

		if (airplane.command == "goLanding") {
			var runway = storage.runways[airplane.commandIndex];

			var toleranz = (2 * Math.PI / 180);

			if (airplane.currentDegress > runway.a - toleranz && airplane.currentDegress < runway.a + toleranz) {
				// TODO: if runway.a == 0 - 2 = -2 => 358
				airplane.command = "landing";
			}
		}
	}

	// ============================
	// landing
	// ============================
	function landing(airplane) {

	}

	// spawn counter
	var lastSpawn = 0;


	// ============================
	// update
	// ============================
	function update(timestamp) {
		var passedTime = timestamp - lastSpawn;

		// ============================
		// neues flugzeug
		// ============================
		if (passedTime > storage.config.spawntime) {
			storage.airplanes.push(createPlane());
	
			lastSpawn = timestamp;
		}

		// ============================
		// position / commands update
		// ============================
		storage.airplanes.forEach((airplane, index) => {
			// airplane ist kaputt
			if (airplane.destroyed) {
				return; // nicht weiter berechnen
			}

			// ============================
			// sprit berechnung
			// ============================
			if (!airplane.onGround) {
				airplane.gasoline -= 0.01;				
	
				// flugzeug leer?
				if (airplane.gasoline <= 0) {
					// explosion
					airplane.destroyed = true;
					return;
				}
			}

			// ============================
			// neues flugzeug flieg in kreis
			// ============================
			if (airplane.command == "incoming") {
				return incoming(airplane);
			}

			// ============================
			// flugzeug flieg im kreis -> go landing
			// ============================
			if (airplane.command == "circle") {
				return circle(airplane);
			}

			// landen
			// Landeanflug (x | y) Einleiten
			// Landen bis (x | y) Box -> Eintragen in runway liste
			// check if other airplane -> check bounding box
			// collision -> error -> runway blocken
			// stehen bleiben und warten
		});
	
		// ============================
		// collision detection
		// ============================
		collision();

	}

	return {
		update
	}
}