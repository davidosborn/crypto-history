#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

APP=crypto-history
CLEAN=yes
#RUN=.

. ../deploy/cfg.sh
. ../deploy/deploy.sh
