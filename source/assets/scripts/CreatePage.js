import { newReviewToStorage } from "./localStorage.js";

window.addEventListener("DOMContentLoaded", init);

/**
 * Delegates the functionality for creating review cards.
 */
function init() {
	initFormHandler();
}

/**
 * Creates a form and associates a new ID with the new review card.
 */
function initFormHandler() {
	// Accesses form components
	let tagContainer = document.getElementById("tag-container-form");
	let form = document.querySelector("form");

	// Declaring variable storing image data url
	let imgDataURL = "";

	// Accessing components related to taking photo
	let videoMode = true;
	let player = document.getElementById("player");
	let canvas = document.getElementById("photoCanvas");
	let photoButton = document.getElementById("photoButton");
	let context = canvas.getContext("2d");

	// Event listener for the photo taking/reset button
	photoButton.addEventListener("click", () => {
		// capturing the current video frame
		if (videoMode) {
			videoMode = false;

			// setting up the appropriate components for displaying the photo preview
			photoButton.innerText = "Retake";
			player.setAttribute("hidden", "");
			canvas.removeAttribute("hidden", "");

			// displaying the captured snapshot on a canvas and saving it as a data url
			context.drawImage(player, 0, 0, canvas.width, canvas.height);
			imgDataURL = canvas.toDataURL();
		}
		// returning to displaying the video stream
		else {
			videoMode = true;

			// setting up the appropriate components for the video stream
			photoButton.innerText = "Take Photo";
			canvas.setAttribute("hidden", "");
			player.removeAttribute("hidden", "");
		}
	});

	// Event listener for reading image form different data
	let select = document.getElementById("select");
	const input = document.getElementById("mealImg");
	select.addEventListener("change", function () {
		// Select a photo with HTML file selector
		if (select.value == "file") {
			// enabling file upload components and hiding photo taking components
			input.removeAttribute("hidden", "");
			player.setAttribute("hidden", "");
			canvas.setAttribute("hidden", "");
			photoButton.setAttribute("hidden", "");

			// stopping the video stream
			player.srcObject.getVideoTracks()[0].stop();
		}

		// Take a photo
		else {
			// enabling photo taking components and hiding file upload components
			videoMode = true;
			photoButton.innerText = "Take Photo";
			input.setAttribute("hidden", "");
			player.removeAttribute("hidden", "");
			photoButton.removeAttribute("hidden", "");

			// getting video stream from user's camera then displaying it on a video element
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
				player.srcObject = stream;
			});
		}
	});

	// Addresses sourcing image from local file
	document.getElementById("mealImg").addEventListener("change", function () {
		const reader = new FileReader();

		// Store image data URL after successful image load
		reader.addEventListener(
			"load",
			() => {
				imgDataURL = reader.result;
			},
			false
		);

		// Convert image file into data URL for local storage
		reader.readAsDataURL(document.getElementById("mealImg").files[0]);
	});

	form.addEventListener("submit", function (e) {
		// Create reviewObject and put in storage
		e.preventDefault();
		let formData = new FormData(form);
		let reviewObject = {};

		// Adds data to the reviewObject from form data
		for (let [key, value] of formData) {
			if (`${key}` !== "tag-form") {
				reviewObject[`${key}`] = `${value}`;
			}
			if (`${key}` === "mealImg" && imgDataURL !== "") {
				reviewObject["mealImg"] = imgDataURL;
			}
		}

		// Makes sure that ratings is filled
		if (reviewObject["rating"] != null) {
			//Adds rags separately as an array
			reviewObject["tags"] = [];

			// Grabs tags
			let tags = document.querySelectorAll(".tag");
			for (let i = 0; i < tags.length; i++) {
				reviewObject["tags"].push(tags[i].innerHTML);
				tagContainer.removeChild(tags[i]);
			}

			// Assigns the new review with a new ID
			let nextReviewId = newReviewToStorage(reviewObject);
			sessionStorage.setItem("currID", JSON.stringify(nextReviewId));

			// Redirects to a page that shows the newly created review
			window.location.assign("./ReviewDetails.html");
		}
		// Does not let user proceed if rating is not complete
		else {
			window.alert("Please fill in rating by selecting the stars :)");
		}
	});

	// Event listener for tag functionality
	let tagAddBtn = document.getElementById("tag-add-btn");
	//Set used to track tags and ensure no duplicates
	let tagSet = new Set();
	tagAddBtn.addEventListener("click", () => {
		let tagField = document.getElementById("tag-form");

		// If there is a tag, it'll display the tag
		if (tagField.value.length > 0) {
			let tagSetVal = tagField.value.toLocaleLowerCase();
			if (!tagSet.has(tagSetVal)) {
				let tagLabel = document.createElement("label");
				tagLabel.innerHTML = tagField.value;
				tagLabel.setAttribute("class", "tag");
				tagSet.add(tagSetVal);
				tagLabel.addEventListener("click", () => {
					tagContainer.removeChild(tagLabel);
					tagSet.delete(tagSetVal);
				});

				tagContainer.append(tagLabel);
			} else {
				window.alert("No duplicate tags allowed");
			}
			tagField.value = "";
		}
	});
}
