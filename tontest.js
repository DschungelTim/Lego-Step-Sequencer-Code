let context = new AudioContext();

var element = document.getElementById('B4'),
    style = window.getComputedStyle(element),
    color = style.getPropertyValue('background-color');
    document.write (color);

if (color === "rgb(255, 0, 0)") {
    document.querySelector("#startButton").addEventListener("mouseup", function(e){
        let sound = new Audio("/Sounds/sound1.wav");
        let soundNode = context.createMediaElementSource(sound);
        let gainNode = context.createGain();    
        gainNode.gain.value = 0.8;    
        soundNode.connect(gainNode);
        gainNode.connect(context.destination);   
        sound.play();
    });    
    }
    else if (color === "rgb(0, 128, 0)") {
        document.querySelector("#startButton").addEventListener("mouseup", function(e){
            let sound = new Audio("/Sounds/sound2.wav");
            let soundNode = context.createMediaElementSource(sound);
            let gainNode = context.createGain();    
            gainNode.gain.value = 0.8;    
            soundNode.connect(gainNode);
            gainNode.connect(context.destination);   
            sound.play();
        });
        }
        else if (color === "rgb(0, 0, 255)") {
            document.querySelector("#startButton").addEventListener("mouseup", function(e){
                let sound = new Audio("/Sounds/sound3.wav");
                let soundNode = context.createMediaElementSource(sound);
                let gainNode = context.createGain();   
                gainNode.gain.value = 0.8;    
                soundNode.connect(gainNode);
                gainNode.connect(context.destination);  
                sound.play();
            });
            }
            else if (color === "rgb(255, 255, 0)") {
                document.querySelector("#startButton").addEventListener("mouseup", function(e){
                    let sound = new Audio("/Sounds/sound4.wav");
                    let soundNode = context.createMediaElementSource(sound);
                    let gainNode = context.createGain();   
                    gainNode.gain.value = 0.8;   
                    soundNode.connect(gainNode);
                    gainNode.connect(context.destination);     
                    sound.play();
                });
                }

//clicktest
let felder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
rot = getComputedStyle(document.documentElement).getPropertyValue('--rot');
gruen = getComputedStyle(document.documentElement).getPropertyValue('--gruen');
gelb = getComputedStyle(document.documentElement).getPropertyValue('--gelb');
blau = getComputedStyle(document.documentElement).getPropertyValue('--blau');
background = getComputedStyle(document.documentElement).getPropertyValue('--vordergrund');


document.querySelector("#B4").addEventListener("mouseup", function (e) {
    document.getElementById('B4').style.backgroundColor = rot;
    document.querySelector("#B4").addEventListener("mouseup", function (e) {
        document.getElementById('B4').style.backgroundColor = gruen;
        document.querySelector("#B4").addEventListener("mouseup", function (e) {
            document.getElementById('B4').style.backgroundColor = blau;
            document.querySelector("#B4").addEventListener("mouseup", function (e) {
                document.getElementById('B4').style.backgroundColor = gelb;
            });
        });
    });
});

var element = document.getElementById('B' + (Spalte + Zeile)),

element.addEventListener("click", function (e) {
    var i;
    for (i = 0; i < 32; i++) {
        if (felder[i] == 0) {
        }
        else if (felder[i] == 1) {
        }
        else if (felder[i] == 2) {
        }
        else if (felder[i] == 3) {
        }
        else if (felder[i] == 4) {
        }
        
    
});





