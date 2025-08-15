import { Project, ProjectStatus } from '../graphql/project';

// Mock project data - Using GraphQL Project interface
export const mockProjects: Project[] = [
  {
    _id: '1',
    name: 'E-commerce Website',
    slug: 'ecommerce-website',
    avatar: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    path: '/projects/ecommerce-website',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    description: 'Modern e-commerce platform with React and Node.js',
    status: ProjectStatus.ACTIVE
  },
  {
    _id: '2',
    name: 'Task Management App',
    slug: 'task-management-app',
    avatar: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    path: '/projects/task-management-app',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    description: 'Collaborative task management with real-time updates',
    status: ProjectStatus.ACTIVE
  },
  {
    _id: '3',
    name: 'Portfolio Website',
    slug: 'portfolio-website',
    avatar: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    path: '/projects/portfolio-website',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    description: 'Personal portfolio with modern design',
    status: ProjectStatus.ACTIVE
  },
  {
    _id: '4',
    name: 'Blog Platform',
    slug: 'blog-platform',
    avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    path: '/projects/blog-platform',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    description: 'Content management system for bloggers',
    status: ProjectStatus.PENDING
  },
  {
    _id: '5',
    name: 'Mobile App Backend',
    slug: 'mobile-app-backend',
    avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    path: '/projects/mobile-app-backend',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-05T11:30:00Z',
    description: 'RESTful API for mobile application',
    status: ProjectStatus.ACTIVE
  },
  {
    _id: '6',
    name: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    path: '/projects/analytics-dashboard',
    createdAt: '2024-01-03T13:20:00Z',
    updatedAt: '2024-01-03T13:20:00Z',
    description: 'Data visualization and reporting dashboard',
    status: ProjectStatus.ACTIVE
  }
];
