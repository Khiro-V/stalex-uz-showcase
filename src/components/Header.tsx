import { Link } from "react-router-dom";
import { Search, Phone, Mail, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+998974335115" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={16} />
              <span>+998 97 433-51-15</span>
            </a>
            <a href="mailto:info@stankogroup.uz" className="hidden sm:flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={16} />
              <span>info@stankogroup.uz</span>
            </a>
          </div>
          <div className="text-xs opacity-90">
            Тошкент шахар, Уста Ширин кўчаси, 116 уй
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <div className="font-bold text-xl text-foreground">STG CORP</div>
              <div className="text-xs text-muted-foreground">Официальный дилер STALEX</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Главная
            </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors font-medium">
              Каталог
            </Link>
            <Link to="/service" className="text-foreground hover:text-primary transition-colors font-medium">
              Сервис
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              О компании
            </Link>
            <Link to="/news" className="text-foreground hover:text-primary transition-colors font-medium">
              Новости
            </Link>
            <Link to="/downloads" className="text-foreground hover:text-primary transition-colors font-medium">
              Загрузки
            </Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition-colors font-medium">
              Контакты
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Переключить тему">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <Button asChild className="hidden md:flex bg-accent hover:bg-accent-light text-accent-foreground">
              <Link to="/contacts#quote">Запросить КП</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Главная
            </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Каталог
            </Link>
            <Link to="/service" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Сервис
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              О компании
            </Link>
            <Link to="/news" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Новости
            </Link>
            <Link to="/downloads" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Загрузки
            </Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition-colors font-medium py-2">
              Контакты
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
