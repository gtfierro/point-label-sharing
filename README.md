# Dataset: An Open Dataset and Collection Tool for BMS Point Labels

## Abstract

Semantic metadata standards for buildings such as Brick and Project Haystack show promise in enabling wide-scale deployment of energy-efficiency measures and advanced building management technologies. However, techniques for converting existing diverse and idiosyncratic forms of building metadata to these standard forms is an area of active research. To encourage and facilitate research into the development and evaluation of such techniques, we are releasing an open dataset of metadata pulled from real building management systems, containing attributes for 103,064 points over 92 buildings. In addition, we are releasing an open-source tool for scraping and cleaning metadata from building management systems (BMS) for contribution to the dataset.

## How it Works

We are releasing a tool to substantially reduce the effort in extracting point labels and related metadata from BMS and preparing this data for public release. The tool begins by scanning a network for BMS endpoints which it can connect to; the tool then pulls all available points and metadata from the BMS. The tool then organizes this compiled data into a CSV format and loads it into a web interface which is presented to the user. The user, such as a building manager, can then visualize, clean and prepare the point labels for public release. After cleaning and filtering the data, users download the finished dataset and upload it to data.mortardata.org, where it will be reviewed and ultimately integrated into the released dataset. As the dataset expands over time, it will contain a higher number and a more diverse population of building metadata, giving researchers a rich body of data from which to develop metadata normalization methods.

## How to Use

### BACnet scanning

We use the excellent [BAC0](https://github.com/ChristianTremblay/BAC0) and [BACpypes](https://github.com/JoelBender/bacpypes) libraries to scan a network for existing BACnet devices.

To scan your network for BACnet devices and dump the found points, install the `pointscan` library and run the `scan` tool:

```bash
$ pip install pointscan
$ pointscan scan
```

This will dump a `csv` file in your current directory

### Dataset Cleaning

We have also produced a web-based tool for cleaning the point labels found with the scan tool. Due to web dependencies, this can be a little complex to set up (see the "Development Setup" section below) but you should be able to get this working through Docker:

```bash
$ docker run -p 5000:5000 --name pointscan-web mortar/pointscan:latest
```

and then access the web interface at [http://localhost:5000](http://localhost:5000).

## Development Setup

Any version > Python v3.6 is recommended. Run the **Makefile** to install necessary dependencies. 

```bash
# install virtualenv:
# sudo apt install python3-venv

python3 -m venv venv
. venv/bin/activate
make
python app.py
```

Run `python app.py` to run the app. <br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

**Development Mode**

```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
python app.py # Runs API server
cd frontend
npm install
npm start
```
Run `npm start` to run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

# Point Label Sharing API

## Rule Templates

Put rule templates in this folder. These are pieces of Python code with a function `rule` defined that has an arbitrary number of positional arguments. These arguments define the template.
`rule` returns a function that take as input a string to be processed, and returns the result of processing the string using the previous positional arguments where needed.
This returned function is an "instance" of the rule template. We call instances of rule templates "rules".

Consider the following example implementation of a rule template that returns a function that performs find/replace on an input string.


```python
# function must be called rule
# we take 2 arguments: the substring to find, and the string to replace each instance of the substring
def rule(find_string, replace_string):
    # return a function that has a single argument (string) and returns the result of applying
    # the Python replace function to the input string
    def impl(inp):
        return inp.replace(find_string, replace_string)
    return impl
```

To instantiate a rule template, we POST to the URL `/rule/<templateid>`, where `<templateid>` is the ID of the template we want to instantiate.
The body of the POST request is a JSON-encoded object:

```json
{
    "cols": [0],
    "args": ["abc","def"]
}
```

The `"cols"` field contains a list of column indexes that the rule is applied to; here, we apply the rule to only the first column of the file.
The `"args"` field contains a list of the arguments to the template. In the case of the `replace` rule above, the arguments are the substring to be found (`"abc"`) and the replacement string (`"def"`). When we apply this rule to a file, all instances of `abc` in the first column will be replaced with the string `def`
