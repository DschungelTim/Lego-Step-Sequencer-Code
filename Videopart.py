import numpy as np
import cv2

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

# Funktion, um Masken zu erstellen und durch Filter zu verbessern
def Masken(hue_min, hue_max, sat_min, sat_max) :
    mask_h = cv2.inRange(h, hue_min, hue_max)
    mask_s = cv2.inRange(s, sat_min, sat_max)
    mask = cv2.multiply(mask_h, mask_s)
    mask = cv2.medianBlur(mask, kSize)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    return mask

# Funktion, um die Schwerpunkte der einzelnen Steine zu berechnen
def Schwerpunkte(maske) :
    contours, _ = cv2.findContours(maske, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_L1)
    centres = []
    for i in range(len(contours)):
        try:
            moments = cv2.moments(contours[i])
            centres.append((int(moments['m10']/moments['m00']), int(moments['m01']/moments['m00'])))
        except:
            print("Wups")
    return centres

# Webcam öffnen
cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    # Bild in HSV splitten
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # Maskenfunktion für jede Farbe aufrufen
    mask_blau = Masken(hue_blau, hue_max_blau, sat_blau, sat_max_blau)
    mask_rot = Masken(hue_rot, hue_max_rot, sat_rot, sat_max_rot)
    mask_gruen = Masken(hue_gruen, hue_max_gruen, sat_gruen, sat_max_gruen)
    mask_orange = Masken(hue_orange, hue_max_orange, sat_orange, sat_max_orange)

    # Funktionen aufrufen, um Schwerpunkte zu berechen, Ergebis wird als Array gespeichert mit jeweils x,y Koordinate
    center_blau = Schwerpunkte(mask_blau)
    center_rot = Schwerpunkte(mask_rot)
    center_gruen = Schwerpunkte(mask_gruen)
    center_orange = Schwerpunkte(mask_orange)

    # Video und Masken anzeigen
    cv2.imshow("Video", frame)
    cv2.imshow("Rot", mask_rot)
    cv2.imshow("Blau", mask_blau)
    cv2.imshow("Grün", mask_gruen)
    cv2.imshow("Orange", mask_orange)

    if cv2.waitKey(25) != -1:
        break

cap.release()
cv2.destroyAllWindows()