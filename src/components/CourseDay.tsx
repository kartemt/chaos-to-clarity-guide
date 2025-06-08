
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  Download,
  FileText,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
}

interface CourseDayProps {
  day: number;
  title: string;
  description: string;
  content: string[];
  tasks: Task[];
  result: string;
  template?: string;
  nextDay?: number;
  prevDay?: number;
}

const CourseDay = ({ 
  day, 
  title, 
  description, 
  content, 
  tasks, 
  result, 
  template,
  nextDay,
  prevDay 
}: CourseDayProps) => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showBonus, setShowBonus] = useState(false);

  const progress = (completedTasks.length / tasks.length) * 100;

  const handleTaskComplete = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
      
      // Показываем бонус при выполнении всех задач
      if (completedTasks.length + 1 === tasks.length) {
        setShowBonus(true);
      }
    }
  };

  const allTasksCompleted = completedTasks.length === tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {prevDay && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/day/${prevDay}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                День {prevDay}
              </Button>
            )}
            <Badge variant="secondary" className="text-sm">
              День {day} из 5
            </Badge>
            {nextDay && allTasksCompleted && (
              <Button 
                size="sm"
                onClick={() => navigate(`/day/${nextDay}`)}
                className="ml-auto"
              >
                День {nextDay}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{description}</p>
          
          <div className="bg-card rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Прогресс дня</span>
              <span className="text-sm text-muted-foreground">{completedTasks.length}/{tasks.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Материал урока
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Практические задания
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={task.id}
                        checked={completedTasks.includes(task.id)}
                        onCheckedChange={() => handleTaskComplete(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={task.id}
                          className={`font-medium cursor-pointer block ${
                            completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {task.title}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{task.timeEstimate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bonus Section */}
            {showBonus && allTasksCompleted && (
              <Card className="border-green-500/20 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Lightbulb className="h-5 w-5" />
                    Отлично! Все задания выполнены
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Поздравляем! Вы завершили все задания дня {day}. 
                    {nextDay ? ` Переходите к дню ${nextDay} или` : ''} сохраните результаты и поделитесь успехом в комментариях.
                  </p>
                  <div className="flex gap-2">
                    {template && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Скачать шаблон
                      </Button>
                    )}
                    {nextDay && (
                      <Button size="sm" onClick={() => navigate(`/day/${nextDay}`)}>
                        Следующий день
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Result Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Результат дня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result}</p>
              </CardContent>
            </Card>

            {/* Template Download */}
            {template && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Материалы</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {template}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4, 5].map((dayNum) => (
                  <Button
                    key={dayNum}
                    variant={dayNum === day ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate(`/day/${dayNum}`)}
                    disabled={dayNum > day && !allTasksCompleted}
                  >
                    День {dayNum}
                    {dayNum < day && <CheckCircle className="h-4 w-4 ml-auto text-green-500" />}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/')}
                >
                  Главная страница
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDay;
