/*jshint indent:4, strict:true*/


/* Main class to use on the initiator's side 
 *
 * Example:
 *
 * ...
 * var params = {
 *     channelID: 'bb-channel',
 *     participantID: 'bb-scandinavia',
 *     onInitiatorDisconnected: function () {},
 *     onInitiatorReconnected: function () {},
 * };
 * 
 * var participant = new RTCParticipant(params);
 * 
 * participant.startBroadcast(videoHTMLElement);
 * ...
 */


RTCParticipant = function (settings) {
    "use strict";

    // Update the object with settings
    for (var item in (settings ? settings: {})) {
        this[item] = settings[item];
    }

    // Show WebRTC logs in debug mode
    if (!this.debug)
        window.skipRTCMultiConnectionLogs = true;

    this._initConnection();
};
