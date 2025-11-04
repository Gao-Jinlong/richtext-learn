import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { LexicalEditor } from '../components/LexicalEditor'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            试试编辑器
          </h2>
          <div className="max-w-4xl mx-auto">
            <ClientOnly>
              <LexicalEditor />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  )
}
