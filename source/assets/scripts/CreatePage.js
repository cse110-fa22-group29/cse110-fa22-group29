import { newReviewToStorage } from "./localStorage.js";

window.addEventListener("DOMContentLoaded", init);

function init() {
	initFormHandler();
}

function initFormHandler() {

	//accessing form components
	let tagContainer = document.getElementById("tag-container-form");
	let form = document.querySelector("form");

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
		const reader = new FileReader();
		
		//store image data URL after successful image load
		reader.addEventListener("load", ()=>{
			imgDataURL = reader.result;
		}, false);
		
		//convert image file into data URL for local storage
		reader.readAsDataURL(document.getElementById("mealImg").files[0]);
	});
		
	form.addEventListener("submit", function(e){
	/*
    *  User submits the form for their review.
    *  We create reviewCard and put in storage
    */
		e.preventDefault();
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
		if(reviewObject["rating"] != null){
			reviewObject["tags"] = [];

			let tags = document.querySelectorAll(".tag");
			for(let i = 0; i < tags.length; i ++) {
				reviewObject["tags"].push(tags[i].innerHTML);
				tagContainer.removeChild(tags[i]);
			}

			let nextReviewId = newReviewToStorage(reviewObject);
			sessionStorage.setItem("currID", JSON.stringify(nextReviewId));

			window.location.assign("./ReviewDetails.html");
		} else{
			window.alert("NO! FILL IN STARS");
		}
        
	});

	let tagAddBtn = document.getElementById("tag-add-btn");
	//Set used to track tags and ensure no duplicates
	let tagSet = new Set();
	tagAddBtn.addEventListener("click", ()=> {
		let tagField = document.getElementById("tag-form");
		if (tagField.value.length > 0) {
			let tagSetVal = tagField.value.toLowerCase();
			if (!tagSet.has(tagSetVal)){
				let tagLabel = document.createElement("label");
				tagLabel.innerHTML = tagField.value;
				tagLabel.setAttribute("class","tag");
				tagSet.add(tagField.value.toLowerCase());
				tagLabel.addEventListener("click",()=> {
					tagContainer.removeChild(tagLabel);
					tagSet.delete(tagField.value.toLowerCase());
				});
		
				tagContainer.append(tagLabel);
			} else {
				window.alert("No duplicate tags allowed");
			}
			tagField.value = "";
		}
	});

}
