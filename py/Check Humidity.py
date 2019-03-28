import paho.mqtt.client as mqtt
import logging
from threading import Thread
import json
from stmpy import Machine, Driver
import random

# TODO: choose proper MQTT broker address
MQTT_BROKER = 'localhost'  # 10.22.212.1
MQTT_PORT = 1883

# # TODO: choose proper topics for communication
# MQTT_TOPIC_INPUT = 'plant/in'
# MQTT_TOPIC_OUTPUT = 'plant/out'

logging.DEBUG  #: Most fine-grained logging, printing everything


# logging.INFO:  Only the most important informational log items
# logging.WARN:  Show only warnings and errors.
# logging.ERROR: Show only error messages.

class HumidityChecker:
    def __init__(self, plant_name, treshhold):
        self._logger = logging.getLogger(__name__)
        logging.basicConfig(level = logging.INFO)
        print('logging under name {}.'.format(__name__))
        self._logger.info('Starting humiditychecker')
        self._logger.debug("TEST")
        self.plant_name = plant_name
        self.treshhold = treshhold
        myclient = MQTT_Client_1()
        self.mqtt_client = myclient.client
        self.watering_machine = WateringMachine(plant_name, self)


        t0 = {'source': 'initial',
              'target': 'check_idle'}
        t1 = {'trigger': 't',
              'source': 'check_idle',
              'function': self.water_checking}
        t2 = {'trigger': 'watering_done',
              'source': 'watering_plant',
              'effect' : 'stop_timer("fallback");logg("Watering done"); ',
              'target': 'check_idle'}
        t3 = {'trigger': 'fallback',
              'source': 'watering_plant',
              'target': 'check_idle'}

        check_idle = {'name': 'check_idle',
                      'entry': 'start_timer("t",2000);logg("State: check_idle");'}
        watering_plant = {'name': 'watering_plant',
                          'entry': 'start_timer("fallback",20000);sendToDriver("water","Watering");logg("State: watering_plant")'}

        humidity_machine = Machine(transitions=[t0, t1, t2, t3], obj=self,
                                   states=[check_idle, watering_plant],
                                   name='humidityCheck')

        self.stm = humidity_machine
        broker, port = MQTT_BROKER, MQTT_PORT
        driver = Driver()
        driver.add_machine(self.stm)
        self.driver = driver
        myclient.stm = self.stm
        myclient.stm_driver = driver
        self.driver.add_machine(self.watering_machine.stm)
        driver.start()
        myclient.start(broker, port)




    def water_checking(self):
        self.logg("checking humdity")
        humidity = self.mesure_humidity()

        self.mqtt_client.publish("plant/" + self.plant_name, str(humidity))
        self.logg("humidity: " + str(humidity) + " treshhold:" + str(self.treshhold))
        if (humidity <= self.treshhold):
            self.mqtt_client.publish("plant/" + self.plant_name, "humidity low")
            return 'watering_plant'
        else:
            return 'check_idle'
    def sendToDriver(self, action, machine):
        self.driver.send(action,machine)
    def send_mqtt(self,topic, message):
        self.mqtt_client.publish(topic, message)

    def logg(self, info):
        self._logger.info(info)

    def mesure_humidity(self):
        return 200 #random.randint(1, 1000)

    def change_treshhold(self, treshhold):
        self.treshhold = treshhold


class WateringMachine:
    def __init__(self, plant_name, humidityCh):
        self._logger = logging.getLogger(__name__)
        self._logger.warning("Created watering machine")
        self.plant_name = plant_name
        watering_machine = Machine(transitions=[self.t0, self.t1, self.t2], obj=self,
                                   states=[self.not_watering, self.watering_plant],
                                   name='Watering')
        self.stm = watering_machine
        self.humidityCh = humidityCh

    def sendToDriver(self, action, machine):
        self.humidityCh.driver.send(action,machine)

    def water_plant(self):
        self.humidityCh.mqtt_client.publish("plant/" + self.plant_name, "Watering plant")
        # start_water

    def stop_watering(self):
        self.humidityCh.mqtt_client.publish("plant/" + self.plant_name, "Stopped watering plant")
        # stop_water
    def send_mqtt(self, payload):
        self.humidityCh.send_mqtt(self.humidityCh.plant_name,payload)

    # initial transition
    t0 = {'source': 'initial',
          'target': 'not_watering'}

    t1 = {'trigger': 'water',
          'source': 'not_watering',
          'target': 'watering_plant'}

    t2 = {'trigger': 't',
          'source': 'watering_plant',
          'effect' : 'sendToDriver("watering_done","humidityCheck");stop_watering',
          'target': 'not_watering'}

    not_watering = {'name': 'not_watering'}

    watering_plant = {'name': 'watering_plant',
                      'entry': 'water_plant;start_timer("t", 2000)'}


class MQTT_Client_1:

    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        print('on_connect(): {}'.format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print('topic: {}'.format(msg.topic))

        if (msg.topic == "plant/in"):
            print(msg.topic + " \n " +  msg.payload)
            # self.stm_driver.send('buzz', 'quiz')
            # print(str(msg.payload) + '\n')
        if (msg.topic == "plant/change_humidity"):
            self.stm.change_treshhold(int(msg.payload))
            print("Changed treshhold to " + str(msg.payload) + '\n')

    def send_message(self,topic, payload):
        print(topic + "  " + payload)
        self.client.publish(topic,payload)

    def start(self, broker, port):

        print('Connecting to {}:{}'.format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("plant/in")
        self.client.subscribe("plant/change_humidity")
        self.client.publish("plantEyooooo", "Koblet til")

        try:
            thread = Thread(target=self.client.loop_forever())
            thread.start()
        except KeyboardInterrupt:
            print('Interrupted')
            self.client.disconnect()



HumidityChecker("Rose", 300)
