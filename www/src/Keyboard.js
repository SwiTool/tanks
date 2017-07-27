function Keyboard(keyCodes) {
	var keys = {
		press: undefined,
		release: undefined,
		isDown: false,
		isUp: true
	};
	if (!keyCodes.constructor === Array) {
		keyCodes = [keyCodes];
	}
	keys.downHandler = function(event) {
		if (keyCodes.indexOf(event.keyCode) !== -1) {
			if (keys.isUp && keys.press) keys.press();
			keys.isDown = true;
			keys.isUp = false;
		}
		event.preventDefault();
	}
	keys.upHandler = function(event) {
		if (keyCodes.indexOf(event.keyCode) !== -1) {
			if (keys.isDown && keys.release) keys.release();
			keys.isDown = false;
			keys.isUp = true;
		}
		event.preventDefault();
	}

	//Attach event listeners
	window.addEventListener(
		"keydown", keys.downHandler.bind(keys), false
	);
	window.addEventListener(
		"keyup", keys.upHandler.bind(keys), false
	);
	return keys;
}

export default Keyboard;