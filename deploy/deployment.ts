import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

const pulumi_hello_worldDeployment = new kubernetes.apps.v1.Deployment("pulumi_hello_worldDeployment", {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
        name: "pulumi-hello-world",
        labels: {
            app: "pulumi-hello-world",
        },
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: {
                app: "pulumi-hello-world",
            },
        },
        template: {
            metadata: {
                labels: {
                    app: "pulumi-hello-world",
                },
            },
            spec: {
                containers: [{
                    name: "pulumi-hello-world",
                    image: "nginx:latest",
                    ports: [{
                        containerPort: 80,
                    }],
                }],
            },
        },
    },
});
