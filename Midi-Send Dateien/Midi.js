if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({sysex: false}).then(function (midiAccess) {
        midi = midiAccess;
        var inputs = midi.inputs.values();
        // loop through all inputs
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            // listen for midi messages
            input.value.onmidimessage = onMIDIMessage;
        }
    });
} else {
    alert("No MIDI support in your browser.");
}

function onMIDIMessage(event) {
    // event.data is an array
    // event.data[0] = on (144) / off (128) / controlChange (176)  / pitchBend (224) / ...
    // event.data[1] = midi note
    // event.data[2] = velocity

    switch (event.data[0]) {
    case 144:
        // your function startNote(note, velocity)
        //startNote(event.data[1], event.data[2]);
        document.querySelector("#data1").innerHTML = event.data[1];
        document.querySelector("#data2").innerHTML = event.data[2];
        break;
    case 128:
        // your function stopNote(note, velocity)
        document.querySelector("#data3").innerHTML = event.data[1];
        document.querySelector("#data4").innerHTML = event.data[2];
        break;
    }
}
