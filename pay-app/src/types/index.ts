export interface Split {
  id: string
  title: string
  amount: string
  participants: number
  status: 'pending' | 'active' | 'completed'
  dueDate?: string
  yourShare?: string
  network: string
}

export interface Contributor {
  name: string
  amount: string
  network: string
}

export interface ContributionProgressProps {
  title: string
  totalAmount: string
  collectedAmount: string
  percentage: number
  contributors: Contributor[]
}

export interface SplitCardProps extends Split {}

export interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export interface WalletStatus {
  isConnected: boolean
  address?: string
  network?: string
} 