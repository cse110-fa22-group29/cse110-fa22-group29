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
	let activeIDS = JSON.parse(localStorage.getItem("activeIDS"));

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
 * Returns the top n reviews by ID. If there are less than n reviews, returns the most possible. 
 * @param {number} n number of reviews to return
 * @returns {Object} list of n reviews that are the top rated
 */
export function getTopReviewsFromStorage(n) {

}

/**
 * Returns all reviews which contain the same tag specified. 
 * @param {string} tag to filter by
 * @returns {Object} list of reviews that all contain the specified tag
 */
export function getReviewsByTag(tag) {

}

// legacy function
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