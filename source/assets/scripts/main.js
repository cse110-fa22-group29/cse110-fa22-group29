// main.js
import {getReviewsFromStorage, saveReviewsToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init() {
	// Get the reviews from localStorage
	let reviews = getReviewsFromStorage();
	// Add each reviews to the <main> element
	addReviewsToDocument(reviews);
	// Add the event listeners to the form elements
	initFormHandler();
}

/**
 * @param {Array<Object>} reviews An array of reviews
 */
function addReviewsToDocument(reviews) {
	let mainEl = document.querySelector("main");
	reviews.forEach(review => {
		let newReview = document.createElement("review-card");
		newReview.data = review;
		//TODO: want to append it to whatever the box is in layout 
		mainEl.append(newReview);
	});

}

/**
 * Adds the necessary event handlers to <form> and the clear storage
 * <button>.
 */
function initFormHandler() {

	/*
	//btn to create form (could be its own function?)
	let createBtn = document.getElementById("create");
	createBtn.addEventListener("click", function(){
		window.location.assign("./CreatePage.html");
	});*/

	//accessing form components
	let tagContainer = document.getElementById("tag-container-form");
	let form = document.querySelector("form");

	/*
	* change the input source of the image between local file and URL 
	* depending on user's selection
	*/
	let select = document.getElementById("select");
	select.addEventListener("change", function() {
		const input = document.getElementById('source');
	
		if (select.value == "file") {
		  input.innerHTML = `
		  Source:
		  <input type="file" id="mealImg" name="mealImg">
		  `
		}
		else {
		  input.innerHTML = `
		  Source:
		  <input type="text" id="mealImg" name="mealImg">
		  `
		}
	});

	//addressing sourcing image from local file
	let imgDataURL = "";
	document.getElementById("mealImg").addEventListener("change", function() {
		const reader = new FileReader();
		
		//store image data URL after successful image load
		reader.addEventListener("load", ()=>{
			imgDataURL = reader.result;
		}, false);
		
		//convert image file into data URL for local storage
		reader.readAsDataURL(document.getElementById("mealImg").files[0]);
	})


  
	form.addEventListener("submit", function(){
	/*
    *  User submits the form for their review.
    *  We create reviewCard and put in storage
    */
		let formData = new FormData(form);
		let reviewObject = {};

		for (let [key, value] of formData) {
			console.log(`${key}`);
			console.log(`${value}`);
			if (`${key}` !== "tag-form") {
				reviewObject[`${key}`] = `${value}`;
			}
			if (`${key}` === "mealImg" && select.value == "file") {
				reviewObject["mealImg"] = imgDataURL;
			}
		}
		reviewObject["tags"] = [];

		let tags = document.querySelectorAll(".tag");
		for(let i = 0; i < tags.length; i ++) {
			reviewObject["tags"].push(tags[i].innerHTML);
			tagContainer.removeChild(tags[i]);
		}
    

		let newReview = document.createElement("review-card");
		newReview.data = reviewObject;

		//TODO: want to append it to whatever the box is in layout 
		let mainEl = document.querySelector("main");
		mainEl.append(newReview);

		let storedReviews = getReviewsFromStorage();
		storedReviews.push(reviewObject);
		saveReviewsToStorage(storedReviews);
		document.getElementById("new-food-entry").reset();
	});

	// DEV-MODE: for testing purposes 
	let clearBtn = document.querySelector(".danger");
	clearBtn.addEventListener("click", function() {
		localStorage.clear();
		let mainEl = document.querySelector("main");
		while (mainEl.firstChild) {
			mainEl.removeChild(mainEl.firstChild);
		}
		let deleteTags = document.querySelectorAll(".tag");
		for(let i = 0; i < deleteTags.length; i ++) {
			tagContainer.removeChild(deleteTags[i]);
		}
    
		//clears reviews AS WELL as resets form
		document.getElementById("new-food-entry").reset();
     
     
	});

	let tagAddBtn = document.getElementById("tagAdd");
	tagAddBtn.addEventListener("click", ()=> {
		let tagField = document.getElementById("tag-form");
		if (tagField.value.length > 0) {
			let tagLabel = document.createElement("label");
			tagLabel.innerHTML = tagField.value;
			tagLabel.setAttribute("class","tag");
			tagLabel.addEventListener("click",()=> {
				tagContainer.removeChild(tagLabel);
			});
      
			tagContainer.append(tagLabel);
			tagField.value = "";

		}
	});

}
