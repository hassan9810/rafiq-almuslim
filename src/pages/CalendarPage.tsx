import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { arSA, enUS } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';

type HijriEventKey =
  | 'hijriEventIslamicNewYear'
  | 'hijriEventAshura'
  | 'hijriEventMawlid'
  | 'hijriEventIsraMiraj'
  | 'hijriEventMidShaban'
  | 'hijriEventRamadanBegins'
  | 'hijriEventLaylatAlQadr'
  | 'hijriEventEidAlFitr'
  | 'hijriEventHajjBegins'
  | 'hijriEventArafah'
  | 'hijriEventEidAlAdha'
  | 'hijriEventTashreeqDays';

type HijriMonthKey =
  | 'hijriMonthMuharram'
  | 'hijriMonthSafar'
  | 'hijriMonthRabiAlAwwal'
  | 'hijriMonthRabiAlThani'
  | 'hijriMonthJumadaAlUla'
  | 'hijriMonthJumadaAlAkhira'
  | 'hijriMonthRajab'
  | 'hijriMonthShaban'
  | 'hijriMonthRamadan'
  | 'hijriMonthShawwal'
  | 'hijriMonthDhuAlQadah'
  | 'hijriMonthDhuAlHijjah';

type HijriEvent = {
  day: string;
  labelKey: HijriEventKey;
};

type HijriMonth = {
  month: number;
  nameKey: HijriMonthKey;
  events: HijriEvent[];
};

const HIJRI_MONTHS: HijriMonth[] = [
  {
    month: 1,
    nameKey: 'hijriMonthMuharram',
    events: [
      { day: '1', labelKey: 'hijriEventIslamicNewYear' },
      { day: '10', labelKey: 'hijriEventAshura' },
    ],
  },
  { month: 2, nameKey: 'hijriMonthSafar', events: [] },
  {
    month: 3,
    nameKey: 'hijriMonthRabiAlAwwal',
    events: [{ day: '12', labelKey: 'hijriEventMawlid' }],
  },
  { month: 4, nameKey: 'hijriMonthRabiAlThani', events: [] },
  { month: 5, nameKey: 'hijriMonthJumadaAlUla', events: [] },
  { month: 6, nameKey: 'hijriMonthJumadaAlAkhira', events: [] },
  {
    month: 7,
    nameKey: 'hijriMonthRajab',
    events: [{ day: '27', labelKey: 'hijriEventIsraMiraj' }],
  },
  {
    month: 8,
    nameKey: 'hijriMonthShaban',
    events: [{ day: '15', labelKey: 'hijriEventMidShaban' }],
  },
  {
    month: 9,
    nameKey: 'hijriMonthRamadan',
    events: [
      { day: '1', labelKey: 'hijriEventRamadanBegins' },
      { day: '27', labelKey: 'hijriEventLaylatAlQadr' },
    ],
  },
  {
    month: 10,
    nameKey: 'hijriMonthShawwal',
    events: [{ day: '1', labelKey: 'hijriEventEidAlFitr' }],
  },
  { month: 11, nameKey: 'hijriMonthDhuAlQadah', events: [] },
  {
    month: 12,
    nameKey: 'hijriMonthDhuAlHijjah',
    events: [
      { day: '8', labelKey: 'hijriEventHajjBegins' },
      { day: '9', labelKey: 'hijriEventArafah' },
      { day: '10', labelKey: 'hijriEventEidAlAdha' },
      { day: '11-13', labelKey: 'hijriEventTashreeqDays' },
    ],
  },
];

