import os 
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

import models
if __name__ =='__main__':
    db.create_all()

Player= models.getPlayerClass(db)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

userList = []


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    
    # change to make order by DESCENDING
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    print("Leaders", leaderboard, "\n\n")
    
    players = []
    for player in leaderboard:
        players.append( [player.username, player.score] )
    print("Players:", players)
    
    socketio.emit('leaderboard', players)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat',  data, broadcast=True, include_self=False)


# When a client emits the event 'board' to the server, this function is run
# 'board' is a custom event name that we just decided when a player clicks
@socketio.on('board')
def on_board(data): # data is whatever arg you pass in your emit call on client
    print( data  )
    # This emits the 'board' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('board',  data, broadcast=True, include_self=False)

@socketio.on('reset')
def on_reset():
    socketio.emit('reset', broadcast=True, include_self=False)

@socketio.on('login')
def on_login( data ):
    print("Adding:", data)
    userList.append(data)
    socketio.emit('login', userList , broadcast=True, include_self=True)
    
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    print("\n\nFirst:",leaderboard)

    players = []
    appendUser = True
    for player in leaderboard:
        players.append( [player.username, player.score] )
        if player.username == data:
            appendUser = False
    print("Players:", players)
    
    # update leaderboard
    if appendUser:
        player = Player(username=data, score=100)
        db.session.add(player)
        db.session.commit()
    
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    print("\n\nSecond:",leaderboard)
    players = []
    for player in leaderboard:
        players.append( [player.username, player.score] )
        
    print("Players:", players)
    
    socketio.emit('leaderboard', players, broadcast=True, include_self=True)
    

@socketio.on('logout')
def on_logout( data ):
    # swap player x with first player s
    if (userList[0] == data and len(userList) > 2):
        temp = userList[0]
        userList[0] = userList[2]
        userList[2] = temp
        
    
    print("Removing", data)
    print(userList)
    userList.remove(data)
    socketio.emit('logout', userList, broadcast=True, include_self=True)
    

@socketio.on('match')
def on_match( data ): # data will be 'X','O',or 'S'.  Will only be sent by 'X'
    print("\nWho won?  ", data,"\n")
    win = data[0]
    username = data[1]
    
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    players = []
    for player in leaderboard:
        players.append( [player.username, player.score] )
    print("Before Update Players:", players)
    
    
    if win == 'X':
        # add 1 to 'X', subtract 1 from 'O'
        winner = Player.query.filter_by(username=userList[0]).first()
        winner.score = winner.score + 1
        
        loser = Player.query.filter_by(username=userList[1]).first()
        loser.score = loser.score - 1
        db.session.commit()
        
    elif win == 'O':
        # subtract 1 from 'X', add 1 to 'O'
        winner = Player.query.filter_by(username=userList[1]).first()
        winner.score = winner.score + 1
        
        loser = Player.query.filter_by(username=userList[0]).first()
        loser.score = loser.score - 1
        db.session.commit()
        
    elif win == 'Tie':
        # do nothing
        print(data)
    
    
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    players = []
    for player in leaderboard:
        players.append( [player.username, player.score] )
    print("After Updata Players:", players)
    
    socketio.emit('leaderboard', players, broadcast=True, include_self=True)
    
# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)

'''

import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='./build/static')


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


app.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
'''