/*jshint indent:4, strict:true*/

/* TODO: move all WebRTC stuff into a separate library */

$(function () {
    //window.skipRTCMultiConnectionLogs = true;
    var channelID = 'Bnei Baruch Group Video';
    var connection = new RTCMultiConnection(channelID);

    var remoteStreams = {};

    connection.isInitiator = true;
    connection.sessionid = 'awesome-session';
    connection.preventSSLAutoAllowed = false;
    connection.autoReDialOnFailure = true;
    connection.session = {};

    // We do accept remote video stream
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
    };

    // On getting local or remote media stream
    connection.onstream = function(e) {
        console.log("New stream: ", e);
        remoteStreams[e.userid] = e.stream;
        /*video.src = URL.createObjectURL(e.stream);
          video.play();*/
    };

    connection.onleave = function(e) {
        /*if (!!stream) {
          video.src = null;
          stream.stop('remote');
          stream = null;
          }*/
        console.log("User left: ", e);
        delete remoteStreams[e.userid];
        removeParticipant(e.userid);
    }

    connection.onRequest = function (request) {
        console.log("New request: ", request);
        connection.accept(request);
        addParticipant(request.userid);
    };

    window.onbeforeunload = connection.close;

    // Setup signalling channel
    connection.open();
    console.log("Connection opened.");

});

function addParticipant(userID) {
    var attrs = {
        'text': userID,
        'class': 'js-participant',
        'data-id': userID
    };
    var participant = $('<button />', attrs);
    $('#js-participants-container').append(participant);
};

function removeParticipant(userID) {
    $('.js-participant[data-id="' + userID + '"]').remove();
}
