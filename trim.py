def rule(num_chars_left=0, num_chars_right=0):
    def impl(inp):
        return inp[num_chars_left:-num_chars_right]
    return impl
