#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

APP=crypto_history

. ../deploy/cfg.sh
. ../deploy/deploy-db.sh
