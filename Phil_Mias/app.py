from website import create_app
from flask import send_from_directory, render_template
from flask_socketio import SocketIO, emit
from engineio.async_drivers import gevent
import geventwebsocket
import signal
import sys

import webbrowser
import socket


port = 8888
app = create_app()
socketio = SocketIO(app)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path, 'statis/imgs/favicon.png', mimetype='image/vnd.microsoft.icon')


@app.route('/chatroom')
def chatroom():
    return render_template('chatroom.html')


@socketio.on('message')
def handle_message(message):
    emit('message', message, broadcast=True)


def signal_handler(sig, frame):
    print('\n\nTERMINATING DR. PHIL MIAS WEBSITE FROM MAIN\n\n')
    sys.exit()


def main():
    print('\n\nRUNNING DR. PHIL MIAS WEBSITE FROM MAIN\n\n')
    webbrowser.open(f"http://{socket.gethostbyname(socket.gethostname())}:{port}/home")

    # app.run(debug=True, host='0.0.0.0', port=8888, threaded=True)
    socketio.run(app, host='0.0.0.0', port=port, debug=True)


if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    main()
