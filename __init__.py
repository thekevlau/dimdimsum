"""
WSGI webapp using Flask
"""
"""from gevent import monkey
monkey.patch_all()
"""
from flask import Flask
from flask import redirect, render_template, url_for, jsonify, request, make_response
from flask.ext.socketio import SocketIO, send, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
m = {
    "message": "some string"
}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event')
def handle_my_custom_event(json):
    """does this even go anywhere?"""
    """why does having an emit function before the print statement, void the print statement?"""
    print('received message: ' + json['data'])
    emit('my response', m)

"""
@socketio.on('my event')
def handle_my_custom_event(json):
    emit('my response', m)
"""

if __name__ == '__main__':
    socketio.run(app)
