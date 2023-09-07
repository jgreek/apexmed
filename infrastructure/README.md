# ApexMed CDK TypeScript Project

Welcome to the ApexMed CDK project developed using TypeScript. This solution focuses on optimizing medicine inventory management, particularly for surgical operations, leveraging the power of data science and AWS cloud capabilities.

## Project Background

Surgeries require precise administration of medications. Inefficiencies in the tracking, utilization, and replenishment of medicine inventories can lead to unwanted scenarios such as waste, increased operational costs, and potential shortages during critical medical procedures. The goal of ApexMed is to draw actionable insights from the confluence of surgical and medicine inventory records, ensuring optimal and efficient medicine usage during surgeries.

## Structure

The primary codebase revolves around the AWS CDK (Cloud Development Kit) to orchestrate cloud resources necessary for the data-driven analyses.

`cdk.json` instructs the CDK Toolkit on the execution of the app.

## Essential Commands

- `npm run build` - Compiles TypeScript to JavaScript.
- `npm run watch` - Initiates a watcher that listens for changes and compiles the TypeScript accordingly.
- `npm run test` - Executes jest unit tests ensuring code reliability.
- `cdk deploy` - Deploys the stack to the designated AWS account and region.
- `cdk diff` - Provides a differential analysis between the deployed stack and the current state.
- `cdk synth` - Outputs the synthesized AWS CloudFormation template which is crucial for understanding the cloud resources being generated.

## Contribution

Please ensure to follow the coding standards and guidelines when making modifications. All changes must undergo peer review before merging to the master branch.

