import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

const pulumi_hello_world_ingressIngress = new kubernetes.networking.v1.Ingress("pulumi_hello_world_ingressIngress", {
    apiVersion: "networking.k8s.io/v1",
    kind: "Ingress",
    metadata: {
        name: "pulumi-hello-world-ingress",
        annotations: {
            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
            "nginx.ingress.kubernetes.io/use-regex": "true",
            "nginx.ingress.kubernetes.io/rewrite-target": `/$2`,
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
                            name: "pulumi-hello-world-service",
                            port: {
                                number: 80,
                            },
                        },
                    },
                }],
            },
        }],
    },
});
