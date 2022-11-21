//ReviewDetails.js
import {deleteReviewFromStorage, getReviewFromStorage, updateReviewToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

/**
 * Delegates the functionality for deleting and updating review cards.
 */
function init(){
	setupDelete();
	setupUpdate();
}

/**
 * Sets up functionality for the delete button when deleting a review.
 */
function setupDelete(){

	// Grabs the delete button
	let deleteBtn = document.getElementById("delete-btn");

	// Gets the ID from the current review card
	let currID = JSON.parse(sessionStorage.getItem("currID"));

	// Event Listener that deletes the review from storage
	deleteBtn.addEventListener("click", function(){

		// Pop-up that checks if the user wants to delete
		// If so, deletes from storage
		if(window.confirm("Are you sure you want to delete this entry?")){
			deleteReviewFromStorage(currID);
			sessionStorage.removeItem("currID");
			window.location.assign("./index.html");
		}
	});
}

/**
 * Sets up functionality for the update button when updating a review.
 */
function setupUpdate(){

	// Grabs the update button
	let updateBtn = document.getElementById("update-btn");

	// Gets the ID from the current review card
	let currID = JSON.parse(sessionStorage.getItem("currID"));

	// Gets the data from the current review card
	let currReview = getReviewFromStorage(currID);

	// Gets the form
	let form = document.getElementById("update-food-entry");
	updateBtn.addEventListener("click", function(){
		//update function

		//form.style.display = "block";
		form.classList.remove("hidden");
		let tagContainer = document.getElementById("tag-container-form");

		//Set value of each input element to current's values
		document.getElementById("mealImg").defaultValue = currReview["mealImg"];
		document.getElementById("imgAlt").defaultValue = currReview["imgAlt"];
		document.getElementById("mealName").defaultValue = currReview["mealName"];
		document.getElementById("comments").textContent = currReview["comments"];
		document.getElementById("s" + `${currReview["rating"]}`).checked = true;
		document.getElementById("restaurant").defaultValue = currReview["restaurant"];

		if(currReview["tags"]){
			while (tagContainer.firstChild) {
				tagContainer.removeChild(tagContainer.firstChild);
			}
			for (let i = 0; i < currReview["tags"].length; i++) {
				let newTag = document.createElement("label");
				newTag.setAttribute("class","tag");
				newTag.innerHTML = currReview["tags"][i];
				newTag.addEventListener("click",()=> {
					tagContainer.removeChild(newTag);
				});
				tagContainer.append(newTag);
			}
		}
		//Take formdata values as newData when submit
		form.addEventListener("submit", function(){
			/*
			*  User submits the form for their review.
			*  We create reviewCard and put in storage
			*/
			let formData = new FormData(form);
			let newData = {};
			for (let [key, value] of formData) {
				console.log(`${key}`);
				console.log(`${value}`);
				if (`${key}` !== "tag-form") {
					newData[`${key}`] = `${value}`;
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

			form.style.display = "none";

		});

		let tagAddBtn = document.getElementById("tag-add-btn");
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
	});
}
