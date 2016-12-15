#!/bin/sh
# Timestamps a file using StartSSL.com

# name of file to be hashed and time-stamped
in_file="$1"

# name of file to save the time-stamp response
out_file="${in_file}.tsr"

# URL of time-stamp server
ts_server='http://www.startssl.com/timestamp'

# Use openssl to create the time-stamp request, then use curl to submit the request and save the response.
openssl ts -query -data "$in_file" -sha1 -cert | curl -o "$out_file" -sSH 'Content-Type: application/timestamp-query' --data-binary @- "$ts_server"

# Verify the response.
openssl ts -verify -data "$in_file" -in "$out_file" -CApath "$(openssl version -d | cut -d '"' -f 2)/certs/"

# Print the response in human-readable format for more info.
openssl ts -reply -in "$out_file" -text