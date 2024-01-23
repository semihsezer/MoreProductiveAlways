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


# implement serialize_shortcuts
def serialize_shortcuts(shortcuts):
    '''Helper method to serialize shortcuts'''
    serialized_shortcuts = []
    for shortcut in shortcuts:
        serialized_shortcut = {
            'id': shortcut.id,
            'application_name': shortcut.application.name,
            'command': shortcut.command,
            'mac': shortcut.mac,
            'windows': shortcut.windows,
            'linux': shortcut.linux,
            'description': shortcut.description,
            'created_at': shortcut.created_at,
            'updated_at': shortcut.updated_at,
        }
        serialized_shortcuts.append(serialized_shortcut)
    return serialized_shortcuts