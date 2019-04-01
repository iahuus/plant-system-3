import serial

try:
    arduino = serial.Serial("/dev/ttyUSB0", timeout=1)
except:
    print("check the port")
    
rawdata = ""

def get_humidity():
    while True:
        data = arduino.readline()
        if data != b'':
            rawdata = (str(data.decode("utf-8")))
        else:
            break
    if rawdata == "":
        rawdata = 0
    return int(rawdata)
    
