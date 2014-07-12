/*jshint indent:4, strict:true*/


/* Main class to use on the initiator's side 
 *
 * Example:
 *
 * ...
 * var params = {
 *     channelID: 'bnei-baruch-channel',
 *     debug: true,
 *     onParticipantConnected: function (participantID) {...},
 *     onParticipantVideoReady: function (participantID) {...},
 *     onParticipantLeft: function (participantID) {...},
 * };
 * 
 * var initiator = new RTCInitiator(params);
 * 
 * initiator.bindVideo(participantID, videoHTMLElement);
 * ...
 * initiator.unbindVideo(participantID);
 * ...
 */
RTCInitiator = function (settings) {
    "use strict";

    this._remoteStreams = {};

    // Update the object with settings
    (settings | {}).forEach(function(item) {
        this[item] = settings[item];
    });

    // Show WebRTC logs in debug mode
    if (this.debug)
        window.skipRTCMultiConnectionLogs = true;

    this._initConnection();

    // Close connection on closing the browser window
    window.onbeforeunload = connection.close;
};


RTCInitiator.prototype = {
    /* Channel ID, 'bnei-baruch-group-video' by default
     */
    channelID: 'bnei-baruch-group-video',

    /* Raised if a new participant has been connected
     *
     * @param participantID: participant ID string
     */
    onParticipantConnected: function (participantID) {
        "use strict";
        this._debug("Participant connected: ", participantID);
    },

    /* Raised if a participant video stream is ready to play
     *
     * @param participantID: participant ID string
     */
    onParticipantVideoReady: function (participantID) {
        "use strict";
        this._debug("Participant's video is ready: ", participantID);
    },

    /* Raised if a participant has left
     *
     * @param participantID: participant ID string
     */
    onParticipantLeft: function (participantID) {
        "use strict";
        this._debug("Participant's left: ", participantID);
    },

    /* Binds a participant's video to a DOM video element
     *
     * @param participantID: participant ID string
     * @domVideoElement: DOM video element to bind the stream to
     */
    bindVideo: function (participantID, domVideoElement) {
        "use strict";

        this._unholdSilently(participantID);
        domVideoElement.src = URL.createObjectURL(this._remoteStreams[userID]);
        domVideoElement.play();
    },

    /* Unbinds a participant's video
     *
     * @param participantID: participant ID string
     */
    unbindVideo: function (participantID) {
        "use strict";
        this._holdSilently(participantID);
    },

    /* Unique session ID
     */
    _sessionID: 'Ighiex7atoo2ih1Ta7quesh5fiesahsh',

    /* Initialize an RTCMultiConnection, for internale use only
     */
    _initConnection: function () {
        "use strict";

        this.connection = new RTCMultiConnection(channelID);

        this.connection.isInitiator = true;
        this.connection.sessionid = this._sessionID;
        this.connection.preventSSLAutoAllowed = false;
        this.connection.autoReDialOnFailure = true;
        this.connection.session = {};

        // We do accept remote video stream
        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        };

        this._bindConnectionEvents();
        this.connection.open();
        this._debug("Connection established.");
    },

    /* Binds RTCMultiConnection events
     * @param connection: RTCMultiConnection instance
     */
    _bindConnectionEvents: function () {
        "use strict";

        this.connection.onstream = function(e) {
            this._debug("New participant stream: ", e);
            e.stream.muted = true;
            this._remoteStreams[e.userid] = e.stream;
            this._holdSilently(e.userid);
            this.onParticipantVideoReady(e.userid);
        };

        this.connection.onleave = function(e) {
            this._debug("Participant left: ", e);
            delete this._remoteStreams[e.userid];
            this.onParticipantLeft(e.userid);
        };

        this.connection.onRequest = function (request) {
            this._debug("New participant request: ", request);
            this.connection.accept(request);
            this.onParticipantConnected(request.userid);
        };
    },

    /* Holds a peer without raising the onhold and onmute events
     *
     * @param participantID: participant ID string
     */
    _holdSilently: function (participantID) {
        "use strict";
        this._toggleHoldSilently(participantID, true);
    },

    /* Unholds a peer without raising the onunhold and onunmute events
     *
     * @param participantID: participant ID string
     */
    _unholdSilently: function (participantID) {
        "use strict";
        toggleHoldSilently(participantID, false);
    },

    /* Holds or unholds the call with a participant depending on the hold argument value
     *
     * @param participantID: participant ID string
     * @param hold: true or false
     */
    _toggleHoldSilently: function (participantID, hold) {
        "use strict";

        var peer = this.connection.peers[participantID];

        if (peer && peer.peer.hold != hold) {
            /* A monkey-patch, see
             * https://github.com/muaz-khan/WebRTC-Experiment/issues/244
             * */
            peer.fireHoldUnHoldEvents = function() {};

            var params = {
                participantid: participantID,
                extra: {},
                holdMLine: 'both'
            };

            if (hold)
                params.hold = true;
            else
                params.unhold = true;

            peer.socket.send(params);
            peer.peer.hold = hold;
        }
    },

    /* Log a debug message, wraps the built-in console.log() function
     */
    _debug: function () {
        "use strict";
        if (this.debug)
            console.log.apply(this, arguments);
    }
};
