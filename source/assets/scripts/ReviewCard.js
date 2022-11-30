// ReviewCard.js

class ReviewCard extends HTMLElement {
	// Called once when document.createElement('review-card') is called, or
	// the element is written into the DOM directly as <review-card>
	constructor() {
		super(); 

		let shadowEl = this.attachShadow({mode:"open"});

		let articleEl = document.createElement("article");

		let styleEl = document.createElement("style");
		styleEl.textContent = `
		* {
			font-family: Century Gothic;
			margin: 0;
			padding: 0;
			overflow-wrap: anywhere;
		}
		
		a {
			text-decoration: none;
		}
		
		a:hover {
			text-decoration: underline;
		}
		
		article {
			align-items: center;
			border: 2px solid rgb(31, 41, 32);
			border-radius: 8px;
			height: auto;
			row-gap: 5px;
			padding: 0 16px 16px 16px;
			width: 200px;
			margin: 8px 8px 8px 8px;
		}
		
		div.rating {
			align-items: center;
			display: flex;
		}
		
		div.rating>img {
			height: auto;
			display: inline-block;
			object-fit: scale-down;
		}
		
		article>img {
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			height: 120px;
			object-fit: cover;
			margin-left: -16px;
			margin-right: -16px;
			width: calc(100% + 32px);
		}

		.meal-name-div {
			height: 54px;
			overflow: hidden;
		}
		
		label.restaurant-name {
			color: black !important;
		}
		
		label.meal-name {
			font-size: 24px;
			height: 36px;
		}
		
		label:not(.meal-name),
		span,
		time {
			color: #70757A;
			font-size: 12px;
		}

		.tag-container-div {
			margin-top: 20px;
			height: 100px;
			overflow: hidden;
		}

		.tag-container {
			display: flex;
			flex-flow: row wrap;
			height: fit-content;
		}
		
		.a-tag {
			background-color:#94da97;
			border-radius: 6px;
			color: #94da97;
			padding: 0px 6px 2px 6px;
			margin: 2px 2px 2px 2px;
			font-weight: bold;
			overflow: hidden;
			height: 14px;
		}
    	`;
		articleEl.append(styleEl);
		shadowEl.append(articleEl);
		this.shadowEl = shadowEl;
		
		// Attach event listener to each review-card
		this.addEventListener("click", (event) => {
			console.log(event.target);
			console.log(event.target.reviewId);
			// Saves the ID for corresponding review on new page (for data retrieval)
			sessionStorage.setItem("currID", JSON.stringify(event.target.data.reviewID));
			// Goes to the new page for the review
			window.location.assign("./ReviewDetails.html");
		});
	}

