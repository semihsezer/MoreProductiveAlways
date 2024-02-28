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

def serialize_application(application):
    '''Helper method to serialize application'''
    serialized_application = {
        'id': application.id,
        'name': application.name,
        'description': application.description,
        'category': application.category,
        'created_at': application.created_at,
        'updated_at': application.updated_at,
    }
    return serialized_application

def serialize_applications(applications):
    '''Helper method to serialize applications'''
    serialized_applications = []
    for application in applications:
        serialized_applications.append(serialize_application(application))
    return serialized_applications

def serialize_shortcut(shortcut):
    '''Helper method to serialize shortcut'''
    serialized_shortcut = {
        'id': shortcut.id,
        'application': serialize_application(shortcut.application),
        'command': shortcut.command,
        'mac': shortcut.mac,
        'windows': shortcut.windows,
        'linux': shortcut.linux,
        'description': shortcut.description,
        'created_at': shortcut.created_at,
        'updated_at': shortcut.updated_at,
    }
    return serialized_shortcut

# implement serialize_shortcuts
def serialize_shortcuts(shortcuts):
    '''Helper method to serialize shortcuts'''
    serialized_shortcuts = []
    for shortcut in shortcuts:
        serialized_shortcuts.append(serialize_shortcut(shortcut))
    return serialized_shortcuts

def serialize_user_shortcut(user_shortcut):
    """Helper method that serializes user_shortcut: UserShortcut based on UserShortcut model"""
    serialized_user_shortcut = {
        'id': user_shortcut.id,
        'username': user_shortcut.user.username,
        'shortcut': serialize_shortcut(user_shortcut.shortcut),
        'user_mac': user_shortcut.user_mac,
        'user_windows': user_shortcut.user_windows,
        'user_linux': user_shortcut.user_linux,
        'category': user_shortcut.category,
        'created_at': user_shortcut.created_at,
        'updated_at': user_shortcut.updated_at,
    }
    return serialized_user_shortcut

def serialize_user_shortcuts(user_shortcuts):
    """Helper method that serializes user_shortcuts: List[UserShortcut] based on UserShortcut model"""
    serialized_user_shortcuts = []
    for user_shortcut in user_shortcuts:
        serialized_user_shortcuts.append(serialize_user_shortcut(user_shortcut))
    return serialized_user_shortcuts

def serialize_idea(idea):
    """Helper method that serializes idea: Idea based on Idea model"""
    serialized_idea = {
        'id': idea.id,
        'user': idea.user.username,
        'title': idea.title,
        'description': idea.description,
        'application': serialize_application(idea.application) if idea.application else None,
        'type': idea.type,
        'status': idea.status,
        'created_at': idea.created_at,
        'updated_at': idea.updated_at,
    }
    
    return serialized_idea

def serialize_user_ideas(user_ideas):
    """Helper method that serializes user_ideas: List[Idea] based on Idea model"""
    serialized_user_ideas = []
    for user_idea in user_ideas:
        serialized_user_ideas.append(serialize_idea(user_idea))
    return serialized_user_ideas