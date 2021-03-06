# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Setup for Socket.io with Flask and ReactJS
1. Open Cloud9 terminal in `~/environment`. Run `pip install flask-socketio`
2. Run `pip install flask-cors`
3. `cd` into `react-starter` directory. Run `npm install socket.io-client --save`

## Setup for Database
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs` Enter yes to all prompts.
2. Initialize PSQL database: `sudo service postgresql initdb`
3. Start PSQL: `sudo service postgresql start`
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER` If you get an error saying "could not change directory", that's okay! It worked!
5. Make a new database: `sudo -u postgres createdb $USER` If you get an error saying "could not change directory", that's okay! It worked!
6. Make sure your user shows up:
a) `psql`
b) `\du` look for ec2-user as a user 
c) `\l` look for ec2-user as a database

7. Make a new user:
a) `psql` (if you already quit out of psql)
b) Type this with your username and password (DONT JUST COPY PASTE): `create user some_username_here superuser password 'some_unique_new_password_here';` e.g. `create user namanaman superuser password 'mysecretpassword123';`
c) `\q` to quit out of sql
8. Save your username and password in a `sql.env` file with the format `SQL_USER=` and `SQL_PASSWORD=`.
9. To use SQL in Python: `pip install psycopg2-binary`
10. `pip install Flask-SQLAlchemy==2.1`

## Create a new database on Heroku and connect to our code
1. In your terminal, go to the directory with `app.py`.
2. Let's set up a new remote Postgres database with Heroku and connect to it locally.
* Login and fill creds: `heroku login -i`
* Create a new Heroku app: `heroku create`
* Create a new remote DB on your Heroku app: `heroku addons:create heroku-postgresql:hobby-dev` (If that doesn't work, add a `-a {your-app-name}` to the end of the command, no braces)
* See the config vars set by Heroku for you: `heroku config`. Copy the value for DATABASE_URL
* Paste this value into your `.env` file in the following format: `export DATABASE_URL='copy-paste-value-in-here'`
    ### Use Python to update this new Database
3. In the terminal, run `python` to open up an interactive session. Let's initialize a new database and add some dummy data in it using SQLAlchemy functions. Then type in these Python lines one by one:
```
>> from app import db
>> import models
>> db.create_all()
>> admin = models.Person(username='admin', email='admin@example.com')
>> guest = models.Person(username='guest', email='guest@example.com')
>> db.session.add(admin)
>> db.session.add(guest)
>> db.session.commit()
```
4. In your same `python` session, let's now make sure that data was added successfully by doing some queries.
```
>> models.Person.query.all()
[<Person u'admin'>, <Person u'guest'>] # output
>> models.Person.query.filter_by(username='admin').first()
<Person u'admin'> # output
```
5. Now let's make sure this was written to our Heroku remote database! Let's connect to it using: `heroku pg:psql`
6. `\d` to list all our tables. `person` should be in there now.
7. Now let's query the data with a SQL query to check if it works:
`SELECT * FROM person;`
`SELECT email FROM person WHERE username='admin';`


## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'`

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Problems/Future Addons

1. Implementing the .env for the database. Whenever I did `os.getenv('DATAB_URL')`, it was giving me a different DATABASE URL than the one I entered.  There was no reason for that to happen because I clearly did not have any other variables.  I even deleted the content of DATABASE_URL and then even the file, but it was still giving me the same string.

   I was able to fix this by changing the variable name, but this is still a problem because I do not know if it will carry onto the clone.  I do not think so because it is a .env file so there would be no commit for this but better to be safe than sorry.
   
2. I do not have any more problems that I am currently aware of so here are a couple future addons I can do.
    
    * I could expand my database to include passwords.  This means that people could have their own usernames unique to them.  It would be pretty simple to set up.  Have another column in the database named passwords.  When logging in ask for a password and if the password matches, login successfully. If not display error and do not login. Just have to make sure the passwords are never emitted anywhere so people could not easily find them on the console.
    *  I could also expand my database to include the playing history.  This would display who you played against and the outcome of the match.  This would just be another nested array within the database.  There might be some issues with assigning space for the row but that would be later.
   

## Technical Issues

1. I was having a problem with import models in app.py.  Models contained classes and imported db. There was an Attribute Error and further research revealed that importing db from app actually runs app, which imports models and this just keeps on looping.

    I was able to fix this by making functions that returned the classes.  These classes will accept db as a parameter.  This means that I do not have to import db in models. This fixed the circular loop of imports.

2. I was also having an issue with emitting my outcome of the match.  My thought proccess was to have Player 'X' be the only one to send the emits, but when I emitted I was also recieving an emit, so it would update the page and re-emit again.  This would also re-emit the outcome for every emit to the page that doesn't reset the board. 

    I fixed this by changing the code to emit the outcome on clicking a square.  I then had to change my code again because my emits were only emitted by Player 'X'.  So I made it so the winner would emit the outcome.  I also had to make special functions to calculate if that specific move lead to a win/tie and then if so, emit.
