# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)

def square(num):
    return num ** 2

@app.route('/square', methods=['GET'])
def get_square():
    # Retrieve the number from the query parameter (e.g., /square?num=4)
    num = request.args.get('num', type=int)
    
    if num is None:
        return jsonify({"error": "Missing 'num' query parameter"}), 400
    
    result = square(num)  # Call your function
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)