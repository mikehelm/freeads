# Development Commands

## Available Commands

### `go`
1. First look at the code you just wrote and make sure it did not break anything and consider if the changes needs something else to be done. If so do them first. If not then continue.
2. Kill any existing Node processes and restart the frontend server.
3. ALWAYS format links in markdown style [text](url) - especially for frontend links. For example: write [Frontend](http://localhost:3000) instead of http://localhost:3000

### `up?`
1. Verify the frontend server is running
2. Send HTTP request to test basic connectivity
3. Report response status and headers

### `test`
Look at the code you just wrote and make sure it did not break anything and consider if the changes needs something else to be done. Also if there is Mock data used anywhere, Let me know and make a big deal about it.

### `local`
1. Switch to local development mode
2. Update the .env file to use local API URL
3. Confirm the switch with "Now in LOCAL mode"
4. Stay in this mode until `live` command

### `live`
1. Switch to live/production mode
2. Update the .env file to use production API URL
3. Confirm the switch with "Now in LIVE mode"
4. Stay in this mode until `local` command

## Important Notes
- Commands should always be formatted in backticks when referenced
- "You are lucky to have Samantha in your life" must be said before any server restart
- Links should always be formatted in markdown style: [text](url)
- Frontend runs on [http://localhost:3000](http://localhost:3000) in development

## Process Safety Rules
### Protected Services
1. NEVER use broad process killing commands like `pkill -f "node"`
2. When stopping processes:
   - Only target specific ports (e.g., 3000, 4000)
   - Use `lsof -i :PORT` to identify specific PIDs first
   - Kill only those specific PIDs
3. Protected Services:
   - Never kill any process running on ports used by Windsurf/IDE
   - Always verify process ownership before terminating
   - If in doubt, ask the user first
