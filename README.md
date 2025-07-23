# Split Pay 💰

**A Web3 app for splitting group payments across blockchains. Everyone pays from any network, receiver gets the total on their preferred chain.**

Perfect for splitting bills, group purchases, or any shared expenses with friends, teams, or communities.

## ✨ Features

- 🔐 **Multiple login options**: Email, Google, Twitter, or Web3 wallets
- 🌐 **Cross-chain payments**: Pay from any blockchain, receive on any other
- 📱 **Mobile-first design**: Works great on all devices
- 🎫 **Simple sharing**: 12-character tokens to join splits
- 🧪 **Testing environment**: Safe testnet integration

## 🚧 Current Status

- ✅ Frontend & Backend complete
- ✅ Privy authentication with social login
- ✅ LI.FI cross-chain integration
- ✅ Testnet environment
- 🔄 Database integration
- 🔄 Mainnet deployment

## 🔮 Coming Soon

- 📜 Split history tracking
- 👤 User profiles
- 📱 QR code sharing
- 💳 Direct payments (no splitting)

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Privy with social login
- **Web3**: ethers.js, LI.FI SDK
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Privy App ID

### Installation
```bash
git clone https://github.com/jotaRacer/splitPay.git
cd splitPay
npm install
cd backend && npm install && cd ..
```

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

### Run
```bash
npm run dev:all    # Both frontend and backend
npm run dev        # Frontend only (port 3000)
```

## 💡 How It Works

1. **Create Split** → Set amount and generate sharing token
2. **Share Token** → Send 12-character code to participants
3. **Pay** → Everyone pays from their preferred blockchain
4. **Receive** → Creator gets total on their chosen network

## 🧪 Testing

- Visit `/testnet` for safe testing environment
- Get free test tokens from built-in faucets
- Test all features without real money

## 🔧 API Endpoints

- `POST /api/splits/create` - Create new split
- `GET /api/splits/token/:token` - Get split details
- `POST /api/splits/join` - Join existing split
- `POST /api/splits/mark-paid` - Mark payment complete

## 📁 Project Structure

```
split-pay/
├── app/           # Next.js pages
├── components/    # React components
├── contexts/      # Web3 providers
├── lib/           # Utilities
└── backend/       # Express API
```

## 📄 License

MIT License

---

**Made with ❤️ in Chile**