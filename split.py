def rule(delimeter, keep_delimeter, sections):
    def impl(inp):
        all_sections = inp.split(delimeter)
        if keep_delimeter:
            return delimeter.join([all_sections[i - 1] for i in sections])
        else:
            return ''.join([all_sections[i - 1] for i in sections])
    return impl
