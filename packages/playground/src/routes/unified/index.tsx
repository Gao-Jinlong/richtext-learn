import { createFileRoute } from '@tanstack/react-router'
import { UnifiedEditor } from '../../components/UnifiedEditor'

export const Route = createFileRoute('/unified/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnifiedEditor />
}
