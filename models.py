''' create objects for database to hold leaderboard information '''


def get_person(database):
    ''' return class Person for a database'''
    class Person(database.Model):
        ''' create class Person and set up output'''
        id = database.Column(database.Integer, primary_key=True)
        username = database.Column(database.String(80),
                                   unique=True,
                                   nullable=False)
        email = database.Column(database.String(120),
                                unique=True,
                                nullable=False)

        def __repr__(self):
            return '<Person %r>' % self.username

    return Person


def get_player_class(database):
    ''' return class Player for a database'''
    class Player(database.Model):
        ''' create class Player and set up output'''
        id = database.Column(database.Integer, primary_key=True)
        username = database.Column(database.String(80),
                                   unique=True,
                                   nullable=False)
        score = database.Column(database.Integer, unique=False, nullable=False)

        def __repr__(self):
            return '<Player %r>' % self.username

    return Player
