/*jshint indent:4, strict:true*/

var initiator;

$(function () {
    "use strict";

    var channelID = prompt("Please enter the channel ID", 'bnei-baruch-group-video');

    var params = {
        channelID: channelID,
        debug: false,
        onParticipantConnected: onParticipantConnected,
        onParticipantVideoReady: onParticipantVideoReady,
        onParticipantLeft: onParticipantLeft
    };

    initiator = new RTCInitiator(params);
});

function onParticipantConnected(participantID) {
    "use strict";

    var attrs = {
        type: 'button',
        text: participantID,
        'class': 'js-participant btn btn-default',
        disabled: true,
        'data-id': participantID
    };
    var participant = $('<button />', attrs);
    $('#js-participants-container').append(participant);

    participant.click(function () {
        if ($(this).hasClass('active'))
            removeParticipantVideo(participantID);
        else
            displayParticipantVideo(participantID);
    });
}

function onParticipantVideoReady(participantID) {
    "use strict";
    var participant = getObjectByUserID('js-participant', participantID);
    participant.prop('disabled', false);
}

function onParticipantLeft(participantID) {
    "use strict";
    getObjectByUserID('js-participant', participantID).remove();
    removeParticipantVideo(participantID);
}

function displayParticipantVideo(participantID) {
    "use strict";

    var videoAttrs = {
        title: participantID,
        'class': 'js-participant-video',
        'data-id': participantID,
        autoplay: true
    };

    var video = $('<video />', videoAttrs);
    $('#js-videos-container').append(video);

    initiator.bindVideo(participantID, video.get(0));
}

function removeParticipantVideo(participantID) {
    "use strict";
    initiator.unbindVideo(participantID);
    getObjectByUserID('js-participant-video', participantID).remove();
}

function getObjectByUserID(className, participantID) {
    "use strict";
    return $('.' + className + '[data-id="' + participantID + '"]');
}
