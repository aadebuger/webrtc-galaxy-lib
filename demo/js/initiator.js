/*jshint indent:4, strict:true*/

var initiator;

$(function () {
    "use strict";

    var channelID = prompt("Please enter the channel ID", 'bnei-baruch-group-video');

    var settings = {
        channelID: channelID,
        debug: true,
        onParticipantConnected: _onParticipantConnected,
        onParticipantVideoReady: _onParticipantVideoReady,
        onParticipantLeft: _onParticipantLeft
    };

    initiator = new RTCInitiator(settings);
});

/* Adds a new participant toggle button and binds its click event
 */
function _onParticipantConnected(participantID) {
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
            _removeParticipantVideo(participantID);
        else
            _displayParticipantVideo(participantID);
    });
}

/* Enables participant's toggle button when his video stream is ready
 */
function _onParticipantVideoReady(participantID) {
    "use strict";
    var participant = _getObjectByUserID('js-participant', participantID);
    participant.prop('disabled', false);
}

/* Removes participant's toggle button and video widget on leaving
 */
function _onParticipantLeft(participantID) {
    "use strict";
    _getObjectByUserID('js-participant', participantID).remove();
    _removeParticipantVideo(participantID);
}

/* Displays participant's video widget and plays the stream
 */
function _displayParticipantVideo(participantID) {
    "use strict";

    var videoAttrs = {
        title: participantID,
        width: '320px',
        height: '240px',
        'class': 'js-participant-video',
        'data-id': participantID,
        autoplay: true
    };

    var video = $('<video />', videoAttrs);
    $('#js-videos-container').append(video);

    initiator.bindVideo(participantID, video.get(0));
}

/* Halts participant's video stream and removes the video widget from DOM
 */
function _removeParticipantVideo(participantID) {
    "use strict";
    initiator.unbindVideo(participantID);
    _getObjectByUserID('js-participant-video', participantID).remove();
}

/* Returns a jQuery object by its CSS class name and the data-id attribute
 */
function _getObjectByUserID(className, participantID) {
    "use strict";
    return $('.' + className + '[data-id="' + participantID + '"]');
}
