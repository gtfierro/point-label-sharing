## Dataset: An Open Dataset and Collection Tool for BMS Point Labels

[Link to Paper: Dataset: An Open Dataset and Collection Tool for BMS Point Labels](https://brickschema.org/papers/BuildingMetadataDataset-DATA-2019-Fierro.pdf)


## Questions

**1. What makes me proud of this piece of work?**

There is nothing more exciting than having real users interacting with a product that you spent countless hours developing. Furthermore, hearing users' reactions to how the product is impacting their life is encouraging and motivating. I am most proud of this particular piece of work because it will be implemented in the real world in the near future. In the context of my research, the application is targeted towards building managers who can issue an automated scan of all their building's equipment and sensors (AKA points), consolidate the data into a CSV format, clean and anonymize the data, and ultimately contribute to a growing, diverse online dataset of building metadata. Specifically, one of the aspects of the application that I am most proud of implementing is the variety of real-time string manipulation tools used to aid in the data cleaning/anonymization process. These tools are integral to removing outliers and unwanted points to ensure that the resulting datasets can be used by building researchers to enhance their projects by leveraging powerful machine learning algorithms on the data. 

**2. What areas of this project did I specifically work on?**

I took ownership of the bulk of the application by building the entire React-Redux frontend, as well as several API endpoints of the Flask backend. After generating new ideas for features, I redesigned the database several times, prompting me to edit multiple API queries to reflect these changes. In addition to building a significant portion of the API and frontend, I built all the different string manipulation rule templates denoted by **replace.py**, **split.py**, **trim.py**, etc. 

**3. What did I learn throughout this project?**

Developing this application has helped me grow and diversify my skill set. I required a strong command of several technologies like Python, JavaScript, Node.js, Flask API Development, React, and Redux to bring the project alive. As I added new features during the development process, the drawbacks of my initial backend design were becoming increasingly prevalent, impelling me to redesign the database and rewrite all my API endpoints again. I learned the importance of carefully designing backend infrastructure and associated databases before building an application. Another fundamental concept that I learned and capitalized on throughout this project was modularization. After building the first few components of the web application, I quickly realized how fast my codebase was growing given that I had many more features to implement. I accepted the challenge by building reusable components, separating business and application logic, and abstracting away repetitive logic into helper modules. Modularizing the application also taught me effective ways to increase the transparency of data flow from the Redux data store to the reducers, and finally to the component-level state, especially from the perspective of another programmer. 

**4. What was the most interesting thing about working on this?**

I absolutely enjoyed building this project because it encouraged me to delve deep into my creativity to build a clean, easy-to-use application that will help accelerate building research in the long-term. The most interesting aspect of working on this project was understanding how to combine the multiple moving parts to build one cohesive application that will serve thousands of people. Solving interesting challenges related to backend design and modularization was eye-opening and a great learning experience. As we near the production stage, I am excited to solve the many more challenges that will come with scaling the application. 

## Abstract

Semantic metadata standards for buildings such as Brick and Project
Haystack show promise in enabling wide-scale deployment of
energy-efficiency measures and advanced building management
technologies. However, techniques for converting existing diverse
and idiosyncratic forms of building metadata to these standard
forms is an area of active research. To encourage and facilitate
research into the development and evaluation of such techniques,
we are releasing an open dataset of metadata pulled from real building management systems, containing attributes for 103,064 points
over 92 buildings. In addition, we are releasing an open-source tool
for scraping and cleaning metadata from building management
systems (BMS) for contribution to the dataset.

## How it Works

We are releasing a tool to substantially reduce the effort in extracting point labels and related metadata
from BMS and preparing this data for public release. The tool begins by scanning a network for BMS endpoints which it can connect to; the tool then pulls all available points and metadata from the
BMS. The tool then organizes this compiled data into a CSV format and loads it into a web interface which is presented to the user. The user, such as a building manager, can then visualize, clean and
prepare the point labels for public release. After cleaning and filtering the data, users download the finished dataset and upload it to data.mortardata.org, where it will be reviewed and ultimately integrated into the released dataset. As the dataset expands over time, it will contain a higher number and a
more diverse population of building metadata, giving researchers a rich body of data from which to develop metadata normalization methods.

## Setup

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
