var context = new AudioContext();

button = document.querySelector('#Startbutton');

//Tempo initialisieren
var tempo = 90; 
var eighthNoteTime = (60 / tempo) / 2;

// leeres Array für Sounds
var audioBuffers = [];

// Array für Felderkennung, 32 Felder wobei 0 aus ist und 1-4 verschiedene Farben
var felder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// MIDI Initialisieren
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

// Wenn MIDI-Nachricht kommt, speichere im Array an der Richtigen Stelle die Farbe in Form von 0(aus), 1(farb1)...usw
function onMIDIMessage(event) {
    switch (event.data[0]) {
        case 144:
            // Feld- und Farberkennung und schreiben ins Array
            felder[event.data[1]] = event.data[2];
            break;
    }
}

// Audiosound laden
for (let i = 0; i < 4; i++)
    getAudioData(i);

function getAudioData(i) {
    fetch("Sound/sound" + (i + 1) + ".wav")
    .then(response => response.arrayBuffer())
    .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
    .then(audioBuffer => {
        audioBuffers[i] = audioBuffer;
    })
    .catch(console.error);
}

// Funktion um einen Sound zu bestimmten Zeitpunkt abzuspielen
function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
}