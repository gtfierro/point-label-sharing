import json
import requests

d1 = {
    "name": "test1",
    "contents": [
        ["col1","col2"],
        ["abc", "val2"]
    ]
}

file_list = requests.get('http://localhost:5000/file').json()
print(f"file list: {file_list}")

resp = requests.post('http://localhost:5000/file', data=json.dumps(d1)).json()
fileid = resp['fileid']
print(f"file saved with id: {fileid}")

contents = requests.get(f'http://localhost:5000/file/{fileid}').json()
print(f'Got contents of file {fileid}: {contents}')

template_list = requests.get('http://localhost:5000/template').json()
print(f"template list: {template_list}")

rule_list = requests.get('http://localhost:5000/rule').json()
print(f"rule list: {rule_list}")

# instantiate rule
rule_stuff = {
    'cols': [0],
    'args': ['abc','replaced']
}
resp = requests.post('http://localhost:5000/rule/replace', data=json.dumps(rule_stuff)).json()
ruleid=resp['ruleid']
print(f"ruleid: {ruleid}")

ruledef = requests.get(f'http://localhost:5000/rule/{ruleid}').json()
print(f"got defined rule: {ruledef}")

resp = requests.post(f'http://localhost:5000/apply/{fileid}/{ruleid}').json()
newfileid = resp['fileid']
print(f"new file id: {newfileid}")

contents = requests.get(f'http://localhost:5000/file/{newfileid}').json()
print(f'Running rule on {fileid} gave us {newfileid} with content: {contents}')
