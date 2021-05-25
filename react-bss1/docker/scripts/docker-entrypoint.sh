#!/bin/bash

set -eu

/usr/local/bin/confd -confdir="/etc/confd" -onetime -backend env

exec "$@"