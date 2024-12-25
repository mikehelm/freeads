export default function debugPlugin() {
  return {
    name: 'debug-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          // Log all headers being set
          const originalSetHeader = res.setHeader;
          res.setHeader = function(name, value) {
            console.log(`Header being set: ${name} = ${value}`);
            return originalSetHeader.call(this, name, value);
          };
        } catch (error) {
          console.error('Error in debug plugin:', error);
        }
        next();
      });
    }
  };
}
