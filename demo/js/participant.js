/*jshint indent:4, strict:true*/

/* TODO: move all WebRTC stuff into a separate library */

var connection;
var channelID;
var reconnectionInterval = 5000;
var intervalID;
var userID;

var size = {width: 320, height: 240};
var sessions = {};


$(function () {
    "use strict";
    // window.skipRTCMultiConnectionLogs = true;
    channelID = prompt("Please enter the channel ID", 'bnei-baruch-group-video');
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
    "use strict";

    if (intervalID)
        window.clearInterval(intervalID);

    if (connection) {
        connection.close();
    }

    connection = new RTCMultiConnection(channelID);
    connection.userid = userID;
    connection.sessionid = 'Ighiex7atoo2ih1Ta7quesh5fiesahsh';
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
    };

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
    "use strict";
    console.log("Restablishing connection...");
    initConnection();
    connection.connect();
}

function displayAlert(message) {
    "use strict";
    $('#js-status-container').show().text(message);
}
