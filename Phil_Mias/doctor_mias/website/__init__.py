from flask import Flask


def create_app():
    new_app = Flask(__name__, static_url_path="/website/static")
    new_app.config['SECRET_KEY'] = 'nigger-man'

    from .views import views

    new_app.register_blueprint(views, url_prefix='/')

    return new_app
