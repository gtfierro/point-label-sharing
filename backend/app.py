from flask import Flask
from flask import jsonify, send_from_directory
from flask import request
from flask import current_app
from flask import make_response
from flask import render_template
from functools import update_wrapper
from datetime import datetime, timedelta
import copy
import random
import importlib
import json

app = Flask(__name__, static_url_path='/static')

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
                    "replace": {
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
                    "regex_match": {
                        "args": 1,
                        "filename": "regex_match"
                    }
                },
                'rules': {},
            }

        # load in templates
        # TODO: do this automatically

        # example
        self.obj['templates']['replace'] = {
            'args': 2,
            'filename': 'replace'
        }

        # save to file
        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)



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

db = database('db.json')

@app.route('/file/<fileid>', methods=['GET'])
@crossdomain(origin='*')
def get_file(fileid):
    return jsonify(db.get('files', fileid, {}))

@app.route('/file', methods=['GET','POST'])
@crossdomain(origin='*')
def filehandler():
    if request.method == 'POST':
        # get new fileid
        fileid = db.add('files',request.get_json(force=True))
        return jsonify({'fileid': fileid})
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

@app.route('/rule/<ruleid>', methods=['GET','POST'])
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
    else:
        return jsonify(db.get('rules', ruleid, {}))

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
    for row in content['contents']:
        for col in ruledef['cols']:
            try:
                row[col] = ruleinst(row[col])
            except Exception as e:
                print(e)
                pass
        new_contents.append(row)

    new_file = {
        'name': content['name'],
        'applied': content.get('applied', []),
        'content': new_contents
    }
    new_file['applied'].append(ruleid)
    newfileid = db.add('files', new_file)
    return jsonify({'fileid': newfileid})

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
