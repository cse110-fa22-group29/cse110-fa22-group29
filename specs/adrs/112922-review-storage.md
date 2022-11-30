# Backend Storage Structure
- Status: Accept
- Deciders: Rhea Bhutada, Kara Hoagland, Gavyn Ezell, George Dubinin, Henry Feng 
- Date: 11/29/2022

## Decision Drivers
- Needed more efficient way of storing reviews that are created, for more efficient testing, updating, accessing, and deleting.

## Considered Options
- localStorage

## Decision Outcome
Using local storage to maintain the "local first" requirement.
Moved away from array of objects for storing reviews, reviews are stored individually as keys in localStorage, under the "review{id}" format. Each key 
corresponds to object containing review data. We also have an array stored in local storage, named "activeIDs" which keeps track of id numbers that are attached
to created reviews.
