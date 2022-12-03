# Use multiple CI/CD pipelines in parallel

-   Status: accept
-   Deciders: Arthur Lu, Marc Reta
-   Date: 11 / 12 / 22

## Decision Drivers

-   Need to perform many different CI/CD tasks
-   Need pipeline to be durable against any single failure

## Considered Options

-   Single deep pipeline
-   Multiple short pipelines in parallel

## Decision Outcone

Chosen Option: Multiple short pipelines in parallel as any one failure will not prevent code from being developed and deployed.
