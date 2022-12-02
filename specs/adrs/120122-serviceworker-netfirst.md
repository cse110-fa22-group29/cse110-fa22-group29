# Use a network first cache second for service worker architecture 

- Status: in consideration
- Deciders: Arthur Lu, Kara Hoagland, Rhea Bhutada, George Dubinin
- Date: 12 / 01 / 22

## Decision Drivers

- Need to balance the need for user ease of use and local first priority
- Users should expect to update their app easily when they have network, but may not be expected to know how to perform a hard refresh
- Local first priority means we should avoid unnecessary network activity when possible

## Considered Options
- Network first cache second
- Cache first network second

## Decision Outcome

Chosen Option: Network first for automatic app updating.