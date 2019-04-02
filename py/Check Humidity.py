import paho.mqtt.client as mqtt
import logging
from threading import Thread
import json
from stmpy import Machine, Driver
import random
from py.Mqtt_client import MQTT_Client_1
from arduino_python import get_humidity
from sense_hat import SenseHat
from py.air_humidity import AirHumidity
"""
Endre humidity ved å sende til topic: "team3/plant/{plant_name}/change_humidity"
Payload skal da være humidity

Sender humidity data på topic "team3/plant/humid"
payload = "{plant_name}:{humidity}

"""


MQTT_BROKER = 'iot.eclipse.org' #"localhost"
MQTT_PORT = 1883


logging.DEBUG  #: Most fine-grained logging, printing everything


# logging.INFO:  Only the most important informational log items
# logging.WARN:  Show only warnings and errors.
# logging.ERROR: Show only error messages.
green = (76, 187, 23)
red = (255,0,0)
yellow = (250,250,0)

class HumidityChecker:
    def __init__(self, plant_name, treshhold):
        self.sense = SenseHat()
        self._logger = logging.getLogger(__name__)
        logging.basicConfig(level = logging.INFO)
        print('logging under name {}.'.format(__name__))
        self._logger.info('Starting humiditychecker')
        self.plant_name = plant_name
        self.treshhold = treshhold
        self.watering_machine = WateringMachine(plant_name, self)
        self.sense.show_message("Hello", text_colour=green)


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
              'effedt' : 'logg("State: check_idle");',
              'target': 'check_idle'}

        check_idle = {'name': 'check_idle',
                      'entry': 'start_timer("t",4000);'}
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
        myclient = MQTT_Client_1(driver,self,MQTT_BROKER, MQTT_PORT,self.plant_name)
        self.mqtt = myclient
        self.mqtt_client = myclient.client
        myclient.stm = self.stm
        myclient.stm_driver = driver
        self.driver.add_machine(self.watering_machine.stm)
        self.airhumid = AirHumidity(self.plant_name,MQTT_BROKER,MQTT_PORT)
        self.driver.add_machine(self.airhumid.stm)
        driver.start()
        myclient.start(broker, port)

    def fill_red(self):
        self.sense.clear(red)
    def fill_green(self):
        self.sense.clear(green)
    def water_checking(self):
        humidity = self.mesure_humidity()
        self.sense.show_message(str(humidity), text_colour=yellow)
        self.mqtt.send_message("team3/plant/humid", str(self.plant_name) + "-" + str(humidity))
        self.logg("humidity: " + str(humidity) + " treshhold:" + str(self.treshhold))
        if (humidity <= self.treshhold):
            self.mqtt_client.publish("team3/plant/" + self.plant_name, "humidity low")
            self.fill_red()
            return 'watering_plant'
        else:
            self.fill_green()
            return 'check_idle'
    def sendToDriver(self, action, machine):
        self.driver.send(action,machine)
    def send_mqtt(self,topic, message):
        self.mqtt_client.publish(topic, message)

    def logg(self, info):
        self._logger.info(info)

    def mesure_humidity(self):
        return get_humidity() # random.randint(1, 1000)

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
        self.humidityCh.mqtt_client.publish("team3/plant/" + self.plant_name, "Watering plant")
        # start_water

    def stop_watering(self):
        self.humidityCh.mqtt_client.publish("team3/plant/" + self.plant_name, "Stopped watering plant")
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



HumidityChecker("1", 200)
