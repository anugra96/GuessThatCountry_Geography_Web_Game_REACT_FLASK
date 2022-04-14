#!/usr/bin/python

import sys
from shapely.geometry import shape
import json
from pyproj import Geod
import math
import random

## Importing Libraries and Reading in Countries geoJSON -------------------------------------------------------------------
with open("./countries.geojson") as f:
    gj = json.load(f)

features = gj['features']

## Creating a centroid property and calculating it for each country ----------------------------------------------------------

for country in features:
    country["properties"]["centroid"] = [0,0]

for country in features:
    country_shape = shape(country["geometry"])
    country_centroid_point = country_shape.centroid
    centroid_lon = country_centroid_point.x
    centroid_lat = country_centroid_point.y
    country["properties"]["centroid"][0] = centroid_lat
    country["properties"]["centroid"][1] = centroid_lon
    

def get_centroid(fetch_country):
    ret_val = {}
    for country in features:
        if (country["properties"]["ADMIN"] == fetch_country):
            ret_val = country
            break
        else:
            continue
    
    country_shape = shape(ret_val["geometry"])
    country_shape_centroid = country_shape.centroid
    centroid_lon = country_shape_centroid.x
    centroid_lat = country_shape_centroid.y
    return [centroid_lat, centroid_lon]


## CLEAN COUNTRY STRING ---------------------------------------------------------------------------------------

def clean_string(country):
    ret_val = country.lower().strip()
    return ret_val

## CHECK IF COUNTRY EXISTS ------------------------------------------------------------------------------------------------
## check_exists: Str -> Bool
def check_exists(guess):
    ret_val = False
    for country in features:
        compare_country = country["properties"]["ADMIN"]
        if clean_string(guess) == clean_string(compare_country):
            ret_val = True
            break
        else:
            continue
    return ret_val
    

## Takes a string (country name) and outputs a tuple of its centroid ---------------------------------------------------------------
def get_centroid_list(country_name):
    ret_val = []
    for country in features:
        if clean_string(country_name) == clean_string(country["properties"]["ADMIN"]):
            ret_val = country["properties"]["centroid"]
            break
        else:
            continue
    return ret_val

## Calculating Distance Between Two Country Centroids ---------------------------------------------------------------------

## create a Geod object from Shapely library
## - specify WGS84 coordinate system
wgs84_geod = Geod(ellps="WGS84")


## function to get distance between two countries in kms
def get_distance(country1, country2):
    country_1_centroid = get_centroid_list(country1)
    country_2_centroid = get_centroid_list(country2)
    lat1, lon1 = (country_1_centroid[0], country_1_centroid[1])
    lat2, lon2 = (country_2_centroid[0], country_2_centroid[1])
    
    az12, az21, dist = wgs84_geod.inv(lon1,lat1,lon2,lat2)
    
#     print("degrees: " + str(fix_bearings(az12)))
#     print("azimuth: " + str(az12))
    
    return dist/1000


## Calculating Bearing Between Two Country Centroids ------------------------------------------------------------------------
def simple_project(latitiude: float) -> float:
    """
    Projects a point to its corrected latitude for the rhumbline calculations.
    :param latitiude: A float in radians.
    :return: The projected value in radians.
    """
    return math.tan(math.pi / 4 + latitiude / 2)

def convert_to_compass_direction(azimuth: float) ->str:
    
    compass_brackets = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]

    compass_lookup = round(azimuth / 22.5)
    
    return compass_brackets[compass_lookup]

def bearing(point_a: tuple, point_b: tuple) -> float:
    """
    Returns bearing between two points in degrees
    :param point_a: Start point. Tuple of degrees.
    :param point_b: End point. Tuple of degrees.
    :return: The bearing in degrees.
    """
    lat_a = math.radians(point_a[0])
    lon_a = math.radians(point_a[1])

    lat_b = math.radians(point_b[0])
    lon_b = math.radians(point_b[1])

    delta_psi = math.log(simple_project(lat_b) / simple_project(lat_a))
    delta_lambda = lon_b - lon_a

    if abs(delta_lambda) > math.pi:
        if delta_lambda > 0:
            delta_lambda = -(2 * math.pi - delta_lambda)
        else:
            delta_lambda = 2 * math.pi + delta_lambda

    final_azi = math.degrees(math.atan2(delta_lambda, delta_psi))
    
    if final_azi < 0:
        final_azi = final_azi + 360
    
    return final_azi

## PUTTING IT TOGETHER -----------------------------------------------------------
def take_a_guess(origin, dest):
    origin_centroid = get_centroid_list(origin)
    dest_centroid = get_centroid_list(dest)
    
    dist = get_distance(origin, dest)
    compass = convert_to_compass_direction(bearing(origin_centroid, dest_centroid))
    
    factor = 10 ** 2
    rounded_dist = math.ceil(dist * factor) / factor

    return [rounded_dist, compass]


## Select Random Country

## random_country: None -> Str
## Inputs nothing, and returns the string name of a random country
def random_country():
    rand_country_index = random.randint(0, 254)
    
    return features[rand_country_index]["properties"]["ADMIN"]




## SET HOME POINT ------------------------------------------------------------------------

def set_home():

    USER_GUESS = input("SET A HOME COUNTRY: ")
    
    while(check_exists(USER_GUESS) == False):
        USER_GUESS = (input("Your country doesn't exist. GUESS AGAIN:\n"))
    
    return USER_GUESS

    

## MAIN PROGRAM -------------------------------------------------------------------------

def main():



    TOTAL_GUESSES = 5
    FINAL_DESTINATION = random_country()

    final_result = 0

    guess_list = ["Home Point: ", "Guess 1: ", "Guess 2: ", "Guess 3: ", "Guess 4: ", "Guess 5: \n"]

    HOME = set_home()
    guess_list[0] = guess_list[0] + HOME
    from_home = take_a_guess(HOME, FINAL_DESTINATION)

    print("FINAL DESTINATION" + " is " + str(from_home[0])+ " away, in the " + from_home[1] + " direction!")



    while TOTAL_GUESSES > 0:

        print("-------------------------------------")
            
        print (guess_list)
        print("\n")
        
        print(str(TOTAL_GUESSES) + " Guesses Left")

        USER_GUESS = input("GUESS A COUNTRY:\n")
        
        if USER_GUESS == "England":
            USER_GUESS = "United Kingdom"

        while(check_exists(USER_GUESS) == False):
            USER_GUESS = (input("Your country doesn't exist. GUESS AGAIN:\n"))
        
        results = take_a_guess(USER_GUESS, FINAL_DESTINATION)

        if results[0] == 0:
            final_result = 1
            break
        else:
            ## update guess list
            guess_list[6 - TOTAL_GUESSES] = guess_list[6 - TOTAL_GUESSES] + (USER_GUESS)
            TOTAL_GUESSES = TOTAL_GUESSES - 1
            print("WRONG!\n")
            print("FINAL DESTINATION" + " is " + str(results[0])+ " away, in the " + results[1] + " direction!")
    
    if final_result == 0:
        print("YOU FAILED")
        print("The correct answer is: " + FINAL_DESTINATION)
    else:
        print("WELL DONE! YOU WIN")
            







