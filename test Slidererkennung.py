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
                if i == 9 or i == 10:
                    Wert = ((Y-y0)/dy)*127
                    Wert = round(Wert)   
                    sendMidiNote(i+40, Wert) #i+40, damit Note gesendet wird, die sehr unterschiedlich zu "normalen Feldern" ist
                if 0 <= i <= 8:
                    xFelder = yxFelder[1]
                    xFelder.append(i+1)   
                    for i in range (0, 4) :
                        if (y0 + (i/4) * dy) < Y <= (y1 -((3 - i)/4) * dy) :
                            yFelder = yxFelder[0]
                            yFelder.append(i+1)
    return yxFelder

