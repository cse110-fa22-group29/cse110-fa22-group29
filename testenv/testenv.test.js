const {environment} = require("./testenv.js");
var assert = require("assert");
var {describe, it, beforeEach} = require("mocha");
var {saveToLocal, getFromLocal, removeFromLocal, clearLocal} = require("./testenv_helpers");

beforeEach(() => {
	window = environment();
});

describe("test localStorage mock", () => {
	it("test save and fetch", () => {
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		assert.equal(getFromLocal("testkey1"), "testvalue1");
		assert.equal(getFromLocal("testkey2"), "testvalue2");
		assert.equal(getFromLocal("testkey3"), "testvalue3");
		assert.equal(getFromLocal("testkey4"), "testvalue4");

		saveToLocal("testkey6", "testvalue5");
		assert.equal(getFromLocal("testkey6"), "testvalue5");
	});

	it("test window locality", () => {
		assert.equal(getFromLocal("testkey1"), null);
		assert.equal(getFromLocal("testkey2"), null);
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), null);
	});

	it("test delete and fetch", () => {
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		removeFromLocal("testkey3");

		assert.equal(getFromLocal("testkey1"), "testvalue1");
		assert.equal(getFromLocal("testkey2"), "testvalue2");
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), "testvalue4");

		removeFromLocal("testkey1");

		assert.equal(getFromLocal("testkey1"), null);
		assert.equal(getFromLocal("testkey2"), "testvalue2");
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), "testvalue4");

		removeFromLocal("testkey4");
		
		assert.equal(getFromLocal("testkey1"), null);
		assert.equal(getFromLocal("testkey2"), "testvalue2");
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), null);

		removeFromLocal("testkey2");
		
		assert.equal(getFromLocal("testkey1"), null);
		assert.equal(getFromLocal("testkey2"), null);
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), null);
	});

	it("test clear and fetch", () => {
		saveToLocal("testkey1", "testvalue1");
		saveToLocal("testkey2", "testvalue2");
		saveToLocal("testkey3", "testvalue3");
		saveToLocal("testkey4", "testvalue4");

		clearLocal();

		assert.equal(getFromLocal("testkey1"), null);
		assert.equal(getFromLocal("testkey2"), null);
		assert.equal(getFromLocal("testkey3"), null);
		assert.equal(getFromLocal("testkey4"), null);
	});
});