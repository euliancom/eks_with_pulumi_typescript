import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const config = new pulumi.Config();
const name = config.require("name");

const pulumi_IamRole = new aws.iam.Role("pulumi-IamRole", {
    assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
`});

const pulumi_AmazonEKSClusterPolicy = new aws.iam.RolePolicyAttachment("pulumi-AmazonEKSClusterPolicy", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    role: pulumi_IamRole.name,
});

const pulumi_AmazonEKSVPCResourceController = new aws.iam.RolePolicyAttachment("pulumi-AmazonEKSVPCResourceController", {
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    role: pulumi_IamRole.name,
});

const pulumi_VPC = new aws.ec2.Vpc("pulumi-vpc", {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Name: "Pulumi VPC",
    },
});

const pulumi_Subnet1 = new aws.ec2.Subnet("pulumi-subnet-1", {
    vpcId: pulumi_VPC.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "us-east-1a",
    tags: {
        Name: "Pulumi Subnet 1",
    },
}, {
    dependsOn: [
        pulumi_VPC
    ],
});

const pulumi_Subnet2 = new aws.ec2.Subnet("pulumi-subnet-2", {
    vpcId: pulumi_VPC.id,
    cidrBlock: "10.0.2.0/24",
    availabilityZone: "us-east-1d",
    tags: {
        Name: "Pulumi Subnet 2",
    },
}, {
    dependsOn: [
        pulumi_VPC
    ],
});

const pulumi_eks = new aws.eks.Cluster("pulumi-eks", {
    roleArn: pulumi_IamRole.arn,
    vpcConfig: {
        subnetIds: [
            pulumi_Subnet1.id,
            pulumi_Subnet2.id,
        ],
    },
}, {
    dependsOn: [
        pulumi_AmazonEKSClusterPolicy,
        pulumi_AmazonEKSVPCResourceController,
        pulumi_Subnet1,
        pulumi_Subnet2
    ],
});

const k8s_clueste_arn = pulumi_eks.arn;

const pulumi_cluster_provider = new k8s.Provider("pulumi-cluster-provider", {
    context: k8s_clueste_arn
}, {
    dependsOn: [
        pulumi_eks
    ]
});

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(name, {}, {
    dependsOn: [
        pulumi_cluster_provider
    ],
    provider: pulumi_cluster_provider
});

// Export the Namespace name
export const namespaceName = ns.metadata.name;

// Create a NGINX Deployment
const appLabels = { appClass: name };
const deployment = new k8s.apps.v1.Deployment(name,
    {
        metadata: {
            namespace: namespaceName,
            labels: appLabels,
        },
        spec: {
            replicas: 1,
            selector: { matchLabels: appLabels },
            template: {
                metadata: {
                    labels: appLabels,
                },
                spec: {
                    containers: [
                        {
                            name: name,
                            image: "nginx:latest",
                            ports: [{ name: "http", containerPort: 80 }],
                        },
                    ],
                },
            },
        },
    },
    {
        dependsOn: [
            ns
        ],
        provider: pulumi_cluster_provider,
    },
);

// Export the Deployment name
export const deploymentName = deployment.metadata.name;

// Create a LoadBalancer Service for the NGINX Deployment
const service = new k8s.core.v1.Service(name,
    {
        metadata: {
            labels: appLabels,
            namespace: namespaceName,
        },
        spec: {
            type: "LoadBalancer",
            ports: [{ port: 80, targetPort: "http" }],
            selector: appLabels,
        },
    },
    {
        dependsOn: [
            deployment
        ],
        provider: pulumi_cluster_provider,
    },
);

// Export the Service name and public LoadBalancer Endpoint
export const serviceName = service.metadata.name;
export const serviceHostname = service.status.loadBalancer.ingress[0].hostname;
