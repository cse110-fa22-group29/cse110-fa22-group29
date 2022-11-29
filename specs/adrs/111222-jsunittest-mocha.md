# Use mocha for JS unit testing framework

- Status: accept
- Deciders: Arthur Lu, Marc Reta
- Date: 11 / 12 / 22

## Decision Drivers

- Need specification on how to write unit testing assertion statements
- Need framework to perform unit testing quickly for immediate code feedback

## Considered Options

- JUnit5
- Jest
- Mocha

## Decision Outcome

Chosen Option: Mocha because it was significantly faster to run than Jest (1s vs 30s), and can use a variety of assertion styles unlike JUnit5.
