
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

	return {
		createGate: createObject,
		createRunway: createObject,
		createPark: createObject
	}
}