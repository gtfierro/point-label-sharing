def rule(separator, section):
    def impl(inp):
        return inp.split(separator)[section - 1]
    return impl
