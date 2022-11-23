import * as aws from "@pulumi/aws";
import * as iam from "./iam";
import * as vpc from "./vpc";

export function createEksCluster(name: string): aws.eks.Cluster {
    const clusterRole = iam.createClusterRole(`${name}-cluster-role`);

    const vpcConfig = vpc.createVPC(`${name}-vpc`);
    const subnetUsEast1a = vpc.createSubnet(
        `${name}-subnet-us-east-1a`,
        vpcConfig,
        "10.0.1.0/24",
        "us-east-1a",
        true
    );
    const subnetUsEast1d = vpc.createSubnet(
        `${name}-subnet-us-east-1d`,
        vpcConfig,
        "10.0.2.0/24",
        "us-east-1d",
        false
    );

    const logGroup = new aws.cloudwatch.LogGroup(`${name}-log-group`, { retentionInDays: 7 });

    const eks = new aws.eks.Cluster(`${name}-eks`, {
        roleArn: clusterRole.arn,
        vpcConfig: {
            subnetIds: [subnetUsEast1a.id, subnetUsEast1d.id],
        },
        enabledClusterLogTypes: [
            "api",
            "audit",
        ],
    }, {
        dependsOn: [
            clusterRole,
            subnetUsEast1a,
            subnetUsEast1d,
            logGroup
        ],
    });

    return eks;
}
