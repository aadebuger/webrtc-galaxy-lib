/*jshint indent:4, strict:true*/

var participant;

$(function () {
    "use strict";

    var channelID = prompt("Please enter the channel ID", 'bnei-baruch-group-video');
    var participantID = prompt("Please enter your participant ID", 'virtual-group');

    var settings = {
        channelID: channelID,
        participantID: participantID,
        debug: true,
        onInitiatorConnected: _onInitiatorConnected,
        onInitiatorDisconnected: _onInitiatorDisconnected,
    };

    participant = new RTCParticipant(settings);

    _bindPageEvents();
});

/* Binds jQuery events to DOM elements on the page
 */
function _bindPageEvents() {
    "use strict";
    $('#js-start-broadcasting-button').click(function() {
        $(this).prop('disabled', true);
        participant.startBroadcasting($('video').get(0));
    });
}

/* Hides the alert when connection with the initiator has been established
 */
function _onInitiatorConnected() {
    "use strict";
    $('#js-status-container').hide();
}

/* Shows an alert when the initiator has been disconnected
 */
function _onInitiatorDisconnected() {
    "use strict";
    var message = "The initiator has left, trying to reconnect...";
    $('#js-status-container').show().text(message);
}
