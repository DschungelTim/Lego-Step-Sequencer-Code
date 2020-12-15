import numpy as np
import cv2

# Wertebereich Hue: 0-180, Sat: 0-255
# [Hue_min, Hue_max, Sat_min, Sat_max]
gruen = [60, 90, 153, 255]
#blau = [100, 120, 204, 255]
rot = [160, 190, 190, 245]
orange = [0, 15, 130, 210]
ecke = [100, 120, 204, 255]

# Koordinateneckpunkte initialisieren
x0 = 0
x1 = 0
y0 = 0
y1 = 0

# Filtergröße Medianfilter
kSize = 7
# Kernel für Closing-Filter
kernelClosing = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
# Kernel für Opening Filter
kernelOpening = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))

#kernel für Erosion Filter
kernelErosion = np.ones((7,7), np.uint8)

# Funktion, um Masken zu erstellen und durch Filter zu verbessern
def Masken(hue_min, hue_max, sat_min, sat_max) :
    mask_h = cv2.inRange(h, hue_min, hue_max)
    mask_s = cv2.inRange(s, sat_min, sat_max)
    mask = cv2.multiply(mask_h, mask_s)
    mask = cv2.medianBlur(mask, kSize)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernelOpening)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernelClosing)
    mask = cv2.erode(mask, kernelErosion, iterations=2)
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

def PinKoord (SPunktarray) :
    dx = x1 - x0
    dy = y1 - y0
    for i in range(0, len(SPunktarray)) :
        Y = SPunktarray [i] [0]
        X = SPunktarray [i] [1]
        for i in range (0, 10) :
            if (x0 + (i/10) * dx) < X < (x1 - ((9-i)/10) * dx) :
                print (i+1)
        for i in range (0, 4) :
            if (y0 + (i/4) * dy) < Y < (y1 -((3 - i)/4) * dy) :
                print (i+1)

# Webcam öffnen
cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    # Bild in HSV splitten
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

        # Eckpunkte des Koordinatensystems berechnen
    mask_ecke = Masken(ecke[0], ecke[1], ecke[2], ecke[3])
    center_ecke = Schwerpunkte(mask_ecke)
    if center_ecke[0] [0] < center_ecke [1] [1] :
        y0 = center_ecke[0] [0]
        x0 = center_ecke[0] [1]
        y1 = center_ecke [1] [0]
        x1 = center_ecke [1] [1]
    else :
        y0 = center_ecke [1] [0]
        x0 = center_ecke [1] [1]
        y1 = center_ecke[0] [0]
        x1 = center_ecke[0] [1]

    # Maskenfunktion für jede Farbe aufrufen
    #mask_blau = Masken(blau[0], blau[1], blau[2], blau[3])
    mask_rot = Masken(rot[0], rot[1], rot[2], rot[3])
    mask_gruen = Masken(gruen[0], gruen[1], gruen[2], gruen[3])
    mask_orange = Masken(orange[0], orange[1], orange[2], orange[3]) 

    # Funktionen aufrufen, um Schwerpunkte zu berechen, Ergebis wird als Array gespeichert mit jeweils x,y Koordinate
    #center_blau = Schwerpunkte(mask_blau)
    center_rot = Schwerpunkte(mask_rot)
    center_gruen = Schwerpunkte(mask_gruen)
    center_orange = Schwerpunkte(mask_orange)

    PinKoord (center_rot)

    # Video und Masken anzeigen
    cv2.imshow("Video", frame)
    cv2.imshow("Rot", mask_rot)
    cv2.imshow("Blau", mask_blau)
    cv2.imshow("Grün", mask_gruen)
    cv2.imshow("Orange", mask_orange)
    cv2.imshow("Ecken", mask_ecke)

    if cv2.waitKey(25) != -1:
        break

cap.release()
cv2.destroyAllWindows()