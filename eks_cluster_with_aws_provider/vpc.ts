import * as aws from "@pulumi/aws";

// Creates a VPC
export function createVPC(name: string): aws.ec2.Vpc {
    const vpcConfig = new aws.ec2.Vpc(name, {
        cidrBlock: "10.0.0.0/16",
        tags: {
            Name: "Pulumi VPC",
        },
    });

    const gw = new aws.ec2.InternetGateway(`${name}-gw`, {
        vpcId: vpcConfig.id,
        tags: {
            Name: name,
        },
    }, {
        dependsOn: [vpcConfig],
    });

    return vpcConfig
}

// Creates a Subnet
export function createSubnet(name: string, vpc: aws.ec2.Vpc, cidrBlock: string, availabilityZone: string, mapPublicIpOnLaunch: boolean): aws.ec2.Subnet {
    return new aws.ec2.Subnet(name, {
        vpcId: vpc.id,
        cidrBlock: cidrBlock,
        availabilityZone: availabilityZone,
        mapPublicIpOnLaunch: mapPublicIpOnLaunch,
        tags: {
            Name: `Pulumi Subnet ${availabilityZone}`,
            "kubernetes.io/cluster/CLUSTER_NAME": "",
        },
    });
}
