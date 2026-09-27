// Local teaching setup only. Keys/witnesses stay in a fresh build directory.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const snarkjs = require('snarkjs');
process.chdir(__dirname);
const build = fs.mkdtempSync(path.join(__dirname, 'build-'));
const file = name => path.join(build, name);
const cli = path.join(path.dirname(require.resolve('snarkjs')), 'cli.cjs');
function run(script, args) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr + result.stdout);
}
const snark = (...args) => run(cli, args);
const save = (name, data) => fs.writeFileSync(file(name), JSON.stringify(data, null, 2));
async function main() {
    run(require.resolve('circom2/cli.js'), ['classifier.circom', '--r1cs', '--wasm', '--sym', '-o', build]);
    const wc = await require(file('classifier_js/witness_calculator.js'))(
        fs.readFileSync(file('classifier_js/classifier.wasm')));
    for (let a = 0; a < 16; a++) {
        for (let b = 0; b < 16; b++) {
            const witness = await wc.calculateWitness({ x: [a, b] }, true);
            assert.equal(witness[1], BigInt(a+b >= 16));
        }
    }
    for (const x of [[-1,0], [16,0], [0,16], [0,-1]]) {
        await assert.rejects(() => wc.calculateWitness({ x }, true));
    }
    console.log('PASS: 256 circuit outputs and 4 out-of-range rejections');
    snark('powersoftau', 'new', 'bn128', '6', file('initial.ptau'));
    // Fresh entropy; no shared public ceremony or production security claim.
    snark('powersoftau', 'contribute', file('initial.ptau'), file('contributed.ptau'), '-e='+randomBytes(32).toString('hex'));
    snark('powersoftau', 'prepare', 'phase2', file('contributed.ptau'), file('ready.ptau'));
    snark('groth16', 'setup', file('classifier.r1cs'), file('ready.ptau'), file('initial.zkey'));
    snark('zkey', 'contribute', file('initial.zkey'), file('final.zkey'), '-e='+randomBytes(32).toString('hex'));
    const vk = await snarkjs.zKey.exportVerificationKey(file('final.zkey'));
    save('verification_key.json', vk);
    for (const [name, x, expected] of [['positive',[12,7],'1'], ['negative',[3,4],'0']]) {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            { x }, file('classifier_js/classifier.wasm'), file('final.zkey'));
        assert.deepEqual(publicSignals, [expected]);
        assert.equal(await snarkjs.groth16.verify(vk, publicSignals, proof), true);
        assert.equal(await snarkjs.groth16.verify(vk, [expected === '1' ? '0' : '1'], proof), false);
        save(name+'.proof.json', proof);
        save(name+'.public.json', publicSignals);
    }
    console.log('PASS: 2 Groth16 proofs; 2 changed-label rejections; public signals contain only label');
    console.log('Artifacts:', build);
}
main().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
