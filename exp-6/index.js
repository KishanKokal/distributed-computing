class BankersAlgorithm {
    constructor(available, max, allocation, need) {
        this.available = available; // Available resources
        this.max = max; // Maximum resources each process can request
        this.allocation = allocation; // Currently allocated resources to processes
        this.need = need; // Resources needed by each process to complete
        this.numProcesses = allocation.length;
        this.safeSequence = [];
    }

    // Checks if the system is in a safe state
    isSafeState() {
        let work = [...this.available];
        let finish = new Array(this.numProcesses).fill(false);
        let safeSeq = [];

        for (let i = 0; i < this.numProcesses; i++) {
            if (!finish[i] && this.canFinish(i, work)) {
                // Mark process as finished and release allocated resources
                finish[i] = true;
                safeSeq.push(i);
                for (let j = 0; j < this.available.length; j++) {
                    work[j] += this.allocation[i][j];
                }
                i = -1; // Start over, as the state may have changed
            }
        }

        // Check if all processes are finished
        for (let i = 0; i < this.numProcesses; i++) {
            if (!finish[i]) {
                console.log("System is in an unsafe state. Deadlock detected.");
                return false;
            }
        }

        console.log("System is in a safe state. Safe sequence: ", safeSeq);
        this.safeSequence = safeSeq;
        return true;
    }

    // Checks if process can finish with the given work
    canFinish(process, work) {
        for (let i = 0; i < this.available.length; i++) {
            if (this.need[process][i] > work[i]) {
                return false;
            }
        }
        return true;
    }
}

// Example usage of safe state
const available = [3, 3, 2]; // Available instances of each resource
const max = [
    [7, 5, 3], // Maximum resources required by each process
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
];
const allocation = [
    [0, 1, 0], // Resources currently allocated to each process
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
];
const need = [
    [7, 4, 3], // Resources needed by each process to complete
    [1, 2, 2],
    [6, 0, 0],
    [0, 1, 1],
    [4, 3, 1]
];

const banker = new BankersAlgorithm(available, max, allocation, need);
banker.isSafeState();