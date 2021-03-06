import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# print('\n\n')
# print("Find:", find_dotenv())
# print()
# print("DATA:", os.getenv('DATAB_URL'))
# print()
# print("LOAD:", load_dotenv("") )
# print('\n\n')


# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATAB_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

import models

db.create_all()


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