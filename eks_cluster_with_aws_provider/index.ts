import { Config } from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as eks from "./eks";
import * as nodegroup from "./nodegroup";
import * as eksProviderConfig from "./provider";
import * as eksDeployment from "./deployment";
import * as eksService from "./service";
import * as eksIngress from "./ingress";

const config = new Config();
const name = config.require("name");

const eksConfig = eks.createEksCluster(name);
const nodeGroup = nodegroup.createNodeGroup(name, eksConfig);
const eksProvider = eksProviderConfig.getProvider(name, eksConfig);

const ns = new k8s.core.v1.Namespace(name, {}, {
    dependsOn: [
        nodeGroup,
        eksProvider,
    ],
    provider: eksProvider,
});

const deployment = eksDeployment.createDeployment(name, eksProvider, ns);
const service = eksService.createService(name, eksProvider, ns, deployment);
const ingress = eksIngress.createIngress(name, eksProvider, ns, service);

