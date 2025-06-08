
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, RefreshCw, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telegram: string;
  phone: string;
  feedback: string | null;
  submitted_at: string;
}

const AdminApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { toast } = useToast();

  const { data: submissions = [], isLoading, refetch, error } = useQuery({
    queryKey: ['contact-submissions', searchTerm, dateFrom, dateTo, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (dateFrom) {
        query = query.gte('submitted_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('submitted_at', dateTo + 'T23:59:59');
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await query.range(from, to);

      if (error) {
        console.error('Ошибка при загрузке заявок:', error);
        throw new Error(error.message);
      }

      return data as ContactSubmission[];
    },
  });

  const { data: totalCount = 0 } = useQuery({
    queryKey: ['contact-submissions-count', searchTerm, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (dateFrom) {
        query = query.gte('submitted_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('submitted_at', dateTo + 'T23:59:59');
      }

      const { count, error } = await query;

      if (error) {
        console.error('Ошибка при подсчете заявок:', error);
        throw new Error(error.message);
      }

      return count || 0;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить заявки. Проверьте подключение к интернету.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Обновлено",
      description: "Данные успешно обновлены"
    });
  };

  const handleExportToExcel = async () => {
    try {
      toast({
        title: "Подготовка экспорта...",
        description: "Загружаем все заявки для экспорта"
      });

      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (dateFrom) {
        query = query.gte('submitted_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('submitted_at', dateTo + 'T23:59:59');
      }

      const { data: allSubmissions, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const exportData = allSubmissions?.map(submission => ({
        'Имя': submission.first_name,
        'Фамилия': submission.last_name,
        'Email': submission.email,
        'Telegram': submission.telegram,
        'Телефон': submission.phone,
        'Отзыв': submission.feedback || '',
        'Дата подачи': new Date(submission.submitted_at).toLocaleString('ru-RU')
      })) || [];

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Заявки");

      const fileName = `заявки_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Экспорт завершен",
        description: `Файл ${fileName} успешно скачан`
      });

    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Панель администратора
          </h1>
          <p className="text-lg text-muted-foreground">
            Управление заявками курса "Бизнес на автопилоте"
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-sm text-muted-foreground">Всего заявок</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                  <p className="text-sm text-muted-foreground">На текущей странице</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Download className="h-8 w-8 text-primary" />
                <div>
                  <Button onClick={handleExportToExcel} variant="outline" className="w-full">
                    Скачать Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Поиск и фильтры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Поиск по имени, фамилии или почте</Label>
                <Input
                  id="search"
                  placeholder="Введите текст для поиска..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div>
                <Label htmlFor="dateFrom">Дата от</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div>
                <Label htmlFor="dateTo">Дата до</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleRefresh} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Заявки участников</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Загрузка заявок...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Заявки не найдены</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Фамилия</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telegram</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Дата подачи</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.first_name}</TableCell>
                          <TableCell>{submission.last_name}</TableCell>
                          <TableCell>
                            <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                              {submission.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`https://t.me/${submission.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {submission.telegram}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${submission.phone}`} className="text-primary hover:underline">
                              {submission.phone}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(submission.submitted_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(currentPage - 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(currentPage + 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminApplications;
