function maxTimestamp(a, b) {
    return Math.max(a, b);
}

function displayTimestamps(p1, p2) {
    console.log("The time stamps of events in P1:");
    p1.forEach(timestamp => {
        process.stdout.write(timestamp + " ");
    });
    console.log("\nThe time stamps of events in P2:");
    p2.forEach(timestamp => {
        process.stdout.write(timestamp + " ");
    });
    console.log();
}

function lamportLogicalClock(e1, e2, m) {
    let p1 = Array.from({ length: e1 }, (_, i) => i + 1);
    let p2 = Array.from({ length: e2 }, (_, i) => i + 1);

    console.log("\nInitial Matrix:");
    process.stdout.write("\t");
    for (let i = 0; i < e1; i++) {
        process.stdout.write("e1" + (i + 1) + "\t");
    }
    console.log();
    for (let i = 0; i < e2; i++) {
        process.stdout.write("e2" + (i + 1) + "\t");
        for (let j = 0; j < e1; j++) {
            process.stdout.write(m[j][i] + "\t");
        }
        console.log();
    }

    for (let i = 0; i < e1; i++) {
        for (let j = 0; j < e2; j++) {
            if (m[i][j] === 1) {
                p2[j] = maxTimestamp(p2[j], p1[i] + 1);
                for (let k = j + 1; k < e2; k++) {
                    p2[k] = p2[k - 1] + 1;
                }
            } else if (m[i][j] === -1) {
                p1[i] = maxTimestamp(p1[i], p2[j] + 1);
                for (let k = i + 1; k < e1; k++) {
                    p1[k] = p1[k - 1] + 1;
                }
            }
        }
    }

    displayTimestamps(p1, p2);
}

// Define the input matrix
const e1 = 3; // Number of events in P1
const e2 = 4; // Number of events in P2
const m = [
    [0, 1, 0, 1],
    [-1, 0, 1, 0],
    [0, -1, 0, 1]
];

lamportLogicalClock(e1, e2, m);
