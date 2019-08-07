from flask import Flask
from flask import jsonify, send_from_directory
from flask import request
from flask import current_app
from flask import make_response
from flask import render_template
import copy
import random
import importlib
import json

app = Flask(__name__, static_url_path='/static')

class database:
    def __init__(self, filename):
        self.filename = filename
        try:
            with open(self.filename, 'r') as f:
                self.obj = json.load(f)
        except:
            self.obj = {
                'files': {},
                'templates': {},
                'rules': {},
            }

        # load in templates
        # TODO: do this automatically

        # example
        self.obj['templates']['replace'] = {
            'args': 2,
            'filename': 'replace'
        }

        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)



    def add(self, col, value, key=None):
        """
        serialize contents to the database
        """
        if key is None:
            ident = str(random.randint(0,64000))
            while self.get(col, ident) is not None:
                ident = str(random.randint(0,64000))
            key = ident
        self.obj[col][key] = value
        with open(self.filename, 'w') as f:
            json.dump(self.obj, f)
        return key
    
    def get(self, col, key, default=None):
        r = self.obj[col].get(key, default)
        return copy.deepcopy(r) if r is not None else None

db = database('db.json')

@app.route('/file/<fileid>', methods=['GET'])
def get_file(fileid):
    return jsonify(db.get('files', fileid, {}))

@app.route('/file', methods=['GET','POST'])
def filehandler():
    if request.method == 'POST':
        # get new fileid
        fileid = db.add('files',request.get_json(force=True))
        return jsonify({'fileid': fileid})
    else:
        fileids = list(db.obj['files'].keys())
        return jsonify(fileids)

@app.route('/template/<templateid>', methods=['GET'])
def get_template(templateid):
    return jsonify(db.get('templates', templateid, {}))

@app.route('/template', methods=['GET'])
def templatehandler():
    templateids = list(db.obj['templates'].keys())
    return jsonify(templateids)

@app.route('/rule/<ruleid>', methods=['GET','POST'])
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
def rulehandler():
    ruleids = list(db.obj['rules'].keys())
    return jsonify(ruleids)

@app.route('/apply/<fileid>/<ruleid>', methods=['POST'])
def applyrule(fileid, ruleid):
    content = db.get('files',fileid)
    ruledef = db.get('rules',ruleid)
    template = db.get('templates',ruledef['template'])
    ruleinst = importlib.import_module(template['filename']).rule(*ruledef['args'])

    new_contents = []
    for row in content['contents']:
        for col in ruledef['cols']:
            row[col] = ruleinst(row[col])
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
    app.run(host='localhost',debug=True)
