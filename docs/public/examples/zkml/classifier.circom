pragma circom 2.2.2;

// Bit hints are constrained: boolean bits plus exact reconstruction.
template Bits(n) {
    signal input in;
    signal output bit[n];
    var reconstructed = 0;
    for (var i = 0; i < n; i++) {
        bit[i] <-- (in >> i) & 1;
        bit[i] * (bit[i] - 1) === 0;
        reconstructed += bit[i] * (2 ** i);
    }
    in === reconstructed;
}

template Classifier() {
    signal input x[2];
    signal output label;
    component bounded[2];
    for (var i = 0; i < 2; i++) {
        bounded[i] = Bits(4);
        bounded[i].in <== x[i];
    }
    // Trained model: s = 19*x[0] + 19*x[1] - 296.
    // s in [-296, 274]; s+512 in [216,786]. Top bit is 1 iff s >= 0.
    component shifted = Bits(10);
    shifted.in <== 19*x[0] + 19*x[1] + 216;
    label <== shifted.bit[9];
}

// Private inputs, one public output. This does not bind x to an external record.
component main = Classifier();
