#!/bin/bash

# Safe Server Management Script
# This script safely manages the development server without affecting other processes

# Configuration
DEV_PORT=3000
WAIT_TIME=1000  # milliseconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a process belongs to our development server
is_our_process() {
    local pid=$1
    local process_name=$(ps -p $pid -o comm=)
    [[ $process_name == *"vite"* ]] || [[ $process_name == *"npm"* ]]
}

# Function to safely get our process ID
get_our_pid() {
    local pid=$(lsof -i :${DEV_PORT} -t)
    if [ ! -z "$pid" ]; then
        if is_our_process $pid; then
            echo $pid
        fi
    fi
}

# Function to check port availability
check_port() {
    if lsof -i :${DEV_PORT} >/dev/null 2>&1; then
        local pid=$(lsof -i :${DEV_PORT} -t)
        if is_our_process $pid; then
            echo -e "${YELLOW}Port ${DEV_PORT} is in use by our development server (PID: $pid)${NC}"
            return 1
        else
            echo -e "${RED}Port ${DEV_PORT} is in use by another process (PID: $pid)${NC}"
            return 2
        fi
    fi
    echo -e "${GREEN}Port ${DEV_PORT} is available${NC}"
    return 0
}

# Function to safely stop our server
stop_server() {
    local pid=$(get_our_pid)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Stopping development server (PID: $pid)${NC}"
        kill $pid
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            echo -e "${RED}Server didn't stop gracefully, forcing...${NC}"
            kill -9 $pid
        fi
        echo -e "${GREEN}Server stopped${NC}"
    else
        echo -e "${GREEN}No development server running${NC}"
    fi
}

# Function to start the development server
start_server() {
    echo -e "${GREEN}Starting development server...${NC}"
    npm run dev
}

# Main execution
main() {
    echo "Checking server status..."
    check_port
    local status=$?
    
    if [ $status -eq 1 ]; then
        read -p "Development server is running. Restart it? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            stop_server
            start_server
        fi
    elif [ $status -eq 2 ]; then
        echo -e "${RED}Cannot start server - port in use by another process${NC}"
        exit 1
    else
        start_server
    fi
}

# Run the script
main
