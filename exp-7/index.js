// Round Robin Load Balancer

// Define a list of servers
const servers = ['Server 1', 'Server 2', 'Server 3', 'Server 4'];

// Function to simulate a request being handled by a server
function handleRequest(server) {
    console.log(`Request handled by ${server}`);
}

// Simulate incoming requests
function simulateRequests(numRequests) {
    let currentServerIndex = 0;

    for (let i = 0; i < numRequests; i++) {
        const server = servers[currentServerIndex];
        handleRequest(server);

        // Move to the next server in a round-robin fashion
        currentServerIndex = (currentServerIndex + 1) % servers.length;
    }
}

// Simulate 10 requests
simulateRequests(10);
