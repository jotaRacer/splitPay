import { ResponsiveButton } from "./ui/responsive-button"
import { Plus, Users, History, QrCode } from "lucide-react"

export function QuickActions() {
  return (
    <div className="w-full">
      <h2 className="text-responsive-2xl font-bold mb-4 sm:mb-6">Quick Actions</h2>

      {/* Mobile: Stack vertically, Desktop: Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <ResponsiveButton size="lg" className="h-16 sm:h-20 flex-col gap-2">
          <Plus className="h-6 w-6" />
          <span className="text-responsive-sm font-medium">Create Split</span>
        </ResponsiveButton>

        <ResponsiveButton variant="outline" size="lg" className="h-16 sm:h-20 flex-col gap-2">
          <QrCode className="h-6 w-6" />
          <span className="text-responsive-sm font-medium">Join Split</span>
        </ResponsiveButton>

        <ResponsiveButton variant="outline" size="lg" className="h-16 sm:h-20 flex-col gap-2">
          <Users className="h-6 w-6" />
          <span className="text-responsive-sm font-medium">My Groups</span>
        </ResponsiveButton>

        <ResponsiveButton variant="outline" size="lg" className="h-16 sm:h-20 flex-col gap-2">
          <History className="h-6 w-6" />
          <span className="text-responsive-sm font-medium">History</span>
        </ResponsiveButton>
      </div>
    </div>
  )
}
