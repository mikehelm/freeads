#!/bin/bash

# Server Management Script
# This script helps manage the development server safely

check_port() {
    if lsof -i:3000 > /dev/null; then
        echo "Port 3000 is in use. Cleaning up..."
        return 1
    fi
    return 0
}

safe_kill_node() {
    echo "Safely stopping Node processes..."
    pkill -f "node"
    sleep 1
}

start_server() {
    echo "Starting development server..."
    npm run dev
}

verify_csp() {
    if ! grep -q "Content-Security-Policy" index-dev.html; then
        echo "WARNING: CSP meta tag missing in index-dev.html"
        exit 1
    fi
}

main() {
    # Verify CSP configuration
    verify_csp

    # Check port status
    check_port
    if [ $? -eq 1 ]; then
        safe_kill_node
    fi

    # Double check port is free
    check_port
    if [ $? -eq 1 ]; then
        echo "ERROR: Port 3000 still in use after cleanup"
        exit 1
    fi

    # Start server
    start_server
}

main
