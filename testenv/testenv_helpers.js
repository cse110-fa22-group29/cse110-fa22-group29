module.exports = {saveToLocal, getFromLocal, removeFromLocal, clearLocal};

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