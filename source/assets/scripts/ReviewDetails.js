//reviewDetails.js
import {deleteReviewFromStorage, getReviewFromStorage, updateReviewToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init(){
	setupInfo();
	setupDelete();
	setupUpdate();
}

/**
 * Populates the relevant data to the details from local storage review
 */
function setupInfo(){
	let updateBtn = document.getElementById("update-btn");
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	let tagContainer = document.getElementById("tag-container-form");

	//Set value of each input element to current's values
	document.getElementById("d-meal-img").defaultValue = currReview["mealImg"];
	document.getElementById("d-meal-name").defaultValue = currReview["mealName"];
	document.getElementById("d-comments").textContent = currReview["comments"];
	document.getElementById("s" + `${currReview["rating"]}`).checked = true;
	document.getElementById("d-restaurant").defaultValue = currReview["restaurant"];

	// set inputs uneditable or hidden
	document.getElementById('d-meal-name').setAttribute('readonly', true);
	document.getElementById('d-meal-name').style.borderBottom = "none";
	document.getElementById('d-meal-name').style.fontFamily = "Century Gothic";
	document.getElementById('d-meal-name').style.fontSize = "2em";
	document.getElementById('d-meal-name').style.textAlign = "center";
	document.getElementById('d-meal-name').style.fontWeight = "bold";
	document.getElementById('d-restaurant').setAttribute('readonly', true);
	document.getElementById('d-restaurant').style.borderBottom = "none";
	document.getElementById('d-restaurant').style.fontFamily = "Century Gothic";
	document.getElementById('d-restaurant').style.fontSize = "1.5em";
	document.getElementById('d-restaurant').style.textAlign = "center";
	document.getElementById('d-meal-name').style.fontWeight = "bold";
	document.getElementById('select').classList.add("hidden");
	document.getElementById('source').classList.add("hidden");
	document.querySelector('.rating').classList.add("hidden");
	document.getElementById('tag-form').classList.add("hidden");
	document.getElementById('tag-add-btn').classList.add("hidden");
	document.getElementById('save-btn').classList.add("hidden");
	document.getElementById('home-btn').classList.add("hidden");

	//rating
	let starsImg = document.getElementById("d-rating");
	starsImg.setAttribute("src", "./assets/images/"+currReview["rating"]+"-star.svg");
	starsImg.setAttribute("alt", currReview["rating"] +" stars");

	//tags
	if(currReview["tags"]){
		for (let i = 0; i < currReview["tags"].length; i++) {
			let newTag = document.createElement("label");
			newTag.setAttribute("class","d-tag");
			newTag.innerHTML = currReview["tags"][i];
			tagContainer.append(newTag);
		}
	}

	//meal image
	let mealImg = document.getElementById("d-meal-img");
	mealImg.setAttribute("src",currReview["mealImg"]);
	mealImg.addEventListener("error", function(e) {
		mealImg.setAttribute("src", "./assets/images/default_plate.png");
		e.onerror = null;
	});

	/*
	* change the input source of the image between local file and URL 
	* depending on user's selection
	*/
	let select = document.getElementById("select");
	select.addEventListener("change", function() {
		const input = document.getElementById("source");
	
		if (select.value == "file") {
			input.innerHTML = `
			Source:
			<input type="file" accept="image/*" id="mealImg" name="mealImg">
			`;
		}
		//TODO: change to photo taking for sprint 3
		else {
			input.innerHTML = `
			Source:
			<input type="text" id="mealImg" name="mealImg">
			`;
		}
	});
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
	
}
