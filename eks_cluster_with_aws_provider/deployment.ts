import * as k8s from "@pulumi/kubernetes";

export function createDeployment(name: string, eksProvider: k8s.Provider, ns: k8s.core.v1.Namespace): k8s.apps.v1.Deployment {
    const deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
        metadata: {
            name: `${name}-deployment`,
            namespace: ns.metadata.name,
            labels: {
                app: name,
            },
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: name,
                },
            },
            template: {
                metadata: {
                    labels: {
                        app: name,
                    },
                },
                spec: {
                    containers: [{
                        name: name,
                        image: "nginx:latest",
                        ports: [{
                            containerPort: 80,
                        }],
                    }],
                },
            },
        },
    }, {
        dependsOn: [
            ns,
        ],
        provider: eksProvider
    });

    return deployment;
}
