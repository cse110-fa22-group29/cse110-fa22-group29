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
    
      p.ingredients {
        height: 32px;
        line-height: 16px;
        padding-top: 4px;
        overflow: hidden;
      }
    
      p.organization {
        color: black !important;
      }
    
      p.title {
        display: -webkit-box;
        font-size: 16px;
        height: 36px;
        line-height: 18px;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    
      p:not(.title),
      span,
      time {
        color: #70757A;
        font-size: 12px;
      }
    `;
    articleEl.append(styleEl);
    shadowEl.append(articleEl);
    this.shadowEl = shadowEl
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
   *                        }
   */
  set data(data) {
    // If nothing was passed in, return
    if (!data) return;

    // Select the <article> we added to the Shadow DOM in the constructor
    let articleEl = this.shadowEl.querySelector('article');
    
    // setting the article elements for the review card

    //image setup
    let img1 = document.createElement('img');
    img1.setAttribute('src',data['imgSrc']);
    img1.setAttribute('alt',data['imgAlt']);

    //meal name setup
    let pMeal = document.createElement('p');
    pMeal.setAttribute('class','meal-name');
    pMeal.innerHTML = data["mealName"];

    let pRestaurant = document.createElement('p');
    pRestaurant.setAttribute('class','restaurant-name');
    pRestaurant.innerHTML = data["restaurant"];

    //other info: rating
    let div = document.createElement('div')
    div.setAttribute('class', 'rating')
    let span1 = document.createElement('span')
    span1.innerHTML = data["rating"];
    let img2 = document.createElement('img')
    img2.setAttribute('src', './source/assets/images/icons/'+data['rating']+'-star.svg');
    img2.setAttribute('alt', data['rating'] +' stars');
    div.append(span1);
    div.append(img2);

    articleEl.append(img1)
    articleEl.append(pMeal)
    articleEl.append(pRestaurant)
    articleEl.append(div)

  }
}
customElements.define('review-card', ReviewCard);