const GREGORIAN_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const HIJRI_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function getHijriMonthNumber(date: Date): number | null {
  const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric' }).formatToParts(date);
  const monthPart = parts.find((part) => part.type === 'month');
  if (!monthPart) return null;
  const monthNumber = Number(monthPart.value);
  return Number.isNaN(monthNumber) ? null : monthNumber;
}

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function CalendarPage() {
  const { t, language } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'gregorian' | 'hijri'>('gregorian');
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const hijriLocale = language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic';
  const isRtl = language === 'ar';
  const calendarLocale = isRtl ? arSA : enUS;

  const gregorianLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, GREGORIAN_FORMAT).format(selectedDate);
  }, [locale, selectedDate]);

  const hijriLabel = useMemo(() => {
    return new Intl.DateTimeFormat(hijriLocale, HIJRI_FORMAT).format(selectedDate);
  }, [hijriLocale, selectedDate]);

  const gregorianDayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric' }),
    [locale],
  );
  const hijriDayFormatter = useMemo(
    () => new Intl.DateTimeFormat(hijriLocale, { day: 'numeric' }),
    [hijriLocale],
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    [locale],
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long' }),
    [locale],
  );

  const calendarFormatters = useMemo(
    () => ({
      formatCaption: (date: Date) =>
        new Intl.DateTimeFormat(
          calendarView === 'hijri' ? hijriLocale : locale,
          { month: 'long', year: 'numeric' },
        ).format(date),
      formatDay: (date: Date) =>
        calendarView === 'hijri'
          ? hijriDayFormatter.format(date)
          : gregorianDayFormatter.format(date),
      formatWeekdayName: (date: Date) => weekdayFormatter.format(date),
    }),
    [calendarView, gregorianDayFormatter, hijriDayFormatter, hijriLocale, locale, weekdayFormatter],
  );

  const hijriMonthNumber = useMemo(() => getHijriMonthNumber(selectedDate), [selectedDate]);
  const currentHijriMonth = hijriMonthNumber
    ? HIJRI_MONTHS.find((month) => month.month === hijriMonthNumber)
    : undefined;

  useEffect(() => {
    setCalendarMonth(selectedDate);
  }, [selectedDate]);

  const selectedYear = selectedDate.getFullYear();
  const selectedMonthIndex = selectedDate.getMonth();
  const selectedDay = selectedDate.getDate();

  const yearOptions = useMemo(() => {
    const start = 1900;
    const end = 2100;
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, []);

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => ({
      value: index,
      label: monthFormatter.format(new Date(2024, index, 1)),
    })),
    [monthFormatter],
  );

  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedYear, selectedMonthIndex]);

  const handleSelectYear = (value: string) => {
    const nextYear = Number(value);
    const daysInMonth = getDaysInMonth(nextYear, selectedMonthIndex);
    const nextDay = Math.min(selectedDay, daysInMonth);
    const nextDate = new Date(nextYear, selectedMonthIndex, nextDay);
    setSelectedDate(nextDate);
    setCalendarMonth(nextDate);
  };

  const handleSelectMonth = (value: string) => {
    const nextMonthIndex = Number(value);
    const daysInMonth = getDaysInMonth(selectedYear, nextMonthIndex);
    const nextDay = Math.min(selectedDay, daysInMonth);
    const nextDate = new Date(selectedYear, nextMonthIndex, nextDay);
    setSelectedDate(nextDate);
    setCalendarMonth(nextDate);
  };

  const handleSelectDay = (value: string) => {
    const nextDay = Number(value);
    const nextDate = new Date(selectedYear, selectedMonthIndex, nextDay);
    setSelectedDate(nextDate);
    setCalendarMonth(nextDate);
  };

  return (
    <div>
      <main>
        <div className="container max-w-6xl">
          <PageHeader
            icon={CalendarDays}
            title={t('calendar')}
            subtitle={t('calendarSubtitle')}
          />

          <div className={`-mt-6 mb-6 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
            <Button variant="emerald" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                {t('returnHome')}
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Card className="border-border/60">
              <CardHeader className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <div>
                  <CardTitle className="text-xl">
                    {calendarView === 'gregorian' ? t('gregorianCalendar') : t('hijriCalendar')}
                  </CardTitle>
                </div>
                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Select value={calendarView} onValueChange={(value) => setCalendarView(value as 'gregorian' | 'hijri')}>
                    <SelectTrigger className="h-9 w-[170px]" aria-label={t('calendarView')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" dir={isRtl ? 'rtl' : 'ltr'}>
                      <SelectItem value="gregorian">{t('gregorianCalendar')}</SelectItem>
                      <SelectItem value="hijri">{t('hijriCalendar')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                    {t('today')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : 'text-left'}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setSelectedDate(date);
                    setCalendarMonth(date);
                  }}
                  className="rounded-lg border border-border/60"
                  locale={calendarLocale}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  weekStartsOn={6}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  formatters={calendarFormatters}
                  classNames={{
                    head_row: 'flex gap-2',
                    head_cell: 'text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2 gap-2',
                    cell: 'h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-10 w-10 p-0 font-normal aria-selected:opacity-100',
                  }}
                />
                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">{t('selectedDate')}</p>
                  <p className="text-lg font-semibold text-foreground">
                    {calendarView === 'gregorian' ? gregorianLabel : hijriLabel}
                  </p>
                  {calendarView === 'hijri' && (
                    <p className="mt-2 text-sm text-muted-foreground">{t('hijriNote')}</p>
                  )}
                </div>

                <div className="mt-4 rounded-lg border border-border/60 bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t('chooseDate')}</p>
                  <div className={`mt-3 grid gap-3 ${isRtl ? 'text-right' : 'text-left'} sm:grid-cols-3`}>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('chooseDay')}</p>
                      <Select value={String(selectedDay)} onValueChange={handleSelectDay}>
                        <SelectTrigger className="mt-2 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
                          {dayOptions.map((day) => (
                            <SelectItem key={day} value={String(day)}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('chooseMonth')}</p>
                      <Select value={String(selectedMonthIndex)} onValueChange={handleSelectMonth}>
                        <SelectTrigger className="mt-2 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
                          {monthOptions.map((month) => (
                            <SelectItem key={month.value} value={String(month.value)}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('chooseYear')}</p>
                      <Select value={String(selectedYear)} onValueChange={handleSelectYear}>
                        <SelectTrigger className="mt-2 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={isRtl ? 'rtl' : 'ltr'} className="max-h-72">
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <p className="text-sm font-semibold text-foreground">
                      {calendarView === 'hijri' ? hijriLabel : gregorianLabel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">{t('hijriCalendar')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t('hijriDate')}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{hijriLabel}</p>
                  {currentHijriMonth && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{t('currentHijriMonth')}</Badge>
                      <span className="text-sm font-medium text-foreground">
                        {t(currentHijriMonth.nameKey)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">{t('selectedDate')}</p>
                  <p className="text-lg font-semibold text-foreground">{gregorianLabel}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t('hijriNote')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 border-border/60">
            <CardHeader>
              <CardTitle className="text-xl">{t('hijriEvents')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {HIJRI_MONTHS.map((month) => {
                  const isCurrent = month.month === hijriMonthNumber;
                  return (
                    <div
                      key={month.month}
                      className={`rounded-xl border p-4 transition ${isCurrent ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card'}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">{t(month.nameKey)}</h3>
                        {isCurrent && <Badge>{t('currentHijriMonth')}</Badge>}
                      </div>
                      {month.events.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('hijriEventNoMajor')}</p>
                      ) : (
                        <div className="space-y-2">
                          {month.events.map((event) => (
                            <div key={`${month.month}-${event.day}`} className="flex items-start gap-2">
                              <Badge variant="outline" className="mt-0.5">
                                {event.day}
                              </Badge>
                              <span className="text-sm text-foreground">{t(event.labelKey)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
