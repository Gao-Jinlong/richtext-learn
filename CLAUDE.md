# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 项目概述

这是一个**用于实验富文本技术的 monorepo**，对比两种不同的方法：
- **Lexical** - Meta 的富文本编辑器框架（基于 React）
- **Unified** - 基于 AST 的文本处理生态系统（Markdown/HTML 处理）

## 开发命令

### 根目录级别
```bash
pnpm install              # 安装所有依赖
pnpm type-check          # 运行 TypeScript 类型检查
pnpm type-check:watch    # 监听模式下的类型检查
pnpm clean               # 清理 TypeScript 构建产物
```

### Lexical 包 (`packages/lexical/`)
```bash
pnpm dev        # 启动开发服务器 (Vite)
pnpm build      # 构建应用程序
pnpm lint       # 运行 ESLint
pnpm preview    # 预览构建的应用程序
```

### Unified 包 (`packages/unified-md/`)
```bash
pnpm start              # 运行主要的 unified 处理器
pnpm add-id-to-hype     # 运行标题 ID 生成示例
```

## 架构

### Monorepo 结构
- 使用 **pnpm workspaces** 进行包管理
- **TypeScript 项目引用** 用于跨包依赖
- 共享的基础 TypeScript 配置，启用严格模式

### 核心技术
- **包管理器**: pnpm（必需 - workspace 配置）
- **语言**: TypeScript 启用严格类型检查
- **构建**: Vite 用于 React 应用，tsx 用于 Node.js 执行
- **富文本**: Lexical 框架，包含自定义节点和插件
- **文本处理**: Unified 与 Remark/Rehype 处理器

### 包结构
```
packages/
├── lexical/           # 基于 React 的富文本编辑器
│   ├── src/
│   │   ├── plugins/      # Lexical 插件（工具栏等）
│   │   ├── node/         # 自定义 Lexical 节点
│   │   └── App.tsx       # 主要 React 组件
│   └── vite.config.ts    # Vite 配置
└── unified-md/       # 基于 AST 的文本处理
    ├── index.ts          # 主要 unified 处理器
    ├── example.ts        # 使用示例
    └── add-id-to-hype/   # 标题 ID 插件
```

## 开发说明

### TypeScript 配置
- 启用严格模式和全面的类型检查
- ES2022 目标，使用 ESNext 模块
- 路径别名：`@richtext-learn/*` 映射到 `packages/*/src`

### 代码质量
- ESLint 配合 React 特定规则和 TypeScript 支持
- Prettier 用于代码格式化
- 当前未配置正式的测试框架

### 正在探索的核心功能
- 使用 Lexical 进行富文本编辑（自定义节点、插件、序列化）
- 使用 Unified 进行 Markdown 处理（AST 操作、格式转换）
- HTML 生成和处理
- 表情符号和话题标签支持
- 为文档生成标题 ID
- 文本分析和转换

### 重要依赖
- **Lexical**: `lexical`, `@lexical/react`, `@lexical/html`, `@lexical/link`
- **Unified**: `unified`, `remark`, `rehype`, `remark-parse`, `rehype-stringify`
- **React**: 最新 v19.1.1，使用现代 React 模式
- **构建**: Vite 7.1.2 用于快速开发和构建