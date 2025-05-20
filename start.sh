#!/bin/sh

# Start the backend
cd /usr/share/nginx/html/backend
node server.js &

# Start nginx
nginx -g 'daemon off;' 