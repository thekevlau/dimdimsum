from flask import Flask, redirect, render_template, url_for, jsonify, request, make_response
from flask.ext.socketio import SocketIO, send, emit

app = Flask(__name__, static_url_path='')

from dimdimsum import views
# socketio = SocketIO(app)

# m = {
#     "message": "some string"
# }
# #app.config['SECRET_KEY'] = 'secret!'
# @socketio.on('my event')
# def handle_my_custom_event(json):
#     """does this even go anywhere?"""
#     """why does having an emit function before the print statement, void the print statement?"""
#     print('received message: ' + json['data'])
#     emit('my response', m)

# """
# @socketio.on('my event')
# def handle_my_custom_event(json):
#     emit('my response', m)
# """

def start():
    app.run(debug=True, port=5000);

