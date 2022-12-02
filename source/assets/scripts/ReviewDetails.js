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
	//let head = document.querySelector("head");
	let form = document.getElementById("update-form");
	let editable = false;

	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	let tagContainer = document.getElementById("tag-container-form");

	//Set value of each input element to current's values
	document.getElementById("d-meal-img").defaultValue = currReview["mealImg"];
	document.getElementById("d-meal-name").defaultValue = currReview["mealName"];
	document.getElementById("d-comments").defaultValue = currReview["comments"];
	document.getElementById("s" + `${currReview["rating"]}`).checked = true;
	document.getElementById("d-restaurant").defaultValue = currReview["restaurant"];

	// set inputs uneditable or hidden
	let mealLabel = document.getElementById('d-meal-name');
	mealLabel.setAttribute('readonly', true);
	mealLabel.classList.add("read-only");
	let restaurantLabel = document.getElementById('d-restaurant');
	restaurantLabel.setAttribute('readonly', true);
	restaurantLabel.classList.add("read-only");
	let comments = document.getElementById('d-comments');
	comments.setAttribute('readonly', true);

	//rating
	let starsImg = document.getElementById("d-rating");
	starsImg.setAttribute("src", "./assets/images/"+currReview["rating"]+"-star.svg");
	starsImg.setAttribute("alt", currReview["rating"] +" stars");

	//tags
	//Set used to track tags and ensure no duplicates
	let tagSet = new Set();
	if(currReview["tags"]){
		let tagSetVal;
		for (let i = 0; i < currReview["tags"].length; i++) {
			tagSetVal = currReview["tags"][i].toLowerCase()
			tagSet.add(tagSetVal);
			let newTag = document.createElement("label");
			newTag.setAttribute("class","d-tag");
			newTag.innerHTML = currReview["tags"][i];
			newTag.addEventListener("click",()=> {
				if(editable){
					tagContainer.removeChild(newTag);
					tagSet.delete(tagSetVal);
				}
			});
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

	//addressing sourcing image from local file
	let imgDataURL = "";
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

	updateBtn.addEventListener("click", function(){
		editable = true;
		let editStyle = document.createElement("link");
		editStyle.rel = 'stylesheet';	 
		editStyle.type = 'text/css';
		editStyle.href = './static/Form.css';
		editStyle.setAttribute("id", "edit-style");
		form.append(editStyle);

		mealLabel.readOnly = false;
		restaurantLabel.readOnly = false;
		comments.readOnly = false;

		console.log("editable");

	});

	//Note: had to change id name. Could mess with tests
	let cancelBtn = document.getElementById("cancel-btn");
	cancelBtn.addEventListener("click", function(){
		window.location.reload();
	});

	//Take formdata values as newData when submit
	form.addEventListener("submit", function(e){
		/*
		*  User submits the form for their review.
		*  We create reviewCard data, replace in storage, and update tags
		*/
		e.preventDefault();
		let formData = new FormData(form);
		let newData = {};
		//iterate through formData and add to newData
		for (let [key, value] of formData) {
			console.log(`${key}`);
			console.log(`${value}`);
			if (`${key}` !== "tag-form") {
				newData[`${key}`] = `${value}`;
			}
			//Account for the case where image is not updated
			if (`${key}` === "mealImg" && document.getElementById("mealImg").value === "") {
				newData["mealImg"] = currReview["mealImg"];
			}
			else if (`${key}` === "mealImg" && select.value == "file") {
				newData["mealImg"] = imgDataURL;
			}
		}
		newData["tags"] = [];
	
		let tags = document.querySelectorAll(".d-tag");
		for(let i = 0; i < tags.length; i ++) {
			newData["tags"].push(tags[i].innerHTML);
			tagContainer.removeChild(tags[i]);
		}

		newData["reviewID"] = currID;
		
		updateReviewToStorage(currID, newData);

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
				tagLabel.setAttribute("class","d-tag");
				tagSet.add(tagSetVal);
				tagLabel.addEventListener("click",()=> {
					if(editable){
						tagContainer.removeChild(tagLabel);
						tagSet.delete(tagSetVal);
					}
				});
		
				tagContainer.append(tagLabel);
			} else {
				window.alert("No duplicate tags allowed");
			}
			tagField.value = "";
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

function triggerUpdate(){
	//need to add info only to update btn
}