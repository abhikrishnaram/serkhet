import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';

const eventsData = [
  {
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts detected',
    timestamp: '2 minutes ago',
    severity: 'high',
    node: 'Gateway-Node-01',
    icon: 'alert'
  },
  {
    title: 'System Update Completed',
    description: 'Security patches successfully installed',
    timestamp: '15 minutes ago',
    severity: 'info',
    node: 'Server-Node-03',
    icon: 'success'
  },
  {
    title: 'New Device Connected',
    description: 'IoT device authenticated to network',
    timestamp: '1 hour ago',
    severity: 'info',
    node: 'Edge-Node-05',
    icon: 'info'
  },
  {
    title: 'Anomaly Detected',
    description: 'Unusual traffic pattern identified',
    timestamp: '2 hours ago',
    severity: 'medium',
    node: 'Sensor-Node-02',
    icon: 'alert'
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-destructive text-destructive-foreground';
    case 'medium':
      return 'bg-warning text-warning-foreground';
    case 'info':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-primary text-primary-foreground';
  }
};

const getIcon = (icon: string) => {
  switch (icon) {
    case 'alert':
      return <IconAlertTriangle className="h-4 w-4" />;
    case 'success':
      return <IconCircleCheck className="h-4 w-4" />;
    case 'info':
      return <IconInfoCircle className="h-4 w-4" />;
    default:
      return <IconInfoCircle className="h-4 w-4" />;
  }
};

export function RecentEvents() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>System events from the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6 max-h-[320px] overflow-y-auto'>
          {eventsData.map((event, index) => (
            <div key={index} className='flex items-start space-x-4'>
              <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                {getIcon(event.icon)}
              </div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{event.title}</p>
                  <span className='text-xs text-muted-foreground'>{event.timestamp}</span>
                </div>
                <p className='text-sm text-muted-foreground'>{event.description}</p>
                <div className='flex items-center space-x-2'>
                  <Badge variant="outline" className='text-xs'>
                    {event.node}
                  </Badge>
                  <Badge className={`text-xs ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
