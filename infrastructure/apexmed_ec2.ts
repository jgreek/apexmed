// Import necessary modules from the AWS CDK library.
import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// Define the main stack class.
export class ApexMedEc2Stack extends cdk.Stack {
    // Constructor for the stack.
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        // Call the parent constructor, initializing the stack.
        super(scope, id, props);

        // Define a new VPC.
        // This sets up a VPC with a maximum of 2 Availability Zones.
        const vpc = new ec2.Vpc(this, 'MyVpc', {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'PublicSubnet',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ],
        });

        // Define a new security group within the created VPC.
        // This security group will control inbound and outbound access.
        const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            vpc,
            description: 'Allow http, https, and ssh access',
            allowAllOutbound: true // This lets the instance make outbound requests without restriction.
        });

        // Only add specific allow rules. For example, if SSH access is needed from a specific IP:
        // securityGroup.addIngressRule(ec2.Peer.ipv4('[ADD SERVER SPECIFIC IP]/32'), ec2.Port.tcp(22), 'allow ssh access from specific ipv4');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from any ipv4');

        // Define a new EC2 instance using the above-defined VPC and security group.
        // It utilizes a t2.micro instance type and the latest version of Amazon Linux 2 AMI.
        const myInstance = new ec2.Instance(this, 'MyInstance', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO), // Set instance type to t2.micro.
            machineImage: ec2.MachineImage.latestAmazonLinux2(), // Use the latest Amazon Linux 2 AMI.
            securityGroup, // Attach the previously defined security group.
            associatePublicIpAddress: true,  // Ensure the instance requests a public IP
            keyName: 'Greek_SX3', // The name of the key pair, not the filename
        });

        // Step 2: Define the DynamoDB asset_table for Assets
        const asset_table = new dynamodb.Table(this, 'Assets', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'asset_name',
                type: dynamodb.AttributeType.STRING
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
        });


         const results_table = new dynamodb.Table(this, 'Results', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'result_name',
                type: dynamodb.AttributeType.STRING
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
        });
        // Step 3: Ensure the EC2 instance can communicate with DynamoDB
        // Note: Normally you wouldn't open direct access from EC2 to DynamoDB but rather use VPC endpoints.
        // For simplicity, we are granting full DynamoDB permissions to the EC2 instance.
        asset_table.grantFullAccess(myInstance.role);
        results_table.grantFullAccess(myInstance.role);
    }
}

