class Node {
    constructor(id) {
        this.id = id;
        this.parent = null;
        this.children = [];
        this.requesting = false;
        this.receivedReply = false;
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
}

class RaymondMutex {
    constructor(numProcesses, processId, onCriticalSectionEnter, onCriticalSectionExit) {
        this.numProcesses = numProcesses;
        this.processId = processId;
        this.root = new Node(0); // Root of the tree
        this.initializeTree();
        this.requesting = false;
        this.held = false;
        this.onCriticalSectionEnter = onCriticalSectionEnter;
        this.onCriticalSectionExit = onCriticalSectionExit;
    }

    // Initializes the tree structure
    initializeTree() {
        for (let i = 1; i < this.numProcesses; i++) {
            const node = new Node(i);
            this.root.addChild(node);
        }
    }

    // Request access to the critical section
    requestCriticalSection() {
        this.requesting = true;
        this.root.requesting = true;
        this.sendRequest(this.root);
    }

    // Send request to all nodes in the tree
    sendRequest(node) {
        if (node.children.length === 0) {
            // Leaf node, send request to parent
            this.sendRequestToParent(node);
        } else {
            // Send request to children
            for (const child of node.children) {
                this.sendRequest(child);
            }
        }
    }

    // Send request to parent node
    sendRequestToParent(node) {
        const parent = node.parent;
        if (parent) {
            parent.receivedReply = false;
            // Simulate sending request to parent
            console.log(`Process ${this.processId} sends request to Process ${parent.id}`);
            this.receiveReply(parent);
        }
    }

    // Receive reply from child node
    receiveReply(node) {
        node.receivedReply = true;
        const allChildrenReplied = node.children.every(child => child.receivedReply);
        if (node.id === 0) {
            // Reached the root, check if all children replied
            if (allChildrenReplied) {
                console.log(`Process ${this.processId} enters critical section.`);
                this.held = true;
                this.onCriticalSectionEnter(this.processId);
            }
        } else {
            if (allChildrenReplied && node.requesting) {
                this.sendReply(node.parent);
            }
        }
    }

    // Send reply to parent node
    sendReply(node) {
        // Simulate sending reply to parent
        console.log(`Process ${this.processId} sends reply to Process ${node.id}`);
        this.receiveReply(node);
    }

    // Release access to the critical section
    releaseCriticalSection() {
        this.requesting = false;
        this.root.requesting = false;
        this.held = false;
        console.log(`Process ${this.processId} releases critical section.`);
        this.release(this.root);
        this.onCriticalSectionExit(this.processId);
    }

    // Release access recursively
    release(node) {
        for (const child of node.children) {
            this.release(child);
        }
        // Reset receivedReply for all nodes
        node.receivedReply = false;
    }
}

// Simulate multiple processes interacting with the critical section

// Number of processes
const numProcesses = 3;

// Array to hold the instances of RaymondMutex
const mutexes = [];

// Function to handle entering critical section
const onCriticalSectionEnter = (processId) => {
    console.log(`Process ${processId} is in the critical section.`);
};

// Function to handle exiting critical section
const onCriticalSectionExit = (processId) => {
    console.log(`Process ${processId} exited the critical section.`);
};

// Create RaymondMutex instances for each process
for (let i = 0; i < numProcesses; i++) {
    const mutex = new RaymondMutex(numProcesses, i, onCriticalSectionEnter, onCriticalSectionExit);
    mutexes.push(mutex);
}

// Simulate concurrent processes requesting and releasing critical section
setTimeout(() => {
    mutexes[0].requestCriticalSection();
}, 1000);

setTimeout(() => {
    mutexes[1].requestCriticalSection();
}, 2000);

setTimeout(() => {
    mutexes[0].releaseCriticalSection();
}, 3000);

setTimeout(() => {
    mutexes[2].requestCriticalSection();
}, 4000);

setTimeout(() => {
    mutexes[1].releaseCriticalSection();
}, 5000);

setTimeout(() => {
    mutexes[2].releaseCriticalSection();
}, 6000);
