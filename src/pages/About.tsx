import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Globe, Users, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>О компании STG CORP - Официальный дистрибьютор STALEX в Узбекистане</title>
        <meta name="description" content="STG CORP - официальный поставщик промышленного оборудования STALEX в Узбекистане. Качественная техника, профессиональный сервис, гарантия надежности." />
        <link rel="canonical" href="https://stalex-shop.uz/about" />
        <meta property="og:title" content="О компании STG CORP - STALEX Узбекистан" />
        <meta property="og:url" content="https://stalex-shop.uz/about" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">О компании</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">О компании STG CORP</h1>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground">STG CORP</strong> — это ведущий поставщик промышленного 
                оборудования в Узбекистане, специализирующийся на реализации и обслуживании высококачественной 
                техники мировых производителей.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы являемся официальным дистрибьютором бренда <strong className="text-foreground">STALEX</strong> — 
                одного из лидеров в производстве металлообрабатывающего оборудования. Наша миссия — обеспечить 
                узбекские предприятия надежной техникой, которая повысит производительность и качество продукции.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                За годы работы мы зарекомендовали себя как надежный партнер для производственных 
                предприятий различного масштаба — от небольших мастерских до крупных промышленных комплексов.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary mb-4">STALEX</h2>
                <p className="text-xl text-foreground font-medium mb-2">Официальный дистрибьютор</p>
                <p className="text-muted-foreground">в Республике Узбекистан</p>
              </div>
            </div>
          </div>

          {/* Our Advantages */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Наши преимущества</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Award className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Официальная гарантия</h3>
                <p className="text-muted-foreground">
                  Все оборудование поставляется с официальной гарантией производителя
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <Users className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Опытная команда</h3>
                <p className="text-muted-foreground">
                  Квалифицированные специалисты с многолетним опытом в отрасли
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Globe className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Широкая сеть</h3>
                <p className="text-muted-foreground">
                  Доставка и сервисное обслуживание по всему Узбекистану
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <TrendingUp className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Рост вместе с вами</h3>
                <p className="text-muted-foreground">
                  Долгосрочное партнерство и поддержка на всех этапах
                </p>
              </div>
            </div>
          </div>

          {/* About STALEX */}
          <div className="bg-card rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">О бренде STALEX</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">STALEX</strong> — международный производитель 
                металлообрабатывающего оборудования с многолетней историей. Компания специализируется 
                на разработке и производстве станков для обработки металла, которые сочетают в себе 
                надежность, функциональность и доступную стоимость.
              </p>
              <p>
                Продукция STALEX широко используется в различных отраслях промышленности: 
                от небольших производственных мастерских до крупных машиностроительных предприятий. 
                Оборудование этого бренда известно своей долговечностью, простотой в эксплуатации 
                и отличным соотношением цены и качества.
              </p>
              <p>
                В ассортименте STALEX представлены: гильотинные ножницы, листогибочные прессы, 
                вальцы для листового металла, сверлильные станки, пилы по металлу и другое 
                профессиональное оборудование.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Готовы начать сотрудничество?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Свяжитесь с нами, и наши специалисты помогут подобрать оптимальное решение для вашего производства
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+998974335115" className="text-lg font-bold text-accent hover:underline">
                +9 9897 433-51-15
              </a>
              <span className="text-muted-foreground">|</span>
              <a href="mailto:info@stankogroup.uz" className="text-lg font-bold text-accent hover:underline">
                info@stankogroup.uz
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
