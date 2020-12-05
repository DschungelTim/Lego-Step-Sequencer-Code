import numpy as np
import cv2
#import rtmidi
#import mido

# Wertebereich Hue: 0-180, Sat: 0-255
hue_gruen = 75
hue_max_gruen = 90
sat_gruen = 235 
sat_max_gruen = 255
hue_blau = 104 
hue_max_blau = 120
sat_blau = 248 
sat_max_blau = 255
hue_rot = 165 
hue_max_rot = 185
sat_rot = 200 
sat_max_rot = 235
hue_orange = 5
hue_max_orange = 40
sat_orange = 100
sat_max_orange = 200

# Filtergröße Medianfilter
kSize = 5

# Kernel für Closing-Filter
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10,10))

# Midi Ports suchen
#print("MIDI output ports: ", mido.get_output_names())
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
    mask_h_blau = cv2.inRange(h, hue_blau, hue_max_blau)
    mask_s_blau = cv2.inRange(s, sat_blau, sat_max_blau)
    mask_blau = cv2.multiply(mask_h_blau, mask_s_blau)
    mask_blau = cv2.medianBlur(mask_blau, kSize)
    mask_blau = cv2.morphologyEx(mask_blau, cv2.MORPH_CLOSE, kernel)

    mask_h_rot = cv2.inRange(h, hue_rot, hue_max_rot)
    mask_s_rot = cv2.inRange(s, sat_rot, sat_max_rot)
    mask_rot = cv2.multiply(mask_h_rot, mask_s_rot)
    mask_rot = cv2.medianBlur(mask_rot, kSize)
    mask_rot = cv2.morphologyEx(mask_rot, cv2.MORPH_CLOSE, kernel)

    mask_h_gruen = cv2.inRange(h, hue_gruen, hue_max_gruen)
    mask_s_gruen = cv2.inRange(s, sat_gruen, sat_max_gruen)
    mask_gruen = cv2.multiply(mask_h_gruen, mask_s_gruen)
    mask_gruen = cv2.medianBlur(mask_gruen, kSize)
    mask_gruen = cv2.morphologyEx(mask_gruen, cv2.MORPH_CLOSE, kernel)

    mask_h_orange = cv2.inRange(h, hue_orange, hue_max_orange)
    mask_s_orange = cv2.inRange(s, sat_orange, sat_max_orange)
    mask_orange = cv2.multiply(mask_h_orange, mask_s_orange)
    mask_orange = cv2.medianBlur(mask_orange, kSize)
    mask_orange = cv2.morphologyEx(mask_orange, cv2.MORPH_CLOSE, kernel)

    cv2.imshow("Video", frame)
    cv2.imshow("Rot", mask_rot)
    cv2.imshow("Blau", mask_blau)
    cv2.imshow("Grün", mask_gruen)
    cv2.imshow("Orange", mask_orange)


    if cv2.waitKey(25) != -1:
        break

cap.release()
cv2.destroyAllWindows()