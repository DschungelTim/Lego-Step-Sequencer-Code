var context = new AudioContext();

button = document.querySelector('#Startbutton');

//Tempo initialisieren
var tempo = 90; 
var eighthNoteTime = (60 / tempo) / 2;

// leeres Array für Sounds
var audioBuffers = [];

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