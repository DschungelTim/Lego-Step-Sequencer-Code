import numpy as np
import cv2

cap = cv2.VideoCapture(0)

# Hauptschleife während Kamera geöffnet ist
while cap.isOpened():
    ret, frame = cap.read()

    cv2.imshow("Video", frame)

    if cv2.waitKey(25) != -1:
        break

cap.release()
cv2.destroyAllWindows()