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
```

#### Windows

```
$env:AWS_ACCESS_KEY_ID = "<YOUR_ACCESS_KEY_ID>";
$env:AWS_SECRET_ACCESS_KEY = "<YOUR_SECRET_ACCESS_KEY>"
```

#### Linux

```
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```

