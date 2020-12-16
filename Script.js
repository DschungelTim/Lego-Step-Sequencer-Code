let context = new AudioContext();
isPlaying = true;

// leeres Array für Sounds
var audioBuffers = [];

// Nodes erstellen
let gain = context.createGain();

// setTime, bpm
let tempo = 90; // BPM (beats per minute)
let eighthNoteTime = (60 / tempo) / 2;
// Calls timeout() function for the first time
timeout();

// Slider array initialisieren
let sliders = document.getElementsByClassName("slider");

// Array für Felderkennung, 32 Felder wobei 0 aus ist und 1-4 verschiedene Farben
// 0 = aus, 1(basedrum) = red, 2(snaredrum) = green, 3(clap) = blue, 4(hihat) = orange
// Die Reihenfolge ist wie folgt: [1.Zeile1.Spalte, 2.Zeile1.Spalte, 3.Zeile1.Spalte, 4.Zeile1.Spalte, 1.Zeile2.Spalte, usw...]
// Die letzten zwei Felder sind für die Slider, felder[32] Gain von 0-127=0dB-5dB und felder[33] Speed von 0-127=50bpm-178bpm
let felder = [1, 4, 0, 0, 2, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 4, 0, 0, 3, 20, 30];





//Farbvariablen
rot = getComputedStyle(document.documentElement).getPropertyValue('--rot');
gruen = getComputedStyle(document.documentElement).getPropertyValue('--gruen');
gelb = getComputedStyle(document.documentElement).getPropertyValue('--gelb');
blau = getComputedStyle(document.documentElement).getPropertyValue('--blau');
background = getComputedStyle(document.documentElement).getPropertyValue('--vordergrund');

// MIDI Initialisieren
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false }).then(function (midiAccess) {
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
            changeSliderParamMIDI();
            break;
    }
}


// Change backgroundColor of the div Elements in the css-file based on Array input
function changeColor() {
    var i;
    for (i = 0; i < 32; i++) {
        if (felder[i] == 0) {
            document.getElementById("B" + i).style.backgroundColor = background;
        }
        else if (felder[i] == 1) {
            document.getElementById("B" + i).style.backgroundColor = rot;
        }
        else if (felder[i] == 2) {
            document.getElementById("B" + i).style.backgroundColor = gruen;
        }
        else if (felder[i] == 3) {
            document.getElementById("B" + i).style.backgroundColor = blau;
        }
        else if (felder[i] == 4) {
            document.getElementById("B" + i).style.backgroundColor = gelb;
        }
    }
}

// Audiosound laden
for (let i = 0; i < 5; i++)
    getAudioData(i);

function getAudioData(i) {
    fetch("/sounds/sound" + (i) + ".wav")
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
    source.connect(gain);
    gain.connect(context.destination);
    source.start(time);
}

function convertToHex(str){
    var raw = str.match(/(\d+)/g);
    var hexr = parseInt(raw[0]).toString(16);
    var hexg = parseInt(raw[1]).toString(16);
    var hexb = parseInt(raw[2]).toString(16);
        hexr = hexr.value == 1 ? '0' + hexr: hexr;
        hexg = hexg.length == 1 ? '0' + hexg: hexg;
        hexb = hexb.length == 1 ? '0' + hexb: hexb;
    var hex = '#' + hexr + hexg + hexb;
    return hex;
  }

// Funktion, welche an einer bestimmten Spalte, Zeile nachschaut welche Farbe vorhanden ist und daraufhin
// den ensprechenden Sound zurückgibt
function whichSound(Spalte, Zeile) {

    var element = document.getElementById('B' + (Spalte + Zeile)),
        style = window.getComputedStyle(element),
        color = style.getPropertyValue('background-color');
    color = convertToHex(color);

    if (color.trim() === background.trim()) {
        return audioBuffers[0];
    }
    else if (color.trim() === rot.trim()) {
        return audioBuffers[1];
        
    }
    else if (color.trim() === gruen.trim()) {
        return audioBuffers[2];
    }
    else if (color.trim() === blau.trim()) {
        return audioBuffers[3];
    }
    else if (color.trim() === gelb.trim()) {
        return audioBuffers[4];
    }
    
}

// Funktion, welche durch setInterval unten alle 90 bpm wiederholt wird.
// Sie geht in der ersten for-Schleife jede Spalte und in der zweiten for-Schleife jede Zeile der Spalte durch.
// Alle Sounds, je nach Farbe bestimmt durch whichSound(), werden pro Spalte gleichzeitig abgespielt.
// "eight" ist für den Abspielzeitpunkt, also in welchem achtel eines Takes wir uns befinden zuständig
function playBeat() {
    let startTime = context.currentTime;
    let eight = 0;
    for (let i = 0; i < 32; i = i+4) {
        
        for (let j = 0; j < 4; j++) {
            //console.log(i, j)
            playSound(whichSound(i, j), startTime + eight * eighthNoteTime);
        }
        
        eight = eight + 1;
        if (eight == 8) {
            eight = 0;
        }
        
    }
}

// Calls our playBeat() function every eightNoteTime*8*1000 seconds
function timeout(){
    setTimeout(function () {
        if (isPlaying){
            playBeat();
        }
        timeout();
    }, eighthNoteTime * 8 * 1000);
};

// Abfrage, ob Sliderwerte geändert werden
for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("input", changeParameter, false);
}

//Änderung der Parameter
function changeParameter() {
    switch (this.id) {
        case "gainSlider":
            gain.gain.value = (this.value/100);
            document.querySelector("#gainOutput").innerHTML = (this.value)/100 + " dB";
            break;
        case "speedSlider":
            eighthNoteTime = (60 / this.value) / 2;
            document.querySelector("#speedOutput").innerHTML = (this.value) + " bpm";
            break;
    }
}

function changeSliderParamMIDI() {
    let gainMIDI = Math.round(((felder[32]/128)*5 + Number.EPSILON) * 100) / 100;
    let speedMIDI = felder[33];
    
    gain.gain.value = gainMIDI;
    console.log(gain.gain.value);
    document.querySelector("#gainOutput").innerHTML = gainMIDI + " dB";
    document.getElementById("gainSlider").value = gainMIDI*100;

    eighthNoteTime = (60 / (speedMIDI+50)) / 2;
    console.log(eighthNoteTime);
    document.querySelector("#speedOutput").innerHTML = speedMIDI+50 + " bpm";
    document.getElementById("speedSlider").value = speedMIDI + 50;
}

// Die sollte dann immer aufgerufen werden, wenn eine MIDI Note kommt, oder ein div angeklickt wird
// Hiermit wird vorerst die changeColor() Funktion aufgerufen
// WICHTIG: Nur ein setInterval pro js wahrscheinlich möglich (nicht 100% sicher)
document.querySelector("#startButton").addEventListener("click", function(e) {
    changeColor();
});



startButton.addEventListener("click", function (e) {
    if (isPlaying) {
        startButton.innerHTML = "START";
    } else {
        startButton.innerHTML = "STOP";
    }
    isPlaying = !isPlaying;
});