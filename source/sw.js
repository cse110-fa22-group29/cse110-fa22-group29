const CACHE_NAME = "food-journal-v1";
const ASSETS = [
	"index.html",
	"ReviewDetails.html",
	"CreatePage.html",
	"static/CoveredByYourGrace-Regular.ttf",
	"static/CreatePage.css",
	"static/Form.css",
	"static/homepage.css",
	"static/ReviewDetails.css",
	"assets/images/0-star.svg",
	"assets/images/1-star.svg",
	"assets/images/2-star.svg",
	"assets/images/3-star.svg",
	"assets/images/4-star.svg",
	"assets/images/5-star.svg",
	"assets/images/default_plate.png",
	"assets/images/delete_icon_for_interface.png",
	"assets/images/edit_button_for_interface.png",
	"assets/images/Grouppink.png",
	"assets/images/home_button_for_interface.png",
	"assets/images/favicon.ico",
	"assets/images/Logo.png",
	"assets/scripts/CreatePage.js",
	"assets/scripts/localStorage.js",
	"assets/scripts/main.js",
	"assets/scripts/ReviewCard.js",
	"assets/scripts/ReviewDetails.js",
];

/**
 * Adds the install listener where the app assets are added to the cache
 */
self.addEventListener("install", async () => {
	// open the cace
	const cache = await caches.open(CACHE_NAME);
	// add all elements in ASSETS to the cache, these are all the files requried for the app to run
	await cache.addAll(ASSETS);
});

/**
 * Adds an event listener on fetch events to serve cached resources while offline
 * Uses a network first structure to prioritize fetching from network in case of app updates.
 * If there are important updates, we want the user to get those if possible.
 */
self.addEventListener("fetch", (event) => {
	// add a response to the fetch event
	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		// try to return a network fetch response
		return fetch(event.request).then((fetchedResponse) => {
			// if there is a response, add it to the cache
			cache.put(event.request, fetchedResponse.clone());
			// return the network response
			return fetchedResponse;
		}).catch(() => {
			// If there is not a network response, return the cached response
			// The ignoreVary option is used here to fix an issue where the service worker 
			// would not serve certain requests unless the page was refreshed at least once
			return cache.match(event.request, {ignoreVary: true}); 
		});
	}));
});
