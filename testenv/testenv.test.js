const {environment} = require("./testenv.js");

function saveToLocal (k, v) {
	window.localStorage.setItem(k, v);
}

function getFromLocal (k) {
	return window.localStorage.getItem(k);
}

function removeFromLocal (k) {
	window.localStorage.removeItem(k);
}

function clearLocal () {
	window.localStorage.clear();
} 

describe("test localStorage mock", () => {
	test("test save and fetch", () => {
		let window = environment();
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		expect(getFromLocal("testkey1")).toStrictEqual("testvalue1");
		expect(getFromLocal("testkey2")).toStrictEqual("testvalue2");
		expect(getFromLocal("testkey3")).toStrictEqual("testvalue3");
		expect(getFromLocal("testkey4")).toStrictEqual("testvalue4");

		saveToLocal("testkey6", "testvalue5");
		expect(getFromLocal("testkey6")).toStrictEqual("testvalue5");
	});

	test("test delete and fetch", () => {
		let window = environment();
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		removeFromLocal("testkey3");

		expect(getFromLocal("testkey1")).toStrictEqual("testvalue1");
		expect(getFromLocal("testkey2")).toStrictEqual("testvalue2");
		expect(getFromLocal("testkey3")).toStrictEqual(null);
		expect(getFromLocal("testkey4")).toStrictEqual("testvalue4");

		removeFromLocal("testkey1");

		expect(getFromLocal("testkey1")).toStrictEqual(null);
		expect(getFromLocal("testkey2")).toStrictEqual("testvalue2");
		expect(getFromLocal("testkey3")).toStrictEqual(null);
		expect(getFromLocal("testkey4")).toStrictEqual("testvalue4");

		removeFromLocal("testkey4");
		
		expect(getFromLocal("testkey1")).toStrictEqual(null);
		expect(getFromLocal("testkey2")).toStrictEqual("testvalue2");
		expect(getFromLocal("testkey3")).toStrictEqual(null);
		expect(getFromLocal("testkey4")).toStrictEqual(null);

		removeFromLocal("testkey2");
		
		expect(getFromLocal("testkey1")).toStrictEqual(null);
		expect(getFromLocal("testkey2")).toStrictEqual(null);
		expect(getFromLocal("testkey3")).toStrictEqual(null);
		expect(getFromLocal("testkey4")).toStrictEqual(null);
	});

	test("test clear and fetch", () => {
		let window = environment();
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		clearLocal();

		expect(getFromLocal("testkey1")).toStrictEqual(null);
		expect(getFromLocal("testkey2")).toStrictEqual(null);
		expect(getFromLocal("testkey3")).toStrictEqual(null);
		expect(getFromLocal("testkey4")).toStrictEqual(null);
	});
});