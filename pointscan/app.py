from flask import Flask
from flask import jsonify, send_from_directory
from flask import request, redirect
from flask import current_app
from flask import make_response
from flask import render_template
from functools import update_wrapper
from datetime import datetime, timedelta
import copy
import random
import importlib
import json
from subprocess import call
import os

app = Flask(__name__, static_url_path='/static', static_folder='static/static')

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
            
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):

            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

class database:
    """
    Simple append-only database backed by a JSON file. Writes the JSON file whenever
    we add to the database. Has 3 collections: files, templates, rules.
    """
    def __init__(self, filename):
        self.filename = filename

        # open existing db or create new db
        try:
            with open(self.filename, 'r') as f:
                self.obj = json.load(f)
        except:
            self.obj = {
                'files': {},
                'templates': {
                    "find and replace": {
                        "args": 2,
                        "filename": "replace"
                    },
                    "trim": {
                        "args": 2,
                        "filename": "trim"
                    },
                    "remove": {
                        "args": 1,
                        "filename": "remove"
                    },
                    "split": {
                        "args": 2,
                        "filename": "split"
                    },
                    "regex": {
                        "args": 1,
                        "filename": "regex"
                    }
                },
                'rules': {},
            }

        # load in templates
        # TODO: do this automatically

        # example
        self.obj['templates']['find and replace'] = {
            'args': 2,
            'filename': 'replace'
        }

        # save to file
        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)


    def update(self, col, key, value):
        """
        Updates existing contents in the database.
        Returns the key it was inserted under.
        """
        if col not in ['files','templates','rules']:
            raise Exception("col needs to be one of files, templates, rules")

        self.obj[col][key] = value

        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)
        
        return key

    def add(self, col, value):
        """
        serialize contents to the database.
        Returns the key it was inserted under. All inserts will have unique keys
        """
        if col not in ['files','templates','rules']:
            raise Exception("col needs to be one of files, templates, rules")
        # get unique key
        key = str(random.randint(0,64000))
        while self.get(col, key) is not None:
            ident = str(random.randint(0,64000))

        # set key => value
        self.obj[col][key] = value

        # save database
        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)
        return key
    
    def get(self, col, key, default=None):
        """
        Return the document stored under the key in the given collection.
        Returns 'default' if the key is not found.
        """
        if col not in ['files','templates','rules']:
            raise Exception("col needs to be one of files, templates, rules")
        r = self.obj[col].get(key, default)
        return copy.deepcopy(r) if r is not None else None
    
    def remove(self, col, key):
        if col not in ['files','templates','rules']:
            raise Exception("col needs to be one of files, templates, rules")
        
        if key not in self.obj[col]:
            raise Exception("key does not exist")

        del self.obj[col][key]

        # save to file
        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)

db = database('db.json')

@app.route('/file/<fileid>', methods=['GET', 'PUT'])
@crossdomain(origin='*')
def get_or_update_file(fileid):
    if request.method == 'GET':
        return jsonify(db.get('files', fileid, {}))
    else:
        file_data = request.get_json(force=True)
        new_file = db.get("files", fileid)
        new_file["contents"] = file_data["contents"]
        fileid = db.update("files", fileid, new_file)
        return jsonify({ 'fileid': fileid })

@app.route('/file', methods=['GET','POST'])
@crossdomain(origin='*')
def filehandler():
    if request.method == 'POST':
        # get new fileid
        req_json = request.get_json(force=True)
        req_json["appliedRules"] = False
        fileid = db.add('files',req_json)
        return jsonify({'fileid': fileid })
    else:
        appliedRules = request.args.get('appliedRules', False)
        fileids = []
        if appliedRules:
            for fileid in db.obj['files']:
                if "appliedRules" in db.get('files', fileid):
                    if not db.obj['files'][fileid]['appliedRules']:
                        fileids.append(fileid)
                else:
                    fileids.append(fileid)
        else:
            fileids = list(db.obj['files'].keys())
        return jsonify(fileids)

@app.route('/template/<templateid>', methods=['GET'])
@crossdomain(origin='*')
def get_template(templateid):
    return jsonify(db.get('templates', templateid, {}))

