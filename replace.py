def rule(arg1, arg2):
    def impl(inp):
        return inp.replace(arg1, arg2)
    return impl
