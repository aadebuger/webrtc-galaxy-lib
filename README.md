webrtc-multi-connection
=======================

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

```html
<script src="/<path-to-webrtc-multi-connection>/initiator.js"></script>
```

```javacript

// Initiator

var params = {
    channelID: 'bb-channel',
    onParticipantConnected: function (participantID) {},
    onParticipantVideoReady: function (participantID) {},
    onParticipantLeft: function (participantID) {},
};

var initiator = new RTCInitiator(params);

initiator.bindVideo(participantID, videoHTMLElement);
initiator.unbindVideo(participantID);
```

```html
<script src="/<path-to-webrtc-multi-connection>/participant.js"></script>
```

```javacript
// Participant

var params = {
    channelID: 'bb-channel',
    participantID: 'bb-scandinavia',
    onInitiatorDisconnected: function () {},
    onInitiatorReconnected: function () {},
};

var participant = new RTCParticipant(params);

participant.startBroadcast(videoHTMLElement);
```