	/**
	* Called when the .data property is set on this element.
	*
	* For Example:
	* let reviewCard = document.createElement('review-card'); 
	* reviewCard.data = { foo: 'bar' } 
	*
	* @param {Object} data - The data to pass into the <review-card>, must be of the
	*                        following format:
	*                        {
	*                          "mealImg": string,
	*                          "mealName": string,
	*                          "comments": string,
	*                          "rating": number,
	*                          "restaurant": string,
	*                          "reviewID": number,
	*                          "tags": string array
	*                        }
	*/
	set data(data) {
		// If nothing was passed in, return
		if (!data) return;

		// Select the <article> we added to the Shadow DOM in the constructor
		let articleEl = this.shadowEl.querySelector("article");
    
		// Setting the article elements for the review card
		this.reviewID = data["reviewID"];

		// Image setup
		let mealImg = document.createElement("img");
		mealImg.setAttribute("id", "a-mealImg");
		mealImg.setAttribute("alt","Meal Photo Corrupted");
		mealImg.setAttribute("src",data["mealImg"]);
		mealImg.addEventListener("error", function(e) {
			mealImg.setAttribute("src", "./assets/images/default_plate.png");
			e.onerror = null;
		});

		//meal name setup
		let meallabelDiv = document.createElement("div");
		meallabelDiv.setAttribute("class", "meal-name-div");
		let mealLabel = document.createElement("label");
		mealLabel.setAttribute("id", "a-mealName");
		mealLabel.setAttribute("class","meal-name");
		mealLabel.innerHTML = data["mealName"];
		meallabelDiv.append(mealLabel);

		// Restaurant name setup
		let restaurantLabel = document.createElement("label");
		restaurantLabel.setAttribute("id", "a-restaurant");
		restaurantLabel.setAttribute("class","restaurant-name");
		restaurantLabel.innerHTML = data["restaurant"];

		// Comment section setup (display set to none)
		let comments = document.createElement("p");
		comments.setAttribute("id", "a-comments");
		comments.style.display = "none";
		comments.innerText = data["comments"];

		// Rating setup
		let ratingDiv = document.createElement("div");
		ratingDiv.setAttribute("class", "rating");
		let starsImg = document.createElement("img");
		starsImg.setAttribute("id", "a-rating");
		starsImg.setAttribute("src", "./assets/images/"+data["rating"]+"-star.svg");
		starsImg.setAttribute("alt", data["rating"] +" stars");
		starsImg.setAttribute("num", data["rating"]);
		ratingDiv.append(starsImg);

		//added tags
		let tagContainerDiv = document.createElement("div"); 
		tagContainerDiv.setAttribute("class", "tag-container-div");
		let tagContainer = document.createElement("div");
		tagContainer.setAttribute("class", "tag-container");
		tagContainer.setAttribute("id", "a-tags");
		tagContainer.setAttribute("list", data["tags"]);

		// Checks if user gave tags, if so added to review card
		if(data["tags"]){
			for (let i = 0; i < data["tags"].length; i++) {
				let newTag = document.createElement("label");
				newTag.setAttribute("class","a-tag");
				newTag.innerHTML = data["tags"][i];
				tagContainer.append(newTag);
			}
		}
		tagContainerDiv.append(tagContainer);

		// Setting all the data to the review card
		articleEl.append(mealImg);
		articleEl.append(meallabelDiv);
		articleEl.append(restaurantLabel);
		articleEl.append(ratingDiv);
		articleEl.append(tagContainerDiv);
		articleEl.append(comments);


	}

	/**
	* Called when getting the .data property of this element.
	*
	* For Example:
	* let reviewCard = document.createElement('review-card'); 
	* reviewCard.data = { foo: 'bar' } 
	*
	* @return {Object} data - The data from the <review-card>, of the
	*                        following format:
	*                        {
	*                          "mealImg": string,
	*                          "mealName": string,
	*                          "comments": string,
	*                          "rating": number,
	*                          "restaurant": string,
	*                          "reviewID": number,
	*                          "tags": string array
	*                        }
	*/
	get data() {

		let dataContainer = {};
    
		// Getting the article elements for the review card
		dataContainer["reviewID"] = this.reviewID;

		// Get image
		let mealImg = this.shadowEl.getElementById("a-mealImg");
		dataContainer["mealImg"] = mealImg.getAttribute("src");

		// Get meal name
		let mealLabel = this.shadowEl.getElementById("a-mealName");
		dataContainer["mealName"] = mealLabel.innerHTML;

		// Get comment section
		let comments = this.shadowEl.getElementById("a-comments");
		console.log(comments);
		dataContainer["comments"] = comments.innerText;

		// Get rating
		let starsImg = this.shadowEl.getElementById("a-rating");
		dataContainer["rating"] = starsImg.getAttribute("num");

		//Get restaurant name
		let restaurantLabel = this.shadowEl.getElementById("a-restaurant");
		dataContainer["restaurant"] = restaurantLabel.innerHTML;

		// Get tags
		let tagContainer = this.shadowEl.getElementById("a-tags");
		dataContainer["tags"] = tagContainer.getAttribute("list").split(",");

		return dataContainer;
	}
}
customElements.define("review-card", ReviewCard);
