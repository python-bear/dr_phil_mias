from website import create_app
from flask import send_from_directory


main_app = create_app()


@main_app.route('/favicon.ico')
def favicon():
    return send_from_directory(main_app.root_path, 'statis/imgs/favicon.png', mimetype='image/vnd.microsoft.icon')


if __name__ == '__main__':
    main_app.run(debug=True, host='0.0.0.0', port=8888, threaded=True)

