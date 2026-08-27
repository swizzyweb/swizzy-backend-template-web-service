#!/usr/bin/bash

node ./node_modules/.bin/swizzy-service-config-gen > /tmp/web-service-config.generated.json
exec npx swerve --config /tmp/web-service-config.generated.json
