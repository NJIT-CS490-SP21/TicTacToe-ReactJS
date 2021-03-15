import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
app = Flask(__name__, static_folder='./build/static')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATAB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

import models
if __name__ == '__main__':
    db.create_all()

Player = models.getPlayerClass(db)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

userList = []


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

    players = getLeaderboardAsArray()
    socketio.emit('leaderboard', players)


# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')


@socketio.on('chat')
def on_chat(data):
    print(str(data))
    socketio.emit('chat', data, broadcast=True, include_self=False)


@socketio.on('board')
def on_board(data):
    print(data)
    socketio.emit('board', data, broadcast=True, include_self=False)


@socketio.on('reset')
def on_reset():
    socketio.emit('reset', broadcast=True, include_self=False)


@socketio.on('login')
def on_login(data):
    print("Adding:", data)
    userList.append(data)
    socketio.emit('login', userList, broadcast=True, include_self=True)

    # append only if it does not exist within databasee
    if Player.query.filter_by(username=data).first() == None:
        player = Player(username=data, score=100)
        db.session.add(player)
        db.session.commit()

    # grab leaderboard as an array
    players = getLeaderboardAsArray()

    socketio.emit('leaderboard', players, broadcast=True, include_self=True)


@socketio.on('logout')
def on_logout(data):
    print("Removing", data)

    # swap player x with first player s if x is leaving
    if (userList[0] == data and len(userList) > 2):
        userList[0], userList[2] = userList[2], userList[0]

    userList.remove(data)
    socketio.emit('logout', userList, broadcast=True, include_self=True)


@socketio.on('match')
def on_match(
        data):  # data will be 'X','O',or 'S'.  Will only be sent by winner
    win = data[0]
    username = data[1]

    # Update Leaderboard, +1 winner -1 loser
    updateLeaderboardScore(win)

    players = getLeaderboardAsArray()
    print("After Updata Players:", players)

    socketio.emit('leaderboard', players, broadcast=True, include_self=True)


def getLeaderboardAsArray():
    leaderboard = Player.query.order_by(Player.score.desc()).all()
    players = []
    for player in leaderboard:
        players.append([player.username, player.score])

    return players


def updateLeaderboardScore(win):
    if win == 'X':  # add 1 to 'X', subtract 1 from 'O'
        winner = Player.query.filter_by(username=userList[0]).first()
        winner.score = winner.score + 1

        loser = Player.query.filter_by(username=userList[1]).first()
        loser.score = loser.score - 1
        db.session.commit()

    elif win == 'O':  # subtract 1 from 'X', add 1 to 'O'
        winner = Player.query.filter_by(username=userList[1]).first()
        winner.score = winner.score + 1

        loser = Player.query.filter_by(username=userList[0]).first()
        loser.score = loser.score - 1
        db.session.commit()

    elif win == 'Tie':
        # do nothing
        pass


# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
