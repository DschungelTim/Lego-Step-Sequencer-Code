import numpy as np
import cv2
import rtmidi
import mido

hue_gruen = 
sat_gruen =
hue_blau =
sat_blau =
hue_rot = 
sat_rot =
hue_orange =
sat_orange =


# Midi Ports suchen
print("MIDI output ports: ", mido.get_output_names())
#midiOutput = mido.open_output("LoopBe Internal MIDI 1")

# Webcam öffnen
cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    # Bild in HSV splitten
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # Masken erstellen und Farbbereich festlegen
    mask_h_ = cv2.inRange(h, 9 , 19)
    mask_s = cv2.inRange(s, 150, 230)
    mask = cv2.multiply(mask_h, mask_s)