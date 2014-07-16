webrtc-galaxy-ui
================

WebRTC wrapper to enable many one-direction connections.

Launch demo
-------------

Clone the WebRTC multicionnection repository:
```bash
$ git clone https://github.com/bbfsdev/webrtc-multi-connection
```
Go to to the demos folder:
```bash
$ cd webrtc-multi-connection/demos
```
Launch the static files server:
```bash
$ nodejs serve_static.js
```
This may require additional modules installation, install them with npm.

Now visit http://127.0.0.1:8181/initiator.html and http://127.0.0.1:8181/participant.html in the browser.

Have fun!

Usage
------
### Initiator's side

```html
<script src="/<path-to-webrtc-multi-connection>/3rd-party/RTCMultiConnection-v1.8-experimental.js"></script>
<script src="/<path-to-webrtc-multi-connection>/initiator.js"></script>
```

```javascript

...
var settings = {
    // Unique channel ID for the participants and the initiator
    channelID: 'bnei-baruch-channel',
    // Log debug messages
    debug: true,
    // Raised if a new participant has been connected
    onParticipantConnected: function (participantID) {...},
    // Raised if a participant video stream is ready to play
    onParticipantVideoReady: function (participantID) {...},
    // Raised if a participant has left
    onParticipantLeft: function (participantID) {...},
};

var initiator = new RTCInitiator(settings);

// Binds a participant's video to a DOM video element
initiator.bindVideo(participantID, domVideoElement);
...
// Unbinds a participant's video
initiator.unbindVideo(participantID);
...
```
### Participant's side

```html
<script src="/<path-to-webrtc-multi-connection>/3rd-party/RTCMultiConnection-v1.8-experimental.js"></script>
<script src="/<path-to-webrtc-multi-connection>/participant.js"></script>
```

```javascript

...
var settings = {
    // Unique channel ID for the participants and the initiator
    channelID: 'bb-channel',
    // Participant ID, i.e. unique user name
    participantID: 'bb-scandinavia',
    // Log debug messages
    debug: true,
    // Raised if the connection with the initiator has been (re)established
    onInitiatorConnected: function () {...},
    // Raised if the connection with the initiator has been lost
    onInitiatorDisconnected: function () {...},
};

var participant = new RTCParticipant(settings);

// Start broadcasting local stream and display it in the video element
participant.startBroadcasting(domVideoElement);
...
```

