##Jenkins Continuous Deployment on Rancher v2##
#!/bin/sh

IMAGE_TAG=${1:-"latest"}
IMAGE_NAME=${2:-"dev-docker-registry.tecnotree.com/bss/bss-cbs-app-upgrade-ui"}

BEARER_TOKEN="token-8b9h6:46kpbwxnc2pdh44kwqpvhv4sddmwhxstcs7nxddksk75hksxtmzb62"       ##manas's token##
RANCHER_SERVER="https://rancher2.tecnotree.com/v3"
PROJECT="c-2cglh:p-8hgxc"       ##digital-mld-platform##
NAMESPACE="bss-cbs-dev"
DEPLOYMENT="bss-cbs-webui"
POD="bss-cbs-webui"

#Download Rancher v2 CLI
wget https://nexus.tecnotree.com/repository/raw-3rd-party/rancher/cli/v2.2.0/rancher-linux-amd64-v2.2.0.tar.gz -O - | tar -zx  -C . --strip-components=2

#Download kubectl and update PATH
wget https://nexus.tecnotree.com/repository/raw-3rd-party/kubernetes-release/kubectl/v1.15.0/kubernetes-release-amd64-v1.15.0.tar.gz -O - | tar -zx  -C . && \
     chmod +x ./kubectl && \
     PATH=$PATH:.

./rancher login --token ${BEARER_TOKEN} --context ${PROJECT} ${RANCHER_SERVER}
./rancher kubectl --namespace=${NAMESPACE} set image deployment/${DEPLOYMENT} ${POD}=${IMAGE_NAME}:${IMAGE_TAG}

exit 0