Farben = ["blau", "rot", "gruen", "orange"]
for i in Farben:
    x = "mask_h_" + i 
    x = 25

print(x)



    mask_h_blau = cv2.inRange(h, hue_blau , hue_blau_max)
    mask_s_blau = cv2.inRange(s, sat_blau, sat_blau_max)
    mask_blau = cv2.multiply(mask_h_blau, mask_s_blau)

    mask_h_rot = cv2.inRange(h, hue_rot , hue_rot_max)
    mask_s_rot = cv2.inRange(s, sat_rot, sat_rot_max)
    mask_rot = cv2.multiply(mask_h_rot, mask_s_rot)