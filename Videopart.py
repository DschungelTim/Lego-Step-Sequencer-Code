import numpy as np
import cv2
import rtmidi
import mido
import time

# Midi Port
midiOutput = mido.open_output("LoopBe Internal MIDI 1")

# Wertebereich Hue: 0-180, Sat: 0-255
# [Hue_min, Hue_max, Sat_min, Sat_max]
gruen = [60, 90, 153, 255]
hellblau = [80, 105, 230, 255]
rot = [160, 190, 190, 245]
orange = [0, 15, 130, 210]
ecke = [100, 120, 204, 255]
blau = [100, 120, 204, 255]

# Koordinateneckpunkte initialisieren
x0 = 0
x1 = 0
y0 = 0
y1 = 0

# Array für Senden der Daten über Midi
senden = []

# dict für javascriptfelder
felderDict = {
    (1, 1) : 0,
    (2, 1) : 1,
    (3, 1) : 2,
    (4, 1) : 3,
    (1, 2) : 4,
    (2, 2) : 5,
    (3, 2) : 6,
    (4, 2) : 7,
    (1, 3) : 8,
    (2, 3) : 9,
    (3, 3) : 10,
    (4, 3) : 11,
    (1, 4) : 12,
    (2, 4) : 13,
    (3, 4) : 14,
    (4, 4) : 15,
    (1, 5) : 16,
    (2, 5) : 17,
    (3, 5) : 18,
    (4, 5) : 19,
    (1, 6) : 20,
    (2, 6) : 21,
    (3, 6) : 22,
    (4, 6) : 23,
    (1, 7) : 24,
    (2, 7) : 25,
    (3, 7) : 26,
    (4, 7) : 27,
    (1, 8) : 28,
    (2, 8) : 29,
    (3, 8) : 30,
    (4, 8) : 31
}

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
            pass
    return centres

# Funktion, um die erkannten x- und y-Koordinaten in unser definiertes Raster einzuordnen.
def PinKoord (SPunktarray) :
    dx = x1 - x0
    dy = y1 - y0
    yxFelder = [[], []]
    Wert = 0
    for i in range(0, len(SPunktarray)) :
        X = SPunktarray [i] [0]
        Y = SPunktarray [i] [1]
        for i in range (0, 10) :
            if (x0 + (i/10) * dx) < X <= (x1 - ((9-i)/10) * dx) :
                if i == 8 or i == 9:
                    Wert = ((Y-127)/192)*127
                    Wert = round(Wert)   
                    sendMidiNote(i+24, 127-Wert) #i+40, damit Note gesendet wird, die sehr unterschiedlich zu "normalen Feldern" ist
                if 0 <= i <= 7:
                    xFelder = yxFelder[1]
                    xFelder.append(i+1)   
                    for i in range (0, 4) :
                        if (y0 + (i/4) * dy) < Y <= (y1 -((3 - i)/4) * dy) :
                            yFelder = yxFelder[0]
                            yFelder.append(i+1)
    return yxFelder

# Das senden Array wird zurückgesetzt und ner mit Werten von 0 - 31 bestückt.
# Aus dem senden Array werden dann alle gesendeten herausgelöscht (mit pop),
# danach wird mit den übriggebliebenen eine MidiNote mit velocity 0, also kein Stein auf dem Feld, gesendet.
def sendMIDIContainer():
    global senden
    senden = []
    for i in range(32):
        senden.append(0)

    # Ruft sendMIDI für die jeweiligen Farbarrays auf
    sendMIDI(felder_hellblau)
    sendMIDI(felder_rot)
    sendMIDI(felder_gruen)
    sendMIDI(felder_orange)
    sendMIDI(felder_blau)

    for i in range(len(senden)):
        sendMidiNote(i, senden[i])

# Definiert wie eine Midi Note gesendet werden kann
def sendMidiNote(note, velocity):
    message = mido.Message('note_on', note=note, velocity=velocity)
    midiOutput.send(message)

