# Getting Started with Attendance DApp

This project is a blockchain-based attendance system built using Solidity, Truffle, Ganache, and a React-based frontend with Web3.js.

## Prerequisites

Ensure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (Recommended: v16.0.0 or later)
- [npm](https://www.npmjs.com/) (Comes with Node.js)
- [Truffle](https://trufflesuite.com/) (`npm install -g truffle`)
- [Ganache](https://trufflesuite.com/ganache/) (Download and install)
- [MetaMask](https://metamask.io/) (Browser extension)

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all dependencies required for the project.

### `truffle compile`

Compiles the Solidity smart contracts.

### `truffle migrate`

Deploys the smart contracts to the local blockchain (Ganache must be running).

### `truffle test`

Runs the test suite for the smart contracts.

### `npm start`

Runs the React frontend in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `truffle console`

Opens the Truffle interactive console for testing contract interactions.

## Setting Up the Project

### Step 1: Clone the Repository

```sh
git clone https://github.com/your-repo/attendance-dapp.git
cd attendance-dapp
```

### Step 2: Install Dependencies

```sh
npm install
```

### Step 3: Start Ganache

- Open Ganache and create a new workspace
- Configure the network to `http://127.0.0.1:7545`

### Step 4: Compile and Deploy the Smart Contracts

```sh
truffle compile
truffle migrate --reset
```

### Step 5: Start the Frontend

```sh
npm start
```

## MetaMask Configuration

1. Open MetaMask and create/import an account.
2. Connect MetaMask to the local blockchain:
   - Network: `Custom RPC`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337` (or default Ganache ID)

## Troubleshooting

- If you encounter `truffle migrate` errors, ensure Ganache is running.
- If MetaMask doesn't connect, restart your browser and reconfigure the network.
- If frontend doesn't load properly, ensure all dependencies are installed with `npm install`.

## Learn More

For more details, visit:

- [Truffle Documentation](https://trufflesuite.com/docs/)
- [React Documentation](https://reactjs.org/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

