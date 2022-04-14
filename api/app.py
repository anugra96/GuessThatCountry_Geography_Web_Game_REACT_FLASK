import time
from flask import Flask, request
from flask import send_from_directory
from guess import random_country
from guess import take_a_guess
from guess import get_centroid
from flask_cors import CORS, cross_origin

create_app = Flask(__name__, static_folder='my-app/build', static_url_path='')
CORS(create_app)


destination = ""

@create_app.route('/')
@cross_origin()
def serve():
    return send_from_directory(create_app.static_folder, 'index.html')

@create_app.route('/random_country/<code>')
def get_random_country(code):
    print(code)
    destination = code
    return {'random_country_centroid': get_centroid(destination)}

@create_app.route('/make_guess/<country>/<destination>')
def make_guess(country, destination):
    print(country)
    print(destination)
    ret_arr = take_a_guess(country, destination)
    random_country_centroid = get_centroid(destination)
    ret_obj = {'response': {
            'distance': ret_arr[0],
            'direction': ret_arr[1],
            'centroid': random_country_centroid
        }
    }
    return ret_obj



if __name__ == '__main__':
    create_app.run()
