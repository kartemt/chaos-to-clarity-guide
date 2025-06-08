
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);

  const features = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Конкретные результаты",
      description: "Готовый план систематизации уже через 3 дня"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "5 дней — 5 систем",
      description: "Каждый день — новый процесс под контроль"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Для инфопредпринимателей",
      description: "Специально для тех, кто уже зарабатывает, но устал от хаоса"
    }
  ];

  const modules = [
    {
      day: 1,
      title: "Аудит процессов",
      description: "Находим узкие места и определяем приоритеты",
      result: "План упорядочивания ключевого процесса"
    },
    {
      day: 2,
      title: "Построение процесса",
      description: "Создаем четкую схему основного рабочего цикла",
      result: "Готовая схема бизнес-процесса"
    },
    {
      day: 3,
      title: "Делегирование и автоматизация",
      description: "Инструменты для передачи задач и автоматизации",
      result: "План делегирования повторяющихся задач"
    },
    {
      day: 4,
      title: "Контроль и метрики",
      description: "Простая аналитика и показатели эффективности",
      result: "Чек-лист и метрики для отслеживания"
    },
    {
      day: 5,
      title: "Дорожная карта",
      description: "План внедрения систем и развития бизнеса",
      result: "Стратегия системного развития"
    }
  ];

  const handleEnroll = () => {
    setIsEnrolled(true);
    // В реальном приложении здесь была бы интеграция с платежной системой
    setTimeout(() => {
      navigate('/day/1');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-6 text-sm font-medium" variant="secondary">
            Мини-курс для инфопредпринимателей
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Бизнес на автопилоте:<br />
            <span className="text-3xl md:text-5xl">системный старт</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Превратите хаос в эффективную систему за 5 дней. Для тех, кто уже зарабатывает на инфобизнесе, 
            но устал от операционной рутины и хочет навести порядок.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Практические задания</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Готовые шаблоны</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Мобильный формат</span>
            </div>
          </div>

          {!isEnrolled ? (
            <div className="mb-16">
              <div className="bg-card rounded-lg p-8 max-w-md mx-auto border border-primary/20 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2">
                    <span className="line-through text-muted-foreground text-xl">2990₽</span>
                    <span className="text-primary ml-2">990₽</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Специальная цена для первых 100 участников</p>
                </div>
                
                <Button 
                  onClick={handleEnroll}
                  className="w-full text-lg py-6 mb-4"
                  size="lg"
                >
                  Получить доступ сейчас
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Доступ открывается мгновенно после оплаты
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-16">
              <Card className="max-w-md mx-auto border-green-500/20 bg-green-50/50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Добро пожаловать!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Вы успешно записались на курс. Переходим к первому дню...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-primary/10">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Program Structure */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Программа курса</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {modules.map((module, index) => (
              <Card key={index} className="border-primary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {module.day}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{module.title}</CardTitle>
                      <p className="text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="ml-16">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Результат дня:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.result}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pain Points */}
        <div className="bg-card rounded-xl p-8 mb-16 border border-primary/10">
          <h2 className="text-2xl font-bold text-center mb-8">Знакомые проблемы?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Постоянно "тушите пожары" вместо стратегического развития</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Делаете всё сами, боясь делегировать важные задачи</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Не знаете, какие процессы можно автоматизировать</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Работаете 12+ часов в день, но прогресса не чувствуете</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Нет четкой системы контроля и метрик эффективности</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <p className="text-muted-foreground">Хотите масштабировать бизнес, но не знаете с чего начать</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!isEnrolled && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Превратите хаос в систему уже сегодня</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Всего 5 дней практики, и вы получите работающую систему управления бизнесом. 
              Начните прямо сейчас!
            </p>
            <Button onClick={handleEnroll} size="lg" className="text-lg px-8 py-6">
              Начать курс за 990₽
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
