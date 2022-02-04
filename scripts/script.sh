#!/bin/bash
if [ ! -f "project.mg" ]; then
    mkdir `pwd`/output
    /data/Meshroom-2021.1.0-av2.4.0-centos7-cuda10.2/meshroom_batch --input `pwd`/input --output `pwd`/output --save project.mg
fi
/data/Meshroom-2021.1.0-av2.4.0-centos7-cuda10.2/meshroom_compute project.mg --toNode Publish_1 --forceStatus
