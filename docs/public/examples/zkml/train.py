"""Integer perceptron on a synthetic, exhaustive 4-bit domain. Python 3.8+."""
import json
from pathlib import Path

def train():
    weights, bias = [0, 0], 0
    for epoch in range(10000):
        errors = 0
        for a in range(16):
            for b in range(16):
                target = int(a + b >= 16)
                predicted = int(weights[0] * a + weights[1] * b + bias >= 0)
                delta = target - predicted
                if delta:
                    weights[0] += delta * a
                    weights[1] += delta * b
                    bias += delta
                    errors += 1
        if not errors:
            return dict(weights=weights, bias=bias, epochs=epoch + 1)
    raise RuntimeError('No convergence')

if __name__ == '__main__':
    model = train()
    # The distributed circuit fixes these constants. A new model needs a new circuit/key.
    assert model == dict(weights=[19, 19], bias=-296, epochs=59)
    for a in range(16):
        for b in range(16):
            assert int(19*a + 19*b - 296 >= 0) == int(a+b >= 16)
    Path('model.json').write_text(json.dumps(model, indent=2) + '\n')
    print(json.dumps(model), '256/256 training examples matched (not a held-out accuracy test)')
