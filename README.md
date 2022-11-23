# Task

1. Create your code in a public Github account
2. Use pulumi to spin up on AWS;
3. A small Kubernetes cluster
4. Deploy a hello world container
5. Make the container public with an ingress towards the Kubernetes cluster. (You can chose technology or tool that you want.)

# Create a new AWS EKS cluster using Pulumi with TypeScript

## Before You Begin
### Install Pulumi
#### MacOs

`brew install pulumi/tap/pulumi`

#### Windows

`choco install pulumi`

#### Linux

`curl -fsSL https://get.pulumi.com | sh`

### Install Language Runtime

Install [Node.js](https://nodejs.org/en/download/).

### Configure Pulumi to access your AWS account
#### MacOs

```
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID> 
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
export KUBECONFIG=~/.kube/kubeconfig
```

#### Windows

```
$env:AWS_ACCESS_KEY_ID = "<YOUR_ACCESS_KEY_ID>";
$env:AWS_SECRET_ACCESS_KEY = "<YOUR_SECRET_ACCESS_KEY>"
$env:AWS_SECRET_ACCESS_KEY = "C:\Users\<username>\AppData\Local\Tempkubeconfig"
```

#### Linux

```
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
export KUBECONFIG=~/.kube/kubeconfig
```

### Install additional software
# [KUBECTL](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
# [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Implementations:

### [EKS + Kubernetes providers](https://github.com/euliancom/eks_with_pulumi_typescript/tree/main/eks_cluster_with_eks_provider)
### [AWS + Kubernetes providers](https://github.com/euliancom/eks_with_pulumi_typescript/tree/main/eks_cluster_with_aws_provider)

