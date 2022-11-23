import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const name = config.require("name");

// Create an EKS cluster with non-default configuration
const vpc = new awsx.ec2.Vpc("vpc", { numberOfAvailabilityZones: 2 });

const cluster = new eks.Cluster(name, {
    vpcId: vpc.id,
    subnetIds: vpc.publicSubnetIds,
    desiredCapacity: 2,
    minSize: 1,
    maxSize: 2,
    storageClasses: "gp2",
    deployDashboard: false,
});

// Export the clusters' kubeconfig.
export const kubeconfig = cluster.kubeconfig;

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(name, {}, { provider: cluster.provider });

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
            cluster
        ],
        provider: cluster.provider,
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
            type: "NodePort",
            ports: [{ port: 80, targetPort: 80 }],
            selector: appLabels,
        },
    },
    {
        dependsOn: [
            deployment
        ],
        provider: cluster.provider,
    },
);

// Export the Service name
export const serviceName = service.metadata.name;

// Create an Ingress for the NGINX Service
const ingress = new k8s.networking.v1.Ingress(name, {
    metadata: {
        name: name,
        namespace: namespaceName,
    },
    spec: {
        ingressClassName: "nginx",
        rules: [{
            http: {
                paths: [{
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                        service: {
                            name: serviceName,
                            port: {
                                number: 80,
                            },
                        },
                    },
                }],
            },
        }],
    },
},
{
    dependsOn: [
        service
    ],
    provider: cluster.provider,
},);
