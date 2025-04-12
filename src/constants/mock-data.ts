import { SecurityData, Node } from '@/lib/data-service';

// Generate random process paths
const processNames = ['sshd', 'nginx', 'apache2', 'mysql', 'mongodb', 'redis', 'docker', 'kubernetes', 'systemd'];
const processUsers = ['root', 'www-data', 'mysql', 'mongodb', 'redis'];
const filePaths = [
  '/etc/passwd',
  '/etc/shadow',
  '/var/log/auth.log',
  '/var/log/syslog',
  '/etc/ssh/sshd_config',
  '/etc/nginx/nginx.conf',
  '/var/www/html/index.php',
  '/var/lib/mysql/data',
  '/home/user/.ssh/id_rsa'
];

// Generate timestamps for the last 24 hours
const generateTimestamps = () => {
  const timestamps = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(now.getHours() - i);
    timestamps.push(date);
  }
  return timestamps;
};

// Generate random events
const generateEvents = (count: number): SecurityData => {
  const timestamps = generateTimestamps();
  const data: SecurityData = {
    file_access: [],
    module: [],
    ransomware: [],
    setuid: [],
    useradd: []
  };

  // Generate file access events
  for (let i = 0; i < count; i++) {
    data.file_access.push({
      event: 'file_access',
      file: filePaths[Math.floor(Math.random() * filePaths.length)],
      pid: Math.floor(Math.random() * 10000),
      process: processNames[Math.floor(Math.random() * processNames.length)],
      process_path: `/usr/sbin/${processNames[Math.floor(Math.random() * processNames.length)]}`
    });
  }

  // Generate module events
  for (let i = 0; i < Math.floor(count / 2); i++) {
    data.module.push({
      event: 'module_load',
      args: ['-f', '--config', '/etc/config.conf'],
      binary: `/usr/lib/${processNames[Math.floor(Math.random() * processNames.length)]}`,
      pid: Math.floor(Math.random() * 10000),
      process: processNames[Math.floor(Math.random() * processNames.length)],
      process_path: `/usr/sbin/${processNames[Math.floor(Math.random() * processNames.length)]}`
    });
  }

  // Generate ransomware events
  for (let i = 0; i < Math.floor(count / 4); i++) {
    data.ransomware.push({
      event: 'ransomware',
      count: Math.floor(Math.random() * 100),
      elevated: Math.floor(Math.random() * 2),
      file: filePaths[Math.floor(Math.random() * filePaths.length)],
      pid: Math.floor(Math.random() * 10000),
      process: processNames[Math.floor(Math.random() * processNames.length)],
      process_path: `/usr/sbin/${processNames[Math.floor(Math.random() * processNames.length)]}`
    });
  }

  // Generate setuid events
  for (let i = 0; i < Math.floor(count / 3); i++) {
    data.setuid.push({
      event: Math.random() > 0.5 ? 'setuid' : 'setgid',
      pid: Math.floor(Math.random() * 10000),
      process: processNames[Math.floor(Math.random() * processNames.length)],
      process_path: `/usr/sbin/${processNames[Math.floor(Math.random() * processNames.length)]}`,
      uid: Math.floor(Math.random() * 1000),
      gid: Math.floor(Math.random() * 1000)
    });
  }

  // Generate user management events
  for (let i = 0; i < Math.floor(count / 5); i++) {
    data.useradd.push({
      event: 'user_management',
      args: ['--create-home', '--shell', '/bin/bash'],
      binary: '/usr/sbin/useradd',
      pid: Math.floor(Math.random() * 10000),
      process: 'useradd',
      process_path: '/usr/sbin/useradd'
    });
  }

  return data;
};

// Generate mock nodes with realistic data
export const mockNodes: Node[] = Array.from({ length: 10 }, (_, i) => {
  const status = Math.random() > 0.7 ? 'warning' : Math.random() > 0.2 ? 'online' : 'offline';
  const lastSeen = status === 'offline' ? new Date(Date.now() - Math.random() * 86400000) : new Date();
  
  return {
    id: (i + 1).toString(),
    name: `Node-${i + 1}`,
    ip: `192.168.1.${100 + i}`,
    status,
    lastSeen,
    metrics: {
      cpu: status === 'offline' ? 0 : Math.floor(Math.random() * 100),
      memory: status === 'offline' ? 0 : Math.floor(Math.random() * 100),
      events: status === 'offline' ? 0 : Math.floor(Math.random() * 200)
    }
  };
});

// Generate initial security data
export const initialSecurityData: SecurityData = generateEvents(1000);

// Export the generator function for dynamic updates
export { generateEvents };
