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
    <header className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg">
      <div className="container flex h-16 items-center">
        <Link
          to="/"
          className="mr-8 flex items-center space-x-3 group"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200 shadow-lg">
            <SquareFunction className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">RichText Learn</span>
        </Link>

        <NavigationMenu className="ml-auto">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link to="/">
                <Button
                  variant={isActive('/') ? "default" : "ghost"}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
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
                  variant={isActive('/lexical') ? "default" : "ghost"}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/lexical')
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
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
                  variant={isActive('/unified') ? "default" : "ghost"}
                  className={`gap-2 transition-all duration-200 ${
                    isActive('/unified')
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
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
