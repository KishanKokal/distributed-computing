// Define a class representing a message broker
class MessageBroker {
    constructor() {
        this.subscribers = {};
    }

    // Method to subscribe to a topic
    subscribe(topic, callback) {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push(callback);
    }

    // Method to publish a message to a topic
    publish(topic, message) {
        if (this.subscribers[topic]) {
            this.subscribers[topic].forEach(callback => {
                callback(message);
            });
        }
    }
}

// Create a message broker instance
const messageBroker = new MessageBroker();

// Subscriber 1
messageBroker.subscribe("group-chat", message => {
    console.log("Subscriber 1 received message:", message);
});

// Subscriber 2
messageBroker.subscribe("group-chat", message => {
    console.log("Subscriber 2 received message:", message);
});

// Subscriber 3
messageBroker.subscribe("announcement", message => {
    console.log("Subscriber 3 received announcement:", message);
});

// Publisher sends message to group-chat topic
messageBroker.publish("group-chat", "Hello everyone!");

// Publisher sends announcement to announcement topic
messageBroker.publish("announcement", "Important announcement: Meeting at 2 PM.");
