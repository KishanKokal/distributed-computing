process.stdin.on('data', (data) => {
    console.log(`Received message from parent process: ${data}`);
    // Respond back to the parent process
    process.stdout.write('Hello from child process!');
});
