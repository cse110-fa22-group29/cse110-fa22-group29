module.exports = {environment};

function environment () {
	const localStorageMock = (function () {
		let store = {};
		return {
			getItem(key) {
				return store[key];
			},
			setItem(key, value) {
				store[key] = value;
			},
			clear() {
				store = {};
			},
			removeItem(key) {
				delete store[key];
			},
			getAll() {
				return store;
			},
		};
	})();

	let window = {};
	Object.defineProperty(window, "localStorage", { value: localStorageMock });
	return window;
}