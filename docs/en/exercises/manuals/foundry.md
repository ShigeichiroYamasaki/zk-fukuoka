---
outline: [2, 3]
---

# Foundry / Anvil Operation Manual

Updated: November 20, 2026

Foundry is a toolkit for building and testing Solidity projects. Forge builds and tests contracts; Anvil runs a local EVM chain. This guide covers the L1 side of the ZK rollup exercise without connecting to a testnet.

## Use this repository's Docker environment

From the repository root, run:

```sh
docker compose --profile evm run --rm --service-ports foundry
```

Anvil listens on the local RPC endpoint `http://127.0.0.1:8545`. Leave this terminal running, then check the connection from another terminal:

```sh
curl -s -X POST -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \\
  http://127.0.0.1:8545
```

The response's `result` should be `0x7a69` (31337 in decimal). Stop Anvil with `Ctrl+C` in the terminal where it is running.

## Use a Foundry project

If Foundry is installed locally, create a practice project and run the basic commands:

```sh
forge init hello-foundry
cd hello-foundry
forge build
forge test
```

`forge init` creates a project skeleton, `forge build` compiles Solidity, and `forge test` runs tests. First run the generated tests, then add the contract and tests for the exercise.

## Local installation

Before using the official installation script, review the official guide and its security notes. After installation, open a new terminal and run:

```sh
foundryup
forge --version
anvil --version
```

To start Anvil manually, run `anvil --host 127.0.0.1`. Its default development accounts and private keys are for local learning only. Do not use real assets or production keys, and do not expose this RPC endpoint to external networks.

## In the exercise

Use `forge build` to compile the Solidity contract and `forge test` to test state transitions. If you try deployment or RPC calls, keep the endpoint on local Anvil. This environment does not automatically provide a complete system connecting Circom circuits, proof generation and the L1 contract.

## Official references

- [Foundry installation](https://www.getfoundry.sh/introduction/installation)
- [Creating a Foundry project](https://www.getfoundry.sh/projects/)
- [Forge](https://www.getfoundry.sh/forge/)
- [Anvil](https://www.getfoundry.sh/anvil/)

[Basic operation manuals](../manuals) · [Available tools](../tools) · [ERC-20 ZK rollup applied course](../../rollup/)
