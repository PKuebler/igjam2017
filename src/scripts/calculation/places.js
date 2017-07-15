
export default function Places(storage) {

	function createObject(x,y,a) {
		return {
			pos: {x, y},
			angle: a
		};
	}

	return {
		createGate: createObject,
		createRunway: createObject,
		createPark: createObject
	}
}