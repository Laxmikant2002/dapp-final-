# 🗳️ Blockchain-based Voting DApp

A modern, decentralized voting platform powered by Ethereum smart contracts and a React frontend.

---

## 🚀 Features

- 🔒 Secure, transparent, and tamper-proof voting
- 🛠️ Admin dashboard for election and candidate management
- 📊 Real-time election results
- 🧑‍💼 Voter registration and verification
- 🦊 MetaMask wallet integration
- 📱 Responsive, user-friendly UI
- 🧪 Mock/demo data support

---

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** React, TailwindCSS, Framer Motion
- **Web3:** Ethers.js, MetaMask
- **Testing:** Hardhat, React Testing Library, Jest
- **Deployment:** Vercel (frontend), Ethereum testnet (backend)

---

## 📁 Project Structure

```text
Voting-Dapp-master/
├── contracts/           # Solidity smart contracts
├── scripts/             # Deployment and interaction scripts
├── client/              # React frontend (SPA)
│   ├── src/
│   ├── public/
│   └── ...
├── artifacts/           # Compiled contract artifacts
├── cache/               # Hardhat cache
├── docs/                # Documentation
├── hardhat.config.js    # Hardhat configuration
├── package.json         # Project dependencies
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)

---

### 2. Clone & Install

```bash
git clone https://github.com/yourusername/voting-dapp.git
cd Voting-Dapp-master
npm install
cd client
npm install
```

---

### 3. Local Blockchain & Contract Deployment

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

---

### 4. Start the Frontend

```bash
cd client
npm start
```
- App runs at [http://localhost:3000](http://localhost:3000)

---

### 5. Run Tests

**Smart Contracts:**
```bash
npx hardhat test
```

**Frontend:**
```bash
cd client
npm test
```

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Build React App:**
    ```bash
    cd client
    npm run build
    ```

2. **Install Vercel CLI:**
    ```bash
    npm install -g vercel
    ```

3. **Login & Deploy:**
    ```bash
    vercel login
    vercel --prod
    ```
    - Output directory: `build`
    - For React Router, ensure `client/vercel.json`:
      ```json
      {
        "rewrites": [
          { "source": "/(.*)", "destination": "/index.html" }
        ]
      }
      ```

4. **Live Production:**  
   https://dappvoting-6y3jajm8f-laxmikant2002s-projects.vercel.app

---

## ⚙️ Environment Variables

- Set contract address and network in the frontend as needed.
- For testnet, update `.env` and contract addresses after deployment.

---

## 📜 Scripts

- `scripts/deploy.js` – Deploy contracts
- `scripts/interact.js` – Interact with contracts
- `scripts/check-network.js` – Check network status

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

MIT License

---

## 💬 Support

Open an issue or email: support@votingdapp.com

---

## 🙏 Acknowledgments

- Hardhat & Ethereum community
- React & TailwindCSS teams

---

> **Tip:** For future frontend deployments, just run `vercel --prod` from the `client` directory.

---