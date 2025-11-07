import { Link } from '@tanstack/react-router'
import { Home, Network, SquareFunction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useLocation } from '@tanstack/react-router'

export default function Header() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="supports-backdrop-filter:bg-background/60 h-16 shrink-0 border-b border-slate-200 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg backdrop-blur">
      <div className="flex h-full w-full items-center justify-between px-8">
        <Link to="/" className="group mr-8 flex items-center space-x-3">
          <div className="rounded-lg bg-linear-to-br from-purple-500 to-pink-500 p-2 shadow-lg transition-all duration-200 group-hover:from-purple-600 group-hover:to-pink-600">
            <SquareFunction className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">RichText Learn</span>
        </Link>

        <NavigationMenu className="">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/')
                      ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/lexical">
                <Button
                  variant={isActive('/lexical') ? 'default' : 'ghost'}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/lexical')
                      ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <SquareFunction className="h-4 w-4" />
                  Lexical
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/unified">
                <Button
                  variant={isActive('/unified') ? 'default' : 'ghost'}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/unified')
                      ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Network className="h-4 w-4" />
                  Unified
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
