// main.js
const {getReviewsFromStorage, saveReviewsToStorage} = require('./localStorage');

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
 * Adds the necesarry event handlers to <form> and the clear storage
 * <button>.
 */
function initFormHandler() {
  let tagContainer = document.getElementById('tag-container');
  let theForm = document.querySelector('form')
  let submitButt = document.querySelector('button[type="submit"]')
  submitButt.addEventListener('click', function(){
    let deleteTags = document.querySelectorAll('.tag')
    for(let i = 0; i < deleteTags.length; i ++) {
      tagContainer.removeChild(deleteTags[i]);
    }
    let formData = new FormData(theForm);
    let reviewObject = {}
    for (let [key, value] of formData) {
      console.log(`${key}`)
      console.log(`${value}`)
      reviewObject[`${key}`] = `${value}`
    }
    //console.log(reviewObject)

    let newReview = document.createElement('review-card')
    newReview.data = reviewObject

    let mainEl = document.querySelector('main')
    mainEl.append(newReview)

    let aList = getReviewsFromStorage()
    aList.push(reviewObject)
    saveReviewsToStorage(aList)
    document.getElementById("new-food-entry").reset();
  });

  let clearButt = document.querySelector('.danger')
  clearButt.addEventListener('click', function() {
    localStorage.clear();
    let mainEl = document.querySelector('main')
    while (mainEl.firstChild) {
      mainEl.removeChild(mainEl.firstChild);
    }
    let deleteTags = document.querySelectorAll('.tag')
    for(let i = 0; i < deleteTags.length; i ++) {
      tagContainer.removeChild(deleteTags[i]);
    }
    
    //clears reviews AS WELL as resets form
    document.getElementById("new-food-entry").reset();
     
     
  });

  //allowing for tags selection/creation for user's review card
  let tagAddButton = document.getElementById('tagAdd');
  tagAddButton.addEventListener('click', ()=> {
    let tagField = document.getElementById('tags');
    if (tagField.value.length > 0) {
      let p = document.createElement('p');
      p.innerHTML = tagField.value;
      p.setAttribute('class','tag')
      
      tagContainer.append(p);
      tagField.value = '';

      //adding deletion feature to each individual tag
      let deleteTags = document.querySelectorAll('.tag')

      for(let i = 0; i < deleteTags.length; i ++) {
        deleteTags[i].addEventListener('click',()=> {
          tagContainer.removeChild(deleteTags[i]);
        })
      }
    }
  });

}