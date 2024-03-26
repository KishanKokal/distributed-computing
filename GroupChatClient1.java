import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class GroupChatClient1 {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String clientName = scanner.nextLine();
        Socket socket = new Socket("localhost", 5000);
        try {
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            writer.println(clientName);
            Thread readerThread = new Thread(new ClientReader(socket));
            readerThread.start();
            while (true) {
                String message = scanner.nextLine();
                writer.println(message);
                if (message.equals("exit")) {
                    break;
                }
            }
        } finally {
            socket.close();
        }
    }
    private static class ClientReader implements Runnable {
        private Socket socket;
        public ClientReader(Socket socket) {
            this.socket = socket;
        }
        @Override
        public void run() {
            try {
                Scanner scanner = new Scanner(socket.getInputStream());
                while (scanner.hasNextLine()) {
                    String message = scanner.nextLine();
                    System.out.println(message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                System.out.println("Disconnected from the server.");
            }
        }
    }
}

