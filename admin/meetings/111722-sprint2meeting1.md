# Meeting Minutes (11/07/2022)

## Team 29: Hackers1995

## Meeting Topic: First Sprint

Meeting notes for the first sprint

## Attendance

1. Rhea Bhutada
2. George Dubinin
3. Gavyn Ezell
4. Henry Feng
5. Kara Hoagland
6. Marc Reta
7. Sanjit Joseph
8. Daniel Hernandez
9. Arthur Lu
10. Isaac Otero

## Meeting Details

- When: 11/17/2022 at 11:30PM
- Where: Design & Innovation Building

## Agenda:

- ### Old/Unresolved Business
  - N/A
- ### New Business

  - Second sprint commences!
  - Focus on design progress for the project showoff
  - Cuisine vs Tag identifiers for reviews (both?)

    - localStorage will hold:
      - list of active IDs which is updated for very create operation. An ID uniquely identifies a review
      - value, "nextId" denoting the index of the next available slot for an Id
      - entries for every single review (javascript object)
      - a list for every tag that denotes which Ids belong to reviews containing this tag

    End2end tests will rely on specific html element names which include the following:

    - "create-btn" (located on homepage and used to create a new review)
    - "submit-btn" (located on form and used to post review)
    - "update-btn" (located on a specific review page)
    - "delete-btn" (located on a specific review page)
    - "tag-add-btn" (located on the review create form)

- ### Next Meeting's Business

## Decisions Made

-

## End Time

- 11/17/2022 at 1:00PM
