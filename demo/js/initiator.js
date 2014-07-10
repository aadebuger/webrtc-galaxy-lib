/*jshint indent:4, strict:true*/

/* TODO: move all WebRTC stuff into a separate library */

var connection;
var remoteStreams = {};

$(function () {
    //window.skipRTCMultiConnectionLogs = true;
    var channelID = 'Bnei Baruch Group Video';
    connection = new RTCMultiConnection(channelID);

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
        e.stream.muted = true;
        remoteStreams[e.userid] = e.stream;
        holdSilently(e.userid);
        enableParticipant(e.userid);
    };

    connection.onleave = function(e) {
        console.log("User left: ", e);
        delete remoteStreams[e.userid];
        removeParticipant(e.userid);
        removeParticipantVideo(e.userid);
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

function holdSilently(userID) {
    toggleHoldSilently(userID, true);
}

function unholdSilently(userID) {
    toggleHoldSilently(userID, false);
}

function toggleHoldSilently(userID, hold) {
    var peer = connection.peers[userID];

    /* A monkey-patch, see
     * https://github.com/muaz-khan/WebRTC-Experiment/issues/244
     * */
    peer.fireHoldUnHoldEvents = function() {};

    var params = {
        userid: userID,
        extra: {},
        holdMLine: 'both'
    }
    if (hold)
        params.hold = true;
    else
        params.unhold = true;
    peer.socket.send(params);
    peer.peer.hold = hold;
}

function addParticipant(userID) {
    var attrs = {
        type: 'button',
        text: userID,
        'class': 'js-participant btn btn-default',
        disabled: true,
        'data-id': userID
    };
    var participant = $('<button />', attrs);
    $('#js-participants-container').append(participant);

    participant.click(function () {
        if ($(this).hasClass('active'))
            removeParticipantVideo(userID);
        else
            displayParticipantVideo(userID);
    });
};

function enableParticipant(userID) {
    getObjectByUserID('js-participant', userID).prop('disabled', false);
}

function removeParticipant(userID) {
    getObjectByUserID('js-participant', userID).remove();
}

function displayParticipantVideo(userID) {
    unholdSilently(userID);

    var videoAttrs = {
        title: userID,
        src: URL.createObjectURL(remoteStreams[userID]),
        'class': 'js-participant-video',
        'data-id': userID,
        autoplay: true
    };
    var video = $('<video />', videoAttrs);
    $('#js-videos-container').append(video);
    video.get(0).play();
}

function removeParticipantVideo(userID) {
    holdSilently(userID);
    getObjectByUserID('js-participant-video', userID).remove();
}

function getObjectByUserID(className, userID) {
    return $('.' + className + '[data-id="' + userID + '"]');
}