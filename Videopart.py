import numpy as np
import cv2

# Wertebereich Hue: 0-180, Sat: 0-255
# [Hue_min, Hue_max, Sat_min, Sat_max]
gruen = [60, 90, 153, 255]
blau = [100, 120, 204, 255]
rot = [165, 185, 200, 235]
orange = [0, 15, 130, 210]

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

# Webcam öffnen
cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    # Bild in HSV splitten
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # Maskenfunktion für jede Farbe aufrufen
    mask_blau = Masken(blau[0], blau[1], blau[2], blau[3])
    mask_rot = Masken(rot[0], rot[1], rot[2], rot[3])
    mask_gruen = Masken(gruen[0], gruen[1], gruen[2], gruen[3])
    mask_orange = Masken(orange[0], orange[1], orange[2], orange[3])

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