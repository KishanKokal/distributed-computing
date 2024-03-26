import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class GroupChatServer {
    private static Set<PrintWriter> writers = new CopyOnWriteArraySet<>();
    private static Set<String> connectedClients = new HashSet<>();

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        System.out.println("Group Chat Server is running...");

        // Start a thread to accept messages from the server console
        Thread serverMessageThread = new Thread(new ServerMessageHandler());
        serverMessageThread.start();

        try {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("New client connected: " + clientSocket);
                Scanner clientScanner = new Scanner(clientSocket.getInputStream());
                String clientName = clientScanner.nextLine();
                synchronized (writers) {
                    writers.add(new PrintWriter(clientSocket.getOutputStream(), true));
                    connectedClients.add(clientName);
                }
                broadcastFromServer(clientName + " has joined the chat.");
                broadcastFromServer("new member has joined !!");
                Thread clientHandler = new Thread(new ClientHandler(clientSocket, clientName));
                clientHandler.start();
            }
        } finally {
            serverSocket.close();
        }
    }

    private static class ClientHandler implements Runnable {
        private Socket clientSocket;
        private String clientName;

        public ClientHandler(Socket clientSocket, String clientName) {
            this.clientSocket = clientSocket;
            this.clientName = clientName;
        }

        @Override
        public void run() {
            try {
                Scanner scanner = new Scanner(clientSocket.getInputStream());
                while (scanner.hasNextLine()) {
                    String message = scanner.nextLine();
                    if (message.equals("exit")) {
                        break;
                    } else if (message.startsWith("/whisper")) {
                        handleWhisper(message);
                    } else {
                        broadcast(clientName + ": " + message);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                synchronized (writers) {
                    writers.removeIf(writer -> writer.equals(clientSocket));
                    connectedClients.remove(clientName);
                }
                broadcastFromServer(clientName + " has left the chat.");
            }
        }

        private void broadcast(String message) {
            synchronized (writers) {
                for (PrintWriter writer : writers) {
                    writer.println(message);
                }
            }
        }

        private void handleWhisper(String message) {
            String[] parts = message.split(" ", 3);
            if (parts.length == 3) {
                String recipient = parts[1].trim();
                String whisperMessage = parts[2].trim();
                synchronized (writers) {
                    if (connectedClients.contains(recipient)) {
                        for (PrintWriter writer : writers) {
                            if (writer.toString().equals(recipient)) {
                                writer.println("(whisper from " + clientName + "): " + whisperMessage);
                                break;
                            }
                        }
                    } else {
                        writers.stream()
                                .filter(writer -> writer.toString().equals(clientName))
                                .findFirst()
                                .ifPresent(writer -> writer.println("Recipient '" + recipient + "' is not connected."));
                    }
                }
            } else {
                writers.stream()
                        .filter(writer -> writer.toString().equals(clientName))
                        .findFirst()
                        .ifPresent(writer -> writer.println("Invalid whisper command. Usage: /whisper recipient message"));
            }
        }
    }

    private static class ServerMessageHandler implements Runnable {
        @Override
        public void run() {
            try {
                BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));
                while (true) {
                    String serverMessage = consoleReader.readLine();
                    broadcastFromServer("[host]: " + serverMessage);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void broadcastFromServer(String message) {
        synchronized (writers) {
            for (PrintWriter writer : writers) {
                writer.println(message);
            }
        }
    }
}
