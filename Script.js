let context = new AudioContext();
isPlaying = false;

// leeres Array für Sounds
var audioBuffers = [];

// Variable for cancelling timeOut()
var loopTout;

// Nodes erstellen
let gain = context.createGain();

// setTime, bpm
let tempo = 90; // BPM (beats per minute)
let eighthNoteTime = (60 / tempo) / 2;


// Slider array initialisieren
let sliders = document.getElementsByClassName("slider");

// Array für Felderkennung, 32 Felder wobei 0 aus ist und 1-4 verschiedene Farben
// 0 = aus, 1(basedrum) = red, 2(snaredrum) = green, 3(clap) = hellblau, 4(hihat) = orange, 5(soundtbd) = blau
// Die Reihenfolge ist wie folgt: [1.Zeile1.Spalte, 2.Zeile1.Spalte, 3.Zeile1.Spalte, 4.Zeile1.Spalte, 1.Zeile2.Spalte, usw...]
// Die letzten zwei Felder sind für die Slider, felder[32] Gain von 0-127=0dB-5dB und felder[33] Speed von 0-127=50bpm-178bpm
let felder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 70];


//Farbvariablen
rot = getComputedStyle(document.documentElement).getPropertyValue('--rot');
gruen = getComputedStyle(document.documentElement).getPropertyValue('--gruen');
gelb = getComputedStyle(document.documentElement).getPropertyValue('--gelb');
hellblau = getComputedStyle(document.documentElement).getPropertyValue('--hellblau');
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
            changeColor();
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
            document.getElementById("B" + i).style.backgroundColor = hellblau;
        }
        else if (felder[i] == 4) {
            document.getElementById("B" + i).style.backgroundColor = gelb;
        }
        else if (felder[i] == 5) {
            document.getElementById("B" + i).style.backgroundColor = blau;
        }
    }
}

