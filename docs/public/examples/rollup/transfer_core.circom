pragma circom 2.1.6;

// Arithmetic-only exercise. No signature, Merkle path, batching or bridge.
template UInt(n) {
    signal input value;
    signal bits[n];
    var sum = 0;
    for (var i = 0; i < n; i++) {
        bits[i] <-- (value >> i) & 1;
        bits[i] * (bits[i] - 1) === 0;
        sum += bits[i] * (2 ** i);
    }
    value === sum;
}

template TransferCore() {
    signal input senderBalance;
    signal input receiverBalance;
    signal input amount;
    signal input nonce;
    signal output senderAfter;
    signal output receiverAfter;
    signal output nonceAfter;
    signal amountInverse;

    senderAfter <== senderBalance - amount;
    receiverAfter <== receiverBalance + amount;
    nonceAfter <== nonce + 1;
    // Amount must be nonzero as well as uint64.
    amountInverse <-- 1 / amount;
    amount * amountInverse === 1;

    component ranges[7];
    for (var i = 0; i < 7; i++) ranges[i] = UInt(64);
    ranges[0].value <== senderBalance;
    ranges[1].value <== receiverBalance;
    ranges[2].value <== amount;
    ranges[3].value <== nonce;
    ranges[4].value <== senderAfter;
    ranges[5].value <== receiverAfter;
    ranges[6].value <== nonceAfter;
}

component main {public [senderBalance, receiverBalance, amount, nonce]} = TransferCore();
