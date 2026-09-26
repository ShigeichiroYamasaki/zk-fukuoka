# Basic operation manuals

Official manuals and instructions for editing learning materials, organized by task. External technical manuals are primarily in English.

[Exercises](./) · [Available tools](./tools)

## Start calculating {#math}

| Manual | What it covers |
| --- | --- |
| [Official SageMath tutorial](https://doc.sagemath.org/html/en/tutorial/) | Input, arithmetic, variables, and help, followed by rings, polynomials, and linear algebra |
| [SageMath installation guide](https://doc.sagemath.org/html/en/installation/) | Choose how to install a local environment |

To try it in a browser, open [SageMathCell](https://sagecell.sagemath.org/), enter `GF(7)(3)^(-1)` in the code field, and press **Evaluate**. The result is `5`. Compare it with the inverse calculation in the [introductory finite-field exercise](../learn/foundations).

## Create a circuit {#circuits}

| Step | Official manual | What it covers |
| --- | --- | --- |
| 1 | [Install Circom](https://docs.circom.io/getting-started/installation/) | Prepare the compiler and supporting tools |
| 2 | [Write your first circuit](https://docs.circom.io/getting-started/writing-circuits/) | Declare inputs, outputs, and constraints |
| 3 | [Compile the circuit](https://docs.circom.io/getting-started/compiling-circuits/) | Generate constraints and witness-calculation code |
| 4 | [Compute the witness](https://docs.circom.io/getting-started/computing-the-witness/) | Supply inputs and generate a witness |

## Generate and verify a proof {#proofs}

| Manual | What it covers |
| --- | --- |
| [Circom proof tutorial](https://docs.circom.io/getting-started/proving-circuits/) | Use snarkjs for Groth16 trusted setup, proof generation, and verification |
| [Official snarkjs README](https://github.com/iden3/snarkjs#readme) | Commands and usage examples |

## Manage materials and exercise results with Git {#git}

| Manual | What it covers |
| --- | --- |
| [Pro Git](https://git-scm.com/book/en/v2) | Repositories, recording changes, branches, and other basic operations |
| [ZK Fukuoka editing guide (Japanese)](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md) | Local editing, previews, and publishing through GitHub |
