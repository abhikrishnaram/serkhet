'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconAlertTriangle, IconFileText, IconUser, IconVirus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { SecurityEvent, getAllEvents } from '@/lib/data-service';
import { CorrelationView } from '@/features/events/components/correlation-view';

// Extend the base SecurityEvent type with UI-specific fields
interface UIEvent {
  id: string;
  nodeId: string;
  type: string;
  event: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  file?: string;
  args?: string[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = getAllEvents();
        // Transform events into UI format
        const uiEvents = allEvents.map(event => ({
          id: event.id,
          nodeId: `Node-${Math.floor(Math.random() * 3) + 1}`, // Mock node assignment
          type: event.event,
          event: event.event,
          timestamp: new Date(), // Mock timestamp
          severity: getSeverityForEvent(event),
          ...(('file' in event) && { file: event.file }),
          ...(('args' in event) && { args: event.args })
        }));
        setEvents(uiEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Function to determine severity based on event type and details
  const getSeverityForEvent = (event: SecurityEvent): 'low' | 'medium' | 'high' => {
    if ('event' in event) {
      switch (event.event) {
        case 'ransomware':
          return 'high';
        case 'file_access':
          if ('file' in event && (event.file.includes('/etc/passwd') || event.file.includes('/root'))) {
            return 'high';
          }
          return 'medium';
        case 'setuid':
        case 'setgid':
          return 'high';
        case 'user_management':
          return 'high';
      }
    }
    return 'medium';
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Security Events</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <CorrelationView />
          </div>
        </div>
      </PageContainer>
    );
  }

  // Function to render the appropriate icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'file_access':
        return <IconFileText className="h-4 w-4" />;
      case 'ransomware':
        return <IconVirus className="h-4 w-4 text-red-500" />;
      case 'user_management':
        return <IconUser className="h-4 w-4" />;
      default:
        return <IconAlertTriangle className="h-4 w-4" />;
    }
  };

  // Function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Security Events</h2>
          <Badge variant="outline" className="px-4 py-1">
            {events.length} Events
          </Badge>
        </div>

        <div className="space-y-4 grid grid-cols-2 gap-4">
          <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{getEventIcon(event.type)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{event.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.event === 'file_access' && event.file && `File: ${event.file}`}
                        {event.event === 'ransomware' && event.file && `Target: ${event.file}`}
                        {event.event === 'user_management' && event.args && `Command: ${event.args.join(' ')}`}
                      </div>
                    </TableCell>
                    <TableCell>{event.nodeId}</TableCell>
                    <TableCell>{new Date(event.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          </Card>
          <CorrelationView />
        </div>
      </div>
    </PageContainer>
  );
}
