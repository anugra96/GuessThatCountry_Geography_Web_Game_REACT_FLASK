import time
from flask import Flask, request
from guess import random_country
from guess import take_a_guess

app = Flask(__name__)

destination = ""

@app.route('/random_country/<code>')
def get_random_country(code):
    print(code)
    destination = code
    return {'random_country': random_country()}

@app.route('/make_guess/<country>/<destination>')
def make_guess(country, destination):
    print(country)
    print(destination)
    ret_arr = take_a_guess(country, destination)
    ret_obj = {'response': {
            'distance': ret_arr[0],
            'direction': ret_arr[1]
        }
    }
    return ret_obj




