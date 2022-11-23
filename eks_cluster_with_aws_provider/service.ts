import * as k8s from "@pulumi/kubernetes";

export function createService(name: string, eksProvider: k8s.Provider, ns: k8s.core.v1.Namespace, deployment: k8s.apps.v1.Deployment): k8s.core.v1.Service {
    const service = new k8s.core.v1.Service("pulumi_hello_world_serviceService", {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            namespace: ns.metadata.name,
            name: `${name}-service`,
            labels: {
                app: name,
            },
        },
        spec: {
            selector: {
                app: name,
            },
            ports: [{
                port: 80,
                targetPort: 80,
            }],
            type: "NodePort",
        },
    }, {
        dependsOn: [
            deployment,
        ],
        provider: eksProvider
    });

    return service;
}
