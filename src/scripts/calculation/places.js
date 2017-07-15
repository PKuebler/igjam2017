
export default function Places(storage) {

	// ============================
	// alle 3 objekte haben eine position, und einen winkel. größe ist fest definiert oder responsive
	// ============================
	function createObject(i, x,y,a) {
		return {
			i,
			pos: {x, y},
			a // angle 
		};
	}

	function createRunway(i,x,y,a) {
		var obj = createObject(i,x,y,a);

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

		obj.type = "runway";

		return obj;
	}

	function createGate(i,x,y,a) {
		var obj = createObject(i,x,y,a);

		obj.type = "gate";
		return obj;
	}

	function createPark(i,x,y,a) {
		var obj = createObject(i,x,y,a);

		obj.type = "park";
		return obj;		
	}

	return {
		createGate: createGate,
		createRunway: createRunway,
		createPark: createPark
	}
}