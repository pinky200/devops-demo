const http = require('http');

test('server responds with 200', (done) => {
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from Jenkins + AKS + ArgoCD!\n');
  });

  server.listen(3001, () => {
    http.get('http://localhost:3001', (res) => {
      expect(res.statusCode).toBe(200);
      server.close(done);
    });
  });
});
