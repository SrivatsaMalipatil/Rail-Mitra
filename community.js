    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCzF2lQO3f2O7BxCMStuwTZXiP5GCccH48",
        authDomain: "railmitra-29557.firebaseapp.com",
        databaseURL: "https://railmitra-29557-default-rtdb.firebaseio.com",
        projectId: "railmitra-29557",
        storageBucket: "railmitra-29557.appspot.com",
        messagingSenderId: "269756755900",
        appId: "1:269756755900:web:69d475147946f789fdc5b9",
        measurementId: "G-T0MQQ6JMLD"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(); // Initialize Firestore
    const auth = firebase.auth(); // Initialize Firebase Auth

    // Function to send message to Firestore
    function sendMessage(message) {
        const user = auth.currentUser;
        if (user) {
            db.collection("messages").add({
                message: message,
                userId: user.uid,
                userEmail: user.email, // Use the user's email
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Use Firestore server timestamp
            }).then(() => {
                console.log("Message sent to Firestore");
            }).catch((error) => {
                console.error("Error sending message:", error);
            });
        } else {
            console.log("User not logged in.");
        }
    }

    // Function to display messages from Firestore
    function displayMessages() {
        const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML = ""; // Clear previous messages
        db.collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
            chatMessages.innerHTML = ""; // Clear previous messages again to avoid duplication
            snapshot.forEach((doc) => {
                const data = doc.data();
                const messageDiv = document.createElement("div");
                const nameDiv = document.createElement("div");

                if (auth.currentUser && data.userId === auth.currentUser.uid) {
                    messageDiv.className = "my-message"; // Styling class for my messages
                    nameDiv.textContent = "Me";
                } else {
                    messageDiv.className = "other-message"; // Styling class for other messages
                    nameDiv.textContent = data.userEmail || "Anonymous"; // Use userEmail instead of userName
                }

                messageDiv.textContent = data.message;
                chatMessages.appendChild(nameDiv);
                chatMessages.appendChild(messageDiv);
            });
        });
    }

    // Event listener for send button
    document.getElementById("sendButton").addEventListener("click", () => {
        const message = document.getElementById("messageInput").value.trim();
        if (message) {
            sendMessage(message);
            document.getElementById("messageInput").value = ""; // Clear input field
        } else {
            alert("Please enter a message");
        }
    });

    // Display messages on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            displayMessages();
        } else {
            // Redirect to login page or display login form
        }
    });
