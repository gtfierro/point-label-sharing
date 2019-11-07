import json
import requests

d1 = {
    "name": "test1",
    "contents": [
        ["col1","col2"],
        ["abcdefg.5678.re3", "val2"]
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

# #Replace
# # instantiate rule
# rule_stuff = {
#     'cols': [0],
#     'args': [False, 'abc','replaced']
# }
# resp = requests.post('http://localhost:5000/rule/replace', data=json.dumps(rule_stuff)).json()
# ruleid=resp['ruleid']
# print(f"ruleid: {ruleid}")

#Trim
# instantiate rule
rule_stuff = {
    'cols': [0],
    'args': [1, 5]
}
resp = requests.post('http://localhost:5000/rule/trim', data=json.dumps(rule_stuff)).json()
ruleid=resp['ruleid']
print(f"ruleid: {ruleid}")

# #Split
# # instantiate rule
# rule_stuff = {
#     'cols': [0],
#     'args': [".", 2]
# }
# resp = requests.post('http://localhost:5000/rule/split', data=json.dumps(rule_stuff)).json()
# ruleid=resp['ruleid']
# print(f"ruleid: {ruleid}")

# #Remove
# # instantiate rule
# rule_stuff = {
#     'cols': [0],
#     'args': ["."]
# }
# resp = requests.post('http://localhost:5000/rule/remove', data=json.dumps(rule_stuff)).json()
# ruleid=resp['ruleid']
# print(f"ruleid: {ruleid}")

# #Regex Match (Doesn't work yet)
# # instantiate rule
# rule_stuff = {
#     'cols': [0],
#     'args': ["\s"]
# }
# resp = requests.post('http://localhost:5000/rule/regex_match', data=json.dumps(rule_stuff)).json()
# ruleid=resp['ruleid']
# print(f"ruleid: {ruleid}")

ruledef = requests.get(f'http://localhost:5000/rule/{ruleid}').json()
print(f"got defined rule: {ruledef}")

resp = requests.post(f'http://localhost:5000/apply/{fileid}/{ruleid}').json()
newfileid = resp['fileid']
print(f"new file id: {newfileid}")

contents = requests.get(f'http://localhost:5000/file/{newfileid}').json()
print(f'Running rule on {fileid} gave us {newfileid} with content: {contents}')
