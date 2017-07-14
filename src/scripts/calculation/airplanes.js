
export default function(storage) {

	var lastSpawn = 0;

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function createPlane() {
		return {
			name: "Airplane",
			pos: { x: 5, y: 5 },
			incomingDegree: 50,
			outcomingDegree: 180,
			currentAngle: 50,
			gasoline: 100,
			randomCircleDistance: getRandomInt(0, 60)
		}
	}

	function update(timestamp) {
		var passedTime = timestamp - lastSpawn;

		// neues flugzeug spawnen
		if (passedTime > storage.config.spawntime) {
			storage.airplanes.push(createPlane());
	
			lastSpawn = timestamp;
		}

		storage.airplanes.forEach((airplane, index) => {
			// spritverbrauch
			airplane.gasoline -= 0.1;

			// flugzeug leer?
			if (airplane.gasoline <= 0) {
				// remove from airplanes
				storage.airplanes.splice(index, 1);
				return;
			}

			// wandern
			airplane.currentAngle += 0.01;

			// neue position ausrechnen
			airplane.pos.x = Math.floor(storage.config.circleCenter.x + (storage.config.circleRadius + airplane.randomCircleDistance) * Math.cos(airplane.currentAngle));
			airplane.pos.y = Math.floor(storage.config.circleCenter.y + (storage.config.circleRadius + airplane.randomCircleDistance) * Math.sin(airplane.currentAngle));
		});
	}

	return {
		update
	}
}