@app.route('/template', methods=['GET'])
@crossdomain(origin='*')
def templatehandler():
    templateids = list(db.obj['templates'].keys())
    return jsonify(templateids)

@app.route('/rule/<ruleid>', methods=['GET','POST', 'PUT'])
@crossdomain(origin='*')
def get_rule(ruleid):
    if request.method == 'POST':
        # treat ruleid as an instanceid
        # expect:
        # body = {
        #   cols: [0],
        #   args: ['arg1', 'arg2'],
        # }
        templateid = ruleid
        template = db.get('templates', templateid)
        args = request.get_json(force=True)
        args['template'] = templateid
        ruleid = db.add('rules', args)
        return jsonify({'ruleid': ruleid})
    elif request.method == 'GET':
        return jsonify(db.get('rules', ruleid, {}))
    else:
        args = request.get_json(force=True)
        fileid = args.pop('fileId', None)
        content = db.get('files', fileid)
        db.update("rules", ruleid, args)
        return jsonify({ 'fileid': fileid, 'originalFile': content['originalFile'], 'ruleids': content["applied"] })

@app.route('/rule', methods=['GET'])
@crossdomain(origin='*')
def rulehandler():
    ruleids = list(db.obj['rules'].keys())
    return jsonify(ruleids)

@app.route('/apply/<fileid>/<ruleid>', methods=['POST'])
@crossdomain(origin='*')
def applyrule(fileid, ruleid):
    content = db.get('files',fileid)        
    ruledef = db.get('rules',ruleid)
    template = db.get('templates',ruledef['template'])
    ruleinst = importlib.import_module(template['filename']).rule(*ruledef['args'])

    new_contents = []
    for row in copy.deepcopy(content)["contents"][1:]:
        for col in ruledef['cols']:
            try:
                row[col] = ruleinst(row[col])
            except Exception as e:
                print(e)
                pass
        new_contents.append(row)

    # Skip and add header row back
    new_contents.insert(0, content["contents"][0])

    new_file = {
        'name': content['name'],
        'applied': content.get('applied', []),
        'contents': new_contents
    }
    new_file['applied'].append(ruleid)
    if "appliedRules" in content and not content["appliedRules"]:
        # If no rules applied yet
        new_file["originalFile"] = fileid
        newfileid = db.add('files', new_file)
        content["appliedRules"] = True
        content["appliedFile"] = newfileid
        db.update('files', fileid, content)
    else: 
        if 'appliedFile' in content:
            new_file['originalFile'] = fileid
            newfileid = db.update('files', content['appliedFile'], new_file)
        else:
            new_file['originalFile'] = content["originalFile"]
            newfileid = db.update('files', fileid, new_file)

    return jsonify({'fileid': newfileid})

@app.route('/delete/<fileid>/<ruleid>', methods=['DELETE'])
@crossdomain(origin='*')
def delete_rule(fileid, ruleid):
    content = db.get('files',fileid)
    content["applied"].remove(ruleid)
    original_file_id = content["originalFile"]
    db.remove('rules', ruleid)
    if content["applied"]:
        updated_file = { 
            "name": content["name"],
            "contents": content["contents"], 
            "applied": content["applied"],
            "originalFile": original_file_id
        } 
        db.update('files', fileid, updated_file)
        return jsonify({'fileid': fileid, 'ruleids': updated_file["applied"], 'originalFile': original_file_id})
    else:
        original_file_content = db.get('files', original_file_id)
        updated_original_file = { 
            "name": original_file_content["name"],
            "contents": original_file_content["contents"], 
            "appliedRules": False
        } 
        db.update('files', original_file_id, updated_original_file)
        db.remove('files', fileid)
        return jsonify({'fileid': original_file_id, 'ruleids': [], 'originalFile': original_file_id})


@app.route('/')
def index():
    return send_from_directory('frontend/build', 'index.html')

@app.route('/<filename>')
@crossdomain(origin='*')
def home(filename):
   return send_from_directory('frontend/build', filename)

if __name__ == '__main__':
    owd = os.getcwd()
    os.chdir("frontend")
    call(["npm", "run", "build"])
    os.chdir(owd)

    app.run(host='0.0.0.0',port=8000,debug=True)
