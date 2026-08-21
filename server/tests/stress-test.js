const http = require('http');

/**
 * Forkroom Synthetic Stress Testing Utility
 * Runs concurrent HTTP requests against the liveness check endpoint to measure latency.
 */
function runTest(concurrency, durationMs) {
  return new Promise((resolve) => {
    console.log(`Starting stress test for ${concurrency} concurrent requests...`);
    
    const latencies = [];
    let completed = 0;
    let failed = 0;
    let active = 0;
    const startTest = Date.now();
    let shouldStop = false;

    const agent = new http.Agent({
      keepAlive: true,
      maxSockets: concurrency
    });

    function makeRequest() {
      if (shouldStop || (Date.now() - startTest) > durationMs) {
        shouldStop = true;
        if (active === 0) {
          finish();
        }
        return;
      }

      active++;
      const startReq = Date.now();
      
      const req = http.get('http://127.0.0.1:3001/health', { agent }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          active--;
          if (res.statusCode === 200) {
            latencies.push(Date.now() - startReq);
            completed++;
          } else {
            failed++;
          }
          makeRequest();
        });
      });

      req.on('error', (err) => {
        active--;
        failed++;
        makeRequest();
      });

      req.end();
    }

    // Launch initial batch
    for (let i = 0; i < concurrency; i++) {
      makeRequest();
    }

    function finish() {
      const elapsedSec = (Date.now() - startTest) / 1000;
      latencies.sort((a, b) => a - b);
      
      const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
      const totalReq = completed + failed;
      const reqPerSec = Math.round(totalReq / elapsedSec);
      const failureRate = ((failed / totalReq) * 100).toFixed(2);

      resolve({
        concurrency,
        p50,
        p99,
        reqPerSec,
        failureRate,
        totalReq
      });
    }

    setTimeout(() => {
      shouldStop = true;
    }, durationMs);
  });
}

async function main() {
  const steps = [500, 1000, 2000, 5000];
  const results = [];
  
  for (const step of steps) {
    await new Promise(r => setTimeout(r, 1000));
    const res = await runTest(step, 5000);
    results.push(res);
    console.log(`Results for ${step} connections: p50=${res.p50}ms, p99=${res.p99}ms, req/sec=${res.reqPerSec}, failure=${res.failureRate}%`);
  }

  console.log('\n--- FINAL RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runTest };
