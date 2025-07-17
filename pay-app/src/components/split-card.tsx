import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Users, Clock, DollarSign, ArrowRight } from "lucide-react"
import { SplitCardProps } from "../types"

export function SplitCard({
  title,
  amount,
  participants,
  status,
  dueDate,
  yourShare,
  network = "Ethereum",
}: SplitCardProps) {
  const statusColors = {
    active: "badge-success",
    completed: "badge-info",
    pending: "badge-warning",
  }

  return (
    <Card className="w-full card-hover animate-fade-in shadow-soft">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-responsive-lg font-semibold truncate mb-1">{title}</h3>
            <div className="flex items-center gap-2 text-responsive-sm text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{participants} participants</span>
              <span>•</span>
              <span>{network}</span>
            </div>
          </div>
          <Badge className={`${statusColors[status]} flex-shrink-0`}>{status}</Badge>
        </div>

        {/* Amount and Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-responsive-sm text-muted-foreground">Total Amount</p>
              <p className="text-responsive-lg font-semibold">{amount}</p>
            </div>
          </div>
          {yourShare && (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full gradient-success flex-shrink-0" />
              <div>
                <p className="text-responsive-sm text-muted-foreground">Your Share</p>
                <p className="text-responsive-lg font-semibold">{yourShare}</p>
              </div>
            </div>
          )}
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-2 mb-4 text-responsive-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Due {dueDate}</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full sm:w-auto sm:ml-auto sm:flex hover-lift"
          variant={status === "pending" ? "default" : "outline"}
        >
          {status === "pending" ? "Pay Now" : "View Details"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
} 