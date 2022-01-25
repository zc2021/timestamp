require('dotenv').config();
const development = process.env.NODE_ENV === 'development';
const cluster = require('cluster');

if (cluster.isMaster) {
  const workerPool = process.env.WEB_CONCURRENCY || 1;
  for (let i=0; i < workerPool; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker) {
    console.log(`Worker ${worker.id} died.`);
    cluster.fork();
  });
} else {
  const express = require('express');
  const cors = require('cors');
  
  const port = process.env.PORT || 3000;
  const app = express();
  const appRouter = require(`${__dirname}/routes/endpoints`);
  
  app.use(cors());
  app.use(express.static('public'));
  app.use(appRouter);
  
  app.listen(port, function () {
    if (development) {
      console.log(`Worker ${cluster.worker.id} listening at: http://localhost:${port}`);
    }
  });
}