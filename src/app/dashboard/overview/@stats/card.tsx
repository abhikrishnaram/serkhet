import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

interface StatCardProps {
    title: string
    subtext: string
    description: string
    value: string
    percentage: string
    trend: "up" | "down"
    trendIcon?: React.ReactNode
}

export const StatCard = ({
    title,
    subtext,
    description,
    value,
    percentage,
    trend,
    trendIcon
}: StatCardProps) => {
    return (
        <Card className='@container/card'>
          <CardHeader>
            <CardDescription>{title}</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {value}
            </CardTitle>
            <CardAction>
              <Badge variant='outline'>
                {trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                {percentage}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              {description} {trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground text-xs">
                {subtext}
            </div>
          </CardFooter>
        </Card>
    )
}
