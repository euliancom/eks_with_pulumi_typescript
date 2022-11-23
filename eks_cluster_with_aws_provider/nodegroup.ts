import * as aws from "@pulumi/aws";
import * as iam from "./iam";

export function createNodeGroup(name: string, eksConfig: aws.eks.Cluster): aws.eks.NodeGroup {
    const nodeGroupRole = iam.createNodeGroupRole(`${name}-node-group`);
    const nodeGroup = new aws.eks.NodeGroup(`${name}-node-group-role`, {
        clusterName: eksConfig.name,
        nodeRoleArn: nodeGroupRole.arn,
        subnetIds: eksConfig.vpcConfig.subnetIds,
        scalingConfig: {
            desiredSize: 3,
            maxSize: 4,
            minSize: 1,
        },
        amiType: "AL2_x86_64",
        capacityType: "SPOT",
        instanceTypes: ["t2.micro"],
        updateConfig: {
            maxUnavailable: 1,
        },
    }, {
        dependsOn: [
            eksConfig,
            nodeGroupRole,
        ],
    });

    return nodeGroup
}