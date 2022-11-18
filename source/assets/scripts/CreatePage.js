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
		reviewObject["tags"] = [];

		let tags = document.querySelectorAll(".tag");
		for(let i = 0; i < tags.length; i ++) {
			reviewObject["tags"].push(tags[i].innerHTML);
			tagContainer.removeChild(tags[i]);
		}

		//grabbing the nextID, and putting our review object in storage associated with the ID
		let nextReviewId = JSON.parse(localStorage.getItem("nextID"));
		reviewObject["reviewID"] = nextReviewId;

        localStorage.setItem("review"+nextReviewId, JSON.stringify(reviewObject));
		sessionStorage.setItem("currID", JSON.stringify(nextReviewId));

        //updating our activeIDS list
        let tempIdArr = JSON.parse(localStorage.getItem("activeIDS"));
        tempIdArr.push(nextReviewId);
        localStorage.setItem("activeIDS", JSON.stringify(tempIdArr));
        
        
        //increment nextID for next review creation
        nextReviewId++;
		localStorage.setItem("nextID", JSON.stringify(nextReviewId));

		window.location.assign('./ReviewDetails.html');
        
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
