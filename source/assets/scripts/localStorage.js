/**
 * Creates a new review to storage and performs related meta tasks
 * @param {Object} review to store
 * @return {number} ID of the newly added review
 */
export function newReviewToStorage(review){
	//grabbing the nextID, and putting our review object in storage associated with the ID
	let nextReviewId = JSON.parse(localStorage.getItem("nextID"));
	review["reviewID"] = nextReviewId;

	// set the review entry to the review object
	localStorage.setItem(`review${nextReviewId}`, JSON.stringify(review));

	// adding to the tag keys
	addTagsToStorage(nextReviewId, review["tags"]);

	//adding to the star storage
	let starArr = JSON.parse(localStorage.getItem(`star${review["rating"]}`));
	if(!starArr){
		starArr = [];
	}
	starArr.push(nextReviewId);
	localStorage.setItem(`star${review["rating"]}`, JSON.stringify(starArr));
	
	//updating our activeIDS list
	let tempIdArr = JSON.parse(localStorage.getItem("activeIDS"));
	tempIdArr.push(nextReviewId);
	localStorage.setItem("activeIDS", JSON.stringify(tempIdArr));
	
	//increment nextID for next review creation
	localStorage.setItem("nextID", JSON.stringify(nextReviewId + 1));

	return nextReviewId;
}

/**
 * Gets a single review by ID from storage
 * @param {string} ID of the review to get
 * @returns {Object} review object corresponding to param ID
 */
export function getReviewFromStorage(ID){
	return JSON.parse(localStorage.getItem(`review${ID}`));
}

/**
 * Updates a single review by ID to storage
 * @param {string} ID of review to update
 * @param {Object} review to store
 */
export function updateReviewToStorage(ID, review){
	let oldReview = JSON.parse(localStorage.getItem(`review${ID}`));
	let starArr = JSON.parse(localStorage.getItem(`star${review["rating"]}`));

	//activeID update recency
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));
	for (let i in activeIDS){
		if(activeIDS[i] == ID){
			activeIDS.splice(i,1);
			activeIDS.push(ID);
			break;
		}
	}
	localStorage.setItem("activeIDS", JSON.stringify(activeIDS));

	//star local storage update
	if(oldReview["rating"] !== review["rating"]){
		//first delete from previous rating array in storage
		let oldStarArr = JSON.parse(localStorage.getItem(`star${oldReview["rating"]}`));
		for (let i in oldStarArr) {
			if (oldStarArr[i] == ID) {
				//removing from corresponding rating array and updating local Storage
				oldStarArr.splice(i,1);
				break;
			}
		}
		if(oldStarArr.length != 0){
			localStorage.setItem(`star${oldReview["rating"]}`, JSON.stringify(oldStarArr));
		} else {
			localStorage.removeItem(`star${oldReview["rating"]}`);
		}
		//then add ID to array corresponding to new review rating
		let newStarArr = starArr;
		if(!newStarArr){
			newStarArr = [];
		}
		newStarArr.push(ID);
		localStorage.setItem(`star${review["rating"]}`, JSON.stringify(newStarArr));
	} else if(starArr.length !== 1) {
		//stars update recency if unchanged
		for (let i in starArr){
			if(starArr[i] == ID) {
				starArr.splice(i,1)
				starArr.push(ID);
				break;
			}
		}
		localStorage.setItem(`star${review["rating"]}`, JSON.stringify(starArr));
	}

	//specifically the unchanged tags update recency
	let repeatedTags = review["tags"].filter(x => oldReview["tags"].includes(x));
	let tagArr = [];
	for (let i in repeatedTags){
		tagArr = JSON.parse(localStorage.getItem(`!${repeatedTags[i]}`));
		if(tagArr.length == 1){
			for (let j in tagArr){
				if(tagArr[j] == ID){
					tagArr.splice(j,1);
					tagArr.push(ID);
					break;
				}
			}
			localStorage.setItem(`!${repeatedTags[i]}`, JSON.stringify(tagArr));
		}
	}

	//Get diff of tags and update storage
	let deletedTags = oldReview["tags"].filter(x => !review["tags"].includes(x));
	let addedTags = review["tags"].filter(x => !oldReview["tags"].includes(x));
	deleteTagsFromStorage(ID, deletedTags);
	addTagsToStorage(ID, addedTags);

	// set the review entry with ID to the review object
	localStorage.setItem(`review${ID}`, JSON.stringify(review));
}

/**
 * Deletes a review by ID from storage
 * @param {string} ID of the review to delete
 */
