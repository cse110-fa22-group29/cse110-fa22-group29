import { newReviewToStorage } from "./localStorage.js";

window.addEventListener("DOMContentLoaded", init);

function init() {
	// get next id

	// creates the key
	initFormHandler();
    
}

function initFormHandler() {

	//accessing form components
	let tagContainer = document.getElementById("tag-container-form");
	let form = document.querySelector("form");
  
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
			window.alert("NO");
		}
        
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

}
