# Guestbook

## Requirements

* Python 2.7 
* virtualenv for python virtual enviornments
* postgres database
* Optionally, create a heroku install the heroku toolbelt (https://toolbelt.heroku.com/) to allow deploying to heroku. Most of this document will assume you don't need it.

## Initial Setup

```
# Create virtualenv into a folder called env
virtualenv --no-site-packages env
# Activate the virtualenv 
. env/bin/activate
# Clone this repository into a folder called venv (Note I'm separating the env and repo)
git clone https://github.com/tgerdes/guestbook
# Use pip to install python prerequisites.
pip install -r guestbook/requirements.txt
```

Some additional enviornment varibles are required:
* `DATABASE_URL`: For my local testing, I set this to "postgres://localhost/tgerdes"; I had to create the "tgerdes" database after installing postgres
* `DJANGO_SECRET_KEY`: Used for salting hashes for session keys. in your local host, it's value doesn't matter. just assign it any random string.
* `DROPBOX_ACCESS_TOKEN`: An OAuth2 token that pairs my Dropbox App with a users Dropbox account.  For now I can provide my token that accesses my dropbox off thread.

None of these enviornment variables should be checked in; they all contain sensitive information for a production environment that represents security risk.

All of these enviornment variables can be set in your `env/bin/activate` script so that every time you activate the project you have everything set up and ready to go.

Next, you need to create the initial database schema:

```
./manage.py syncdb --migrate
```
This will also prompt you to create a super user account; feel free to do so.

At this point, everything should be all set, and you can run the application:
```
./manage.py runserver
```
Which should run the app on port 8000 by default: http://localhost:8000/
