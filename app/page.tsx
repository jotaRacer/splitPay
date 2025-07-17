"use client"

import { MobileHeader } from "@/components/mobile-header"
import { QuickActions } from "@/components/quick-actions"
import { SplitCard } from "@/components/split-card"
import { ContributionProgress } from "@/components/contribution-progress"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveButton } from "@/components/ui/responsive-button"
import { ResponsiveInput } from "@/components/ui/responsive-input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, ArrowUpRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const activeSplits = [
    {
      title: "Team Dinner at Sushi Place",
      amount: "$240.00",
      participants: 6,
      status: "pending" as const,
      dueDate: "Tomorrow",
      yourShare: "$40.00",
      network: "Polygon",
    },
    {
      title: "Weekend Trip to Mountains",
      amount: "$1,200.00",
      participants: 8,
      status: "active" as const,
      dueDate: "Dec 15",
      yourShare: "$150.00",
      network: "Ethereum",
    },
    {
      title: "Office Party Supplies",
      amount: "$85.50",
      participants: 12,
      status: "completed" as const,
      yourShare: "$7.13",
      network: "Base",
    },
  ]

  const contributors = [
    { name: "Alice Johnson", amount: "$50.00", network: "Ethereum" },
    { name: "Bob Smith", amount: "$75.00", network: "Polygon" },
    { name: "Carol Davis", amount: "$40.00", network: "Base" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="container-fluid py-6 space-y-8">
        {/* Welcome Section - Priority on mobile */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-responsive-base text-muted-foreground">
                Manage your splits and contributions across chains
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions - Priority section on mobile */}
        <section>
          <QuickActions />
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-2">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-sm text-muted-foreground">Total Splits</p>
                  <p className="text-responsive-2xl font-bold">24</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-responsive-xs text-green-600">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-sm text-muted-foreground">Amount Split</p>
                  <p className="text-responsive-2xl font-bold">$3,240</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-responsive-xs text-green-600">+8% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-sm text-muted-foreground">Active Networks</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Ethereum</Badge>
                    <Badge variant="outline">Polygon</Badge>
                    <Badge variant="outline">Base</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Featured Split - High priority on mobile */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-responsive-2xl font-bold">Featured Split</h2>
            <ResponsiveButton variant="outline" size="sm">
              View All
            </ResponsiveButton>
          </div>

          <ContributionProgress
            title="Team Building Event"
            totalAmount="$500.00"
            collectedAmount="$165.00"
            percentage={33}
            contributors={contributors}
          />
        </section>

        {/* Recent Splits */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-responsive-2xl font-bold">Your Splits</h2>

            {/* Search - Better positioned on larger screens */}
            <div className="relative sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <ResponsiveInput placeholder="Search splits..." className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {activeSplits.map((split, index) => (
              <SplitCard key={index} {...split} />
            ))}
          </div>
        </section>

        {/* Bottom CTA - Mobile optimized */}
        <section className="text-center py-8">
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-responsive-xl font-semibold mb-2">Ready to split a new payment?</h3>
              <p className="text-responsive-base text-muted-foreground mb-6">
                Create a split in seconds and invite your friends to contribute
              </p>
              <ResponsiveButton size="lg" className="w-full sm:w-auto">
                Create New Split
              </ResponsiveButton>
            </CardContent>
          </Card>
        </section>

        {/* New Buttons Section */}
        <section className="text-center space-y-8">
          <h1 className="text-3xl font-bold">Split Pay</h1>

          <p className="text-gray-600 text-lg">Split payments across different blockchains with your friends</p>

          <div className="space-y-4">
            <Button onClick={() => router.push("/setup")}>Start a Split</Button>

            <Button variant="outline" onClick={() => router.push("/contribute")}>
              Contribute to a Split
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
