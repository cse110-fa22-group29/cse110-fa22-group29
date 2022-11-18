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
	
	//updating our activeIDS list
	let tempIdArr = JSON.parse(localStorage.getItem("activeIDS"));
	tempIdArr.push(nextReviewId);
	localStorage.setItem("activeIDS", JSON.stringify(tempIdArr));
	
	//increment nextID for next review creation
	nextReviewId++;
	localStorage.setItem("nextID", JSON.stringify(nextReviewId));

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
			localStorage.setItem('activeIDS', JSON.stringify(activeIDS));
			localStorage.removeItem(`review${ID}`)
			return;
		}
	}

	console.error(`could not find review${ID} in localStorage`);
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
	let reviews = []
	for (let i = 0; i < activeIDS.length; i++) {
		let currReview = JSON.parse(localStorage.getItem(`review${activeIDS[i]}`));
		reviews.push(currReview);
	}
	return reviews;
}