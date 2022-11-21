//reviewDetails.js
import {deleteReviewFromStorage, getReviewFromStorage, updateReviewToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init(){
	setupInfo();
	setupDelete();
	setupUpdate();
}

function setupInfo(){
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	
	//meal image
	let mealImg = document.getElementById("d-mealImg");
	mealImg.setAttribute("src",currReview["mealImg"]);
	mealImg.addEventListener("error", function(e) {
		mealImg.setAttribute("src", "./assets/images/icons/plate_with_cutlery.png");
		e.onerror = null;
	});

	//meal name
	let mealLabel = document.getElementById("d-mealName");
	mealLabel.innerHTML = currReview["mealName"];

	//restaurant name
	let restaurantLabel = document.getElementById("d-restaurant");
	restaurantLabel.innerHTML = currReview["restaurant"];
	
	//comments
	let comments = document.getElementById("d-comments");
	comments.innerText = currReview["comments"];

	//rating
	let starsImg = document.getElementById("d-rating");
	starsImg.setAttribute("src", "./assets/images/icons/"+currReview["rating"]+"-star.svg");
	starsImg.setAttribute("alt", currReview["rating"] +" stars");
	
	//tags
	let tagContainer = document.getElementById("d-tags");
	if(currReview["tags"]){
		for (let i = 0; i < currReview["tags"].length; i++) {
			let newTag = document.createElement("label");
			newTag.setAttribute("class","tag");
			newTag.innerHTML = currReview["tags"][i];
			tagContainer.append(newTag);
		}
	}
}

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

function setupUpdate(){
	let updateBtn = document.getElementById("update-btn");
	let currID = JSON.parse(sessionStorage.getItem("currID"));
	let currReview = getReviewFromStorage(currID);
	let form = document.getElementById("update-form");
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
				//Account for the case where image is not updated
				if (`${key}` === "mealImg" && document.getElementById("mealImg").value === "") {
					newData["mealImg"] = currReview["mealImg"];
				}
				else if (`${key}` === "mealImg" && select.value == "file") {
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
