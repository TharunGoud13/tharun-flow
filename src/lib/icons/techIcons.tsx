import React from 'react';
import { 
  Server, Database, Cloud, Globe, Cpu, Box, Lock, Shield, 
  Layers, HardDrive, Terminal, GitBranch, Bell, Activity,
  Workflow, Zap, Smartphone, Monitor, Code2, Network
} from 'lucide-react';

export interface TechIconDef {
  id: string;
  name: string;
  category: 'cloud' | 'database' | 'backend' | 'frontend' | 'devops' | 'networking' | 'security' | 'general';
  tags: string[];
  render: (props: { className?: string; size?: number }) => React.ReactNode;
}

export const TECH_ICONS: TechIconDef[] = [
  // Cloud Providers & Services
  {
    id: 'aws',
    name: 'AWS',
    category: 'cloud',
    tags: ['amazon', 'cloud', 'infrastructure', 'ec2', 's3'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M7 16c4 2 9 2 12-1M6 14.5c.3.5.7.9 1.2 1.2M18.5 13.5l1.5 1.5-2 1" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 9l3-5h2l3 5M6 7.5h4M13 4l2 5 2-5M15 7.5h3" stroke="#232F3E" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'aws-ec2',
    name: 'AWS EC2',
    category: 'cloud',
    tags: ['compute', 'virtual machine', 'server', 'aws'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#FF9900" strokeWidth="2" fill="#FFF4E5"/>
        <path d="M8 8h8M8 12h8M8 16h5" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="1.5" fill="#FF9900"/>
      </svg>
    )
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    category: 'cloud',
    tags: ['storage', 'bucket', 'object', 'aws'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3v10c0 1.7-3.6 3-8 3s-8-1.3-8-3V7z" stroke="#E11D48" strokeWidth="2" fill="#FFE4E6"/>
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="#E11D48" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'aws-lambda',
    name: 'AWS Lambda',
    category: 'cloud',
    tags: ['serverless', 'function', 'compute', 'aws'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF9900" fillOpacity="0.15" stroke="#FF9900" strokeWidth="2"/>
        <path d="M8 18l4-10h2l3 10M10.5 13h5M6 18h4M16 18h4" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    category: 'cloud',
    tags: ['gcp', 'google', 'cloud', 'gke', 'bigquery'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
        <path d="M14 13l-4 4-2-2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'cloud',
    tags: ['azure', 'microsoft', 'cloud', 'blob', 'functions'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M13.5 3L4 16h6l-2.5 5L20 7h-6.5z" fill="#0078D4"/>
      </svg>
    )
  },

  // Databases & Caching
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    tags: ['sql', 'database', 'rdbms', 'relational', 'postgres'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C7 2 3 5 3 10c0 3 2 6 5 8v4l4-2c0 0 5 0 8-5 2-4 2-9-2-12-1.5-1-4-1-6-1z" fill="#336791" fillOpacity="0.15" stroke="#336791" strokeWidth="2"/>
        <circle cx="9" cy="9" r="1.5" fill="#336791"/>
        <circle cx="15" cy="9" r="1.5" fill="#336791"/>
        <path d="M8 14s2 2 4 2 4-2 4-2" stroke="#336791" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    tags: ['cache', 'in-memory', 'key-value', 'nosql', 'fast'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M3 7l9-4 9 4-9 4-9-4z" fill="#DC382D" fillOpacity="0.9"/>
        <path d="M3 12l9 4 9-4M3 17l9 4 9-4" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    tags: ['nosql', 'document', 'database', 'json'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C11 5 6 9 6 14c0 3.5 2.5 6 6 8 3.5-2 6-4.5 6-8 0-5-5-9-6-12z" fill="#13AA52" fillOpacity="0.2" stroke="#13AA52" strokeWidth="2"/>
        <path d="M12 4v16" stroke="#13AA52" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    tags: ['sql', 'relational', 'database', 'oracle'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="7" rx="8" ry="3" stroke="#00758F" strokeWidth="2" fill="#E6F4F7"/>
        <path d="M4 7v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7" stroke="#00758F" strokeWidth="2"/>
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="#00758F" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'backend',
    tags: ['event', 'streaming', 'queue', 'pubsub', 'message'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="6" r="3" stroke="#231F20" strokeWidth="2" fill="#000"/>
        <circle cx="6" cy="16" r="3" stroke="#231F20" strokeWidth="2" fill="#000"/>
        <circle cx="18" cy="16" r="3" stroke="#231F20" strokeWidth="2" fill="#000"/>
        <path d="M12 9v4l-4 2M12 13l4 2" stroke="#231F20" strokeWidth="2"/>
      </svg>
    )
  },

  // Containers & DevOps
  {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    tags: ['container', 'image', 'compose', 'devops'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M2 13c1 0 2-1 4-1 2 0 3 2 5 2s3-2 5-2 3 2 5 2c1 0 1.5-.5 2-1 0 4-3 7-9 7s-10-3-12-7z" fill="#2496ED" fillOpacity="0.2" stroke="#2496ED" strokeWidth="2"/>
        <rect x="5" y="8" width="2" height="2" fill="#2496ED"/>
        <rect x="8" y="8" width="2" height="2" fill="#2496ED"/>
        <rect x="11" y="8" width="2" height="2" fill="#2496ED"/>
        <rect x="8" y="5" width="2" height="2" fill="#2496ED"/>
      </svg>
    )
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'devops',
    tags: ['k8s', 'orchestration', 'cluster', 'pods'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" stroke="#326CE5" strokeWidth="2" fill="#326CE5" fillOpacity="0.15"/>
        <circle cx="12" cy="11" r="2.5" stroke="#326CE5" strokeWidth="2"/>
        <path d="M12 4v4.5M19 8l-4 2.5M19 14l-4-2.5M12 18v-4.5M5 14l4-2.5M5 8l4 2.5" stroke="#326CE5" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'devops',
    tags: ['iac', 'infrastructure', 'hashicorp'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M3 4l5 3v6l-5-3V4zM9 7.5l5-3v6l-5 3v-6zM15 4.5l5 3v6l-5-3v-6zM9 14.5l5 3v6l-5-3v-6z" fill="#7B42BC"/>
      </svg>
    )
  },

  // Backend & Runtime
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    tags: ['javascript', 'runtime', 'api', 'express'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" stroke="#5FA04E" strokeWidth="2" fill="#5FA04E" fillOpacity="0.15"/>
        <path d="M12 7v10M8 10l8 4" stroke="#5FA04E" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    tags: ['django', 'fastapi', 'flask', 'ai', 'data'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M11 3c-3 0-5 1-5 3v3h5v1H6c-3 0-4 2-4 5 0 2 1 4 4 4h2v-3c0-2 1-3 3-3h5V7c0-2-2-4-5-4z" fill="#3776AB"/>
        <path d="M13 21c3 0 5-1 5-3v-3h-5v-1h5c3 0 4-2 4-5 0-2-1-4-4-4h-2v3c0 2-1 3-3 3H8v3c0 2 2 4 5 4z" fill="#FFD438"/>
      </svg>
    )
  },
  {
    id: 'golang',
    name: 'Go / Golang',
    category: 'backend',
    tags: ['go', 'google', 'microservice', 'concurrency'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="#00ADD8" fillOpacity="0.15" stroke="#00ADD8" strokeWidth="2"/>
        <path d="M7 10c0-1.5 1-2.5 2.5-2.5S12 8.5 12 10v2c0 1.5-1 2.5-2.5 2.5S7 13.5 7 12h3M14 9.5c0-1 1-2 2.5-2s2.5 1 2.5 2v3c0 1-1 2-2.5 2s-2.5-1-2.5-2" stroke="#00ADD8" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },

  // Frontend
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    tags: ['ui', 'frontend', 'spa', 'web'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)"/>
        <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
      </svg>
    )
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    tags: ['ssr', 'react', 'vercel', 'fullstack'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="2" fill="#000"/>
        <path d="M8 8v8M16 8l-6 8h2l5-6.5V8z" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },

  // Networking & Security
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'networking',
    tags: ['cdn', 'dns', 'waf', 'security', 'proxy'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18.5 10c-.5-3-3.2-5-6.5-5-2.8 0-5.2 1.5-6.3 3.8C3 9.3 1 11.4 1 14c0 3 2.5 5 5.5 5h12c2.5 0 4.5-2 4.5-4.5 0-2.3-1.8-4.2-4.5-4.5z" fill="#F38020" fillOpacity="0.2" stroke="#F38020" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'networking',
    tags: ['reverse proxy', 'load balancer', 'web server'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="#009639" strokeWidth="2" fill="#009639" fillOpacity="0.15"/>
        <path d="M8 16V8l8 8V8" stroke="#009639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'auth0',
    name: 'Auth0',
    category: 'security',
    tags: ['authentication', 'identity', 'oauth', 'jwt'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5v6c0 5.5 3.5 10.5 8 12 4.5-1.5 8-6.5 8-12V5l-8-3z" stroke="#EB5424" strokeWidth="2" fill="#EB5424" fillOpacity="0.15"/>
        <path d="M12 8v5M12 16h.01" stroke="#EB5424" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },

  // General Architecture Shapes
  {
    id: 'api-gateway',
    name: 'API Gateway',
    category: 'general',
    tags: ['router', 'api', 'gateway', 'rest', 'graphql'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <Zap className={className} size={size} color="#8B5CF6" />
    )
  },
  {
    id: 'client-browser',
    name: 'Web Browser / Client',
    category: 'general',
    tags: ['client', 'browser', 'user', 'frontend'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <Globe className={className} size={size} color="#3B82F6" />
    )
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    category: 'general',
    tags: ['ios', 'android', 'phone', 'app'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <Smartphone className={className} size={size} color="#10B981" />
    )
  },
  {
    id: 'queue',
    name: 'Message Queue',
    category: 'general',
    tags: ['queue', 'sqs', 'rabbitmq', 'buffer'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <Layers className={className} size={size} color="#F59E0B" />
    )
  },
  {
    id: 'monitoring',
    name: 'Monitoring / Metrics',
    category: 'general',
    tags: ['observability', 'datadog', 'prometheus', 'grafana'],
    render: ({ className = 'w-6 h-6', size = 24 }) => (
      <Activity className={className} size={size} color="#EC4899" />
    )
  }
];

export function getTechIcon(iconId?: string): TechIconDef {
  if (!iconId) {
    return {
      id: 'default',
      name: 'Component',
      category: 'general',
      tags: [],
      render: ({ className = 'w-6 h-6', size = 24 }) => <Server className={className} size={size} color="#64748B" />
    };
  }

  const found = TECH_ICONS.find(i => i.id.toLowerCase() === iconId.toLowerCase());
  if (found) return found;

  return {
    id: iconId,
    name: iconId.toUpperCase(),
    category: 'general',
    tags: [],
    render: ({ className = 'w-6 h-6', size = 24 }) => <Box className={className} size={size} color="#64748B" />
  };
}

