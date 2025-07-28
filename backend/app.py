from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can call API

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/api/bfs", methods=["POST"])
def bfs():
    data = request.json
    graph = data["graph"]
    start = data["start"]
    visited = []
    queue = [start]

    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            queue.extend([n for n in graph.get(node, []) if n not in visited])
    return jsonify({"order": visited})

@app.route("/api/dfs", methods=["POST"])
def dfs():
    data = request.json
    graph = data["graph"]
    start = data["start"]
    visited = []

    def dfs_recursive(node):
        if node not in visited:
            visited.append(node)
            for neighbor in graph.get(node, []):
                dfs_recursive(neighbor)

    dfs_recursive(start)
    return jsonify({"order": visited})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
