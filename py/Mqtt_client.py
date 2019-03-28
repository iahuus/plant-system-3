import paho.mqtt.client as mqtt
import logging
from threading import Thread


class MQTT_Client_1:

    def __init__(self,driver,ch, broker, port,plant_name):
        self._logger = logging.getLogger(__name__)
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.ch = ch
        ch.change_humidity(100)
        # self.plant_name = plant_name
        # self.driver = driver
        # self.driver.send("change_treshhold(600)","humidityCheck")

    def on_connect(self, client, userdata, flags, rc):
        print('on_connect(): {}'.format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print('topic: {}'.format(msg.topic)+ ":\t " + msg.payload.decode("utf-8"))

        # if (msg.topic == "team3/plant/" + self.plant_name):
        #     print(msg.topic + " \n " +  msg.payload)
        print(self.humiditych.tresshold)
        print("team3/plant/" + self.plant_name + "/change_humidity")
        if (msg.topic == "team3/plant/" + self.plant_name + "/change_humidity"):
            print("changing humidity treshhold to " + msg.payload.decode("utf-8"))
            self.humiditych.change_treshhold(600)

            self.humiditych.change_treshhold(int(msg.payload.decode("utf-8")))
            print("Changed treshhold to " + str(msg.payload) + '\n')

    def send_message(self,topic, payload):
        print(topic + "  " + payload)
        self.client.publish(topic,payload)

    def start(self, broker, port):
        print('Connecting to {}:{}'.format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("team3/plant/" + self.plant_name)
        self.client.subscribe("team3/plant/" + self.plant_name + "/change_humidity")
        self.client.publish("team3/plant/", "PLANT EYOOOOO \n\n\n\t\t\t"  + self.plant_name + " IN THE HOUSE")

        try:
            thread = Thread(target=self.client.loop_forever())
            thread.start()
        except KeyboardInterrupt:
            print('Interrupted')
            self.client.disconnect()
