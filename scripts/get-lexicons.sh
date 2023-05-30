#!/bin/sh

curl https://codeload.github.com/bluesky-social/atproto/tar.gz/main | \
  tar -xz --strip=2 --directory lexicons atproto-main/lexicons
