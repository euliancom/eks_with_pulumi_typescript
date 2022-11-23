import * as aws from "@pulumi/aws";
import { Config } from "@pulumi/pulumi";

const configVPC = new Config("vpc");

export function prepareVPC(name: string): aws.ec2.Subnet[] {
    const vpcConfig = createVPC(`${name}-vpc`);
    const ig = new aws.ec2.InternetGateway(name, {
        vpcId: vpcConfig.id,
        tags: {
            Name: name,
        },
    }, {
        dependsOn: [vpcConfig],
    });

    const publicSubnetUsEast1a = configPublicSubnetUsEast1a(name, vpcConfig, ig);
    const publicSubnetUsEast1b = configPublicSubnetUsEast1b(name, vpcConfig, ig);

    const privateSubnetUsEast1a = configPrivateSubnetUsEast1a(name, vpcConfig, ig);
    const privateSubnetUsEast1b = configPrivateSubnetUsEast1b(name, vpcConfig, ig);

    return [
        privateSubnetUsEast1a,
        privateSubnetUsEast1b,
        publicSubnetUsEast1a,
        publicSubnetUsEast1b,
    ];
}

function configPrivateSubnetUsEast1b(name: string, vpcConfig: aws.ec2.Vpc, ig: aws.ec2.InternetGateway) {
    const privateSubnetUsEast1b = createSubnet(
        `${name}-private-${configVPC.require("subnet-az-2")}`,
        vpcConfig,
        configVPC.require("subnet-private-cidr-block-az-2"),
        configVPC.require("subnet-az-2"),
        false
    );

    const privateEipUsEast1b = new aws.ec2.Eip(`lb-${name}-private-${configVPC.require("subnet-az-2")}`, {
        vpc: true,
    }, {
        dependsOn: [privateSubnetUsEast1b],
    });

    const privateNatUsEast1b = new aws.ec2.NatGateway(`nat-${name}-private-${configVPC.require("subnet-az-2")}`, {
        allocationId: privateEipUsEast1b.id,
        subnetId: privateSubnetUsEast1b.id,
        tags: {
            Name: `nat-${name}-private-${configVPC.require("subnet-az-2")}`,
        },
    }, {
        dependsOn: [ig, privateEipUsEast1b],
    });

    const privateRouteTableUsEast1b = createRouteTable(`rt-${name}-private-${configVPC.require("subnet-az-2")}`, vpcConfig);

    new aws.ec2.RouteTableAssociation(`rta-${name}-private-${configVPC.require("subnet-az-2")}`, {
        subnetId: privateSubnetUsEast1b.id,
        routeTableId: privateRouteTableUsEast1b.id,
    }, {
        dependsOn: [privateSubnetUsEast1b, privateRouteTableUsEast1b],
    });

    const privateRouteUsEast1b = createPrivateRoute(`r-${name}-private-${configVPC.require("subnet-az-2")}`, privateRouteTableUsEast1b, privateNatUsEast1b);
    return privateSubnetUsEast1b;
}

function configPrivateSubnetUsEast1a(name: string, vpcConfig: aws.ec2.Vpc, ig: aws.ec2.InternetGateway) {
    const privateSubnetUsEast1a = createSubnet(
        `${name}-private-${configVPC.require("subnet-az-1")}`,
        vpcConfig,
        configVPC.require("subnet-private-cidr-block-az-2"),
        configVPC.require("subnet-az-1"),
        false
    );

    const privateEipUsEast1a = new aws.ec2.Eip(`lb-${name}-private-${configVPC.require("subnet-az-1")}`, {
        vpc: true,
    }, {
        dependsOn: [privateSubnetUsEast1a],
    });

    const privateNatUsEast1a = new aws.ec2.NatGateway(`nat-${name}-private-${configVPC.require("subnet-az-1")}`, {
        allocationId: privateEipUsEast1a.id,
        subnetId: privateSubnetUsEast1a.id,
        tags: {
            Name: `nat-${name}-private-${configVPC.require("subnet-az-1")}`,
        },
    }, {
        dependsOn: [ig, privateEipUsEast1a],
    });

    const privateRouteTableUsEast1a = createRouteTable(`rt-${name}-private-${configVPC.require("subnet-az-1")}`, vpcConfig);

    new aws.ec2.RouteTableAssociation(`rta-${name}-private-${configVPC.require("subnet-az-1")}`, {
        subnetId: privateSubnetUsEast1a.id,
        routeTableId: privateRouteTableUsEast1a.id,
    }, {
        dependsOn: [privateSubnetUsEast1a, privateRouteTableUsEast1a],
    });

    const privateRouteUsEast1a = createPrivateRoute(`r-${name}-private-${configVPC.require("subnet-az-1")}`, privateRouteTableUsEast1a, privateNatUsEast1a);
    return privateSubnetUsEast1a;
}

