import * as aws from "@pulumi/aws";

const managedClusterPolicyArns: string[] = [
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
];

const managedNodeGroupPolicyArns: string[] = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
];

export function createClusterRole(name: string): aws.iam.Role {
    const role = createRole(name, "eks.amazonaws.com");
    rolePolicyAttachment(name, managedClusterPolicyArns, role);
    return role;
}

export function createNodeGroupRole(name: string): aws.iam.Role {
    const role = createRole(name, "ec2.amazonaws.com");
    rolePolicyAttachment(name, managedNodeGroupPolicyArns, role);
    return role;
}

export function createRole(name: string, service: string): aws.iam.Role {
    const role = new aws.iam.Role(name, {
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
            Service: service,
        }),
    });

    return role;
}

export function rolePolicyAttachment(name: string, managedPolicyArns: string[], role: aws.iam.Role) {
    let counter = 0;
    for (const policy of managedPolicyArns) {
        // Create RolePolicyAttachment without returning it.
        const rpa = new aws.iam.RolePolicyAttachment(`${name}-${counter++}`,
            { policyArn: policy, role: role.name }, {
                dependsOn: [
                    role
                ],
            }
        );
    }
}

