# model_architecture.py
import torch
import torch.nn.functional as F
from torch.nn import Linear, Module
from torch_geometric.nn import GCNConv, global_mean_pool

class GraphClassifier(Module):
    def __init__(self, in_channels=1, hidden_channels=64, out_channels=3):
        super(GraphClassifier, self).__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, hidden_channels)
        self.lin = Linear(hidden_channels, out_channels)

    def forward(self, x, edge_index, batch):
        x = F.relu(self.conv1(x, edge_index))
        x = F.relu(self.conv2(x, edge_index))
        x = global_mean_pool(x, batch)
        return self.lin(x)