# Schaut welches Array im Argument steht und sendet dann die dementsprechende Midi Note
# Über das Wörterbuch werden die hier errechneten Werte in die vom Javascript erwarteten umgerechnet
# Die Zahl 1-4 gibt die Farbe des Steins an
# Desweiteren wird aus dem notsenden Array die jeweils erkannte stelle gelöscht.
def sendMIDI (felder):
    for i in range(len(felder[0])):
        if felder == felder_hellblau:
            senden[felderDict[(felder[0][i], felder[1][i])]] = 3
            
        if felder == felder_rot:
            senden[felderDict[(felder[0][i], felder[1][i])]] = 1
                

        if felder == felder_gruen:
            senden[felderDict[(felder[0][i], felder[1][i])]] = 2
                

        if felder == felder_orange:
            senden[felderDict[(felder[0][i], felder[1][i])]] = 4
        
        if felder == felder_blau:
            senden[felderDict[(felder[0][i], felder[1][i])]] = 5
                

counter = 0
# Webcam öffnen
cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    # Bild in HSV splitten
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

        # Eckpunkte des Koordinatensystems berechnen
    try:
        if counter == 0:
            mask_ecke = Masken(ecke[0], ecke[1], ecke[2], ecke[3])
            center_ecke = Schwerpunkte(mask_ecke)
            if center_ecke[0] [0] < center_ecke [1] [1] :
                x0 = center_ecke[0] [0]
                y0 = center_ecke[0] [1]
                x1 = center_ecke [1] [0]
                y1 = center_ecke [1] [1]
            else :
                x0 = center_ecke [1] [0]
                y0 = center_ecke [1] [1]
                x1 = center_ecke[0] [0]
                y1 = center_ecke[0] [1]

        # Maskenfunktion für jede Farbe aufrufen
        mask_hellblau = Masken(hellblau[0], hellblau[1], hellblau[2], hellblau[3])
        mask_rot = Masken(rot[0], rot[1], rot[2], rot[3])
        mask_gruen = Masken(gruen[0], gruen[1], gruen[2], gruen[3])
        mask_orange = Masken(orange[0], orange[1], orange[2], orange[3]) 
        mask_blau = Masken(blau[0], blau[1], blau[2], blau[3])

        # Funktionen aufrufen, um Schwerpunkte zu berechen, Ergebis wird als Array gespeichert mit jeweils x,y Koordinate
        center_hellblau = Schwerpunkte(mask_hellblau)
        center_rot = Schwerpunkte(mask_rot)
        center_gruen = Schwerpunkte(mask_gruen)
        center_orange = Schwerpunkte(mask_orange)
        center_blau = Schwerpunkte(mask_blau)

        # Funktion aufrufen, um die center_daten in 2D Array mit informationen über "aktivierte" Felder umzuwandeln
        # Für drei rote Steine könnte dann zB. ein solches Array mit y und x Felderzahlen herauskommen:
        #   felder_rot = [[1, 4], [1, 8]] für zwei Steine ganz oben links und ganz unten rechts.
        # felder =[[die y-felder zahlen von 1-4], [die x-felder zahlen von 1-8]]
        felder_hellblau = PinKoord (center_hellblau)
        felder_rot = PinKoord (center_rot)
        felder_gruen = PinKoord (center_gruen)
        felder_orange = PinKoord (center_orange)
        felder_blau = PinKoord (center_blau)
        
        # Hierüber werden alle Midi Sendungen geregelt
        sendMIDIContainer()
        time.sleep(0.1)
        counter = counter + 1
    except:
        pass
    # Video und Masken anzeigen
    cv2.imshow("Video", frame)
    cv2.imshow("Rot", mask_rot)
    cv2.imshow("Hellblau", mask_hellblau)
    cv2.imshow("Grün", mask_gruen)
    cv2.imshow("Orange", mask_orange)
    cv2.imshow("Ecken", mask_ecke)
    cv2.imshow("Blau", mask_blau)

    if cv2.waitKey(25) != -1:
        break

cap.release()
cv2.destroyAllWindows()
