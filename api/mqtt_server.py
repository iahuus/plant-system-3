import paho.mqtt.client as mqtt
import logging
from threading import Thread
import json
from server import *

# TODO: choose proper MQTT broker address
MQTT_BROKER = 'iot.eclipse.org' 
MQTT_PORT = 1883

# # TODO: choose proper topics for communication
# MQTT_TOPIC_INPUT = 'plant/in'
# MQTT_TOPIC_OUTPUT = 'plant/out'

logging.DEBUG  #: Most fine-grained logging, printing everything

class MQTT_Client_2:

    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        print('on_connect(): {}'.format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print('topic: {}'.format(msg.topic)+ ":\t " + msg.payload.decode("utf-8"))

        #splittet med '-'
        if (msg.topic == "team3/plant/humid"):
            id1, pl = msg.payload.decode("utf-8").split("-")
            add_reading(id1, pl)


    def send_message(self,topic, payload):
        print(topic + "  " + payload)
        self.client.publish(topic,payload)

    def start(self, broker, port):

        print('Connecting to {}:{}'.format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("team3/plant/humid")
        self.client.publish("plantEyooooo", "Koblet til")

        try:
            thread = Thread(target=self.client.loop_forever())
            thread.start()
        except KeyboardInterrupt:
            print('Interrupted')
            self.client.disconnect()

