#!/bin/sh
# Requires libheif's heif-convert on PATH. Does not overwrite the source.
set -eu
if [ "$#" -ne 2 ]; then echo 'Usage: convert-heic.sh input.heic output.jpg' >&2; exit 2; fi
if [ -e "$2" ]; then echo 'Output already exists; choose a new filename.' >&2; exit 2; fi
heif-convert "$1" "$2"
