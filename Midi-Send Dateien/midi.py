import rtmidi
import mido
import cv2

# Midi Ports suchen
print("MIDI output ports: ", mido.get_output_names())
midiOutput = mido.open_output("LoopBe Internal MIDI 1")

def sendMidiNote(note, velocity):
	message = mido.Message('note_on', note=note, velocity=velocity)
	midiOutput.send(message)
	
for value in range(128):
	sendMidiNote(7, 1)
	cv2.waitKey(500)