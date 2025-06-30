#!/bin/bash

browserNum=1  # Default to Chrome

echo "Selected browser: $browserNum"

if [[ $browserNum -eq 1 ]]; then
    chromium-browser --no-sandbox --user-data-dir=/tmp/temp-profile --new-window >/dev/null 2>&1 &
elif [[ $browserNum -eq 2 ]]; then
    firefox --no-remote --profile /tmp/temp-profile >/dev/null 2>&1 &
else
    echo "Browser not found!"
fi

