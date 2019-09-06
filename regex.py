import re

def rule(reg_expr):
    def impl(inp):
        match = re.match(reg_expr, inp)
        if match:
            print(match.groups())
            return ''.join(match.groups())
        else:
            return inp
    return impl
