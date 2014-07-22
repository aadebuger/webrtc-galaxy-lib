uniqueChannelID = Math.random().toString(36).substr(2)

createInitiator = (settings) ->
    baseSettings:
        channelID: uniqueChannelID
        debug: true

    for key, val of properties
        baseSettings[key] = val

    new RTCInitiator baseSettings


###
Generates unique participant IDs, e.g. 'participant-1', 'participant-2' etc

Sample usage:
> console.log participantIDGenerator.gen
participant-1

> console.log participantIDGenerator.gen
participant-2

> participantIDGenerator.reset
> console.log participantIDGenerator.gen
participant-1

###
participantIDGenerator = (->
    number = 0
    gen: -> "participant-#{ ++number }"
    reset: -> number = 0
)()
