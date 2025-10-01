import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail } from "lucide-react";

const Service = () => {
  return (
    <>
      <Helmet>
        <title>Сервис и гарантия - Оборудование STALEX | STG CORP</title>
        <meta name="description" content="Профессиональное обслуживание оборудования STALEX в Узбекистане. Гарантийный и постгарантийный сервис, запчасти, обучение персонала." />
        <link rel="canonical" href="https://stalex-shop.uz/service" />
        <meta property="og:title" content="Сервис и гарантия - STALEX" />
        <meta property="og:url" content="https://stalex-shop.uz/service" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Сервис и гарантия</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Сервис и гарантия</h1>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Наши услуги</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Гарантийное обслуживание</h3>
                    <p className="text-muted-foreground">
                      На все оборудование STALEX предоставляется официальная гарантия производителя. 
                      Срок гарантии зависит от модели и составляет от 12 до 24 месяцев.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Постгарантийный сервис</h3>
                    <p className="text-muted-foreground">
                      Наши специалисты обеспечивают квалифицированное обслуживание и ремонт 
                      оборудования на протяжении всего срока эксплуатации.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Поставка запчастей</h3>
                    <p className="text-muted-foreground">
                      Мы обеспечиваем быструю поставку оригинальных запасных частей для 
                      оборудования STALEX со склада в Узбекистане.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Пусконаладочные работы</h3>
                    <p className="text-muted-foreground">
                      Профессиональная установка, настройка и запуск оборудования на объекте заказчика 
                      с полным инструктажем персонала.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Обучение персонала</h3>
                    <p className="text-muted-foreground">
                      Проводим теоретическое и практическое обучение операторов работе на станках, 
                      соблюдению техники безопасности и правильной эксплуатации.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Техническая поддержка</h3>
                    <p className="text-muted-foreground">
                      Консультации по эксплуатации, настройке и обслуживанию оборудования. 
                      Оперативная помощь в решении технических вопросов.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-lg p-8 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Связаться с нами</h2>
                <p className="text-muted-foreground mb-6">
                  Наши специалисты готовы ответить на все ваши вопросы и предоставить 
                  профессиональную консультацию по сервису и обслуживанию оборудования STALEX.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Phone className="text-accent flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                      <a href="tel:+998974335115" className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                        +9 9897 433-51-15
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-accent flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <a href="mailto:info@stankogroup.uz" className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                        info@stankogroup.uz
                      </a>
                    </div>
                  </div>
                </div>

                <Link to="/contacts">
                  <Button size="lg" className="w-full">
                    Форма обратной связи
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Условия гарантии</h2>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground mb-2">Гарантия распространяется на:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Заводские дефекты материалов и сборки</li>
                  <li>Неисправности, возникшие при нормальной эксплуатации</li>
                  <li>Выход из строя комплектующих по вине производителя</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Гарантия не распространяется на:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Механические повреждения</li>
                  <li>Несоблюдение правил эксплуатации</li>
                  <li>Самостоятельный ремонт или вмешательство третьих лиц</li>
                  <li>Естественный износ расходных материалов</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Service;
