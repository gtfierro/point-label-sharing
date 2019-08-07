def rule(arg1, arg2):
    def rule(inp):
        return inp.replace(arg1, arg2)
    return rule
