import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createLead } from '@/api/leads';
import { ADMIN_EMAILS } from '@/lib/constants';

const Contacts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    model: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Сохранить в БД
      await createLead(formData);

      // Создать mailto
      const subject = encodeURIComponent('Заявка с сайта STALEX');
      const body = encodeURIComponent(
        `Имя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nМодель: ${formData.model || 'не указано'}\n\nСообщение:\n${formData.message || 'нет'}`
      );
      const mailtoLink = `mailto:${ADMIN_EMAILS.join(',')}?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;

      toast({
        title: 'Заявка отправлена',
        description: 'Мы свяжемся с вами в ближайшее время'
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        model: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">Контакты</h1>
            <p className="text-lg text-muted-foreground">
              Свяжитесь с нами удобным способом
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                <a href="tel:+998974335115" className="text-primary hover:underline">
                  +998 97 433-51-15
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <a href="mailto:info@stankogroup.uz" className="text-primary hover:underline break-all">
                  info@stankogroup.uz
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Адрес</h3>
                <p className="text-muted-foreground">
                  Тошкент шахар,<br />
                  Уста Ширин кўчаси, 116 уй
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Режим работы</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p>Пн–Пт: 09:00–18:00</p>
                  <p>Сб: 10:00–17:00</p>
                  <p>Вс: выходной</p>
                  <p className="text-primary font-medium mt-2">Техподдержка: 24/7</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div id="quote" className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Запросить КП</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Модель оборудования</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </form>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.4!2d69.2401!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzQwLjAiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Карта офиса STG CORP"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
