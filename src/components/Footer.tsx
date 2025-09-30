import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded flex items-center justify-center">
                <span className="text-xl font-bold text-primary">S</span>
              </div>
              <div>
                <div className="font-bold text-lg">STG CORP</div>
                <div className="text-xs opacity-80">Официальный дилер STALEX</div>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Профессиональное промышленное оборудование STALEX для вашего производства. 
              Гарантия качества и надёжный сервис.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/service" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Сервис и гарантия
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Новости
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Загрузки
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Каталог</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/guillotine-shears" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Гильотинные ножницы
                </Link>
              </li>
              <li>
                <Link to="/catalog/press-brakes" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Листогибочные прессы
                </Link>
              </li>
              <li>
                <Link to="/catalog/hydraulic-presses" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Гидравлические прессы
                </Link>
              </li>
              <li>
                <Link to="/catalog/roll-bending" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Вальцы листогибочные
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Сравнение моделей
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+998974335115" className="flex items-start gap-2 text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  <span>+998 97 433-51-15</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@stankogroup.uz" className="flex items-start gap-2 text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <span>info@stankogroup.uz</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm opacity-90">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Тошкент шахар,<br />Уста Ширин кўчаси, 116 уй</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <div>© 2025 STG CORP. Все права защищены.</div>
          <div className="flex gap-4">
            <Link to="/policy" className="hover:opacity-100 hover:text-accent transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
