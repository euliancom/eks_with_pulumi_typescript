import * as aws from "@pulumi/aws";
import * as iam from "./iam";
import * as vpc from "./vpc";

export function createEksCluster(name: string): aws.eks.Cluster {
    const clusterRole = iam.createClusterRole(`${name}-cluster-role`);

    const subnets = vpc.prepareVPC(name);

    const logGroup = new aws.cloudwatch.LogGroup(`${name}-log-group`, { retentionInDays: 7 });

    const eks = new aws.eks.Cluster(`${name}-eks`, {
        roleArn: clusterRole.arn,
        vpcConfig: {
            subnetIds: subnets.map(({ id }) => id),
        },
        enabledClusterLogTypes: [
            "api",
            "audit",
        ],
    }, {
        dependsOn: [
            clusterRole,
            subnets[0],
            subnets[1],
            subnets[2],
            subnets[4],
            logGroup
        ],
    });

    return eks;
}
