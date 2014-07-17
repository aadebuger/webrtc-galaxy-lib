/*jshint indent:4, strict:true*/


/* Main class to use on the initiator's side 
 *
 * Example:
 *
 * ...
 * var settings = {
 *     channelID: 'bnei-baruch-channel',
 *     debug: true,
 *     onParticipantConnected: function (participantID) {...},
 *     onParticipantVideoReady: function (participantID) {...},
 *     onParticipantLeft: function (participantID) {...},
 *     onConnectionClosed: function () {...}
 * };
 * 
 * var initiator = new RTCInitiator(settings);
 * 
 * initiator.bindVideo(participantID, domVideoElement);
 * ...
 * initiator.unbindVideo(participantID);
 * ...
 */
RTCInitiator = function (settings) {
    "use strict";

    this._blobURLs = {};

    // Update the object with settings
    for (var item in (settings ? settings: {})) {
        this[item] = settings[item];
    }

    // Show WebRTC logs in debug mode
    if (!this.debug)
        window.skipRTCMultiConnectionLogs = true;

    this._initConnection();
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

    /* Raised if a participant has left
     *
     * @param participantID: participant ID string
     */
    onConnectionClosed: function () {
        "use strict";
        this._debug("Connection has been closed because another initiator connected");
    },

    /* Binds a participant's video to a DOM video element
     *
     * @param participantID: participant ID string
     * @domVideoElement: DOM video element to bind the stream to
     */
    bindVideo: function (participantID, domVideoElement) {
        "use strict";

        this._unholdSilently(participantID);
        domVideoElement.src = this._blobURLs[participantID];
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

        this.connection = new RTCMultiConnection(this.channelID);

        this._created = Date.now();
        this.connection.isInitiator = true;
        this.connection.sessionid = this._sessionID;
        this.connection.preventSSLAutoAllowed = false;
        this.connection.autoReDialOnFailure = true;
        this.connection.session = {oneway: true};

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true,
        };

        this._bindConnectionEvents();

        this.connection.open();
        this._debug("Connection established.");

        this._closeOtherInitiators();
    },

    /* Binds RTCMultiConnection events
     * @param connection: RTCMultiConnection instance
     */
    _bindConnectionEvents: function () {
        "use strict";

        var self = this;

        this.connection.onopen = function(e) {
            self._debug("Session opened: ", e);
        };

        this.connection.onstream = function(e) {
            self._debug("New participant stream: ", e);
            e.stream.muted = true;
            self._blobURLs[e.userid] = e.blobURL;
            self._holdSilently(e.userid);
            self.onParticipantVideoReady(e.userid);
        };

        this.connection.onleave = function(e) {
            self._debug("Participant left: ", e);
            delete self._blobURLs[e.userid];
            self.onParticipantLeft(e.userid);
        };

        this.connection.onRequest = function (request) {
            self._debug("New participant request: ", request);
            self.connection.accept(request);
            self.onParticipantConnected(request.userid);
        };

        this.connection.onCustomMessage = function (message) {
            self._debug("New custom message :", message);
            // Got a request to close the connection from a new initiator
            if (message.action === 'close-connection' &&
                    message.timestamp > self._created) {
                // A monkey-patch to fix session re-initiation tries
                self.connection.join = function () {};
                self.connection.close();
                self._debug("Connection closed because another initiator connected");
                self.onConnectionClosed();
            }
        };

        // Close connection on closing the browser window
        window.onbeforeunload = this.connection.close;
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
        this._toggleHoldSilently(participantID, false);
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
                userid: participantID,
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

    /* Sends a custom message for other initiators to close their connections
     */
    _closeOtherInitiators: function () {
        "use strict";

        this.connection.sendCustomMessage({
            action: 'close-connection',
            timestamp: this._created
        });
    },

    /* Log a debug message, wraps the built-in console.log() function
     */
    _debug: function () {
        "use strict";
        if (this.debug)
            console.log.apply(console, arguments);
    }
};
