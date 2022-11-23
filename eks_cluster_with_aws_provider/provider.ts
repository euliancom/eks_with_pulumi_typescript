import * as aws from "@pulumi/aws";
import { local } from "@pulumi/command";
import * as k8s from "@pulumi/kubernetes";
import { interpolate, Config } from "@pulumi/pulumi";

const configAws = new Config("aws");

export function getProvider(name: string, eksConfig: aws.eks.Cluster): k8s.Provider {
    const createKubeconfig = new local.Command("kubeconfig", {
        create: interpolate`aws eks update-kubeconfig --region ${configAws.require("region")} --name ${eksConfig.name}`,
    }, {
        dependsOn: [
            eksConfig,
        ],
    });
    
    const eksProvider = new k8s.Provider("eks-provider", {
        context: eksConfig.arn
    }, {
        dependsOn: [
            createKubeconfig,
        ],
    });

    return eksProvider;
}