import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { Share2, Copy } from "lucide-react"
import { ContributionProgressProps } from "../types"

export function ContributionProgress({
  title,
  totalAmount,
  collectedAmount,
  percentage,
  contributors,
}: ContributionProgressProps) {
  return (
    <Card className="w-full border-2 shadow-soft animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-responsive-xl">{title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover-lift">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
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
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-responsive-sm font-medium shadow-soft">
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
        <Button size="lg" className="w-full hover-lift gradient-primary shadow-soft">
          Contribute to this Split
        </Button>
      </CardContent>
    </Card>
  )
} 