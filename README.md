# Split Pay 💰

**Split Pay is a collaborative app that allows several people to contribute to a group payment from any blockchain, gathering all the contributions and delivering the total amount to the recipient in the network of their preference as a single unified payment.**

Split Pay lets anyone easily split group expenses. Everyone pays their share from any blockchain, and the receiver gets the combined total on their chosen network, thanks to LI.FI's cross-chain tech. Perfect for friends, remote teams, or digital communities.

## ✨ Features

- 🌐 Multi-chain payments (Mantle, Ethereum, Polygon)
- 🔗 Cross-chain aggregation with LI.FI
- 📱 Mobile-first responsive design
- 🔐 Web3 wallet integration
- 🎫 Simple token-based sharing

## 🚧 Status

- ✅ Frontend & Backend
- ✅ Web3 Integration  
- ✅ Token System
- 🔄 LI.FI Integration
- 🔄 Database

## 🔮 Upcoming Features

- 📜 Split History - Track past splits and payments
- 👤 User Profiles - Personalized accounts and preferences
- 📱 QR Code to Join Split - Scan to join splits instantly
- 🎨 Improved Interface - Enhanced UX/UI design
- 💳 Simple Payment Without Splitting - Direct payment option

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Web3**: ethers.js, MetaMask support
- **Networks**: Mantle, Ethereum, Polygon

## � Quick Start

### Prerequisites
- Node.js 18+
- Web3 wallet

### Installation
```bash
git clone https://github.com/jotaRacer/splitPay.git
cd splitPay
npm install
cd backend && npm install && cd ..
```

### Run
```bash
# Both servers
npm run dev:all

# Or separately
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 3001
```

## 💡 How It Works

1. **Create Split** → Generate a 12-character token
2. **Share Token** → Others join using the token
3. **Pay** → Everyone pays from their preferred blockchain
4. **Collect** → Receiver gets total on their chosen network

## 🔧 API

- `POST /api/splits/create` - Create split
- `GET /api/splits/token/:token` - Get split info
- `POST /api/splits/join` - Join split
- `POST /api/splits/mark-paid` - Mark as paid

## � Project Structure

```
split-pay/
├── app/           # Next.js pages (create, join, success)
├── components/    # UI components
├── contexts/      # Web3 state management
├── lib/           # Utils and API client
└── backend/       # Express.js API
    ├── controllers/
    ├── models/
    └── services/
```
## 📄 License

MIT License

---

**Made with ❤️ from Chile by students**
