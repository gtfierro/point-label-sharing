import re

def rule(reg_expr):
    def impl(inp):
        match = re.search("%r"%reg_expr, inp)
        if match:
            return match.group()
        else:
            return inp
    return impl
