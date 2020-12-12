let context = new AudioContext();
isPlaying = false;

// leeres Array für Sounds
var audioBuffers = [];

// Array für Felderkennung, 32 Felder wobei 0 aus ist und 1-4 verschiedene Farben
let felder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
for (let i = 0; i < 3; i++)
    getAudioData(i);

function getAudioData(i) {
    fetch("/sounds/sound" + (i + 1) + ".wav")
        .then(response => response.arrayBuffer())
        .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
        .then(audioBuffer => {
            audioBuffers[i] = audioBuffer;
    })
    .catch(console.error);
}

// Funktion um einen Sound zu bestimmten Zeitpunkt abzuspielen
function playSound(buffer, time) {
    let source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
}

function playBeat() {
    let tempo = 90; // BPM (beats per minute)
    let eighthNoteTime = (60 / tempo) / 2;
    let startTime = context.currentTime;
    let bassdrum = audioBuffers[0];
    let snaredrum = audioBuffers[1];
    let hihat = audioBuffers[2];

    for (let takt = 0; takt < 2; takt++) {
        let time = startTime + (takt * 8 * eighthNoteTime);

        playSound(bassdrum, time + 0 * eighthNoteTime);
        playSound(bassdrum, time + 1 * eighthNoteTime);
        playSound(bassdrum, time + 4 * eighthNoteTime);

        playSound(snaredrum, time + 2 * eighthNoteTime);
        playSound(snaredrum, time + 3.5 * eighthNoteTime);
        playSound(snaredrum, time + 4.5 * eighthNoteTime);
        playSound(snaredrum, time + 6 * eighthNoteTime);

        for (let j = 0; j < 8; j++) {
            playSound(hihat, time + j * eighthNoteTime);
        }
    }
}

/*
if (isPlaying) {
    playBeat();
}
*/
document.querySelector("#startButton").addEventListener("click", function(e) {
    playBeat();
});

/*
startButton.addEventListener("click", function (e) {
    if (isPlaying) {
        startButton.innerHTML = "Start";
    } else {
        startButton.innerHTML = "Stop";
    }
    isPlaying = !isPlaying;
});

*/
