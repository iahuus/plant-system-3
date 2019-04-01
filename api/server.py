from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
import datetime
#from mqtt_server import MQTT_Client_2

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'plant_db.sqlite')

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), unique=False)
    plant_type = db.Column(db.String(60), unique=False)
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    humidity_readings = db.relationship("HumidityReading", backref="plant", lazy=True)

    def __init__(self, name, plant_type):
        self.name = name
        self.plant_type = plant_type


class HumidityReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time_stamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    value = db.Column(db.Integer)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'),
                         nullable=False)

    def __init__(self, value, plant_id):
        self.value = value
        self.plant_id = plant_id                    


class PlantSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "plant_type", "created", "humidity_readings")


class HumidityReadingSchema(ma.Schema):
    class Meta:
        fields = ("id", "time_stamp", "value", "plant_id")


humidity_reading_schema = HumidityReadingSchema()
humidity_readings_schema = HumidityReadingSchema(many=True)

plant_schema = PlantSchema()
plants_schema = PlantSchema(many=True)


# endpoint to create new plant
@app.route("/plants", methods=["POST"])
def add_plant():
    name = request.json.get('name')
    plant_type = request.json.get('plant_type')

    new_plant = Plant(name, plant_type)

    db.session.add(new_plant)
    db.session.commit()

    return plant_schema.jsonify(new_plant)


# endpoint to show all plants
@app.route("/plants", methods=["GET"])
def get_plant():
    all_plants = Plant.query.all()
    result = plants_schema.dump(all_plants)
    return jsonify(result.data)


# endpoint to get plant detail by id
@app.route("/plants/<id>", methods=["GET"])
def plant_detail(id):
    plant = Plant.query.get(id)
    return plant_schema.jsonify(plant)


# endpoint to update plant
@app.route("/plants/<id>", methods=["PUT"])
def plant_update(id):
    plant = Plant.query.get(id)
    name = request.json.get('name')
    plant_type = request.json.get('plant_type')

    if name:
        plant.name = name
    if plant_type:
        plant.plant_type = plant_type

    db.session.commit()
    return plant_schema.jsonify(plant)


# endpoint to delete plant
@app.route("/plants/<id>", methods=["DELETE"])
def plant_delete(id):
    plant = Plant.query.get(id)
    if plant:
        db.session.delete(plant)
        db.session.commit()

        return plant_schema.jsonify(plant)
    else:
        return jsonify(None)


'''# endpoint to add humidity readings
@app.route("/plants/<id>", methods=["PUT"])
def plant_add_reading(plant_id):
    plant = HumidityReading.query.get(plant_id)
    value = request.jsonify.get(value)

    if value:
        plant.value = int(value)

    db.session.commit()
    return plant_schema.jsonify(plant)'''

@app.route("/reading/<id>", methods=["POST"])
def add_reading(id):
    value = request.json.get('value')
    new_reading = HumidityReading(value, id)


    db.session.add(new_reading)
    db.session.commit()

    return humidity_reading_schema.jsonify(new_reading)


if __name__ == '__main__':
    app.run(debug=True)
