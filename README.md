# Label Sharing API

## Setup

```bash
# install virtualenv:
# sudo apt install python3-venv

python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

## Starting

```bash
. venv/bin/activate
python app.py
```

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
