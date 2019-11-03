$(document).ready(function () {

    let firebaseConfig = {
        apiKey: "AIzaSyAF--xN2REMI8zpI_fYNdE9XH6p8LDqcgU",
        authDomain: "train-d577f.firebaseapp.com",
        databaseURL: "https://train-d577f.firebaseio.com",
        projectId: "train-d577f",
        storageBucket: "train-d577f.appspot.com",
        messagingSenderId: "244643335875",
        appId: "1:244643335875:web:1eaf53e9c0e88b1f951c76",
        measurementId: "G-N3P86F0R80"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let dataRef = firebase.database();


    // Initial Values
    let trainName = "";
    let destination = "";
    let firstTrainTime = "";
    let frequency = "";

    function date_time() {
        let now = moment().format('MMMM Do YYYY, h:mm:ss a');
        $('#current-time').text("Don't loose your next Train -> " + now)
        setTimeout(function () {
            date_time();
        }, 1000);
    }
    date_time();

    // Capture Button Click

    $("#submitForm").on("click", function (event) {
        event.preventDefault();

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frequency = $("#frequency").val().trim();

        let newTrain = {
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        }

        dataRef.ref().push(newTrain);

        console.log(newTrain.trainName);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrainTime);
        console.log(newTrain.frequency);

        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");

    });

    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    dataRef.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        let trainNewName = childSnapshot.val().trainName;
        let trainDestination = childSnapshot.val().destination;
        let trainFirstTrain = childSnapshot.val().firstTrainTime;
        let trainFrequency = childSnapshot.val().frequency;

        // Employee Info
        console.log(trainNewName);
        console.log(trainDestination);
        console.log(trainFirstTrain);
        console.log(trainFrequency);

        let tFreq = trainFrequency;
        let fTime = trainFirstTrain;

        // First Time (pushed back 1 year to make sure it comes before current time)
        let firstTimeConv = moment(fTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConv);

        // Current Time
        let cTime = moment();
        console.log("CURRENT TIME: " + moment(cTime).format("hh:mm"));

        // Difference between the times
        let dTime = moment().diff(moment(firstTimeConv), "minutes");
        console.log("DIFFERENCE IN TIME: " + dTime);

        // Time apart (remainder)
        let tRem = dTime % tFreq;
        console.log(tRem);

        // Minute Until Train
        let tMinTillTrain = tFreq - tRem;


        console.log("MINUTES TILL TRAIN: " + tMinTillTrain);

        // Next Train
        let nTrain = moment().add(tMinTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nTrain).format("LT"));

        // Create the new row
        let newRow = $("<tr>").append(
            $("<td>").text(trainNewName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(moment(nTrain).format("LT")),
            $("<td>").text((tMinTillTrain),
        ));

        // Append the new row to the table
        $("#tableBody > tbody").append(newRow);


    });

});