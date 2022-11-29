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

	// Event listener for reading form data
	let select = document.getElementById("select");
	select.addEventListener("change", function() {
		const input = document.getElementById("source");
	
		// Select a photo with HTML file selector
		if (select.value == "file") {
			input.innerHTML = `
			Source:
			<input type="file" accept="image/*" id="mealImg" name="mealImg">
			`;
		}

		// Upload text URL input
		else {
			input.innerHTML = `
			Source:
			<input type="text" id="mealImg" name="mealImg">
			`;
		}
	});

	// Addresses sourcing image from local file
	let imgDataURL = "";
	document.getElementById("mealImg").addEventListener("change", function() {
		const reader = new FileReader();
		
		// Store image data URL after successful image load
		reader.addEventListener("load", ()=>{
			imgDataURL = reader.result;
		}, false);
		
		// Convert image file into data URL for local storage
		reader.readAsDataURL(document.getElementById("mealImg").files[0]);
	});
		
	form.addEventListener("submit", function(e){

		// Create reviewObject and put in storage
		e.preventDefault();
		let formData = new FormData(form);
		let reviewObject = {};

		// Adds data to the reviewObject from form data
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

		// Makes sure that ratings is filled
		if(reviewObject["rating"] != null){

			//Adds rags separately as an array
			reviewObject["tags"] = [];

			// Grabs tags
			let tags = document.querySelectorAll(".tag");
			for(let i = 0; i < tags.length; i ++) {
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
		else{
			window.alert("NO! FILL IN STARS");
		}
        
	});

	// Event listener for tag functionality
	let tagAddBtn = document.getElementById("tag-add-btn");
	tagAddBtn.addEventListener("click", ()=> {
		let tagField = document.getElementById("tag-form");

		// If there is a tag, it'll display the tag
		if (tagField.value.length > 0) {
			let tagLabel = document.createElement("label");
			tagLabel.innerHTML = tagField.value;
			tagLabel.setAttribute("class","tag");
			
			// Allows for user to delete the tag
			tagLabel.addEventListener("click",()=> {
				tagContainer.removeChild(tagLabel);
			});
      	
			// Adds the tag
			tagContainer.append(tagLabel);
			tagField.value = "";

		}
	});

}
