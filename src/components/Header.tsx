
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, CreditCard, Home, LogOut, Menu, Settings, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle window resize (close mobile menu on resize)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta."
    });
    navigate('/login');
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-200',
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="font-semibold text-lg">
            Finanças Pessoais
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                className="text-sm"
              >
                <Home className="h-4 w-4 mr-1" /> Dashboard
              </Button>
            </Link>
            <Link to="/transactions">
              <Button 
                variant={isActive('/transactions') ? 'default' : 'ghost'} 
                className="text-sm"
              >
                <BarChart3 className="h-4 w-4 mr-1" /> Transações
              </Button>
            </Link>
            <Link to="/cards">
              <Button 
                variant={isActive('/cards') ? 'default' : 'ghost'} 
                className="text-sm"
              >
                <CreditCard className="h-4 w-4 mr-1" /> Cartões
              </Button>
            </Link>
            <Link to="/reports">
              <Button 
                variant={isActive('/reports') ? 'default' : 'ghost'} 
                className="text-sm"
              >
                <BarChart3 className="h-4 w-4 mr-1" /> Relatórios
              </Button>
            </Link>
            <Link to="/settings">
              <Button 
                variant={isActive('/settings') ? 'default' : 'ghost'} 
                className="text-sm"
              >
                <Settings className="h-4 w-4 mr-1" /> Configurações
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col py-3">
              <Link to="/" className="w-full">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  className="w-full justify-start mb-1"
                >
                  <Home className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <Link to="/transactions" className="w-full">
                <Button 
                  variant={isActive('/transactions') ? 'default' : 'ghost'} 
                  className="w-full justify-start mb-1"
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Transações
                </Button>
              </Link>
              <Link to="/cards" className="w-full">
                <Button 
                  variant={isActive('/cards') ? 'default' : 'ghost'} 
                  className="w-full justify-start mb-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Cartões
                </Button>
              </Link>
              <Link to="/reports" className="w-full">
                <Button 
                  variant={isActive('/reports') ? 'default' : 'ghost'} 
                  className="w-full justify-start mb-1"
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Relatórios
                </Button>
              </Link>
              <Link to="/settings" className="w-full">
                <Button 
                  variant={isActive('/settings') ? 'default' : 'ghost'} 
                  className="w-full justify-start mb-1"
                >
                  <Settings className="h-4 w-4 mr-2" /> Configurações
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
