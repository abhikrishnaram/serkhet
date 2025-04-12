'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityEvent, getAllEvents, FileAccessEvent, UserManagementEvent, ModuleEvent } from '@/lib/data-service';

// Type guards
function isFileAccessEvent(event: SecurityEvent | { id: string } & SecurityEvent): event is FileAccessEvent | ({ id: string } & FileAccessEvent) {
  return event.event === 'file_access';
}

function isUserManagementEvent(event: SecurityEvent | { id: string } & SecurityEvent): event is UserManagementEvent | ({ id: string } & UserManagementEvent) {
  return event.event === 'user_management';
}

function isModuleEvent(event: SecurityEvent | { id: string } & SecurityEvent): event is ModuleEvent | ({ id: string } & ModuleEvent) {
  return event.event === 'module_load';
}

function getEventPath(event: SecurityEvent | { id: string } & SecurityEvent): string {
  // All event types have process_path
  return event.process_path;
}

interface CorrelatedEvent {
  id: string;
  sourceEvent: string;
  relatedEvents: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
}

export function CorrelationView() {
  const [correlations, setCorrelations] = useState<CorrelatedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would call an API to get correlation data
    // For now, we'll generate some mock correlations based on our events
    const generateMockCorrelations = async () => {
      try {
        const allEvents = getAllEvents();
        
        // Group events by process path
        const eventsByProcess = allEvents.reduce<Record<string, SecurityEvent[]>>((acc, event) => {
          const path = getEventPath(event);
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(event);
          return acc;
        }, {});
        
        // Generate correlations for processes with multiple events
        const mockCorrelations: CorrelatedEvent[] = [];
        
        Object.entries(eventsByProcess).forEach(([processPath, events]) => {
          if (events.length > 1) {
            // Create a correlation for this group of events
            mockCorrelations.push({
              id: `corr-${processPath.split('/').pop()}`,
              sourceEvent: `${events[0].event}-${getEventPath(events[0])}`,
              relatedEvents: events.slice(1).map(e => `${e.event}-${getEventPath(e)}`),
              severity: events.some(e => e.event === 'ransomware') ? 'high' : 'medium',
              description: `Multiple security events from process: ${processPath}`,
              timestamp: new Date()
            });
          }
        });
        
        // Add a few more interesting correlations
        if (allEvents.some(e => isFileAccessEvent(e) && e.file.includes('/etc/passwd'))) {
          mockCorrelations.push({
            id: 'corr-sensitive-access',
            sourceEvent: 'file_access-/etc/passwd',
            relatedEvents: allEvents
              .filter(isUserManagementEvent)
              .map(e => `${e.event}-${e.process_path}`),
            severity: 'high',
            description: 'Sensitive file access followed by user management operations',
            timestamp: new Date()
          });
        }
        
        setCorrelations(mockCorrelations);
      } catch (error) {
        console.error('Failed to generate correlations:', error);
      } finally {
        setLoading(false);
      }
    };

    generateMockCorrelations();
  }, []);

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

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Correlations</CardTitle>
        <CardDescription>
          Detected patterns and relationships between security events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High Severity</TabsTrigger>
            <TabsTrigger value="medium">Medium Severity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {correlations.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No correlations detected
              </div>
            ) : (
              correlations.map((correlation) => (
                <div 
                  key={correlation.id} 
                  className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{correlation.description}</h4>
                    {getSeverityBadge(correlation.severity)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Source event: {correlation.sourceEvent}</p>
                    <p>Related events: {correlation.relatedEvents.length}</p>
                    <p>Detected: {new Date(correlation.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="high" className="space-y-4">
            {correlations.filter(c => c.severity === 'high').map((correlation) => (
              <div 
                key={correlation.id} 
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{correlation.description}</h4>
                  {getSeverityBadge(correlation.severity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Source event: {correlation.sourceEvent}</p>
                  <p>Related events: {correlation.relatedEvents.length}</p>
                  <p>Detected: {new Date(correlation.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="medium" className="space-y-4">
            {correlations.filter(c => c.severity === 'medium').map((correlation) => (
              <div 
                key={correlation.id} 
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{correlation.description}</h4>
                  {getSeverityBadge(correlation.severity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Source event: {correlation.sourceEvent}</p>
                  <p>Related events: {correlation.relatedEvents.length}</p>
                  <p>Detected: {new Date(correlation.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
