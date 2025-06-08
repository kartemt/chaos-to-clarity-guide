
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    telegram: "",
    email: "",
    feedback: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки данных
    setTimeout(() => {
      toast({
        title: "Спасибо за участие!",
        description: "Ваши контакты сохранены. Скоро свяжемся с вами по поводу продвинутых программ.",
      });
      setIsSubmitting(false);
      setFormData({ telegram: "", email: "", feedback: "" });
    }, 1000);
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Telegram аккаунт
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
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Электронная почта
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
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  "Отправляем..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Получить эксклюзивные материалы
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
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
