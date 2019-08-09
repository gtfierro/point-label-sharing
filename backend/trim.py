def rule(side="l", num_chars=0):
    def impl(inp):
        if side == "r":
            return inp[:-num_chars]
        elif side == "l":
            return inp[num_chars:]
    return impl
