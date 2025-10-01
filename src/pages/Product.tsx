import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import productsData from "@/data/products.json";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  images: string[];
  price: string;
  specs: Record<string, string>;
  description: string;
  features?: string[];
}

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const foundProduct = productsData.products.find((p: any) => p.slug === slug);
    setProduct(foundProduct || null);

    if (foundProduct) {
      const related = productsData.products
        .filter((p: any) => p.categoryId === foundProduct.categoryId && p.slug !== slug)
        .slice(0, 3);
      setRelatedProducts(related);
    }
  }, [slug]);

  const handleQuoteRequest = () => {
    toast({
      title: "Запрос отправлен",
      description: "Мы свяжемся с вами в ближайшее время для подготовки коммерческого предложения.",
    });
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && product) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>${product.name} - Технический паспорт</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 10px; }
            h2 { color: #1e3a8a; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e3a8a; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${product.name}</h1>
            <p><strong>STG CORP</strong> - Официальный дистрибьютор STALEX в Узбекистане</p>
          </div>
          
          <h2>Описание</h2>
          <p>${product.description}</p>
          
          <h2>Технические характеристики</h2>
          <table>
            <thead>
              <tr>
                <th>Характеристика</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(product.specs).map(([key, value]) => `
                <tr>
                  <td>${key}</td>
                  <td>${value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p><strong>Контакты:</strong></p>
            <p>Телефон: +9 9897 433-51-15</p>
            <p>Email: info@stankogroup.uz</p>
            <p>Адрес: Тошкент шахар, Уста Ширин кўчаси, 116 уй</p>
            <p>Сайт: https://stalex-shop.uz</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!product) return null;

  const categoryData = productsData.categories.find((cat: any) => cat.slug === product.categoryId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0],
    brand: {
      "@type": "Brand",
      name: "STALEX"
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "UZS",
      seller: {
        "@type": "Organization",
        name: "STG CORP"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://stalex-shop.uz" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://stalex-shop.uz/catalog" },
      { "@type": "ListItem", position: 3, name: categoryData?.name, item: `https://stalex-shop.uz/catalog/${product.categoryId}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `https://stalex-shop.uz/product/${product.slug}` }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Купить в Узбекистане | STG CORP</title>
        <meta name="description" content={`${product.description} Официальный дистрибьютор STALEX. Гарантия качества. ☎ +9 9897 433-51-15`} />
        <link rel="canonical" href={`https://stalex-shop.uz/product/${slug}`} />
        <meta property="og:title" content={`${product.name} - STALEX`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:url" content={`https://stalex-shop.uz/product/${slug}`} />
        <meta property="og:image" content={product.images[0]} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumbs */}
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li><Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link></li>
            <li>/</li>
            <li><Link to={`/catalog/${product.categoryId}`} className="hover:text-primary transition-colors">{categoryData?.name}</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div className="bg-muted rounded-lg overflow-hidden aspect-square">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

              {product.features && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-3">Ключевые особенности</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent mt-1">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg" onClick={handleQuoteRequest} className="flex-1">
                  <FileText className="mr-2" size={20} />
                  Запросить КП
                </Button>
                <Button size="lg" variant="outline" onClick={handleDownloadPDF} className="flex-1">
                  <Download className="mr-2" size={20} />
                  Скачать PDF
                </Button>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-2">Связаться с нами</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Наши специалисты помогут подобрать оборудование и ответят на все вопросы
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Телефон:</strong> <a href="tel:+998974335115" className="text-accent hover:underline">+9 9897 433-51-15</a></p>
                  <p><strong>Email:</strong> <a href="mailto:info@stankogroup.uz" className="text-accent hover:underline">info@stankogroup.uz</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-card rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Технические характеристики</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="py-3 px-4 font-medium text-foreground">{key}</td>
                      <td className="py-3 px-4 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Похожие модели</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/product/${related.slug}`}
                    className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {related.name}
                      </h3>
                      <Button size="sm">Подробнее</Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Product;
