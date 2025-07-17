import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ResponsiveButton } from "./ui/responsive-button"
import { Share2, Copy } from "lucide-react"

interface ContributionProgressProps {
  title: string
  totalAmount: string
  collectedAmount: string
  percentage: number
  contributors: Array<{
    name: string
    amount: string
    network: string
    avatar?: string
  }>
}

export function ContributionProgress({
  title,
  totalAmount,
  collectedAmount,
  percentage,
  contributors,
}: ContributionProgressProps) {
  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-responsive-xl">{title}</CardTitle>
          <div className="flex gap-2">
            <ResponsiveButton variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </ResponsiveButton>
            <ResponsiveButton variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </ResponsiveButton>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-responsive-sm text-muted-foreground">Progress</span>
            <span className="text-responsive-sm font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between items-center">
            <span className="text-responsive-lg font-semibold">{collectedAmount}</span>
            <span className="text-responsive-base text-muted-foreground">of {totalAmount}</span>
          </div>
        </div>

        {/* Contributors */}
        <div className="space-y-3">
          <h4 className="text-responsive-base font-medium">Contributors ({contributors.length})</h4>
          <div className="space-y-2">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-responsive-sm font-medium">
                    {contributor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-responsive-sm font-medium">{contributor.name}</p>
                    <p className="text-responsive-xs text-muted-foreground">{contributor.network}</p>
                  </div>
                </div>
                <span className="text-responsive-sm font-semibold">{contributor.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <ResponsiveButton className="w-full" size="lg">
          Contribute to this Split
        </ResponsiveButton>
      </CardContent>
    </Card>
  )
}
