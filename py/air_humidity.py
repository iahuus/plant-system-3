import logging
from stmpy import Machine
import random
from py.Mqtt_client2 import MQTT_Client_2
from sense_hat import SenseHat

class AirHumidity:
    def __init__(self, plant_name, broker,port):
        self._logger = logging.getLogger(__name__)
        self._logger.warning("Created airHumidity machine")
        self.plant_name = plant_name
        self.sh = SenseHat()
        watering_machine = Machine(transitions=[self.t0, self.t1], obj=self,
                                   states=[self.idle],
                                   name='AirHumid')
        self.stm = watering_machine
        myclient = MQTT_Client_2(self.plant_name)
        self.mqtt = myclient
        self.mqtt.start(broker,port)


    def sendHumid(self):
        humidity = self.sh.get_humidity()
        self.mqtt.send_message("team3/plant/air",str(self.plant_name) + "-" + str(humidity))

    # initial transition
    t0 = {'source': 'initial',
          'target': 'idle'}

    t1 = {'trigger': 't',
          'source': 'idle',
          'effect' : 'sendHumid',
          'target': 'idle'}

    idle = {'name': 'idle',
                      'entry': 'start_timer("t", 20000)'}
