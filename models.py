
def getPerson(db):
    class Person(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True, nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
    
        def __repr__(self):
            return '<Person %r>' % self.username
    return Person
def getPlayerClass(db):
    class Player(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True, nullable=False)
        score = db.Column(db.Integer, unique=False, nullable=False)
    
        def __repr__(self):
            return '<Player %r>' % self.username
    return Player

def hello_world():
    print("Hello world")
    return True