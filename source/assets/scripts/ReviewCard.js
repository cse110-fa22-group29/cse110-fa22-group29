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
			display: grid;
			grid-template-rows: 118px 56px 14px 18px 15px 36px;
			height: auto;
			row-gap: 5px;
			padding: 0 16px 16px 16px;
			width: 178px;
			margin: 8px 8px 8px 8px;
		}
		
		div.rating {
			align-items: center;
			column-gap: 5px;
			display: flex;
		}
		
		div.rating>img {
			height: auto;
			display: inline-block;
			object-fit: scale-down;
			width: 78px;
		}
		
		article>img {
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			height: 119px;
			object-fit: cover;
			margin-left: -16px;
			width: calc(100% + 32px);
		}
		
		label.restaurant-name {
			color: black !important;
		}
		
		label.meal-name {
			display: -webkit-box;
			font-size: 16px;
			height: 36px;
			line-height: 18px;
			overflow: hidden;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		
		label:not(.meal-name),
		span,
		time {
			color: #70757A;
			font-size: 12px;
		}

		.tag-container {
			margin-top: 20px;
			display: flex;
			flex-flow: row wrap;
		}
		
		.a-tag {
			background-color:#94da97;
			border-radius: 7px;
			color: #94da97;
			padding-right: 7px;
			padding-left: 7px;
			margin: 3px;
			font-weight: bold;
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
			mealImg.setAttribute("src", "./assets/images/plate_with_cutlery.png");
			e.onerror = null;
		});

		// Meal name setup
		let mealLabel = document.createElement("label");
		mealLabel.setAttribute("id", "a-mealName");
		mealLabel.setAttribute("class","meal-name");
		mealLabel.innerHTML = data["mealName"];

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

		// Tags setup
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

		// Setting all the data to the review card
		articleEl.append(mealImg);
		articleEl.append(mealLabel);
		articleEl.append(restaurantLabel);
		articleEl.append(ratingDiv);
		articleEl.append(tagContainer);
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