//Wenn auf ein Feld geklickt wird ändert sich die Farbe
document.querySelector(`#B0`).addEventListener("mouseup", function(e) {
    if (felder[0] == 0) {
        felder[0] = 1;           
    }
    else if (felder[0] == 1) {
        felder[0] = 2;           
    }
    else if (felder[0] == 2) {
        felder[0] = 3;           
    }
    else if (felder[0] == 3) {
        felder[0] = 4;           
    }
    else if (felder[0] == 4) {
        felder[0] = 5;           
    }
    else if (felder[0] == 5) {
        felder[0] = 0;           
    }                 
})
document.querySelector(`#B1`).addEventListener("mouseup", function(e) {
    if (felder[1] == 0) {
        felder[1] = 1;           
    }
    else if (felder[1] == 1) {
        felder[1] = 2;           
    }
    else if (felder[1] == 2) {
        felder[1] = 3;           
    }
    else if (felder[1] == 3) {
        felder[1] = 4;           
    }
    else if (felder[1] == 4) {
        felder[1] = 5;           
    }   
    else if (felder[1] == 5) {
        felder[1] = 0;           
    }                 
})
document.querySelector(`#B2`).addEventListener("mouseup", function(e) {
    if (felder[2] == 0) {
        felder[2] = 1;           
    }
    else if (felder[2] == 1) {
        felder[2] = 2;           
    }
    else if (felder[2] == 2) {
        felder[2] = 3;           
    }
    else if (felder[2] == 3) {
        felder[2] = 4;           
    }
    else if (felder[2] == 4) {
        felder[2] = 5;           
    } 
    else if (felder[2] == 5) {
        felder[2] = 0;           
    }                  
})
document.querySelector(`#B3`).addEventListener("mouseup", function(e) {
    if (felder[3] == 0) {
        felder[3] = 1;           
    }
    else if (felder[3] == 1) {
        felder[3] = 2;           
    }
    else if (felder[3] == 2) {
        felder[3] = 3;           
    }
    else if (felder[3] == 3) {
        felder[3] = 4;           
    }
    else if (felder[3] == 4) {
        felder[3] = 5;           
    }    
    else if (felder[3] == 5) {
        felder[3] = 0;           
    }                 
})
document.querySelector(`#B4`).addEventListener("mouseup", function(e) {
    if (felder[4] == 0) {
        felder[4] = 1;           
    }
    else if (felder[4] == 1) {
        felder[4] = 2;           
    }
    else if (felder[4] == 2) {
        felder[4] = 3;       
    }
    else if (felder[4] == 3) {
        felder[4] = 4;           
    }
    else if (felder[4] == 4) {
        felder[4] = 5;          
    }  
    else if (felder[4] == 5) {
        felder[4] = 0;          
    }                   
})
document.querySelector(`#B5`).addEventListener("mouseup", function(e) {
    if (felder[5] == 0) {
        felder[5] = 1;           
    }
    else if (felder[5] == 1) {
        felder[5] = 2;           
    }
    else if (felder[5] == 2) {
        felder[5] = 3;           
    }
    else if (felder[5] == 3) {
        felder[5] = 4;           
    }
    else if (felder[5] == 4) {
        felder[5] = 5;           
    } 
    else if (felder[5] == 5) {
        felder[5] = 0;           
    }                    
})
document.querySelector(`#B6`).addEventListener("mouseup", function(e) {
    if (felder[6] == 0) {
        felder[6] = 1;           
    }
    else if (felder[6] == 1) {
        felder[6] = 2;           
    }
    else if (felder[6] == 2) {
        felder[6] = 3;           
    }
    else if (felder[6] == 3) {
        felder[6] = 4;           
    }
    else if (felder[6] == 4) {
        felder[6] = 5;           
    }  
    else if (felder[6] == 5) {
        felder[6] = 0;           
    }                 
})
document.querySelector(`#B7`).addEventListener("mouseup", function(e) {
    if (felder[7] == 0) {
        felder[7] = 1;           
    }
    else if (felder[7] == 1) {
        felder[7] = 2;           
    }
    else if (felder[7] == 2) {
        felder[7] = 3;           
    }
    else if (felder[7] == 3) {
        felder[7] = 4;           
    }
    else if (felder[7] == 4) {
        felder[7] = 5;           
    }  
    else if (felder[7] == 5) {
        felder[7] = 0;           
    }    
                    
})
document.querySelector(`#B8`).addEventListener("mouseup", function(e) {
    if (felder[8] == 0) {
        felder[8] = 1;           
    }
    else if (felder[8] == 1) {
        felder[8] = 2;           
    }
    else if (felder[8] == 2) {
        felder[8] = 3;           
    }
    else if (felder[8] == 3) {
        felder[8] = 4;           
    }
    else if (felder[8] == 4) {
        felder[8] = 0;           
    }    
    else if (felder[8] == 5) {
        felder[8] = 5;           
    }                 
})
document.querySelector(`#B9`).addEventListener("mouseup", function(e) {
    if (felder[9] == 0) {
        felder[9] = 1;           
    }
    else if (felder[9] == 1) {
        felder[9] = 2;           
    }
    else if (felder[9] == 2) {
        felder[9] = 3;           
    }
    else if (felder[9] == 3) {
        felder[9] = 4;           
    }
    else if (felder[9] == 4) {
        felder[9] = 5;           
    }   
    else if (felder[9] == 5) {
        felder[9] = 0;           
    }                   
})
document.querySelector(`#B10`).addEventListener("mouseup", function(e) {
    if (felder[10] == 0) {
        felder[10] = 1;           
    }
    else if (felder[10] == 1) {
        felder[10] = 2;           
    }
    else if (felder[10] == 2) {
        felder[10] = 3;           
    }
    else if (felder[10] == 3) {
        felder[10] = 4;           
    }
    else if (felder[10] == 4) {
        felder[10] = 5;           
    }
    else if (felder[10] == 5) {
        felder[10] = 0;           
    }    
})
document.querySelector(`#B11`).addEventListener("mouseup", function(e) {
    if (felder[11] == 0) {
        felder[11] = 1;           
    }
    else if (felder[11] == 1) {
        felder[11] = 2;           
    }
    else if (felder[11] == 2) {
        felder[11] = 3;           
    }
    else if (felder[11] == 3) {
        felder[11] = 4;           
    }
    else if (felder[11] == 4) {
        felder[11] = 5;           
    }      
    else if (felder[11] == 5) {
        felder[11] = 0;           
    }                  
})
document.querySelector(`#B12`).addEventListener("mouseup", function(e) {
    if (felder[12] == 0) {
        felder[12] = 1;           
    }
    else if (felder[12] == 1) {
        felder[12] = 2;           
    }
    else if (felder[12] == 2) {
        felder[12] = 3;           
    }
    else if (felder[12] == 3) {
        felder[12] = 4;           
    }
    else if (felder[12] == 4) {
        felder[12] = 5;           
    }   
    else if (felder[12] == 5) {
        felder[12] = 0;           
    }                       
})
document.querySelector(`#B13`).addEventListener("mouseup", function(e) {
    if (felder[13] == 0) {
        felder[13] = 1;           
    }
    else if (felder[13] == 1) {
        felder[13] = 2;           
    }
    else if (felder[13] == 2) {
        felder[13] = 3;           
    }
    else if (felder[13] == 3) {
        felder[13] = 4;           
    }
    else if (felder[13] == 4) {
        felder[13] = 5;           
    }  
    else if (felder[13] == 5) {
        felder[13] = 0;           
    }                      
})
document.querySelector(`#B14`).addEventListener("mouseup", function(e) {
    if (felder[14] == 0) {
        felder[14] = 1;           
    }
    else if (felder[14] == 1) {
        felder[14] = 2;           
    }
    else if (felder[14] == 2) {
        felder[14] = 3;           
    }
    else if (felder[14] == 3) {
        felder[14] = 4;           
    }
    else if (felder[14] == 4) {
        felder[14] = 5;           
    } 
    else if (felder[14] == 5) {
        felder[14] = 0;           
    }                    
})
document.querySelector(`#B15`).addEventListener("mouseup", function(e) {
    if (felder[15] == 0) {
        felder[15] = 1;           
    }
    else if (felder[15] == 1) {
        felder[15] = 2;           
    }
    else if (felder[15] == 2) {
        felder[15] = 3;           
    }
    else if (felder[15] == 3) {
        felder[15] = 4;           
    }
    else if (felder[15] == 4) {
        felder[15] = 5;           
    }   
    else if (felder[15] == 5) {
        felder[15] = 0;           
    }                    
})
document.querySelector(`#B16`).addEventListener("mouseup", function(e) {
    if (felder[16] == 0) {
        felder[16] = 1;           
    }
    else if (felder[16] == 1) {
        felder[16] = 2;           
    }
    else if (felder[16] == 2) {
        felder[16] = 3;           
    }
    else if (felder[16] == 3) {
        felder[16] = 4;           
    }
    else if (felder[16] == 4) {
        felder[16] = 5;           
    }      
    else if (felder[16] == 5) {
        felder[16] = 0;           
    }                 
})
document.querySelector(`#B17`).addEventListener("mouseup", function(e) {
    if (felder[17] == 0) {
        felder[17] = 1;           
    }
    else if (felder[17] == 1) {
        felder[17] = 2;           
    }
    else if (felder[17] == 2) {
        felder[17] = 3;           
    }
    else if (felder[17] == 3) {
        felder[17] = 4;           
    }
    else if (felder[17] == 4) {
        felder[17] = 5;           
    }    
    else if (felder[17] == 5) {
        felder[17] = 0;           
    }                  
})
document.querySelector(`#B18`).addEventListener("mouseup", function(e) {
    if (felder[18] == 0) {
        felder[18] = 1;           
    }
    else if (felder[18] == 1) {
        felder[18] = 2;           
    }
    else if (felder[18] == 2) {
        felder[18] = 3;           
    }
    else if (felder[18] == 3) {
        felder[18] = 4;           
    }
    else if (felder[18] == 4) {
        felder[18] = 5;           
    }     
    else if (felder[18] == 5) {
        felder[18] = 0;           
    }                  
})
document.querySelector(`#B19`).addEventListener("mouseup", function(e) {
    if (felder[19] == 0) {
        felder[19] = 1;           
    }
    else if (felder[19] == 1) {
        felder[19] = 2;           
    }
    else if (felder[19] == 2) {
        felder[19] = 3;           
    }
    else if (felder[19] == 3) {
        felder[19] = 4;           
    }
    else if (felder[19] == 4) {
        felder[19] = 5;           
    }    
    else if (felder[19] == 5) {
        felder[19] = 0;           
    }                
})
document.querySelector(`#B20`).addEventListener("mouseup", function(e) {
    if (felder[20] == 0) {
        felder[20] = 1;           
    }
    else if (felder[20] == 1) {
        felder[20] = 2;           
    }
    else if (felder[20] == 2) {
        felder[20] = 3;           
    }
    else if (felder[20] == 3) {
        felder[20] = 4;           
    }
    else if (felder[20] == 4) {
        felder[20] = 5;           
    }      
    else if (felder[20] == 5) {
        felder[20] = 0;           
    }                      
})
document.querySelector(`#B21`).addEventListener("mouseup", function(e) {
    if (felder[21] == 0) {
        felder[21] = 1;           
    }
    else if (felder[21] == 1) {
        felder[21] = 2;           
    }
    else if (felder[21] == 2) {
        felder[21] = 3;           
    }
    else if (felder[21] == 3) {
        felder[21] = 4;           
    }
    else if (felder[21] == 4) {
        felder[21] = 5;           
    }        
    else if (felder[21] == 5) {
        felder[21] = 0;           
    }                
})
document.querySelector(`#B22`).addEventListener("mouseup", function(e) {
    if (felder[22] == 0) {
        felder[22] = 1;           
    }
    else if (felder[22] == 1) {
        felder[22] = 2;           
    }
    else if (felder[22] == 2) {
        felder[22] = 3;           
    }
    else if (felder[22] == 3) {
        felder[22] = 4;           
    }
    else if (felder[22] == 4) {
        felder[22] = 5;           
    }       
    else if (felder[22] == 5) {
        felder[22] = 0;           
    }                
})
document.querySelector(`#B23`).addEventListener("mouseup", function(e) {
    if (felder[23] == 0) {
        felder[23] = 1;           
    }
    else if (felder[23] == 1) {
        felder[23] = 2;           
    }
    else if (felder[23] == 2) {
        felder[23] = 3;           
    }
    else if (felder[23] == 3) {
        felder[23] = 4;           
    }
    else if (felder[23] == 4) {
        felder[23] = 5;           
    }         
    else if (felder[23] == 5) {
        felder[23] = 0;           
    }               
})
document.querySelector(`#B24`).addEventListener("mouseup", function(e) {
    if (felder[24] == 0) {
        felder[24] = 1;           
    }
    else if (felder[24] == 1) {
        felder[24] = 2;           
    }
    else if (felder[24] == 2) {
        felder[24] = 3;           
    }
    else if (felder[24] == 3) {
        felder[24] = 4;           
    }
    else if (felder[24] == 4) {
        felder[24] = 5;           
    }            
    else if (felder[24] == 5) {
        felder[24] = 0;           
    }           
})
document.querySelector(`#B25`).addEventListener("mouseup", function(e) {
    if (felder[25] == 0) {
        felder[25] = 1;           
    }
    else if (felder[25] == 1) {
        felder[25] = 2;           
    }
    else if (felder[25] == 2) {
        felder[25] = 3;           
    }
    else if (felder[25] == 3) {
        felder[25] = 4;           
    }
    else if (felder[25] == 4) {
        felder[25] = 5;           
    }       
    else if (felder[25] == 5) {
        felder[25] = 0;           
    }              
})
document.querySelector(`#B26`).addEventListener("mouseup", function(e) {
    if (felder[26] == 0) {
        felder[26] = 1;           
    }
    else if (felder[26] == 1) {
        felder[26] = 2;           
    }
    else if (felder[26] == 2) {
        felder[26] = 3;           
    }
    else if (felder[26] == 3) {
        felder[26] = 4;           
    }
    else if (felder[26] == 4) {
        felder[26] = 5;           
    }   
    else if (felder[26] == 5) {
        felder[26] = 0;           
    }                  
})
document.querySelector(`#B27`).addEventListener("mouseup", function(e) {
    if (felder[27] == 0) {
        felder[27] = 1;           
    }
    else if (felder[27] == 1) {
        felder[27] = 2;           
    }
    else if (felder[27] == 2) {
        felder[27] = 3;           
    }
    else if (felder[27] == 3) {
        felder[27] = 4;           
    }
    else if (felder[27] == 4) {
        felder[27] = 5;           
    }   
    else if (felder[27] == 5) {
        felder[27] = 0;           
    }                      
})
document.querySelector(`#B28`).addEventListener("mouseup", function(e) {
    if (felder[28] == 0) {
        felder[28] = 1;           
    }
    else if (felder[28] == 1) {
        felder[28] = 2;           
    }
    else if (felder[28] == 2) {
        felder[28] = 3;           
    }
    else if (felder[28] == 3) {
        felder[28] = 4;           
    }
    else if (felder[28] == 4) {
        felder[28] = 5;           
    }     
    else if (felder[28] == 5) {
        felder[28] = 0;           
    }                  
})
document.querySelector(`#B29`).addEventListener("mouseup", function(e) {
    if (felder[29] == 0) {
        felder[29] = 1;           
    }
    else if (felder[29] == 1) {
        felder[29] = 2;           
    }
    else if (felder[29] == 2) {
        felder[29] = 3;           
    }
    else if (felder[29] == 3) {
        felder[29] = 4;           
    }
    else if (felder[29] == 4) {
        felder[29] = 5;           
    }          
    else if (felder[29] == 5) {
        felder[29] = 0;           
    }                   
})
document.querySelector(`#B30`).addEventListener("mouseup", function(e) {
    if (felder[30] == 0) {
        felder[30] = 1;           
    }
    else if (felder[30] == 1) {
        felder[30] = 2;           
    }
    else if (felder[30] == 2) {
        felder[30] = 3;           
    }
    else if (felder[30] == 3) {
        felder[30] = 4;           
    }
    else if (felder[30] == 4) {
        felder[30] = 5;           
    }      
    else if (felder[30] == 5) {
        felder[30] = 0;           
    }                  
})
document.querySelector(`#B31`).addEventListener("mouseup", function(e) {
    if (felder[31] == 0) {
        felder[31] = 1;           
    }
    else if (felder[31] == 1) {
        felder[31] = 2;           
    }
    else if (felder[31] == 2) {
        felder[31] = 3;           
    }
    else if (felder[31] == 3) {
        felder[31] = 4;           
    }
    else if (felder[31] == 4) {
        felder[31] = 5;           
    }  
    else if (felder[31] == 5) {
        felder[31] = 0;           
    }                   
})

