//reviewDetails.js
import {getReviewsFromStorage, saveReviewsToStorage} from "./localStorage.js";

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

function init(){
	setupDelete();
	setupUpdate();
}

function setupDelete(){
	let deleteBtn = document.getElementById("delete");
	let reviews = getReviewsFromStorage();
	let current = JSON.parse(sessionStorage.getItem("current"));
	deleteBtn.addEventListener("click", function(){
		if(window.confirm("Are you sure you want to delete this entry?")){
			//delete function
			if(current){
				console.log(current);
				for(let i = 0; i < reviews.length; i++){
					console.log(reviews[i]);
					if(reviews[i]["mealName"] == current["mealName"] && reviews[i]["restaurant"] == current["restaurant"]){
						console.log("match found");
						reviews.splice(i,1);
						saveReviewsToStorage(reviews);
						sessionStorage.removeItem("current");
						window.location.assign("./index.html");
						break;
					}
				}
			}
		}
	});
}

function setupUpdate(){
	let updateBtn = document.getElementById("update");
	let reviews = getReviewsFromStorage();
	let current = JSON.parse(sessionStorage.getItem("current"));
	let form = document.getElementById("update-food-entry");
	updateBtn.addEventListener("click", function(){
		//update function
		if(current){
			console.log(current);
			form.style.display = "block";
			let tagContainer = document.getElementById("tag-container-form");
			console.log(document.querySelectorAll("#update-food-entry input"));

			//Set value of each input element to current's values
			document.getElementById("mealImg").defaultValue = current["mealImg"];
			document.getElementById("imgAlt").defaultValue = current["imgAlt"];
			document.getElementById("mealName").defaultValue = current["mealName"];
			document.getElementById("comments").textContent = current["comments"];
			document.getElementById("rating-" + `${current["rating"]}`).checked = true;
			document.getElementById("restaurant").defaultValue = current["restaurant"];

			if(current["tags"]){
				for (let i = 0; i < current["tags"].length; i++) {
					let newTag = document.createElement("label");
					newTag.setAttribute("class","tag");
					newTag.innerHTML = current["tags"][i] + "   ";
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

				for(let i = 0; i < reviews.length; i++){
					console.log(reviews[i]);
					if(reviews[i]["mealName"] == current["mealName"] && reviews[i]["restaurant"] == current["restaurant"]){
						console.log("match found");
						reviews.splice(i,1,newData);
						saveReviewsToStorage(reviews);
						sessionStorage.setItem("current", JSON.stringify(newData));
						break;
					}
				}

				form.style.display = "none";

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
	});
}
