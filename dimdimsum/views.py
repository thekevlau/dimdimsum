from dimdimsum import app
import flask
#shouldn't need below if above import works...
#from flask import redirect, render_template, url_for, jsonify, request, make_response
#from flask.ext.socketio import SocketIO, send, emit
# from app import socketio, render_template
# because i imported render_template into app, i can import it from app, now
# that said...is there a better way? I could just do
# from app import *, but that doesn't seem like good practice?....

@app.route('/')
def index():
    return app.send_static_file('index.html')

# @app.route('/<path:path>')
# def static_files(path):
#     return app.send_static_file(path)

