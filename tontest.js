
let context = new AudioContext();

var element = document.getElementById('B1_2'),
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


