const { io } = require('socket.io-client');

async function runWSJoinTest(concurrency, durationMs = 5000) {
  return new Promise((resolve) => {
    console.log(`Starting Socket.io join-room benchmark for ${concurrency} connections...`);
    
    const latencies = [];
    const sockets = [];
    let completed = 0;
    let failed = 0;
    const startTest = Date.now();

    const batchSize = 100;
    const batchInterval = 50;
    let currentBatch = 0;
    const totalBatches = Math.ceil(concurrency / batchSize);

    const intervalId = setInterval(() => {
      if (currentBatch >= totalBatches) {
        clearInterval(intervalId);
        return;
      }

      const startIdx = currentBatch * batchSize;
      const endIdx = Math.min(startIdx + batchSize, concurrency);

      for (let i = startIdx; i < endIdx; i++) {
        const roomId = `loadtest-room-${Math.floor(i / 10)}`;
        const socket = io('ws://127.0.0.1:3001', {
          transports: ['websocket'],
          reconnection: false,
          forceNew: true
        });

        sockets.push(socket);
        const clientTimestamp = Date.now();

        socket.on('connect', () => {
          socket.emit('join-room', {
            roomId,
            name: `user-${i}`,
            colour: '#FF6B6B',
            clientTimestamp
          });
        });

        socket.on('room-state', (data) => {
          const rtt = Date.now() - (data.clientTimestamp || clientTimestamp);
          latencies.push(rtt);
          completed++;
        });

        socket.on('error', () => {
          failed++;
        });

        socket.on('connect_error', () => {
          failed++;
        });
      }

      currentBatch++;
    }, batchInterval);

    setTimeout(() => {
      // Clean up all sockets
      sockets.forEach(s => s.disconnect());
      
      const elapsedSec = (Date.now() - startTest) / 1000;
      latencies.sort((a, b) => a - b);
      
      const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
      const totalReq = completed + failed;
      const failureRate = totalReq > 0 ? ((failed / totalReq) * 100).toFixed(2) : '0.00';

      resolve({
        concurrency,
        p50,
        p99,
        failureRate,
        completed,
        failed
      });
    }, durationMs + (totalBatches * batchInterval) + 1000);
  });
}

async function main() {
  const steps = [500, 1000, 2000, 5000, 10000, 15000];
  const results = [];
  
  for (const step of steps) {
    await new Promise(r => setTimeout(r, 2000));
    const duration = step >= 10000 ? 10000 : 6000;
    const res = await runWSJoinTest(step, duration);
    results.push(res);
    console.log(`Results for ${step} connections: p50=${res.p50}ms, p99=${res.p99}ms, failure=${res.failureRate}%`);
  }

  console.log('\n--- FINAL WS JOIN RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
