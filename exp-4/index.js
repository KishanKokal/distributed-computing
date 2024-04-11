class Process {
    constructor(id) {
        this.id = id;
        this.coordinator = null;
        this.active = true;
    }

    // Start an election
    startElection() {
        console.log(`Process ${this.id} starts an election.`);
        this.sendElectionMessage();
    }

    // Send election message to higher priority processes
    sendElectionMessage() {
        for (let i = this.id + 1; i <= numProcesses; i++) {
            if (processes[i] && processes[i].active) {
                // Simulate sending election message
                console.log(`Process ${this.id} sends election message to Process ${i}.`);
                processes[i].receiveElectionMessage(this.id);
            }
        }
        this.becomeCoordinator();
    }

    // Receive election message from a lower priority process
    receiveElectionMessage(senderId) {
        console.log(`Process ${this.id} receives election message from Process ${senderId}.`);
        this.startElection();
    }

    // Declare itself as the coordinator
    becomeCoordinator() {
        this.coordinator = this.id;
        console.log(`Process ${this.id} becomes the coordinator.`);
        for (let i = 1; i <= numProcesses; i++) {
            if (i !== this.id && processes[i] && processes[i].active) {
                // Simulate sending coordinator message
                console.log(`Process ${this.id} sends coordinator message to Process ${i}.`);
                processes[i].receiveCoordinatorMessage(this.id);
            }
        }
    }

    // Receive coordinator message from the new coordinator
    receiveCoordinatorMessage(coordinatorId) {
        console.log(`Process ${this.id} receives coordinator message from Process ${coordinatorId}.`);
        this.coordinator = coordinatorId;
    }

    // Deactivate the process (simulate failure)
    deactivate() {
        this.active = false;
        console.log(`Process ${this.id} is deactivated.`);
    }
}

// Number of processes
const numProcesses = 5;

// Array to hold the instances of processes
const processes = [];

// Create Process instances for each process
for (let i = 1; i <= numProcesses; i++) {
    processes[i] = new Process(i);
}

// Simulate a process failure
setTimeout(() => {
    processes[3].deactivate(); // Process 3 fails
}, 3000);

// Start an election from a random process
const randomProcessId = Math.floor(Math.random() * numProcesses) + 1;
processes[randomProcessId].startElection();
