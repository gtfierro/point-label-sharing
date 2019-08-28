def rule(arg1):
    def impl(inp):
        return inp.replace(arg1, "")
    return impl
