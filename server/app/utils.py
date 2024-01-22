def parse_str_bool(str_bool, default=None):
    '''Helper methood to parse bool from str. ie 'false' => False, 'true' => True.
    default is the default that will be set if parse is unsuccessful.
    '''
    if type(str_bool) == bool:
        return str_bool

    if str_bool.lower() == 'false':
        return False
    elif str_bool.lower() == 'true':
        return True
    else:
        return default


