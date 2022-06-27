import json

with open('sets.json') as file:
    jsondecoded = json.load(file)

    for i in range(0,730):
        print(jsondecoded["data"][i]["code"])
        
