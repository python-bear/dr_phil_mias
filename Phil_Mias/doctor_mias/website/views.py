from flask import Blueprint, render_template, request, redirect
import random
from datetime import datetime


views = Blueprint("__main__", "views")


def generate_random_int(low, high):
    return random.randint(low, high)


def get_current_time():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return current_time


@views.route("/home")
def home():
    return render_template("home.html")


@views.route("/num/<chosen_number>")
def numbered_home(chosen_number):
    return render_template("numb.html", num=chosen_number)


@views.route("/data")
def data():
    return render_template("data.html")


@views.route("/yo_mama")
def yo_mama_joke():
    args = request.args
    joke_number = args.get("joke")
    if not joke_number:
        joke_number = generate_random_int(1, 2766)

    with open("website/static/text/yo_mama_jokes.txt", "r", encoding="UTF-8") as file:
        jokes = file.readlines()
        joke = jokes[int(joke_number) - 1]

    return render_template("yo_mama.html", joke=joke)


@views.route("/games")
def game_page():
    return render_template("games.html")


@views.route("/games/rightwaves")
def game_rightwaves():
    return render_template("games/rightwaves.html")


@views.route("/games/2048")
def game_2048():
    return render_template("games/2048.html")


@views.route("/games/snake")
def game_snake():
    return render_template("games/snake.html")


@views.route("/games/tetris")
def game_tetris():
    return render_template("games/tetris.html")


@views.route("/games/pacman")
def game_pacman():
    return render_template("games/pacman.html")


@views.route("/games/pong")
def game_pong():
    return render_template("games/pong.html")


@views.route("/games/breakout")
def game_breakout():
    return render_template("games/breakout.html")


@views.route("/games/drowning")
def game_drowning():
    return render_template("games/drowning.html")


@views.route("/games/frogger")
def game_frogger():
    return render_template("games/frogger.html")


@views.route("/games/block_dude")
def game_block_dude():
    return render_template("games/block_dude.html")


@views.route("/games/bomberman")
def game_bomberman():
    return render_template("games/bomberman.html")


@views.route("/games/missile")
def game_missile():
    return render_template("games/missile.html")


@views.route("/games/sokoban")
def game_sokoban():
    return render_template("games/sokoban.html")


@views.route("/games/jump")
def game_jump():
    return render_template("games/jump.html")


@views.route("/games/bobble")
def game_bobble():
    return render_template("games/bobble.html")


@views.route("/")
def root_home():
    return redirect("/home")


@views.route("/jo_mama")
def jo_mama():
    return redirect("/yo_mama")