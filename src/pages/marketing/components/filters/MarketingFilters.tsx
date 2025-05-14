import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "@/hooks/use-toast";
import { DateRange } from 'react-day-picker';

interface MarketingFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const MarketingFilters = ({ dateRange, setDateRange }: MarketingFiltersProps) => {
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados por email quando estiverem prontos.",
    });
  };

  return (
    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "P", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "P", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "P", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            locale={ptBR}
            className="pointer-events-auto"
          />
          <div className="p-3 border-t border-border/60 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDateRange({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date()
              })}
            >
              Este ano
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const today = new Date();
                setDateRange({
                  from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
                  to: today
                });
              }}
            >
              Últimos 30 dias
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button onClick={handleExportData}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Dados
      </Button>
    </div>
  );
};

export default MarketingFilters;
