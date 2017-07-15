
export default function Places(storage) {

	// ============================
	// alle 3 objekte haben eine position, und einen winkel. größe ist fest definiert oder responsive
	// ============================
	function createObject(x,y,a) {
		return {
			pos: {x, y},
			a: a // angle 
		};
	}

	function createRunway(x,y,a) {
		var obj = createObject(x,y,a);

		var runwayLength = Math.floor(200/2);

		obj.start = {
			x: Math.floor(
				obj.pos.x + 
				runwayLength * Math.cos(obj.a)
			),
			y: Math.floor(
				obj.pos.y +
				runwayLength * Math.sin(obj.a)
			)
		};

		obj.end = {
			x: Math.floor(
				obj.pos.x + 
				runwayLength * Math.cos(obj.a + (180 * Math.PI / 180))
			),
			y: Math.floor(
				obj.pos.y +
				runwayLength * Math.sin(obj.a + (180 * Math.PI / 180))
			)			
		};

		return obj;
	}

	return {
		createGate: createObject,
		createRunway: createRunway,
		createPark: createObject
	}
}