function configPublicSubnetUsEast1b(name: string, vpcConfig: aws.ec2.Vpc, ig: aws.ec2.InternetGateway) {
    const publicSubnetUsEast1b = createSubnet(
        `${name}-public-${configVPC.require("subnet-az-2")}`,
        vpcConfig,
        configVPC.require("subnet-public-cidr-block-az-2"),
        configVPC.require("subnet-az-2"),
        true
    );

    const publicRouteTableUsEast1b = createRouteTable(`rt-${name}-public-${configVPC.require("subnet-az-2")}`, vpcConfig);

    new aws.ec2.RouteTableAssociation(`rta-${name}-public-${configVPC.require("subnet-az-2")}`, {
        subnetId: publicSubnetUsEast1b.id,
        routeTableId: publicRouteTableUsEast1b.id,
    }, {
        dependsOn: [publicSubnetUsEast1b, publicRouteTableUsEast1b],
    });

    const publicRouteUsEast1b = createPublicRoute(`r-${name}-public-${configVPC.require("subnet-az-2")}`, publicRouteTableUsEast1b, ig);
    return publicSubnetUsEast1b;
}

function configPublicSubnetUsEast1a(name: string, vpcConfig: aws.ec2.Vpc, ig: aws.ec2.InternetGateway) {
    const publicSubnetUsEast1a = createSubnet(
        `${name}-public-${configVPC.require("subnet-az-1")}`,
        vpcConfig,
        configVPC.require("subnet-public-cidr-block-az-1"),
        configVPC.require("subnet-az-1"),
        true
    );

    const publicRouteTableUsEast1a = createRouteTable(`rt-${name}-public-${configVPC.require("subnet-az-1")}`, vpcConfig);

    new aws.ec2.RouteTableAssociation(`rta-${name}-public-${configVPC.require("subnet-az-1")}`, {
        subnetId: publicSubnetUsEast1a.id,
        routeTableId: publicRouteTableUsEast1a.id,
    }, {
        dependsOn: [publicSubnetUsEast1a, publicRouteTableUsEast1a],
    });

    const publicRouteUsEast1a = createPublicRoute(`r-${name}-public-${configVPC.require("subnet-az-1")}`, publicRouteTableUsEast1a, ig);
    return publicSubnetUsEast1a;
}

// Creates a VPC
export function createVPC(name: string): aws.ec2.Vpc {
    const vpcConfig = new aws.ec2.Vpc(name, {
        assignGeneratedIpv6CidrBlock: false,
        cidrBlock: configVPC.require("cidr-block"),
        enableDnsHostnames: true,
        enableDnsSupport: true,
        instanceTenancy: "default",
        tags: {
            Name: "Pulumi VPC",
        },
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
    }, {
        dependsOn: [
            vpc
        ],
    });
}

// Creates a RouteTable
export function createRouteTable(name: string, vpc: aws.ec2.Vpc): aws.ec2.RouteTable {
    const routeTable = new aws.ec2.RouteTable(name, {
        vpcId: vpc.id,
        tags: {
            Name: name,
        },
    }, {
        dependsOn: [
            vpc
        ],
    });

    return routeTable;
}

// Creates a public Route
export function createPublicRoute(name: string, routeTable: aws.ec2.RouteTable, ig: aws.ec2.InternetGateway): aws.ec2.RouteTable {
    const route = new aws.ec2.Route(name, {
        routeTableId: routeTable.id,
        destinationCidrBlock: "0.0.0.0/0",
        gatewayId: ig.id,
    }, {
        dependsOn: [
            routeTable,
            ig,
        ],
    });

    return routeTable;
}

// Creates a private Route
export function createPrivateRoute(name: string, routeTable: aws.ec2.RouteTable, nat: aws.ec2.NatGateway): aws.ec2.RouteTable {
    const route = new aws.ec2.Route(name, {
        routeTableId: routeTable.id,
        destinationCidrBlock: "0.0.0.0/0",
        natGatewayId: nat.id,
    }, {
        dependsOn: [
            routeTable,
            nat,
        ],
    });

    return routeTable;
}
