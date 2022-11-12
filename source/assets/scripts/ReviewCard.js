// ReviewCard.js

class ReviewCard extends HTMLElement {
  // Called once when document.createElement('review-card') is called, or
  // the element is written into the DOM directly as <review-card>
  constructor() {
    super(); 


    let shadowEl = this.attachShadow({mode:'open'});

    let articleEl = document.createElement('article');

    let styleEl = document.createElement('style');
    styleEl.textContent = `
      * {
        font-family: sans-serif;
        margin: 0;
        padding: 0;
      }
    
      a {
        text-decoration: none;
      }
    
      a:hover {
        text-decoration: underline;
      }
    
      article {
        align-items: center;
        border: 1px solid rgb(223, 225, 229);
        border-radius: 8px;
        display: grid;
        grid-template-rows: 118px 56px 14px 18px 15px 36px;
        height: auto;
        row-gap: 5px;
        padding: 0 16px 16px 16px;
        width: 178px;
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
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        height: 118px;
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
    `;
    articleEl.append(styleEl);
    shadowEl.append(articleEl);
    this.shadowEl = shadowEl;
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
   *                          "imgSrc": "string",
   *                          "imgAlt": "string",
   *                          "mealName": "string",
   *                          "restaurant": "string",
   *                          "rating": number
   *                          "tags": string array
   *                        }
   */
  set data(data) {
    // If nothing was passed in, return
    if (!data) return;

    // Select the <article> we added to the Shadow DOM in the constructor
    let articleEl = this.shadowEl.querySelector('article');
    
    // setting the article elements for the review card

    //image setup
    let mealImg = document.createElement('img');
    mealImg.setAttribute('src',data['imgSrc']);
    mealImg.setAttribute('alt',data['imgAlt']);

    //meal name setup
    let mealLabel = document.createElement('label');
    mealLabel.setAttribute('class','meal-name');
    mealLabel.innerHTML = data['mealName'];

    //review page link
    //giving it functionality to save the review card's info to session storage for loading the review page
    let reviewLink = document.createElement('a');
    reviewLink.setAttribute('href','./review.html')
    reviewLink.innerHTML = 'review page'
    reviewLink.addEventListener('click', () => {
      sessionStorage.clear();
      let currReview = {
        "imgSrc": data['imgSrc'],
        "imgAlt": data['imgAlt'],
        "mealName": data['mealName'],
        "restaurant": data['restaurant'],
        "rating": data['rating'],
        "tags": data['tags']                
      }
      sessionStorage.setItem('currReview', JSON.stringify(currReview));
    });

    let restaurantLabel = document.createElement('label');
    restaurantLabel.setAttribute('class','restaurant-name');
    restaurantLabel.innerHTML = data['restaurant'];

    //other info: rating
    let ratingDiv = document.createElement('div');
    ratingDiv.setAttribute('class', 'rating');
    let starsImg = document.createElement('img');
    starsImg.setAttribute('src', './source/assets/images/icons/'+data['rating']+'-star.svg');
    starsImg.setAttribute('alt', data['rating'] +' stars');
    ratingDiv.append(starsImg);

    //added tags
    let tagContainer = document.createElement('div')
    tagContainer.setAttribute('class', 'tag-container');
    for (let i = 0; i < data['tags'].length; i++) {
      let newTag = document.createElement('label');
      newTag.setAttribute('class','tag');
      newTag.innerHTML = data['tags'][i] + "   ";
      tagContainer.append(newTag);
    }

    articleEl.append(mealImg);
    articleEl.append(mealLabel);
    articleEl.append(reviewLink)
    articleEl.append(restaurantLabel);
    articleEl.append(ratingDiv);
    articleEl.append(tagContainer);


  }
}
customElements.define('review-card', ReviewCard);
