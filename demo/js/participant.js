/*jshint indent:4, strict:true*/

/* TODO: move all WebRTC stuff into a separate library */

var connection;
var channelID = 'Bnei Baruch Group Video';
var reconnectionInterval = 5000;
var intervalID;
var userID;

var size = {width: 320, height: 240};
var sessions = {};


$(function () {
    // window.skipRTCMultiConnectionLogs = true;
    userID = prompt("Please enter your participant ID", 'virtual-group');

    initConnection();

    // Connect to existing session
    $('#js-start-broadcasting-button').click(function() {
        this.disabled = true;
        connection.connect();
    });

    window.onbeforeunload = connection.close;
});

function initConnection() {
    if (intervalID)
        window.clearInterval(intervalID);

    if (connection) {
        connection.close();
        delete connection;
    }

    connection = new RTCMultiConnection(channelID);
    connection.userid = userID;
    connection.sessionid = 'awesome-session';
    connection.isInitiator = false;
    connection.preventSSLAutoAllowed = false;
    connection.autoReDialOnFailure = true;
    connection.media.max(size.width, size.height);
    connection.bandwidth.video = 112;

    connection.onNewSession = function(session) {
        console.log("New session: ", session);
        session.session = {video: true};
        if (sessions[session.sessionid]) return;
        sessions[session.sessionid] = session;
        session.join();

        if (intervalID) {
            window.clearInterval(intervalID);
            $('#js-status-container').hide();
        }
    }

    // On getting local media stream
    connection.onstream = function(e) {
        console.log("New stream: ", e);
        e.stream.muted = true;
        $('video')
            .prop('src', URL.createObjectURL(e.stream))
            .get(0).play();
    };

    connection.onleave = function(e) {
        console.log("User left", e);
        if (e.entireSessionClosed) {
            displayAlert("The initiator has left, trying to reconnect...");
            sessions[connection.sessionid] = undefined;
            intervalID = window.setInterval(reconnect, reconnectionInterval);
        }
    };

}

function reconnect() {
    console.log("Restablishing connection...");
    initConnection();
    connection.connect();
}

function displayAlert(message) {
    $('#js-status-container').show().text(message);
}
