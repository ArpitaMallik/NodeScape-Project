import torch
from torch_geometric.data import Data
from model import GraphClassifier

label_map = {0: "Cyclic", 1: "DAG", 2: "Tree"}

def load_trained_model(model_path):
    model = GraphClassifier()
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    return model

def predict_graph_type(edge_list, model):
    edge_index = torch.tensor(edge_list, dtype=torch.long).t().contiguous()
    num_nodes = edge_index.max().item() + 1
    x = torch.ones((num_nodes, 1))  # Dummy feature: all 1s

    data = Data(x=x, edge_index=edge_index)
    data.batch = torch.zeros(data.num_nodes, dtype=torch.long)  # batch size 1

    with torch.no_grad():
        out = model(data.x, data.edge_index, data.batch)
        pred = out.argmax(dim=1).item()

    return label_map[pred]
