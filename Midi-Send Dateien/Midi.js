// Array für Felderkennung, 32 Felder wobei 0 aus ist und 1-4 verschiedene Farben
var felder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

// Wenn MIDI-Nachri
function onMIDIMessage(event) {
    switch (event.data[0]) {
        case 144:
            // Feld- und Farberkennung und schreiben ins Array
            felder[event.data[1]] = event.data[2];
            console.log(felder);
            break;
    }
}
