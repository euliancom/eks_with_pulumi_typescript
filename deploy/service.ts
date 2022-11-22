import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

const pulumi_hello_world_serviceService = new kubernetes.core.v1.Service("pulumi_hello_world_serviceService", {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
        name: "pulumi-hello-world-service",
    },
    spec: {
        selector: {
            app: "pulumi-hello-world-service",
        },
        ports: [{
            port: 80,
            targetPort: 80,
        }],
        type: "ClusterIP",
    },
});
