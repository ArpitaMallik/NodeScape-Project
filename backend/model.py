# model.py
import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from model_architecture import GraphClassifier

LABEL_MAP = {0: "Cyclic", 1: "DAG", 2: "Tree"}

def load_model(model_path="graph_gnn_model.pt"):
    model = GraphClassifier()
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_graph(model, edges, node_count):
    edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
    x = torch.ones((node_count, 1))  # Simple node features
    data = Data(x=x, edge_index=edge_index)
    data.batch = torch.zeros(node_count, dtype=torch.long)

    with torch.no_grad():
        out = model(data.x, data.edge_index, data.batch)
        pred = out.argmax(dim=1).item()
        confidence = F.softmax(out, dim=1)[0][pred].item()

    return pred, confidence
