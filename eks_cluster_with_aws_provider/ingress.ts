import * as k8s from "@pulumi/kubernetes";

export function createIngress(name: string, eksProvider: k8s.Provider, ns: k8s.core.v1.Namespace, service: k8s.core.v1.Service): k8s.networking.v1.Ingress {
    const ingress = new k8s.networking.v1.Ingress("pulumi_hello_world_ingressIngress", {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
            namespace: ns.metadata.name,
            name: `${name}-ingress`,
            labels: {
                app: name,
            },
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
                                name: service.metadata.name,
                                port: {
                                    number: 80,
                                },
                            },
                        },
                    }],
                },
            }],
        },
    }, {
        dependsOn: [
            service,
        ],
        provider: eksProvider
    });

    return ingress;
}
