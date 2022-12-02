//reviewDetails.js
import {deleteReviewFromStorage, getReviewFromStorage, updateReviewToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

/**
 * Populates the relevant data to the details from local storage review.
 */
function init(){
	setupInfo();
	setupDelete();
	setupUpdate();
}

/**
 * Populates the relevant data to the details from local storage review
 */
function setupInfo(){
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	
	//meal image
	let mealImg = document.getElementById("d-meal-img");
	mealImg.setAttribute("src",currReview["mealImg"]);
	mealImg.addEventListener("error", function(e) {
		mealImg.setAttribute("src", "./assets/images/default_plate.png");
		e.onerror = null;
	});

	//meal name
	let mealLabel = document.getElementById("d-meal-name");
	mealLabel.innerHTML = currReview["mealName"];

	//restaurant name
	let restaurantLabel = document.getElementById("d-restaurant");
	restaurantLabel.innerHTML = currReview["restaurant"];
	
	//comments
	let comments = document.getElementById("d-comments");
	comments.innerText = currReview["comments"];

	//rating
	let starsImg = document.getElementById("d-rating");
	starsImg.setAttribute("src", "./assets/images/"+currReview["rating"]+"-star.svg");
	starsImg.setAttribute("alt", currReview["rating"] +" stars");
	
	//tags
	let tagContainer = document.getElementById("d-tags");
	if(currReview["tags"]){
		for (let i = 0; i < currReview["tags"].length; i++) {
			let newTag = document.createElement("label");
			newTag.setAttribute("class","d-tag");
			newTag.innerHTML = currReview["tags"][i];
			tagContainer.append(newTag);
		}
	}
}

/**
 * Sets up delete button to delete review from storage and switch to homepage
 */
function setupDelete(){
	let deleteBtn = document.getElementById("delete-btn");
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	deleteBtn.addEventListener("click", function(){
		if(window.confirm("Are you sure you want to delete this entry?")){
			deleteReviewFromStorage(currID);
			sessionStorage.removeItem("currID");
			window.location.assign("./index.html");
		}
	});
}

/**
 * Sets up update button to reveal form and update info in storage and the current page 
 */
function setupUpdate(){
	let updateBtn = document.getElementById("update-btn");
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	let form = document.getElementById("new-food-entry");
	let updateDiv = document.getElementById("update-form");
	updateBtn.addEventListener("click", function(){
		//update function

		updateDiv.classList.remove("hidden");

		let tagContainer = document.getElementById("tag-container-form");

		//Set value of each input element to current's values
		document.getElementById("mealImg").defaultValue = currReview["mealImg"];
		document.getElementById("mealName").defaultValue = currReview["mealName"];
		document.getElementById("comments").textContent = currReview["comments"];
		document.getElementById("s" + `${currReview["rating"]}`).checked = true;
		document.getElementById("restaurant").defaultValue = currReview["restaurant"];

		//Set used to track tags and ensure no duplicates
		let tagSet = new Set();

		if(currReview["tags"]){
			while (tagContainer.firstChild) {
				tagContainer.removeChild(tagContainer.firstChild);
			}
      
			for (let i = 0; i < currReview["tags"].length; i++) {
				let tagSetVal = currReview["tags"][i].toLowerCase()
				tagSet.add(tagSetVal);
				let newTag = document.createElement("label");
				newTag.setAttribute("class","tag");
				newTag.innerHTML = currReview["tags"][i];
				newTag.addEventListener("click",()=> {
					tagContainer.removeChild(newTag);
					tagSet.delete(tagSetVal);
				});
				tagContainer.append(newTag);
			}
		}
		
		// Declaring variable storing image data url
		let imgDataURL = "";

		// Accessing components related to taking photo
		let videoMode = true;
		let player = document.getElementById("player");
		let canvas = document.getElementById("photoCanvas");
		let photoButton = document.getElementById("photoButton");
		let context = canvas.getContext('2d');

		// Event listener for the photo taking/reset button
		photoButton.addEventListener('click', ()=>{
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

		/*
		* change the input source of the image between local file and taking photo 
		* depending on user's selection
		*/
		let select = document.getElementById("select");
		const input = document.getElementById("mealImg");
		select.addEventListener("change", function() {
			console.log("1");
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
				navigator.mediaDevices.getUserMedia({video: true,}).then((stream)=>{
					player.srcObject = stream;
				});
			}
		});

		//addressing sourcing image from local file
		document.getElementById("mealImg").addEventListener("change", function() {
			console.log("reading used");
			const reader = new FileReader();
			
			//store image data URL after successful image load
			reader.addEventListener("load", ()=>{
				imgDataURL = reader.result;
			}, false);
			
			//convert image file into data URL for local storage
			reader.readAsDataURL(document.getElementById("mealImg").files[0]);
		});

		
		//Take formdata values as newData when submit
		form.addEventListener("submit", function(){
			/*
			*  User submits the form for their review.
			*  We create reviewCard data, replace in storage, and update tags
			*/
			let formData = new FormData(form);
			let newData = {};
			//iterate through formData and add to newData
			for (let [key, value] of formData) {
				console.log(`${key}`);
				console.log(`${value}`);
				if (`${key}` !== "tag-form") {
					newData[`${key}`] = `${value}`;
				}
				// Account for the case where image is not updated
				if (`${key}` === "mealImg" && imgDataURL === "") {
					newData["mealImg"] = currReview["mealImg"];
				}
				else if (`${key}` === "mealImg") {
					newData["mealImg"] = imgDataURL;
				}
			}
			newData["tags"] = [];
		
			let tags = document.querySelectorAll(".tag");
			for(let i = 0; i < tags.length; i ++) {
				newData["tags"].push(tags[i].innerHTML);
				tagContainer.removeChild(tags[i]);
			}

			newData["reviewID"] = currID;
			
			updateReviewToStorage(currID, newData);

			updateDiv.classList.add("hidden");

		});

		//adding tag to form functionality
		let tagAddBtn = document.getElementById("tag-add-btn");
		tagAddBtn.addEventListener("click", ()=> {
			let tagField = document.getElementById("tag-form");
			if (tagField.value.length > 0) {
				let tagSetVal = tagField.value.toLowerCase();
				if (!tagSet.has(tagSetVal)){
					let tagLabel = document.createElement("label");
					tagLabel.innerHTML = tagField.value;
					tagLabel.setAttribute("class","tag");
					tagSet.add(tagSetVal);
					tagLabel.addEventListener("click",()=> {
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
	});
}
