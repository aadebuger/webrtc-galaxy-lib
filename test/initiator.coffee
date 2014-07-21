describe 'Initiator', ->
    it 'initializes a WebRTC session', ->
        initiator = new Initiator()
    it 'raises an event when a new participant is connected', ->
        callback = (participantID) -> null
        initiator = new Initiator({onParticipantConnected: callback})
    it ''
