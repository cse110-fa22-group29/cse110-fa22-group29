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

self.addEventListener("install", async () => {
	const cache = await caches.open(CACHE_NAME);
	await cache.addAll(ASSETS);
});

self.addEventListener("fetch", (event) => {
	console.log(`fetching: ${event.request.url}`);
	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		return fetch(event.request).then((fetchedResponse) => {
			cache.put(event.request, fetchedResponse.clone());
			console.log(typeof(fetchedResponse));
			return fetchedResponse;
		}).catch(() => {
			console.log(cache.match(event.request, {ignoreVary: true}));
			return cache.match(event.request, {ignoreVary: true});
		});
	}));
});
