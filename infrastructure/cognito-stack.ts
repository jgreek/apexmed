// cognito-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {Construct} from 'constructs';

export class CognitoStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;
    public readonly userPoolDomain: cognito.UserPoolDomain;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Set up AWS Cognito for authentication.

        // Create a new Cognito User Pool for user registration and authentication.
        this.userPool = new cognito.UserPool(this, 'ApexMedUserPool', {
            selfSignUpEnabled: true, // Allow users to self-register.
            autoVerify: {
                email: true, // Automatically verify the user's email upon sign-up.
            },
            signInAliases: {
                email: true, // Enable users to sign in using their email address.
            },
        });

        // Create a client for the User Pool. This client represents the app that users will interact with.
        this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool: this.userPool,
            generateSecret: false, // For web apps, we typically don't use a secret key.
        });

        // Configure a domain for the Cognito User Pool so users can access the login/sign-up pages.
        this.userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
            userPool: this.userPool,
            cognitoDomain: {
                domainPrefix: 'apexmed-auth', // This will form the start of the domain URL (e.g., 'apexmed-auth.auth.region.amazoncognito.com').
            }
        });

        // Output the User Pool ID to the CloudFormation outputs. This is useful for referencing the User Pool in other AWS services or in your application.
        new cdk.CfnOutput(this, 'UserPoolIdOutput', {
            value: this.userPool.userPoolId,
        });

        // Output the User Pool Client ID. This is essential for frontend apps to initiate authentication requests.
        new cdk.CfnOutput(this, 'UserPoolClientIdOutput', {
            value: this.userPoolClient.userPoolClientId,
        });

        // Output the full domain name of the User Pool. You'll need this URL for directing users to sign-up or sign-in.
        new cdk.CfnOutput(this, 'UserPoolDomainOutput', {
            value: this.userPoolDomain.domainName,
        });
    }
}
