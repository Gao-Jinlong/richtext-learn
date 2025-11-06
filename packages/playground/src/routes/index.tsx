import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Code, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              富文本技术实验平台
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            RichText Learn
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            探索现代富文本编辑技术的实验平台，对比 Lexical 与 Unified
            两种不同方法的优势与应用场景
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/lexical">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Code className="h-5 w-5" />
                体验 Lexical
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/unified">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                <BookOpen className="h-5 w-5" />
                探索 Unified
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            技术对比与探索
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Lexical Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-600">
                      Lexical
                    </CardTitle>
                    <CardDescription>Meta 的富文本编辑器框架</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      React
                    </Badge>
                    <span className="text-sm text-slate-600">
                      基于 React 组件
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      交互式
                    </Badge>
                    <span className="text-sm text-slate-600">
                      实时富文本编辑
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      可扩展
                    </Badge>
                    <span className="text-sm text-slate-600">
                      自定义节点与插件
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  强大的富文本编辑器，提供直观的用户界面和丰富的编辑功能，适合构建现代化的内容编辑系统。
                </p>

                <Link to="/lexical">
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    立即体验
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Unified Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 group-hover:from-green-600 group-hover:to-emerald-600 transition-all">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-600">
                      Unified
                    </CardTitle>
                    <CardDescription>基于 AST 的文本处理生态</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      AST
                    </Badge>
                    <span className="text-sm text-slate-600">
                      抽象语法树处理
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Markdown
                    </Badge>
                    <span className="text-sm text-slate-600">
                      Markdown 处理
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      转换
                    </Badge>
                    <span className="text-sm text-slate-600">格式转换处理</span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  强大的文本处理工具链，通过 AST
                  操作实现复杂的文本分析和转换，适合内容处理和文档生成。
                </p>

                <Link to="/unified">
                  <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    立即探索
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">技术栈</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                React 19
              </Badge>
              <span className="text-sm text-slate-600">前端框架</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                TypeScript
              </Badge>
              <span className="text-sm text-slate-600">类型安全</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Tailwind CSS
              </Badge>
              <span className="text-sm text-slate-600">样式框架</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Vite
              </Badge>
              <span className="text-sm text-slate-600">构建工具</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