// Audiosound laden
for (let i = 0; i < 6; i++)
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
    else if (color.trim() === hellblau.trim()) {
        return audioBuffers[3];
    }
    else if (color.trim() === gelb.trim()) {
        return audioBuffers[4];
    }
    else if (color.trim() === blau.trim()) {
        return audioBuffers[5];
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

        setTimeout(function(){ 
            document.getElementById("one").style.opacity = 0.7;
        }, (0 * eighthNoteTime));   
        setTimeout(function(){ 
            document.getElementById("two").style.opacity = 0.7;
            document.getElementById("one").style.opacity = 1;
        }, (1000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("three").style.opacity = 0.7;
            document.getElementById("two").style.opacity = 1;
        }, (2000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("four").style.opacity = 0.7;
            document.getElementById("three").style.opacity = 1;
        }, (3000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("five").style.opacity = 0.7;
            document.getElementById("four").style.opacity = 1;
        }, (4000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("six").style.opacity = 0.7;
            document.getElementById("five").style.opacity = 1;
        }, (5000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("seven").style.opacity = 0.7;
            document.getElementById("six").style.opacity = 1;
        }, (6000 * eighthNoteTime)); 
        setTimeout(function(){ 
            document.getElementById("eight").style.opacity = 0.7;
            document.getElementById("seven").style.opacity = 1;
        }, (7000 * eighthNoteTime));  
        setTimeout(function(){ 
            document.getElementById("eight").style.opacity = 1;
        }, (8000 * eighthNoteTime)); 
         
        eight = eight + 1;
        if (eight == 8) {
            eight = 0;
        }
        
    }
}

