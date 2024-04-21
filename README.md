# MoreProductiveAlways
A web app that helps you find new productivity shortcuts for the tools you use.


## Dev Environment

### Prerequisites

- Python 3.12

### Getting Started

1. Start a virtual environment
   python -m venv .venv

1. Activate the virtual environment
   source .venv/bin/activate

1. Install requirements
   pip install -r server/requirements.txt

1. Start the db and other services
   make start_db

1. Run migrations and create initial user
   make init

1. Start the server
   make start_server
    

To load sample data, run: `make load_sample_data`.

## Testing

Quick notes:
- For Python tests:
- Create remote connection into Docker container and use default python runtime there in VSCode
- Added VSCode Django Testing extension (double check if this is necessary)
- TODO: Consider moving tests_it into the tests folder as subfolder. It would be nice if the folders are visible in test view, allowing us to separately run db tests if needed.

## Sample Data:

Sample data can be loaded from Excel or JSON with this command:

`python manage.py load_sample_data --delete --source=/server/app/management/scripts/sample_data.xlsx`

### Excel
Expected Sheets and fields in the excel file
- Shortcut
- UserShortcut:
    - username
    - application_name: Name of the application
    - extension: Name of extension, plugin, subsection or workflow where shortcut can be invoked
    - command: Name of command that identifies it
    - context: 
    - mac: Mac shortcut
    - user_mac: Mac shortcut, user's override
    - description: Longer description of command
    - category: User's own category for this shortcut (Saved, Learning, Mastered, Not Relevant)
    - application_command: Name of command in the specific application for this shortcut, if it is different than the common command. This is to avoid different naming conventions across different applications of the same category. ie. For browsers, if Chrome calls Open Tab and Safari calls Create Tab, we want one unique name for this. Then, for Safari, command would be Open Tab and application_command would be Create Tab, the name of this command in this specific application.
- Application
- User

