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
	var nextId = 0;

	function createPlane() {
		// einflug winkel
		var incomingDegress = getRandomArbitrary(0, 360 * Math.PI / 180);

		// ausflug winkel
		var outcomingDegress = getRandomArbitrary(0, 360 * Math.PI / 180);

		// start entfernung
		var currentCircleDistance = 600;

		return {
			id: nextId++,
			name: "Airplane",
			pos: { x: 0, y: 0 },
			size: { w: 10, h: 10},
			lastPos: { x: 0, y: 0 },

			// in / out
			incomingDegress,
			outcomingDegress,

			// circle
			currentDegress: incomingDegress,
			currentCircleDistance,
			randomCircleDistance: getRandomInt(0, 60),

			// fly
			gasoline: storage.config.maxAirplaneGasoline,
			onGround: false,
			destroyed: false,
			viewDirection: 0,

			// loading
		 	newPassenger: getRandomInt(100,300),
		 	passenger: getRandomInt(100,300),


			// action
			command: "incoming",
			commandIndex: null,
			commandStage: 0
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
				if (otherAirplane.id == airplane.id || !otherAirplane.onGround) {
					// mit sich selbst nicht prüfen und nicht mit airplanes in der luft
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
	function incoming(delta, airplane) {
		// im kreis fliegen
		airplane.currentDegress = (airplane.currentDegress + (storage.config.flyspeed * delta)) % fullDegress;

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
					airplane.currentCircleDistance * Math.cos(airplane.currentDegress)
				);
		airplane.pos.y = Math.floor(
					storage.config.circleCenter.y +
					airplane.currentCircleDistance * Math.sin(airplane.currentDegress)
				);

	}
	// ============================
	// circle
	// ============================
	var fullDegress = (360 * Math.PI / 180);
	function circle(delta, airplane) {
		// im kreis fliegen
		airplane.currentDegress = (airplane.currentDegress + (storage.config.flyspeed * delta)) % fullDegress;

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

			var toleranz = (1 * Math.PI / 180);

			if (airplane.currentDegress > runway.a - toleranz && airplane.currentDegress < runway.a + toleranz) {
				// TODO: if runway.a == 0 - 2 = -2 => 358
				airplane.command = "landing";
				airplane.commandStage = 0;
			}
		}
	}

	// ============================
	// landing
	// ============================
	function landing(delta, airplane) {
		// activate collision
		airplane.onGround = true;

		var target = storage.runways[airplane.commandIndex][(airplane.commandStage == 0)?'start':'end'];

		var tx = target.x - airplane.pos.x,
			ty = target.y - airplane.pos.y,
		    dist = Math.sqrt(tx*tx+ty*ty);

		var speed = 1;

		var velX = (tx/dist)*speed;
		var velY = (ty/dist)*speed;

		airplane.pos.x += velX;
		airplane.pos.y += velY;

		if (dist < 2 && dist < 2 && dist > -2 && dist > -2) {
			// finish
			if (airplane.commandStage == 0) {
				airplane.commandStage++;
			} else {
				// debug!!!!!!!
				airplane.command = "goToGate";
				airplane.commandIndex = getRandomInt(1,3)-1;
			}
		}
	}

	// ============================
	// drive to gate
	// ============================
	function goToGate(delta, airplane) {
		var target = storage.gates[airplane.commandIndex];

		var tx = target.pos.x - airplane.pos.x,
			ty = target.pos.y - airplane.pos.y,
		    dist = Math.sqrt(tx*tx+ty*ty);

		var speed = 1;

		var velX = (tx/dist)*speed;
		var velY = (ty/dist)*speed;

		airplane.pos.x += velX;
		airplane.pos.y += velY;

		if (dist < 2 && dist < 2 && dist > -2 && dist > -2) {
			// finish
			airplane.command = "boarding";
			airplane.commandStage = 0;
		}
	}

	// ============================
	// boarding
	// ============================
	function boarding(delta, airplane) {
		if (airplane.commandStage == 0) {
			airplane.passenger = Math.max(0, airplane.passenger-(delta*storage.config.boardingSpeed));

			if (airplane.passenger == 0) {
				airplane.commandStage = 1;
			}
		} else {
			airplane.passenger = Math.min(airplane.newPassenger, airplane.passenger+(delta*storage.config.boardingSpeed));
			if (airplane.passenger == airplane.newPassenger) {
				// finish
				airplane.command = "takeoff";
				airplane.commandStage = 0;
				airplane.commandIndex = 0;
			}
		}
	}

	// ============================
	// takeoff
	// ============================
	function takeoff(delta, airplane) {
		// activate collision

		var target = storage.runways[airplane.commandIndex][(airplane.commandStage == 0)?'start':'end'];

		var tx = target.x - airplane.pos.x,
			ty = target.y - airplane.pos.y,
		    dist = Math.sqrt(tx*tx+ty*ty);

		var speed = 1;

		var velX = (tx/dist)*speed;
		var velY = (ty/dist)*speed;

		airplane.pos.x += velX;
		airplane.pos.y += velY;

		if (dist < 2 && dist < 2 && dist > -2 && dist > -2) {
			// finish
			if (airplane.commandStage == 0) {
				airplane.commandStage++;
			} else {
				airplane.onGround = false;
				airplane.command = "bye";
				airplane.currentCircleDistance = 0;
				airplane.currentDegress = storage.runways[airplane.commandIndex].a * (180 * Math.PI / 180);
			}
		}
	}
	// ============================
	// bye airplane
	// ============================
	function bye(delta, airplane) {
		// kreis größer ziehen
		airplane.currentCircleDistance++;

		// start position
		airplane.pos.x = Math.floor(airplane.pos.x + (delta * storage.config.flyspeed) * Math.cos(airplane.currentDegress));
		airplane.pos.y = Math.floor(airplane.pos.y + (delta * storage.config.flyspeed) * Math.sin(airplane.currentDegress));
	}


	// spawn counter
	var lastSpawn = 0;


	// ============================
	// update
	// ============================
	var lastUpdate = 0;
	function update(timestamp) {
		var passedTime = timestamp - lastSpawn;

		// ============================
		// calc delta time
		// ============================
		var delta = timestamp - lastUpdate;
		lastUpdate = timestamp;

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
				storage.crashedPlanes.push(airplane);
				storage.airplanes.splice(index, 1);
				return; // nicht weiter berechnen
			}

			// weg
			if (airplane.command == "bye" &&
				(airplane.pos.x < 0 ||
				airplane.pos.y < 0 ||
				airplane.pos.x > storage.config.size.w ||
				airplane.pos.y > storage.config.size.h)) {
				storage.airplanes.splice(index, 1);
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
			// Winkel Berechnen
			// ============================
			if (airplane.lastPos.x != airplane.pos.x || airplane.lastPos.y != airplane.pos.y) {
				// hat sich geändert

				var tx = airplane.pos.x - airplane.lastPos.x,
					ty = airplane.pos.y - airplane.lastPos.y;
				airplane.viewDirection = Math.atan2(ty, tx) + 90 * Math.PI / 180;

				// speicher letzte position
				airplane.lastPos.x = airplane.pos.x;
				airplane.lastPos.y = airplane.pos.y;
			}

			// ============================
			// neues flugzeug flieg in kreis
			// ============================
			if (airplane.command == "incoming") {
				return incoming(delta, airplane);
			}

			// ============================
			// flugzeug flieg im kreis -> go landing
			// ============================
			if (airplane.command == "circle" || airplane.command == "goLanding") {
				return circle(delta, airplane);
			}

			// ============================
			// landen
			// ============================
			if (airplane.command == "landing") {
				return landing(delta, airplane);
			}

			// ============================
			// Zum Gate fahren
			// ============================
			if (airplane.command == "goToGate") {
				return goToGate(delta, airplane);
			}

			// ============================
			// Boarding
			// ============================
			if (airplane.command == "boarding") {
				return boarding(delta, airplane);
			}

			// ============================
			// Von Landebahn starten
			// ============================
			if (airplane.command == "takeoff") {
				return takeoff(delta, airplane);
			}

			// ============================
			// Wegfliegen
			// ============================
			if (airplane.command == "bye") {
				return bye(delta, airplane);
			}
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
