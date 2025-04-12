'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconAlertTriangle, IconFileText, IconServer, IconUser, IconVirus } from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getEventCount, getNodes, Node, updateSecurityData, getEventTimeline, SecurityData } from '@/lib/data-service';
import { FileUploader } from '@/components/file-uploader';
import { PieGraph } from '@/features/overview/components/pie-graph';

interface FileWithPreview extends File {
  preview?: string;
}

export default function OverviewPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [eventCounts, setEventCounts] = useState({
    file_access: 0,
    module: 0,
    ransomware: 0,
    setuid: 0,
    useradd: 0
  });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
    const counts = getEventCount();
    setEventCounts(counts);
    setNodes(getNodes());
    setLoading(false);
  }, []);

  // Function to refresh data
  const refreshData = useCallback(() => {
    const counts = getEventCount();
    setEventCounts(counts);
    setNodes(getNodes());
  }, []);

  useEffect(() => {
    refreshData();
    setLoading(false);
  }, [refreshData]);

  // Calculate total events
  const totalEvents = useMemo(() => 
    Object.values(eventCounts).reduce((sum, count) => sum + count, 0),
    [eventCounts]
  );
  
  // Prepare data for pie chart
  const pieData = useMemo(() => [
    { name: 'File Access', value: eventCounts.file_access, color: '#0088FE' },
    { name: 'Module Load', value: eventCounts.module, color: '#00C49F' },
    { name: 'Ransomware', value: eventCounts.ransomware, color: '#FF8042' },
    { name: 'Privilege Escalation', value: eventCounts.setuid, color: '#FFBB28' },
    { name: 'User Management', value: eventCounts.useradd, color: '#8884d8' }
  ], [eventCounts]);

  const handleUpload = useCallback(async (files: FileWithPreview[]) => {
    const file = files[0];
    const text = await file.text();
    try {
      const data = JSON.parse(text) as SecurityData;
      updateSecurityData(data);
      refreshData();
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }, [refreshData]);

  // Get timeline data for bar chart
  const barData = useMemo(() => getEventTimeline(), [eventCounts]);

  // Calculate node statistics
  const onlineNodes = nodes.filter(n => n.status === 'online').length;
  const warningNodes = nodes.filter(n => n.status === 'warning').length;
  const offlineNodes = nodes.filter(n => n.status === 'offline').length;

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">IoT Security Dashboard</h2>
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-sm">Upload Security Data</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                onUpload={handleUpload}
                accept={{ 'application/json': ['.json'] }}
                maxSize={1024 * 1024 * 10} // 10MB
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <CardDescription>All security events</CardDescription>
              </div>
              <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                From {Object.keys(eventCounts).length} different categories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">File Access</CardTitle>
                <CardDescription>Sensitive file access events</CardDescription>
              </div>
              <IconFileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventCounts.file_access}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((eventCounts.file_access / totalEvents) * 100)}% of total events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Ransomware</CardTitle>
                <CardDescription>Detected ransomware activity</CardDescription>
              </div>
              <IconVirus className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventCounts.ransomware}</div>
              <Badge variant="outline" className="bg-red-100 text-red-800">High Severity</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Node Status</CardTitle>
                <CardDescription>IoT device status</CardDescription>
              </div>
              <IconServer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlineNodes} / {nodes.length}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">{onlineNodes} Online</Badge>
                {warningNodes > 0 && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{warningNodes} Warning</Badge>
                )}
                {offlineNodes > 0 && (
                  <Badge variant="outline" className="bg-red-100 text-red-800">{offlineNodes} Offline</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Event Distribution</CardTitle>
              <CardDescription>
                Security events by category
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieGraph />
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                Security events over time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="file_access" name="File Access" fill="#0088FE" />
                    <Bar dataKey="ransomware" name="Ransomware" fill="#FF8042" />
                    <Bar dataKey="user_management" name="User Management" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events Details</CardTitle>
              <CardDescription>
                Detailed information about detected security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Event Type</th>
                      <th className="text-left p-2">Process</th>
                      <th className="text-left p-2">PID</th>
                      <th className="text-left p-2">Path/File</th>
                      <th className="text-left p-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventCounts.file_access > 0 && (
                      <tr className="border-b bg-blue-50">
                        <td className="p-2 font-medium">File Access</td>
                        <td className="p-2">{eventCounts.file_access > 0 ? 'tt' : '-'}</td>
                        <td className="p-2">{eventCounts.file_access > 0 ? '2390' : '-'}</td>
                        <td className="p-2">{eventCounts.file_access > 0 ? '/etc/passwd, /root/.ssh/authorized_keys' : '-'}</td>
                        <td className="p-2">Sensitive file access detected</td>
                      </tr>
                    )}
                    {eventCounts.ransomware > 0 && (
                      <tr className="border-b bg-red-50">
                        <td className="p-2 font-medium">Ransomware</td>
                        <td className="p-2">{eventCounts.ransomware > 0 ? 'a.out' : '-'}</td>
                        <td className="p-2">{eventCounts.ransomware > 0 ? '7581' : '-'}</td>
                        <td className="p-2">{eventCounts.ransomware > 0 ? '/tmp/honeypot_dir*' : '-'}</td>
                        <td className="p-2">Multiple honeypot files accessed</td>
                      </tr>
                    )}
                    {eventCounts.module > 0 && (
                      <tr className="border-b bg-green-50">
                        <td className="p-2 font-medium">Module Load</td>
                        <td className="p-2">{eventCounts.module > 0 ? 'sudo' : '-'}</td>
                        <td className="p-2">{eventCounts.module > 0 ? '6353' : '-'}</td>
                        <td className="p-2">{eventCounts.module > 0 ? '/usr/bin/insmod' : '-'}</td>
                        <td className="p-2">Kernel module loaded</td>
                      </tr>
                    )}
                    {eventCounts.setuid > 0 && (
                      <tr className="border-b bg-yellow-50">
                        <td className="p-2 font-medium">Privilege Escalation</td>
                        <td className="p-2">{eventCounts.setuid > 0 ? 'setfiles' : '-'}</td>
                        <td className="p-2">{eventCounts.setuid > 0 ? '2412' : '-'}</td>
                        <td className="p-2">{eventCounts.setuid > 0 ? '/home/lark/test/test/setfiles' : '-'}</td>
                        <td className="p-2">setuid/setgid to root</td>
                      </tr>
                    )}
                    {eventCounts.useradd > 0 && (
                      <tr className="border-b bg-purple-50">
                        <td className="p-2 font-medium">User Management</td>
                        <td className="p-2">{eventCounts.useradd > 0 ? 'sudo' : '-'}</td>
                        <td className="p-2">{eventCounts.useradd > 0 ? '4527' : '-'}</td>
                        <td className="p-2">{eventCounts.useradd > 0 ? '/usr/bin/useradd' : '-'}</td>
                        <td className="p-2">New user added</td>
                      </tr>
                    )}
                    {totalEvents === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No security events detected. Upload security data to view events.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
