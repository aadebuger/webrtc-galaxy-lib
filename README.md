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
### Initiator's side

```html
<!-- Download RTCMultiConnection from http://www.webrtc-experiment.com/RTCMultiConnection-v1.8.js -->
<script src="/<path-to-javascripts>/RTCMultiConnection-v1.8.js"></script>
<script src="/<path-to-webrtc-multi-connection>/initiator.js"></script>
```

```javascript

...
var settings = {
    channelID: 'bnei-baruch-channel',
    debug: true,
    onParticipantConnected: function (participantID) {...},
    onParticipantVideoReady: function (participantID) {...},
    onParticipantLeft: function (participantID) {...},
};

var initiator = new RTCInitiator(settings);

initiator.bindVideo(participantID, domVideoElement);
...
initiator.unbindVideo(participantID);
...
```
### Participant's side

```html
<!-- Download RTCMultiConnection from http://www.webrtc-experiment.com/RTCMultiConnection-v1.8.js -->
<script src="/<path-to-javascripts>/RTCMultiConnection-v1.8.js"></script>
<script src="/<path-to-webrtc-multi-connection>/participant.js"></script>
```

```javascript

...
var settings = {
    channelID: 'bb-channel',
    participantID: 'bb-scandinavia',
    debug: true,
    onInitiatorConnected: function () {...},
    onInitiatorDisconnected: function () {...},
};

var participant = new RTCParticipant(settings);

participant.startBroadcasting(domVideoElement);
...
```

