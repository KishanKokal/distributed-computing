import java.util.Scanner;

class Pro {
    int id;
    boolean act;

    Pro(int id) {
        this.id = id;
        this.act = true;
    }
}

public class Bully {
    int TotalProcess;
    Pro[] process;

    public static void main(String[] args) {
        Bully object = new Bully();
        Scanner scanner = new Scanner(System.in);
        System.out.print("Total number of processes: ");
        int numProcesses = scanner.nextInt();
        object.initialize(numProcesses);
        object.Election();
        scanner.close();
    }

    public void initialize(int j) {
        System.out.println("No of processes " + j);
        this.TotalProcess = j;
        this.process = new Pro[this.TotalProcess];
        for (int i = 0; i < this.TotalProcess; i++) {
            this.process[i] = new Pro(i);
        }
    }

    public void Election() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter the process number to fail: ");
        int process_to_fail = scanner.nextInt();

        if (process_to_fail < 0 || process_to_fail >= this.TotalProcess) {
            System.out.println("Invalid process number. Please enter a valid process number.");
            return;
        }

        System.out.println("Process no " + this.process[process_to_fail].id + " fails");
        this.process[process_to_fail].act = false;

        System.out.print("Enter the process initiating the election: ");
        int initializedProcess = scanner.nextInt();
        System.out.println("Election Initiated by " + initializedProcess);
        int initBy = initializedProcess;

        int i = -1;
        for(i = initBy; i < TotalProcess - 1; i++){
            if(this.process[i].act){
                System.out.println("Process " + i + " passes Election(" + i + ")" + " to " +(i + 1));
            }else{
                System.out.println("Process " + (i-1) + " passes Election(" + (i - 1) + ")" + " to " +(i + 1));
            }
        }

        int coordinatorID = -1;
        if(this.process[i].act) {
            coordinatorID = i;
        }else{
            coordinatorID = i - 1;
        }
        System.out.println("Process " + coordinatorID + " is the process with max ID");

        for(int j = 0; j< coordinatorID; j++){
            if(this.process[j].act)
                System.out.println("Process " + coordinatorID + " passes Coordinator(" + coordinatorID + ") message to process " + this.process[j].id);

        }
        scanner.close();
    }
}

