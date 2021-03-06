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
1. When one of the clients exits the browser without logging out, the logout event will not be emitted so the username will not be taken out from list.  This would destroy the current server because new users would be added to the end of the list.  Since the permissions is derived from the begining of the list, the user would take up one of the 'X' or 'O' permission spots, thereby ruining the current server.  
 
    I would fix this by periodically having a ping to the current users.  If I do not get a response within a certain time frame, that user would be taken off of the list and the next user in the list will replace them.

    Another way I could fix this is keeping track of the disconnect.  There may be a way to track the id of the person who disconnected.  I would then be able to take that unique id's username from the user list.  I would have to make the user list a dictionary and map the client id's to their respective usernames.
    
    This is a huge issue because if you deploy to Herkou, the server is always running.  That means that once a user closes the tab before logging out, the whole website will be unable to work. The only way to fix it is to log into Heroku and restart it from there.  This is a huge long term problem and should be fixed as soon as possible.
2. Another problem my code has is the chat feature and the user list displayed feature.  My css for the page is only up to a certain height.  This means that when there are many users or messages in the chat, the browser becomes scrollable and can scroll down to see the added messages or users.  This is a problem because my background-image for the page does not go that low.

    I would fix this by having the list of messages and the list of users, scrollable.  This would make the local block scrollable instead of the whole page. Then there would be no conflict with the page and everything would belong to the local block.
    
    I was also thinking of making the text smaller and having the padding between each bullet point very small. Right now like only 5 messages are needed to reach the defined edge of the background-image, this would make the problem less noticable by increasing this amount to maybe almost double. 
    
    I could also overhaul the listItem for the users and display the users in a scrollable table.  This would look a lot better than the current list and could be expanded on to do some interesting things.  Like, when clicked, go automatically scroll to the nearest chat from them. Or display how long they were in the queue when hovered.  Interesting things could come from fixing the users like this.
3. Another problem I encountered was doing the permissions.  I was sending setting the username state before the emit but when it went back to the useEffect, username would not be changed.  I fixed this by having the username in the brackets at the end of the useEffect.  This made another problem though.  I would recieve 2 login events then.  Nothing would change, but the username would be updated.  My problem is that only one login event should appear.    

4. Implementing the .env for the database. Whenever I did `os.getenv('DATAB_URL')`, it was giving me a different DATABASE URL than the one I entered.  There was no reason for that to happen because I clearly did not have any other variables.  I even deleted the content of DATABASE_URL and then even the file, but it was still giving me the same string.

   I was able to fix this by changing the variable name, but this is still a problem because I do not know if it will carry onto the clone.  I do not think so because it is a .env file so there would be no commit for this but better to be safe than sorry.
   

## Technical Issues

1. I was having a problem with updating the status of the board.  Originally, status was a state and every click, it would check winner and then be displayed in the return. However, the browser would always display an empty string.  I added logs and check them and I found out that status was never being updated before it reached the return.  
    
    I could not figure out why until I found a site saying that setState functions are like a queue and would not update until it ran through the rest of the code first.  I still do not know why it does that.  

    I tried to fix it by making status a global variable and just changing the variable in the onClick.  This also displayed an empty string.  I was finally able to fix it by assigning the variable and setting the variable right before the return statement.  I could not set the variable inside of the onClick function or it would not work. I assume that this is similar to the previous problem and it would not update until after it runs through the code.
    
    I thought that this would not work because in order for it to update the page, one of the states need to be updated, however I believe it still works because whenever I click to make a move, the board state updates which would then see the updated status and allow that to be displayed
    
2. I was also having a problem with my emits.  I originally found this problem because whenever I pressed play again, it would not update for a couple seconds.  This then increased a ton as I kept playing.  I added console logs and checked the console and I found out my emits were going off of the charts.  In my array after the useEffect I included [board, user], so it would first update the board and then the user for every client.  What this did instead was it would emit 2n - 1 times every time another square was clicked. So 1 emits and then 3, then 5... for every single click.  I didn't notice it before because of the low running time of those emits, but as I kept running the program, the lag increased a lot.

    My first thought was that it is recursively running the useEffect every time, which it was.  I had setBoard inside of the useEffect and then I was also having the board in the array, which would set the board, check the changes, it does, emit, to server, go to useEffect, set it again, until there were no more changes. I was able to fix most of the problem by changing the array to [user]. I checked the console logs and it decreased the logs to only n times every time I clicked.  So, 1 emit, 2 emits, so on and so forth. I assumed the same thing so I made it an empty array, []. Which fixed the emit problem. So only one emit was happening every click, which was perfect.
    
    I encountered another problem at this stage, the user was not updating accross the different browsers.  This was an easy fix by just adding another element to the dictionary being passed, {... users: users}. Just fixed up the onClick and the useEffect a little more to update accordingly and then everything worked as it should. 

3. Another issue I fixed was when Player X logged out.  Player O would move to Player X and a Player S would move to Player O.  

    I fixed this by, on the logout, check to see if player X is leaving and then if so, check if the list is > 2 and then switch Player 3 with Player X. then just remove Player X.  The permissions would automatically update in the useEffect.