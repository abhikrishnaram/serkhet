import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { StatCard } from "./card"

const StatsCards = () => {
    // Data moved inside component for potential dynamic updates
    const statsData = [
        {
            title: "Total Events",
            subtext: "All security events in the last 30 days",
            description: "5 different categories tracked",
            value: "24",
            percentage: "+15%",
            trend: "up" as const,
            trendIcon: <IconTrendingUp />
        },
        {
            title: "Critical Alerts",
            subtext: "High priority security incidents",
            description: "Requires immediate attention",
            value: "1",
            percentage: "-12%",
            trend: "down" as const,
            trendIcon: <IconTrendingDown />
        },
        {
            title: "Active Devices",
            subtext: "Connected IoT devices in network",
            description: "Healthy connection rate",
            value: "1",
            percentage: "-50%",
            trend: "down" as const,
            trendIcon: <IconTrendingDown />
        },
        {
            title: "Threat Score",
            subtext: "Overall security risk assessment",
            description: "Lower risk than last month",
            value: "3.2/10",
            percentage: "-2.1",
            trend: "down" as const,
            trendIcon: <IconTrendingDown />
        }
    ]

    return (
        <div className='*:data-[slot=card]:from-primary/5 mb-4 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
            {statsData.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    subtext={stat.subtext}
                    description={stat.description}
                    value={stat.value}
                    percentage={stat.percentage}
                    trend={stat.trend}
                    trendIcon={stat.trendIcon}
                />
            ))}
        </div>
    )
}

export default StatsCards
