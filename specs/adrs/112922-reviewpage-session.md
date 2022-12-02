# Opening Specific Reviews
- Status: Accept
- Deciders: Rhea Bhutada, Kara Hoagland, Gavyn Ezell, George Dubinin, Henry Feng 
- Date: 11/29/2022

## Decision Drivers
- When opening up a review, browser needs to know what review ID to use for loading the review page data

## Considered Options
- sessionStorage

## Decision Outcome
Review cards have event listeners that will add their associated review ID number to session storage so
when the review loads, the browser will use the id stored to pull exact data corresponding to the review.

