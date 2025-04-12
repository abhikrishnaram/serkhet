'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for configuration
interface DetectionRule {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  actions: {
    type: string;
    params: Record<string, string>;
  }[];
}

interface NodeConfig {
  id: string;
  name: string;
  enabled: boolean;
  scanInterval: number;
  monitorPaths: string[];
  alertThreshold: number;
}

// Mock data
const mockRules: DetectionRule[] = [
  {
    id: '1',
    name: 'Sensitive File Access',
    type: 'file_access',
    enabled: true,
    conditions: [
      {
        field: 'path',
        operator: 'contains',
        value: '/etc/passwd'
      }
    ],
    actions: [
      {
        type: 'alert',
        params: {
          severity: 'high'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Ransomware Detection',
    type: 'ransomware',
    enabled: true,
    conditions: [
      {
        field: 'count',
        operator: 'greater_than',
        value: '100'
      }
    ],
    actions: [
      {
        type: 'alert',
        params: {
          severity: 'critical'
        }
      }
    ]
  }
];

const mockNodeConfigs: NodeConfig[] = [
  {
    id: '1',
    name: 'Node-1',
    enabled: true,
    scanInterval: 60,
    monitorPaths: ['/etc', '/var/log'],
    alertThreshold: 100
  },
  {
    id: '2',
    name: 'Node-2',
    enabled: true,
    scanInterval: 30,
    monitorPaths: ['/home', '/tmp'],
    alertThreshold: 50
  }
];

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState(mockRules);
  const [nodeConfigs, setNodeConfigs] = useState(mockNodeConfigs);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleNode = (nodeId: string) => {
    setNodeConfigs(configs => 
      configs.map(config =>
        config.id === nodeId ? { ...config, enabled: !config.enabled } : config
      )
    );
  };

  return (
    <PageContainer>
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="rules">Detection Rules</TabsTrigger>
            <TabsTrigger value="nodes">Node Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base font-medium">
                    {rule.name}
                  </CardTitle>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Type</Label>
                      <Select defaultValue={rule.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="file_access">File Access</SelectItem>
                          <SelectItem value="ransomware">Ransomware</SelectItem>
                          <SelectItem value="useradd">User Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {rule.conditions.map((condition, idx) => (
                      <div key={idx} className="grid gap-2">
                        <Label>Condition {idx + 1}</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Field"
                            defaultValue={condition.field}
                            className="flex-1"
                          />
                          <Select defaultValue={condition.operator}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Value"
                            defaultValue={condition.value}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Add Condition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full">Add New Rule</Button>
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4">
            {nodeConfigs.map((config) => (
              <Card key={config.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base font-medium">
                    {config.name}
                  </CardTitle>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => toggleNode(config.id)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Scan Interval (seconds)</Label>
                      <Input 
                        type="number"
                        defaultValue={config.scanInterval}
                        min={1}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Alert Threshold</Label>
                      <Input 
                        type="number"
                        defaultValue={config.alertThreshold}
                        min={0}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Monitored Paths</Label>
                      {config.monitorPaths.map((path, idx) => (
                        <Input key={idx} defaultValue={path} />
                      ))}
                      <Button variant="outline" className="w-full">
                        Add Path
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
