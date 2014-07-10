/*jshint indent:4, strict:true*/

/* TODO: move all WebRTC stuff into a separate library */

var connection;

$(function () {
    //window.skipRTCMultiConnectionLogs = true;

    var channelID = 'Bnei Baruch Group Video';

    var video = document.querySelector('video');
    var size = {width: 320, height: 240};
    var sessions = {};

    connection = new RTCMultiConnection(channelID);
    connection.userid = prompt("Please enter your participant ID", 'virtual-group');
    connection.sessionid = 'awesome-session';
    connection.isInitiator = false;
    connection.preventSSLAutoAllowed = false;
    connection.autoReDialOnFailure = true;
    connection.media.max(size.width, size.height);

    connection.onNewSession = function(session) {
        console.log("New session: ", session);
        session.session = {video: true};
        if (sessions[session.sessionid]) return;
        sessions[session.sessionid] = session;
        session.join();
    }

    // On getting local media stream
    connection.onstream = function(e) {
        console.log("New stream: ", e);
        e.stream.muted = true;
        video.src = URL.createObjectURL(e.stream);
        video.play();
    };

    connection.onleave = function(e) {
        console.log("User left", e);
        if (e.entireSessionClosed) {
            displayAlert("The initiator has left, trying to reconnect...");
            // TODO: reconnect on timeout
        }
    };

    // Connect to existing session
    $('#js-start-broadcasting-button').click(function() {
        this.disabled = true;
        connection.connect();
    });

    window.onbeforeunload = connection.close;
});

function displayAlert(message) {
    $('#js-status-container').show().text(message);
}
