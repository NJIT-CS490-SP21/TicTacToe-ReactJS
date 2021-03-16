''' Server for a TicTacToe web application.

Listens and sends emits to clients based on client actions.
Holds lists of current users.
Can access and update database of winners/losers to show leaderboard.
'''

import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
APP = Flask(__name__, static_folder='./build/static')

APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATAB_URL')
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

import models
if __name__ == '__main__':
    DB.create_all()

Player = models.get_player_class(DB)

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

USERLIST = []


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    ''' creates the app '''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    ''' When a user connects, run this function '''
    print('User connected!')

    players = get_leaderboard_as_array()
    SOCKETIO.emit('leaderboard', players)


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    ''' When a user disconnects, run this function '''
    print('User disconnected!')


@SOCKETIO.on('chat')
def on_chat(data):
    ''' When app receives a 'chat' event, run this function '''
    print(str(data))
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)


@SOCKETIO.on('board')
def on_board(data):
    ''' When app receives a 'board' event, run this function '''
    print(data)
    SOCKETIO.emit('board', data, broadcast=True, include_self=True)


@SOCKETIO.on('reset')
def on_reset():
    ''' When app receives a 'reset' event, run this function '''
    SOCKETIO.emit('reset', broadcast=True, include_self=False)


@SOCKETIO.on('login')
def on_login(data):
    ''' When app receives a 'login' event, run this function '''
    print("Adding:", data)
    add_user_to_userlist(data, USERLIST)
    SOCKETIO.emit('login', USERLIST, broadcast=True, include_self=True)

    # append only if it does not exist within databasee
    if Player.query.filter_by(username=data).first() is None:
        add_user_to_database(data)

    # grab leaderboard as an array
    players = get_leaderboard_as_array()

    SOCKETIO.emit('leaderboard', players, broadcast=True, include_self=True)

def add_user_to_userlist(data, USERLIST):
    ''' adds username to logged in userlists '''
    USERLIST.append(data)
    return USERLIST
    
def add_user_to_database(data):
    ''' Add user to database if it doesn't already exist within the database '''
    player = Player(username=data, score=100)
    DB.session.add(player)
    DB.session.commit()

@SOCKETIO.on('logout')
def on_logout(data):
    ''' When app receives a 'logout' event, run this function '''
    print("Removing", data)

    # swap player x with first player s if x is leaving
    remove_data_from_userlist(data, USERLIST)
    SOCKETIO.emit('logout', USERLIST, broadcast=True, include_self=True)
    
def remove_data_from_userlist(data, USERLIST):
    if (USERLIST[0] == data and len(USERLIST) > 2):
        USERLIST[0], USERLIST[2] = USERLIST[2], USERLIST[0]

    USERLIST.remove(data)
    return USERLIST

@SOCKETIO.on('match')
def on_match(
        data):  # data will be 'X','O',or 'S'.  Will only be sent by winner
    ''' When app receives a 'match' event, run this function '''
    win = data[0]

    # Update Leaderboard, +1 winner -1 loser
    update_leaderboard_score(win)

    players = get_leaderboard_as_array()
    print("After Updata Players:", players)

    SOCKETIO.emit('leaderboard', players, broadcast=True, include_self=True)


def get_leaderboard_as_array():
    ''' Get the database and store data in an array '''
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    players = []
    for player in leaderboard:
        players.append([player.username, player.score])

    return players


def update_leaderboard_score(win):
    ''' Update the database based upon the winner '''
    if win == 'X':  # add 1 to 'X', subtract 1 from 'O'
        winnerIncrement(0)
        loserDecrement(1)
        
        DB.session.commit()

    elif win == 'O':  # subtract 1 from 'X', add 1 to 'O'
        winnerIncrement(1)
        loserDecrement(0)
        
        DB.session.commit()

    elif win == 'Tie':
        # do nothing
        pass

def winnerIncrement(index):
    ''' increment winner in database based on userlist index'''
    winner =  Player.query.filter_by(username=USERLIST[index]).first()
    winner.score = winner.score + 1
    
def loserDecrement(index):
    ''' decrement loser in database based on userlist index '''
    loser =  Player.query.filter_by(username=USERLIST[index]).first()
    loser.score = loser.score - 1
    
# Note that we don't call app.run anymore. We call socketio.run with app arg
SOCKETIO.run(
    APP,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
