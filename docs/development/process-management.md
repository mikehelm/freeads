# Process Management Guidelines

## Critical Rules for Process Management

1. **NEVER Kill Windsurf Processes**
   - NEVER use broad process killing commands like `pkill -f "node"`
   - ALWAYS check process ownership before termination
   - EXCLUDE Windsurf-related processes from cleanup

2. **Safe Process Termination**
   ```bash
   # DO NOT USE these commands:
   pkill -f "node"      # Too broad, affects all Node processes
   killall node         # Dangerous, affects system processes

   # INSTEAD USE these approaches:
   lsof -i :3000 -t    # Get specific process ID for our port
   kill $(lsof -i :3000 -t)  # Kill only our port's process
   ```

3. **Port Management**
   - ALWAYS verify port ownership before killing
   - Use port-specific process termination
   - Keep track of running process IDs

## Safe Server Restart Procedure

1. **Before Restart**
   ```bash
   # 1. Check what's using our port
   lsof -i :3000

   # 2. Get the specific PID
   PORT_PID=$(lsof -i :3000 -t)

   # 3. Verify it's our process
   ps -p $PORT_PID -o comm=

   # 4. Only then terminate
   kill $PORT_PID
   ```

2. **Wait States**
   - Wait 1000ms after process termination
   - Verify port is free before restart
   - Check for zombie processes

3. **Health Checks**
   - Monitor process state
   - Check port availability
   - Verify server responsiveness

## Process Identification

1. **Our Processes**
   - Development server: `vite`
   - Build process: `npm run build`
   - Test runner: `vitest`

2. **System Processes**
   - Windsurf processes
   - IDE processes
   - System Node processes

## Emergency Recovery

1. **If Server Crashes**
   - Check process table first
   - Identify hanging processes
   - Clean up only our processes
   - Restart development server

2. **Prevention**
   - Keep process list updated
   - Monitor resource usage
   - Regular health checks

## Implementation Notes

1. **Process Cleanup Script**
   ```bash
   #!/bin/bash
   
   # Get our server PID
   PORT_PID=$(lsof -i :3000 -t)
   
   # Verify it's our process
   if [ ! -z "$PORT_PID" ]; then
     PROCESS_NAME=$(ps -p $PORT_PID -o comm=)
     if [[ $PROCESS_NAME == *"node"* ]] || [[ $PROCESS_NAME == *"vite"* ]]; then
       kill $PORT_PID
     fi
   fi
   ```

2. **Health Check Script**
   ```bash
   #!/bin/bash
   
   # Check if port is in use
   if lsof -i :3000 >/dev/null; then
     echo "Port 3000 is in use"
     lsof -i :3000
   else
     echo "Port 3000 is available"
   fi
   ```

Remember: SAFETY FIRST - When in doubt, manually check processes rather than using broad kill commands.
