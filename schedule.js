import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

var firebaseConfig = {
    apiKey: "AIzaSyCzF2lQO3f2O7BxCMStuwTZXiP5GCccH48",
    authDomain: "railmitra-29557.firebaseapp.com",
    projectId: "railmitra-29557",
    storageBucket: "railmitra-29557.appspot.com",
    messagingSenderId: "269756755900",
    appId: "1:269756755900:web:69d475147946f789fdc5b9",
    measurementId: "G-T0MQQ6JMLD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.querySelectorAll('.search-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.search-tab').forEach(function(tab) {
            tab.classList.remove('active');
        });
        this.classList.add('active');

        var searchType = this.id;
        if (searchType === 'searchByNumberTab') {
            document.getElementById('numberSearch').style.display = 'block';
            document.getElementById('routeSearch').style.display = 'none';
        } else {
            document.getElementById('numberSearch').style.display = 'none';
            document.getElementById('routeSearch').style.display = 'block';
            $('#datepicker').datepicker({
                autoclose: true,
                format: 'dd/mm/yyyy',
                todayHighlight: true
            });
        }
    });
});

document.getElementById('searchByNumberForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    var trainNumber = document.getElementById('trainNumber').value;
    await searchByTrainNumber(trainNumber);
});
  
// Add this function to handle the click event on the "Book Now" buttons
function bookNow(trainNumber, stationName) {
    // Redirect to reservation.html with the train number and station name as URL parameters
    window.location.href = `reservation.html?trainNumber=${trainNumber}&stationName=${stationName}`;
}

async function searchByTrainNumber(trainNumber) {
    if (!db) {
        console.error("Database instance is not available.");
        return;
    }

    try {
        // Reference to the "seats" collection in Firestore
        const seatsCollectionRef = collection(db, "seats");
        const seatsQuery = query(seatsCollectionRef, where("train number", "==", trainNumber));
        const seatsSnapshot = await getDocs(seatsQuery);
        console.log("Seats query executed successfully.");

        // Reference to the "Trains" collection in Firestore
        const trainDocRef = doc(db, "Trains", trainNumber); // Assuming train number is used as document ID
        const trainDoc = await getDoc(trainDocRef);

        if (!trainDoc.exists()) {
            console.error("Train not found in Trains collection.");
            return;
        }

        const trainData = trainDoc.data();
        const trainName = trainData['name'];

        // Clear previous results
        const resultsTableBody = document.querySelector('.schedule-table tbody');
        resultsTableBody.innerHTML = '';

        seatsSnapshot.forEach((seatDoc) => {
            const seatData = seatDoc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${seatData['train number']}</td>
                <td>${trainName}</td>
                <td>${seatData['station name']}</td>
                <td>${seatData['ac']}</td>
                <td>${seatData['sleeper']}</td>
                <td>${seatData['general']}</td>
                <td><a href="#" class="book-now-btn" data-train-number="${seatData['train number']}" data-station-name="${seatData['station name']}">Book Now</a></td>
            `;
            row.querySelector('.book-now-btn').addEventListener('click', () => bookNow(seatData['train number'], seatData['station name']));
            resultsTableBody.appendChild(row);
            resultsTableBody.appendChild(row);
        });

        console.log("Search completed.");
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

document.getElementById('searchByRouteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var source = document.getElementById('source').value;
    var destination = document.getElementById('destination').value;
    var date = document.getElementById('datepicker').value;
    searchBySourceAndDestination(source, destination, date);
});

function searchBySourceAndDestination(source, destination, date) {
    console.log("Searching by source: " + source + ", destination: " + destination + ", and date: " + date);
}
