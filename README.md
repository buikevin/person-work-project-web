# Web Application với React + TypeScript

Một ứng dụng web hiện đại được xây dựng với React, TypeScript, và các thư viện hàng đầu.

## 🚀 Công nghệ sử dụng

### Core Technologies
- **React 18** - Thư viện UI component
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool và dev server nhanh
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Routing
- **Redux Toolkit** - Quản lý state ứng dụng
- **React Router v7** - Routing với createBrowserRouter
- **React Hook Form** - Quản lý form hiệu suất cao
- **Zod** - Schema validation

### Communication
- **Apollo Client** - GraphQL client
- **Socket.IO Client** - Real-time communication
- **GraphQL** - API query language

### UI Components
- **Shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Type-safe styling

### Utilities
- **Lodash** - Utility functions
- **Moment.js** - Date manipulation
- **Monaco Editor** - Code editor
- **Lexical** - Rich text editor

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── blocks/         # Complex UI blocks
│   ├── editor/         # Editor components
│   └── ui/             # Shadcn UI components
├── pages/              # Page components
├── router/             # Router configuration
├── server/             # API clients (GraphQL, Socket.IO)
├── store/              # Redux store và slices
├── schemas/            # Zod validation schemas
└── lib/                # Utility functions
```

## 🔧 Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_SOCKET_URL=http://localhost:4000
VITE_NODE_ENV=development
```

## 🏃‍♂️ Chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Quy tắc phát triển

### Form Handling
- **LUÔN LUÔN** sử dụng `react-hook-form` và `zod` cho mọi form
- Validate dữ liệu ở cả client và server
- Sử dụng type-safe form với TypeScript

### State Management
- **Thông tin user** phải được lưu trữ trong Redux store
- Sử dụng Redux Toolkit cho async actions
- Implement proper error handling và loading states

### Testing
- **LUÔN LUÔN** viết unit test sau mỗi chức năng hoàn thành
- Test các component, hooks, và utility functions
- Maintain test coverage > 80%

### Code Quality
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Implement proper error boundaries
- Document complex functions với JSDoc

## 🔐 Authentication

Ứng dụng sử dụng JWT-based authentication với:
- Login form với validation
- Protected routes
- Session persistence với "Remember Me"
- Auto token refresh
- Secure logout

### Login Requirements
- **Username**: 4-15 ký tự, chỉ chữ thường và số
- **Password**: 8-40 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt
- **Remember Me**: Lưu session vào localStorage

## 🌐 API Integration

### GraphQL
- Apollo Client với caching
- Error handling và retry logic
- Type-safe queries với codegen
- Authentication headers

### Socket.IO
- Real-time notifications
- Connection management
- Reconnection handling
- Event type safety

## 🧪 Testing Strategy

```bash
# Chạy tests
npm run test

# Test với coverage
npm run test:coverage

# Test watch mode
npm run test:watch
```

## 📦 Build & Deployment

```bash
# Production build
npm run build

# Analyze bundle
npm run analyze

# Preview production
npm run preview
```

## 🤝 Contributing

1. Tạo feature branch từ `main`
2. Implement feature với tests
3. Update documentation
4. Create pull request
5. Code review và merge

## 📄 License

Private project - All rights reserved
