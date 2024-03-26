import java.util.Scanner;

public class LamportLogicalClock {

    public static int maxTimestamp(int a, int b) {
        return Math.max(a, b);
    }

    public static void displayTimestamps(int[] p1, int[] p2) {
        System.out.println("The time stamps of events in P1:");
        for (int timestamp : p1) {
            System.out.print(timestamp + " ");
        }
        System.out.println("\nThe time stamps of events in P2:");
        for (int timestamp : p2) {
            System.out.print(timestamp + " ");
        }
        System.out.println();
    }

    public static void lamportLogicalClock(int e1, int e2, int[][] m) {
        int[] p1 = new int[e1];
        int[] p2 = new int[e2];

        for (int i = 0; i < e1; i++) {
            p1[i] = i + 1;
        }
        for (int i = 0; i < e2; i++) {
            p2[i] = i + 1;
        }

        System.out.println("\nInitial Matrix:");
        for (int i = 0; i < e1; i++) {
            System.out.print("\te1" + (i + 1));
        }
        System.out.println();
        for (int i = 0; i < e2; i++) {
            System.out.print("e2" + (i + 1) + "\t");
            for (int j = 0; j < e1; j++) {
                System.out.print(m[j][i] + "\t");
            }
            System.out.println();
        }

        for (int i = 0; i < e1; i++) {
            for (int j = 0; j < e2; j++) {
                if (m[i][j] == 1) {
                    p2[j] = maxTimestamp(p2[j], p1[i] + 1);
                    for (int k = j + 1; k < e2; k++) {
                        p2[k] = p2[k - 1] + 1;
                    }
                } else if (m[i][j] == -1) {
                    p1[i] = maxTimestamp(p1[i], p2[j] + 1);
                    for (int k = i + 1; k < e1; k++) {
                        p1[k] = p1[k - 1] + 1;
                    }
                }
            }
        }

        displayTimestamps(p1, p2);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter the number of events in P1: ");
        int e1 = scanner.nextInt();
        System.out.print("Enter the number of events in P2: ");
        int e2 = scanner.nextInt();

        int[][] m = new int[e1][e2];

        System.out.println("Enter communication between events:");
        for (int i = 0; i < e1; i++) {
            for (int j = 0; j < e2; j++) {
                System.out.print("Event e1" + (i + 1) + " to e2" + (j + 1) + ": ");
                m[i][j] = scanner.nextInt();
            }
        }

        lamportLogicalClock(e1, e2, m);
        scanner.close();
    }
}
