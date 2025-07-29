# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torch_geometric.data import Data
from model import load_model, predict_graph

app = Flask(__name__)
CORS(app) 

model = load_model()

@app.route('/api/predict-graph-type', methods=['POST'])
def predict_graph_type():
    data = request.json
    edges = data.get('edges', [])
    node_count = data.get('node_count', 0)

    if not edges or node_count == 0:
        return jsonify({'error': 'Invalid input'}), 400

    try:
        prediction, confidence = predict_graph(model, edges, node_count)
        return jsonify({'label': prediction, 'confidence': confidence})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/")
def index():
    return "Backend is running"

if __name__ == '__main__':
    app.run(port=5000, debug=True)
