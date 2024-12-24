const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  app.get('/', (req, res) => {
    setTimeout(() => {
      res.send('Hello World!');
    }, 5000); 
  });
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
