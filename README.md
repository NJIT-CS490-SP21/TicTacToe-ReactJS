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

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Problems

1. Implementing the .env for the database. Whenever I did `os.getenv('DATAB_URL')`, it was giving me a different DATABASE URL than the one I entered.  There was no reason for that to happen because I clearly did not have any other variables.  I even deleted the content of DATABASE_URL and then even the file, but it was still giving me the same string.

   I was able to fix this by changing the variable name, but this is still a problem because I do not know if it will carry onto the clone.  I do not think so because it is a .env file so there would be no commit for this but better to be safe than sorry.
   

## Technical Issues

1. I was having a problem with import models in app.py.  Models contained classes and imported db. There was an Attribute Error and further research revealed that importing db from app actually runs app, which imports models and this just keeps on looping.

    I was able to fix this by making functions that returned the classes.  These classes will accept db as a parameter.  This means that I do not have to import db in models. This fixed the circular loop of imports.

2. I was also having an issue with...

3. I was also having a problem with my emits.  I originally found this problem because whenever I pressed play again, it would not update for a couple seconds.  This then increased a ton as I kept playing.  I added console logs and checked the console and I found out my emits were going off of the charts.  In my array after the useEffect I included [board, user], so it would first update the board and then the user for every client.  What this did instead was it would emit 2n - 1 times every time another square was clicked. So 1 emits and then 3, then 5... for every single click.  I didn't notice it before because of the low running time of those emits, but as I kept running the program, the lag increased a lot.

    My first thought was that it is recursively running the useEffect every time, which it was.  I had setBoard inside of the useEffect and then I was also having the board in the array, which would set the board, check the changes, it does, emit, to server, go to useEffect, set it again, until there were no more changes. I was able to fix most of the problem by changing the array to [user]. I checked the console logs and it decreased the logs to only n times every time I clicked.  So, 1 emit, 2 emits, so on and so forth. I assumed the same thing so I made it an empty array, []. Which fixed the emit problem. So only one emit was happening every click, which was perfect.
    
    I encountered another problem at this stage, the user was not updating accross the different browsers.  This was an easy fix by just adding another element to the dictionary being passed, {... users: users}. Just fixed up the onClick and the useEffect a little more to update accordingly and then everything worked as it should. 

4. Another issue I fixed was when Player X logged out.  Player O would move to Player X and a Player S would move to Player O.  

    I fixed this by, on the logout, check to see if player X is leaving and then if so, check if the list is > 2 and then switch Player 3 with Player X. then just remove Player X.  The permissions would automatically update in the useEffect.