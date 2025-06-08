
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Send, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telegram: "",
    phone: "",
    feedback: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const requiredFields = {
      firstName: "Имя",
      lastName: "Фамилия", 
      email: "Email",
      telegram: "Telegram",
      phone: "Телефон"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast({
          title: "Ошибка валидации",
          description: `Поле "${label}" обязательно для заполнения`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Ошибка валидации",
        description: "Введите корректный email адрес",
        variant: "destructive"
      });
      return false;
    }

    // Валидация Telegram (должен начинаться с @)
    if (!formData.telegram.startsWith('@')) {
      toast({
        title: "Ошибка валидации", 
        description: "Telegram должен начинаться с @",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Показываем уведомление о начале отправки
      toast({
        title: "Отправляем заявку...",
        description: "Пожалуйста, подождите"
      });

      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          telegram: formData.telegram.trim(),
          phone: formData.phone.trim(),
          feedback: formData.feedback.trim() || null
        });

      if (error) {
        console.error('Ошибка при сохранении заявки:', error);
        throw new Error(error.message);
      }

      // Успешное сохранение
      toast({
        title: "Заявка отправлена!",
        description: "Спасибо за участие! Ваши контакты сохранены. Скоро свяжемся с вами по поводу продвинутых программ.",
      });

      // Очищаем форму
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        telegram: "",
        phone: "",
        feedback: ""
      });

    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
      toast({
        title: "Ошибка при отправке",
        description: "Произошла ошибка при сохранении заявки. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
              Поздравляем с завершением курса!
            </CardTitle>
            <p className="text-muted-foreground mt-4">
              Оставьте свои контакты, чтобы получать эксклюзивные материалы 
              и первыми узнавать о новых программах по системному менеджменту
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Имя *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Фамилия *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Ваша фамилия"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Электронная почта *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="telegram" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Telegram аккаунт *
                </Label>
                <Input
                  id="telegram"
                  name="telegram"
                  type="text"
                  placeholder="@ваш_telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Номер телефона *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="feedback">
                  Какой результат курса был самым ценным? (необязательно)
                </Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  placeholder="Поделитесь своими впечатлениями от курса..."
                  value={formData.feedback}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  "Отправляем заявку..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Получить эксклюзивные материалы
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * - обязательные поля<br/>
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных 
                и получение информационных рассылок
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;
