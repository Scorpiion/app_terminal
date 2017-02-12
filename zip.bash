#!/bin/bash

rm -f archive.zip
zip -r -q archive.zip . -y -x *.git* -x *node_modules/*