// Gets called when we press Start and forewards to the loopTimeout()
function startTimeout(){
    setTimeout(function () {
        if (isPlaying){
            playBeat();
        }
        loopTimeout();
    }, 40);
};

// Calls our playBeat() function every eightNoteTime*8*1000 seconds
function loopTimeout(){
    loopTout = setTimeout(function () {
        if (isPlaying){
            playBeat();
        }
        loopTimeout();
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
    //console.log(gain.gain.value);
    document.querySelector("#gainOutput").innerHTML = gainMIDI + " dB";
    document.getElementById("gainSlider").value = gainMIDI*100;

    eighthNoteTime = (60 / (speedMIDI+50)) / 2;
    //console.log(eighthNoteTime);
    document.querySelector("#speedOutput").innerHTML = speedMIDI+50 + " bpm";
    document.getElementById("speedSlider").value = speedMIDI + 50;
}

// Die sollte dann immer aufgerufen werden, wenn eine MIDI Note kommt, oder ein div angeklickt wird 
// Wenn ein Feld angeklickt wird, wird die changeColor() Funktion aufgerufen
// WICHTIG: Nur ein setInterval pro js wahrscheinlich möglich (nicht 100% sicher)
var felders = document.getElementsByClassName("Feld");
for (var i = 0; i < felders.length; i++) {
    felders[i].addEventListener("mouseup", function(e) {
        changeColor();
    });
}


// Functionallity for the StartStop Button
startButton.addEventListener("click", function (e) {
    if (isPlaying) {
        startButton.innerHTML = "START";
        clearTimeout(loopTout);
    } else {
        startButton.innerHTML = "STOP";
        startTimeout()
    }
    isPlaying = !isPlaying;
});