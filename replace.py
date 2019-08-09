import re

def rule(is_regex, arg1, arg2):
    def impl(inp):
        if not is_regex:
            return inp.replace(arg1, arg2)
        else:
            return re.sub("%r"%arg1, arg2, inp)
    return impl
