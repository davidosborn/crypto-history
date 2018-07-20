#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

APP=crypto-watch
CLEAN=yes
RUN=server

. ../deploy/cfg.sh
. ../deploy/deploy.sh
