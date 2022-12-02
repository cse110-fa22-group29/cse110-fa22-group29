# Organizing Review Under Tags
- Status: Accept
- Deciders: Rhea Bhutada, Kara Hoagland, Gavyn Ezell, George Dubinin, Henry Feng 
- Date: 11/29/2022

## Decision Drivers
- Needed to keep track of reviews under certain given tags for filtering feature.

## Considered Options
- localStorage

## Decision Outcome
For every tag create a key under that tag name in localStorage. They will store an array of IDs that correspond to reviews that contain that tag. 
