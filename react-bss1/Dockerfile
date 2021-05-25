FROM dev-docker-registry.tecnotree.com/mirror/registry.docker.io/nginx:1.17.0-alpine


MAINTAINER DL-CP-DEVOPS <DL-CP-DEVOPS@tecnotree.com>

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

ARG CONFD_VERSION=0.16.0

RUN set -xe \
  # add shadow to modify UID of nginx user and group
  echo http://dl-2.alpinelinux.org/alpine/v3.9/community/ >> /etc/apk/repositories && \
  apk add --no-cache --update \
  curl \
  bash \
  shadow && \
  usermod -u 860 nginx && \
  groupmod -g 860 nginx && \
  curl -SL https://github.com/kelseyhightower/confd/releases/download/v${CONFD_VERSION}/confd-${CONFD_VERSION}-linux-amd64 -o /usr/local/bin/confd && \
  chmod a+x /usr/local/bin/confd && \
  # Remove shadow package to decrease attack surface
  apk del shadow

WORKDIR /usr/share/nginx/html

# copy entrypoint script
COPY docker/scripts/docker-entrypoint.sh /

# custom nginx conf
COPY docker/config/nginx.vh.default.conf /etc/nginx/conf.d/default.conf

# confd configuration
COPY docker/config/confd /etc/confd

# replace confd template
#COPY dclm/dist/config.js /etc/confd/templates/config.tmpl

# web app
COPY bss-cbs/dist /usr/share/nginx/html/bss-cbs-app-upgrade-ui

RUN chmod a+x /docker-entrypoint.sh

ARG RELEASE="0.1.0-RC"

LABEL vendor=Tecnotree \
  service=bss-cbs-webui \
  release_tags="[\"${RELEASE}\"]"