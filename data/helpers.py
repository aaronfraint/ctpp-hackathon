def fips_code_list() -> list:
    """
    Make a list of FIPS codes, from 01 to 56
    Return as strings so that 1 - 9 can be left-padded with a zero
    """
    skip_list = [3, 7, 14, 43, 52]
    codes = []
    for x in range(1, 57):
        if x not in skip_list:
            if len(str(x)) == 1:
                codes.append(f"0{x}")
            else:
                codes.append(str(x))
    return codes
