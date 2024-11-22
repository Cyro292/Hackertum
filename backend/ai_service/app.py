from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    content = data.get('content', '')
    # Mock AI processing: reverse the content
    processed_content = content[::-1]
    return jsonify({'processed_content': processed_content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
