const { spawn } = require('child_process');

// Create a child process
const child = spawn('node', ['child-process.js']);

// Listen for data from the child process
child.stdout.on('data', (data) => {
    console.log(`Received message from child process: ${data}`);
});

// Send data to the child process
console.log('Sending message to child process...');
child.stdin.write('Hello from parent process!');
child.stdin.end();
