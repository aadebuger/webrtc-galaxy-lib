describe 'Initiator', ->
    beforeEach ->
        participantIDGenerator.reset

    it 'reports new participant connection', done ->
        spy = jasmine.createSpy('onParticipantConnected').and.callFake done
        createInitiator onParticipantConnected: spy

        initiatorSettings:
            channelID: uniqueChannelID
            debug: true
            onParticipantConnected: spy,

        initiator = new RTCInitiator extend baseSettings, onParticipantConnected: spy

        participantSettings:
            channelID: uniqueChannelID
            participantID: participantID
            debug: true

        participant = new RTCParticipant(participantSettings)



        participantID = participantIDGenerator.gen
        participant = createParticipant participantID: participantID
        participant.startBroadcasting

        expect(spy).toHaveBeenCalledWith(participantID)
