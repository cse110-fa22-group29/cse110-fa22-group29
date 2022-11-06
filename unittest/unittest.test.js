const unittest = require("./unittest.js");

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

function assertion_test () {
	try { unittest.assert(1, 1); }
	catch (error) { console.log("Failed assert(1,1)") }

	try { unittest.assert(65536, 65536); }
	catch (error) { console.log("Failed assert(655366,65536)") }

	try { unittest.assert(-50, 50); console.log("Failed assert(-50,50)") }
	catch (error) {  }

	try { unittest.assert(0, 1); console.log("Failed assert(0,1)") }
	catch (error) {  }

	try { unittest.assert(true, true); }
	catch (error) { console.log("Failed assert(true,true)") }

	try { unittest.assert(false, false); }
	catch (error) { console.log("Failed assert(false,false)") }

	try { unittest.assert(true, false); console.log("Failed assert(true,false)") }
	catch (error) {  }

	try { unittest.assert(false, true); console.log("Failed assert(false,true)") }
	catch (error) {  }

    try { unittest.assert("Test", "Test"); }
	catch (error) { console.log("Failed assert('Test','Test')") }
    
    try { unittest.assert("Test", "Yay"); console.log("Failed assert('Test','Yay')") }
	catch (error) {  }

    try { unittest.assert({one: 1, two: 2}, {one: 1, two: 2}); }
	catch (error) { console.log("Failed assert({one: 1, two: 2},{one: 1, two: 2})") }

    try { unittest.assert({one: 1, two: 2}, {two: 2, three: 3}); console.log("Failed assert({one: 1, two: 2}, {two: 2, three: 3})") }
	catch (error) {  }
}
assertion_test();

function item_test () {
	unittest.item("passing item", () => {
		unittest.assert(1, 1);
	});
	unittest.item("failing item", () => {
		unittest.assert(1, 2);
	});
}
item_test();

function test_test () {
    unittest.test("example test", () => {
		unittest.item("assert 1 = 1", () => {
			unittest.assert(1, 1);
		});
		unittest.item("assert 1 = 2", () => {
			unittest.assert(1, 2);
		})
	});
}
test_test();

function environment_test () {
	function testfunc1 () {
		window.localStorage.clear();
		window.localStorage.setItem("testkey", "testvalue");
		return window.localStorage.getItem("testkey");
	}

	function testfunc2 (){
		window.localStorage.removeItem("testkey");
	}

	unittest.test("test add item", () => {
		unittest.item("testfunc1", () => {
			unittest.assert(testfunc1(), "testvalue");
		});
	});

	unittest.test("test delete item", () => {
		unittest.item("testfunc2", () => {
			unittest.assert(testfunc2(), undefined);
		});
	});
}
environment_test();