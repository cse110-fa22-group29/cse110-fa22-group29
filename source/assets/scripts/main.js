// main.js

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

function init() {
  // Get the reviews from localStorage
  let reviews = getReviewsFromStorage();
  // Add each recipe to the <main> element
  addReviewsToDocument(reviews);
  // Add the event listeners to the form elements
  initFormHandler();
}

/**
 * @returns {Array<Object>} An array of reviews found in localStorage
 */
function getReviewsFromStorage() {
  let result = JSON.parse(localStorage.getItem('reviews'))
  if (result) {
    return result;
  }
  return new Array(0);
}

/**
 * @param {Array<Object>} reviews An array of reviews
 */
function addReviewsToDocument(reviews) {
  let mainEl = document.querySelector('main')
  reviews.forEach(review=> {
    let newReview = document.createElement('review-card')
    newReview.data = review
    mainEl.append(newReview);
  })

}

/**
 * Takes in an array of reviews, converts it to a string, and then
 * saves that string to 'reviews' in localStorage
 * @param {Array<Object>} reviews An array of reviews
 */
function saveRecipesToStorage(reviews) {
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

/**
 * Adds the necesarry event handlers to <form> and the clear storage
 * <button>.
 */
function initFormHandler() {

  let theForm = document.querySelector('form')
  
  let submitButt = document.querySelector('button[type="submit"]')
  submitButt.addEventListener('click', function(){

    let formData = new FormData(theForm);
    let recipeObject = {}

    for (let [key, value] of formData) {
      
      recipeObject[`${key}`] = `${value}`
    }

    let newRecipe = document.createElement('recipe-card')
    newRecipe.data = recipeObject

    let mainEl = document.querySelector('main')
    mainEl.append(newRecipe)

    let aList = getRecipesFromStorage()
    //console.log(typeof(aList))
    //console.log(aList)
    aList.push(recipeObject)
    saveRecipesToStorage(aList)
  });

  let clearButt = document.querySelector('.danger')
  clearButt.addEventListener('click', function() {
    localStorage.clear();
    let mainEl = document.querySelector('main')
     while (mainEl.firstChild) {
      mainEl.removeChild(mainEl.firstChild);
     }
  });

}