export function deleteReviewFromStorage(ID){
	//removing id number from activeIDS and star{rating}
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));
	let reviewRating = JSON.parse(localStorage.getItem(`review${ID}`))["rating"];
	let starArr = JSON.parse(localStorage.getItem(`star${reviewRating}`));
	
	for (let i in starArr) {
		if (starArr[i] == ID) {
			//removing from corresponding rating array and updating local Storage
			starArr.splice(i,1);
			break;
		}
	}
	if(starArr.length != 0){
		localStorage.setItem(`star${reviewRating}`, JSON.stringify(starArr));
	} else {
		localStorage.removeItem(`star${reviewRating}`);
	}
	
	for (let i in activeIDS) {
		if (activeIDS[i] == ID) {
			activeIDS.splice(i,1);
			localStorage.setItem("activeIDS", JSON.stringify(activeIDS));
			
			let currReview = JSON.parse(localStorage.getItem(`review${ID}`));
			deleteTagsFromStorage(ID, currReview["tags"]);
			localStorage.removeItem(`review${ID}`);
			return;
		}
	}

	console.error(`could not find review${ID} in localStorage`);
}

/**
 * Delete ID from the specified tags' storage
 * @param {string} ID to delete from lists
 * @param {string[]} deletedTags to modify storage of
 */
function deleteTagsFromStorage(ID, deletedTags) {
	for(let i in deletedTags){
		//get local storage of each tag and remove id from tag list
		let tagName = "!"+ deletedTags[i].toLowerCase();
		let tagArr = JSON.parse(localStorage.getItem(tagName));
		for(let j in tagArr){
			if(tagArr[j] == ID){
				tagArr.splice(j,1);
				break;
			}
		}
		if(tagArr.length != 0){
			localStorage.setItem(tagName, JSON.stringify(tagArr));
		} else {
			localStorage.removeItem(tagName);
		}
	}
}

/**
 * Add ID from the specified tags' storage
 * @param {string} ID to add to lists
 * @param {string[]} addedTags to modify storage of
 */
function addTagsToStorage(ID, addedTags) {
	for(let i in addedTags){
		let tagName = "!" + addedTags[i].toLowerCase();
		let tagArr = JSON.parse(localStorage.getItem(tagName));
		if(!tagArr){
			tagArr = [];
		}
		tagArr.push(ID);
		localStorage.setItem(tagName, JSON.stringify(tagArr));
	}
}

/**
 * Test Helper Function to get all reviews from local storage
 * @returns {Object} all active reviews from local storage
 */
export function getAllReviewsFromStorage() {
	if (!(localStorage.getItem("activeIDS"))) {
		// we wanna init the active ID array and start the nextID count
		localStorage.setItem("activeIDS", JSON.stringify([]));
		localStorage.setItem("nextID",  JSON.stringify(0));
	}
	//iterate thru activeIDS
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));
	let reviews = [];
	for (let i = 0; i < activeIDS.length; i++) {
		let currReview = JSON.parse(localStorage.getItem(`review${activeIDS[i]}`));
		reviews.push(currReview);
	}
	return reviews;
}

/**
 * Get all IDs of active reviews (order: most recent)
 * @returns {number[]} list of all active IDs by recency
 */
export function getIDsFromStorage() {
	if (!(localStorage.getItem("activeIDS"))) {
		// we wanna init the active ID array and start the nextID count
		localStorage.setItem("activeIDS", JSON.stringify([]));
		localStorage.setItem("nextID",  JSON.stringify(0));
	}
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));
	return activeIDS.reverse();
}

/**
 * Returns all review IDs which contain the same tag specified (order: most recent)
 * @param {string} tag to filter by
 * @returns {number[]} list of IDs of reviews that all contain the specified tag by recency
 */
export function getIDsByTag(tag) {
	let tagArr = JSON.parse(localStorage.getItem("!" + tag.toLowerCase()));
	if(!tagArr){
		tagArr = [];
	}
	return tagArr.reverse();
}

/**
 * Returns the top rated review IDs in order.
 * @returns {number[]} list of IDs of reviews in order of top rating (most recent if equal rating)
 */
export function getTopIDsFromStorage() {
	let resultArr = [];
	for(let i = 5; i > 0; i--){
		let starArr = JSON.parse(localStorage.getItem(`star${i}`));
		if(!starArr){
			continue;
		}
		resultArr = resultArr.concat(starArr.reverse());
	}
	return resultArr;
}