import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator, Wallet, Coins, TrendingUp, Store, Bitcoin, Users, History,
  Trash2, Plus, ArrowLeft, PiggyBank, Home, Wheat, Beef, Layers, RefreshCw,
  CalendarClock, Info, X,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { useZakatStore } from '@/store/useZakatStore';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  calculateMoneyZakat, calculateGoldZakat, calculateSilverZakat,
  calculateStocksZakat, calculateTradeZakat, calculateFitrZakat,
  calculateRetirementZakat, calculateRentalZakat, calculateAgricultureZakat,
  calculateLivestockZakat, calculateTotalZakat, getNisabValue, getHawlStatus,
  GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, AGRICULTURE_NISAB_KG, ZAKAT_RATE,
  type IrrigationType, type LivestockKind, type ZakatType,
} from '@/lib/zakatCalculator';
import { fetchLivePrices } from '@/lib/goldPriceApi';
import { Link } from 'react-router-dom';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP', 'KWD', 'QAR', 'PKR', 'INR', 'IDR', 'MYR', 'TRY'];

export default function ZakatPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const isAr = language === 'ar';

  const {
    currency, nisabBasis, goldPricePerGram, silverPricePerGram, fitrMealPrice,
    pricesUpdatedAt, priceSource, hawlStartDate,
    customItems, payments,
    setSettings, setLivePrices, setHawlStart,
    addCustomItem, updateCustomItem, removeCustomItem,
    addPayment, removePayment,
  } = useZakatStore();

  const [activeTab, setActiveTab] = useState('summary');
  const [priceStatus, setPriceStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  // ---- Per-category inputs ----
  const [moneyAmount, setMoneyAmount] = useState('');
  const [moneyDebts, setMoneyDebts] = useState('');

  const [goldType, setGoldType] = useState<'24' | '22' | '21' | '18' | '14'>('24');
  const [goldWeight, setGoldWeight] = useState('');
  const [silverWeight, setSilverWeight] = useState('');

  const [stocksValue, setStocksValue] = useState('');
  const [tradeInventory, setTradeInventory] = useState('');
  const [tradeCash, setTradeCash] = useState('');
  const [tradeReceivables, setTradeReceivables] = useState('');
  const [tradeLiabilities, setTradeLiabilities] = useState('');
  const [cryptoValue, setCryptoValue] = useState('');

  const [retirementValue, setRetirementValue] = useState('');
  const [rentalValue, setRentalValue] = useState('');

  const [agriWeight, setAgriWeight] = useState('');
  const [agriPriceMode, setAgriPriceMode] = useState<'total' | 'perKg'>('total');
  const [agriValue, setAgriValue] = useState('');
  const [agriPricePerKg, setAgriPricePerKg] = useState('');
  const [irrigation, setIrrigation] = useState<IrrigationType>('natural');

  const [livestockKind, setLivestockKind] = useState<LivestockKind>('sheep');
  const [livestockCount, setLivestockCount] = useState('');

  const [fitrMembers, setFitrMembers] = useState('');

  // Custom item draft
  const [customLabel, setCustomLabel] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customDeductible, setCustomDeductible] = useState(false);

  // ---- Nisab ----
  const goldNisabValue = goldPricePerGram * GOLD_NISAB_GRAMS;
  const silverNisabValue = silverPricePerGram * SILVER_NISAB_GRAMS;
  const currentNisab = getNisabValue(nisabBasis, goldPricePerGram, silverPricePerGram);

  // ---- Live prices ----
  const refreshPrices = useCallback(async () => {
    setPriceStatus('loading');
    const prices = await fetchLivePrices(currency);
    if (prices) {
      setLivePrices(prices.goldPerGram24k, prices.silverPerGram, prices.source);
      setPriceStatus('ok');
    } else {
      setPriceStatus('error');
    }
  }, [currency, setLivePrices]);

  // Auto-fetch on load / currency change when enabled and data is stale (>6h).
  useEffect(() => {
    if (!useZakatStore.getState().autoFetchPrices) return;
    const updated = pricesUpdatedAt ? new Date(pricesUpdatedAt).getTime() : 0;
    const stale = Date.now() - updated > 6 * 60 * 60 * 1000;
    if (stale) refreshPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  // ---- Calculations ----
  const results = useMemo(() => {
    const netMoney = (Number(moneyAmount) || 0) - (Number(moneyDebts) || 0);
    return {
      money: calculateMoneyZakat(netMoney, currentNisab),
      gold: calculateGoldZakat(Number(goldWeight) || 0, Number(goldType), goldPricePerGram),
      silver: calculateSilverZakat(Number(silverWeight) || 0, silverPricePerGram),
      stocks: calculateStocksZakat(Number(stocksValue) || 0, currentNisab),
      trade: calculateTradeZakat(
        Number(tradeInventory) || 0, Number(tradeCash) || 0,
        Number(tradeReceivables) || 0, Number(tradeLiabilities) || 0, currentNisab
      ),
      crypto: calculateStocksZakat(Number(cryptoValue) || 0, currentNisab),
      retirement: calculateRetirementZakat(Number(retirementValue) || 0, currentNisab),
      rental: calculateRentalZakat(Number(rentalValue) || 0, currentNisab),
      agriculture: calculateAgricultureZakat(
        Number(agriWeight) || 0,
        agriPriceMode === 'perKg' ? (Number(agriWeight) || 0) * (Number(agriPricePerKg) || 0) : (Number(agriValue) || 0),
        irrigation
      ),
      livestock: calculateLivestockZakat(livestockKind, Number(livestockCount) || 0),
      fitr: calculateFitrZakat(Number(fitrMembers) || 0, fitrMealPrice),
    };
  }, [
    moneyAmount, moneyDebts, goldWeight, goldType, silverWeight, stocksValue,
    tradeInventory, tradeCash, tradeReceivables, tradeLiabilities, cryptoValue,
    retirementValue, rentalValue, agriWeight, agriValue, agriPriceMode, agriPricePerKg, irrigation,
    livestockKind, livestockCount, fitrMembers, currentNisab,
    goldPricePerGram, silverPricePerGram, fitrMealPrice,
  ]);

  // ---- Combined total (money + gold value + silver value + stocks + trade + crypto + retirement + rental + custom items) ----
  const goldValue = (Number(goldWeight) || 0) *
    (goldPricePerGram * ({ '24': 1, '22': 22 / 24, '21': 21 / 24, '18': 18 / 24, '14': 14 / 24 }[goldType]));
  const silverValue = (Number(silverWeight) || 0) * silverPricePerGram;
  const tradeNet = (Number(tradeInventory) || 0) + (Number(tradeCash) || 0) +
    (Number(tradeReceivables) || 0) - (Number(tradeLiabilities) || 0);

  const totalResult = useMemo(() => {
    const items = [
      { amount: Number(moneyAmount) || 0 },
      { amount: goldValue },
      { amount: silverValue },
      { amount: Number(stocksValue) || 0 },
      { amount: Math.max(0, tradeNet) },
      { amount: Number(cryptoValue) || 0 },
      { amount: Number(retirementValue) || 0 },
      { amount: Number(rentalValue) || 0 },
      { amount: Number(moneyDebts) || 0, deductible: true },
      ...customItems.map((c) => ({ amount: Number(c.amount) || 0, deductible: c.deductible })),
    ];
    return calculateTotalZakat(items, currentNisab);
  }, [
    moneyAmount, moneyDebts, goldValue, silverValue, stocksValue, tradeNet,
    cryptoValue, retirementValue, rentalValue, customItems, currentNisab,
  ]);

  const hawl = hawlStartDate ? getHawlStatus(hawlStartDate) : null;

  // ---- Helpers ----
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { style: 'currency', currency }).format(val || 0);

  const handleSavePayment = (type: ZakatType, amount: number, note?: string) => {
    if (amount <= 0) return;
    addPayment({ date: new Date().toISOString(), amount, type, currency, note });
  };

  const addDraftCustom = () => {
    if (!customLabel.trim() || !(Number(customAmount) > 0)) return;
    addCustomItem({ label: customLabel.trim(), amount: Number(customAmount), deductible: customDeductible });
    setCustomLabel('');
    setCustomAmount('');
    setCustomDeductible(false);
  };

  const priceStatusText = () => {
    if (priceStatus === 'loading') return isAr ? 'جاري تحديث الأسعار…' : 'Updating prices…';
    if (priceStatus === 'error') return isAr ? 'تعذّر جلب السعر المباشر — عدّل يدوياً' : 'Live price unavailable — edit manually';
    if (pricesUpdatedAt) {
      const d = new Date(pricesUpdatedAt);
      return (isAr ? 'آخر تحديث: ' : 'Updated: ') +
        d.toLocaleString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) +
        (priceSource ? ` · ${priceSource}` : '');
    }
    return isAr ? 'الأسعار يدوية' : 'Manual prices';
  };

  const NisabHint = ({ met }: { met: boolean }) =>
    met ? null : (
      <Badge variant="destructive" className="shrink-0">{isAr ? 'لم يبلغ النصاب' : 'Below Nisab'}</Badge>
    );

  const ResultBox = ({ label, amount, highlight = true }: { label: string; amount: number; highlight?: boolean }) => (
    <div className={`p-4 rounded-xl border ${highlight && amount > 0 ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(amount)}</p>
    </div>
  );

  return (
    <div>
      <main>
        <div className="container py-6 max-w-5xl">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
              </Button>
            </Link>
          </div>

          <PageHeader
            icon={Calculator}
            title={isAr ? 'حاسبة الزكاة الذكية' : 'Smart Zakat Calculator'}
            subtitle={isAr ? 'احسب زكاة أموالك بدقة وفق الأسعار الحية والنصاب لكل الحالات' : 'Calculate Zakat for every scenario using live prices and Nisab'}
          />

          {/* Settings Bar */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{isAr ? 'العملة' : 'Currency'}</label>
                  <Select value={currency} onValueChange={(v) => setSettings({ currency: v })}>
                    <SelectTrigger className="w-28 h-9 bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{isAr ? 'أساس النصاب' : 'Nisab basis'}</label>
                  <Select value={nisabBasis} onValueChange={(v) => setSettings({ nisabBasis: v as 'gold' | 'silver' })}>
                    <SelectTrigger className="w-36 h-9 bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">{isAr ? 'الذهب (85غ)' : 'Gold (85g)'}</SelectItem>
                      <SelectItem value="silver">{isAr ? 'الفضة (595غ)' : 'Silver (595g)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{isAr ? 'جرام الذهب 24ق' : 'Gold 24k /g'}</label>
                  <Input type="number" className="w-28 h-9 bg-background" value={goldPricePerGram}
                    onChange={(e) => setSettings({ goldPricePerGram: Number(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{isAr ? 'جرام الفضة' : 'Silver /g'}</label>
                  <Input type="number" className="w-28 h-9 bg-background" value={silverPricePerGram}
                    onChange={(e) => setSettings({ silverPricePerGram: Number(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{isAr ? 'سعر وجبة الفطر' : 'Fitr meal price'}</label>
                  <Input type="number" className="w-28 h-9 bg-background" value={fitrMealPrice}
                    onChange={(e) => setSettings({ fitrMealPrice: Number(e.target.value) || 0 })} />
                </div>

                <Button variant="outline" size="sm" className="h-9 gap-2" onClick={refreshPrices} disabled={priceStatus === 'loading'}>
                  <RefreshCw className={`w-4 h-4 ${priceStatus === 'loading' ? 'animate-spin' : ''}`} />
                  {isAr ? 'سعر حي' : 'Live price'}
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-between">
                <span className={`text-xs ${priceStatus === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {priceStatusText()}
                </span>
                <div className="text-sm font-medium bg-background p-2 rounded-lg border">
                  {isAr ? 'النصاب الحالي: ' : 'Current Nisab: '}
                  <span className="text-primary">{formatCurrency(currentNisab)}</span>
                  <span className="text-muted-foreground text-xs ms-1">
                    ({nisabBasis === 'gold' ? (isAr ? 'ذهب' : 'gold') : (isAr ? 'فضة' : 'silver')})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} dir={direction} className="w-full">
                <TabsList className="w-full flex-wrap h-auto p-1 bg-muted/50 mb-4 justify-start gap-1">
                  <TabsTrigger value="summary" className="gap-2"><Layers className="w-4 h-4" />{isAr ? 'الإجمالي' : 'Total'}</TabsTrigger>
                  <TabsTrigger value="money" className="gap-2"><Wallet className="w-4 h-4" />{isAr ? 'الأموال' : 'Money'}</TabsTrigger>
                  <TabsTrigger value="gold" className="gap-2"><Coins className="w-4 h-4" />{isAr ? 'الذهب والفضة' : 'Gold/Silver'}</TabsTrigger>
                  <TabsTrigger value="stocks" className="gap-2"><TrendingUp className="w-4 h-4" />{isAr ? 'الأسهم' : 'Stocks'}</TabsTrigger>
                  <TabsTrigger value="trade" className="gap-2"><Store className="w-4 h-4" />{isAr ? 'التجارة' : 'Trade'}</TabsTrigger>
                  <TabsTrigger value="crypto" className="gap-2"><Bitcoin className="w-4 h-4" />{isAr ? 'الكريبتو' : 'Crypto'}</TabsTrigger>
                  <TabsTrigger value="retirement" className="gap-2"><PiggyBank className="w-4 h-4" />{isAr ? 'المعاشات' : 'Pension'}</TabsTrigger>
                  <TabsTrigger value="rental" className="gap-2"><Home className="w-4 h-4" />{isAr ? 'الإيجارات' : 'Rental'}</TabsTrigger>
                  <TabsTrigger value="agriculture" className="gap-2"><Wheat className="w-4 h-4" />{isAr ? 'الزروع' : 'Crops'}</TabsTrigger>
                  <TabsTrigger value="livestock" className="gap-2"><Beef className="w-4 h-4" />{isAr ? 'الأنعام' : 'Livestock'}</TabsTrigger>
                  <TabsTrigger value="fitr" className="gap-2"><Users className="w-4 h-4" />{isAr ? 'الفطر' : 'Fitr'}</TabsTrigger>
                </TabsList>

                {/* ============ SUMMARY / TOTAL ============ */}
                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'إجمالي الزكاة على كل ثروتك' : 'Total Zakat on your whole wealth'}</CardTitle>
                      <CardDescription>
                        {isAr
                          ? 'يجمع كل الأصول (نقد، ذهب، فضة، أسهم، تجارة، كريبتو، معاشات، إيجارات) والبنود المخصصة، ويطبّق النصاب مرة واحدة على الصافي.'
                          : 'Combines every asset (cash, gold, silver, stocks, trade, crypto, pension, rental) and your custom items, then applies Nisab once to the net.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="text-muted-foreground text-xs">{isAr ? 'إجمالي الأصول' : 'Total assets'}</p>
                          <p className="font-semibold">{formatCurrency(totalResult.totalAssets)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="text-muted-foreground text-xs">{isAr ? 'إجمالي الخصوم' : 'Total liabilities'}</p>
                          <p className="font-semibold text-destructive">-{formatCurrency(totalResult.totalLiabilities)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="text-muted-foreground text-xs">{isAr ? 'صافي الثروة' : 'Net wealth'}</p>
                          <p className="font-semibold">{formatCurrency(totalResult.netWealth)}</p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border ${totalResult.reachedNisab ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{isAr ? 'إجمالي الزكاة الواجبة (2.5%)' : 'Total Zakat due (2.5%)'}</p>
                            <p className="text-4xl font-bold text-primary mt-1">{formatCurrency(totalResult.zakatDue)}</p>
                          </div>
                          <NisabHint met={totalResult.reachedNisab} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        {isAr
                          ? 'يعتمد الإجمالي على القيم المدخلة في التبويبات المختلفة بالإضافة إلى بنودك المخصصة أدناه. (تُحسب الزروع والأنعام والفطر بشكل مستقل لاختلاف نصابها.)'
                          : 'The total reflects the values entered across the tabs plus your custom items below. (Crops, livestock and Fitr are computed separately as they use different Nisab rules.)'}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" disabled={totalResult.zakatDue <= 0}
                        onClick={() => handleSavePayment('total', totalResult.zakatDue, isAr ? 'الإجمالي' : 'Combined total')}>
                        <Plus className="w-4 h-4 mx-2" />{isAr ? 'حفظ الإجمالي في السجل' : 'Save total to history'}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Custom sections */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{isAr ? 'بنود مخصصة' : 'Custom items'}</CardTitle>
                      <CardDescription>
                        {isAr ? 'أضف أي أصل أو دَيْن ليدخل في الإجمالي (مثلاً: قرض حسن، صندوق ادخار…).' : 'Add any asset or debt to include in the total (e.g. a personal loan, a savings pot…).'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {customItems.length > 0 && (
                        <div className="space-y-2">
                          {customItems.map((c) => (
                            <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/40">
                              <Badge variant={c.deductible ? 'destructive' : 'secondary'} className="text-[10px] shrink-0">
                                {c.deductible ? (isAr ? 'دَيْن' : 'Debt') : (isAr ? 'أصل' : 'Asset')}
                              </Badge>
                              <Input value={c.label} onChange={(e) => updateCustomItem(c.id, { label: e.target.value })}
                                className="h-8 flex-1 min-w-0" />
                              <Input type="number" value={c.amount}
                                onChange={(e) => updateCustomItem(c.id, { amount: Number(e.target.value) || 0 })}
                                className="h-8 w-28" />
                              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeCustomItem(c.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-end gap-2 pt-2 border-t">
                        <div className="space-y-1 flex-1 min-w-[140px]">
                          <label className="text-xs text-muted-foreground">{isAr ? 'الاسم' : 'Label'}</label>
                          <Input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)}
                            placeholder={isAr ? 'مثال: صندوق التوفير' : 'e.g. Savings pot'} className="h-9" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">{isAr ? 'المبلغ' : 'Amount'}</label>
                          <Input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="h-9 w-28" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">{isAr ? 'النوع' : 'Type'}</label>
                          <Select value={customDeductible ? 'debt' : 'asset'} onValueChange={(v) => setCustomDeductible(v === 'debt')}>
                            <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asset">{isAr ? 'أصل' : 'Asset'}</SelectItem>
                              <SelectItem value="debt">{isAr ? 'دَيْن' : 'Debt'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={addDraftCustom} className="h-9 gap-1" disabled={!customLabel.trim() || !(Number(customAmount) > 0)}>
                          <Plus className="w-4 h-4" />{isAr ? 'إضافة' : 'Add'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hawl tracking */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2"><CalendarClock className="w-5 h-5" />{isAr ? 'تتبّع الحول' : 'Hawl tracking'}</CardTitle>
                      <CardDescription>
                        {isAr ? 'تجب الزكاة بعد مرور سنة هجرية كاملة على بلوغ المال النصاب.' : 'Zakat is due once a full lunar (Hijri) year passes on wealth that has reached Nisab.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">{isAr ? 'تاريخ بلوغ النصاب' : 'Date wealth reached Nisab'}</label>
                          <Input type="date" className="h-9 w-44"
                            value={hawlStartDate ? hawlStartDate.slice(0, 10) : ''}
                            onChange={(e) => setHawlStart(e.target.value ? new Date(e.target.value).toISOString() : null)} />
                        </div>
                        {hawlStartDate && (
                          <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground" onClick={() => setHawlStart(null)}>
                            <X className="w-4 h-4" />{isAr ? 'مسح' : 'Clear'}
                          </Button>
                        )}
                      </div>
                      {hawl && (
                        <div className="space-y-2">
                          <Progress value={hawl.progress * 100} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className={hawl.complete ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                              {hawl.complete
                                ? (isAr ? 'اكتمل الحول — الزكاة مستحقة الآن' : 'Hawl complete — Zakat is due now')
                                : (isAr ? `متبقٍّ ${hawl.daysRemaining} يوماً` : `${hawl.daysRemaining} days remaining`)}
                            </span>
                            <span className="text-muted-foreground">
                              {isAr ? 'تاريخ الاستحقاق: ' : 'Due: '}
                              {hawl.dueDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ============ MONEY ============ */}
                <TabsContent value="money">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الأموال والمدخرات' : 'Zakat on Money & Savings'}</CardTitle>
                      <CardDescription>
                        {isAr
                          ? 'تجب في النقد والمدخرات إذا بلغ الصافي النصاب وحال عليه الحول. يمكنك خصم الديون الحالّة.'
                          : 'Due on cash and savings if the net reaches Nisab after a lunar year. You may deduct immediate debts.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{isAr ? 'إجمالي الأموال والمدخرات' : 'Total money & savings'}</label>
                          <Input type="number" placeholder="0" value={moneyAmount} onChange={(e) => setMoneyAmount(e.target.value)} className="text-lg" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-destructive">{isAr ? 'الديون الحالّة (تُخصم)' : 'Immediate debts (deducted)'}</label>
                          <Input type="number" placeholder="0" value={moneyDebts} onChange={(e) => setMoneyDebts(e.target.value)}
                            className="border-destructive/40 focus-visible:ring-destructive" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <ResultBox label={isAr ? 'مقدار الزكاة الواجبة' : 'Obligatory Zakat amount'} amount={results.money} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('money', results.money)} disabled={results.money <= 0}>
                        <Plus className="w-4 h-4 mx-2" />{isAr ? 'حفظ في السجل' : 'Save to history'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ GOLD / SILVER ============ */}
                <TabsContent value="gold">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الذهب والفضة' : 'Zakat on Gold & Silver'}</CardTitle>
                      <CardDescription>
                        {isAr ? `نصاب الذهب ${GOLD_NISAB_GRAMS} جرام (24ق) والفضة ${SILVER_NISAB_GRAMS} جرام.` : `Gold Nisab ${GOLD_NISAB_GRAMS}g (24k), silver ${SILVER_NISAB_GRAMS}g.`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" />{isAr ? 'الذهب' : 'Gold'}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm">{isAr ? 'عيار الذهب' : 'Gold purity (karat)'}</label>
                            <Select value={goldType} onValueChange={(v) => setGoldType(v as typeof goldType)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="24">24k</SelectItem>
                                <SelectItem value="22">22k</SelectItem>
                                <SelectItem value="21">21k</SelectItem>
                                <SelectItem value="18">18k</SelectItem>
                                <SelectItem value="14">14k</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm">{isAr ? 'الوزن (بالجرام)' : 'Weight (grams)'}</label>
                            <Input type="number" placeholder="0" value={goldWeight} onChange={(e) => setGoldWeight(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                          <span>{isAr ? 'زكاة الذهب:' : 'Gold Zakat:'}</span>
                          <span className="font-bold">{formatCurrency(results.gold)}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400" />{isAr ? 'الفضة' : 'Silver'}</h4>
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'الوزن (بالجرام)' : 'Weight (grams)'}</label>
                          <Input type="number" placeholder="0" value={silverWeight} onChange={(e) => setSilverWeight(e.target.value)} />
                        </div>
                        <div className="flex justify-between items-center text-sm p-2 bg-slate-400/10 rounded border border-slate-400/20">
                          <span>{isAr ? 'زكاة الفضة:' : 'Silver Zakat:'}</span>
                          <span className="font-bold">{formatCurrency(results.silver)}</span>
                        </div>
                      </div>

                      <ResultBox label={isAr ? 'إجمالي الزكاة (ذهب + فضة)' : 'Total Zakat (gold + silver)'} amount={results.gold + results.silver} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('gold', results.gold + results.silver)} disabled={(results.gold + results.silver) <= 0}>
                        <Plus className="w-4 h-4 mx-2" />{isAr ? 'حفظ الإجمالي في السجل' : 'Save total to history'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ STOCKS ============ */}
                <TabsContent value="stocks">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الأسهم والاستثمارات' : 'Zakat on Stocks & Investments'}</CardTitle>
                      <CardDescription>{isAr ? 'أسهم المضاربة تُزكّى على قيمتها السوقية بالكامل بنسبة 2.5%.' : 'Trading stocks are zakated at 2.5% of full market value.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isAr ? 'القيمة السوقية الحالية' : 'Current market value'}</label>
                        <Input type="number" placeholder="0" value={stocksValue} onChange={(e) => setStocksValue(e.target.value)} />
                      </div>
                      <ResultBox label={isAr ? 'الزكاة الواجبة (2.5%)' : 'Zakat amount (2.5%)'} amount={results.stocks} highlight={false} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('stocks', results.stocks)} disabled={results.stocks <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ TRADE ============ */}
                <TabsContent value="trade">
                  <Card>
                    <CardHeader><CardTitle>{isAr ? 'زكاة عروض التجارة' : 'Zakat on Trade Goods'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'قيمة البضائع (بسعر السوق)' : 'Inventory value (market)'}</label>
                          <Input type="number" value={tradeInventory} onChange={(e) => setTradeInventory(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'السيولة النقدية للتجارة' : 'Business cash on hand'}</label>
                          <Input type="number" value={tradeCash} onChange={(e) => setTradeCash(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'الديون المرجوّة (لك)' : 'Good receivables (owed to you)'}</label>
                          <Input type="number" value={tradeReceivables} onChange={(e) => setTradeReceivables(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-destructive">{isAr ? 'الديون التي عليك (تُخصم)' : 'Liabilities (deducted)'}</label>
                          <Input type="number" value={tradeLiabilities} onChange={(e) => setTradeLiabilities(e.target.value)} className="border-destructive/50 focus-visible:ring-destructive" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border bg-muted">
                        <p className="text-sm font-medium text-muted-foreground">{isAr ? 'صافي الوعاء الزكوي' : 'Net zakatable wealth'}</p>
                        <p className="text-lg font-semibold mb-4">{formatCurrency(Math.max(0, tradeNet))}</p>
                        <p className="text-sm font-medium text-muted-foreground">{isAr ? 'الزكاة الواجبة' : 'Zakat amount'}</p>
                        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(results.trade)}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('trade', results.trade)} disabled={results.trade <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ CRYPTO ============ */}
                <TabsContent value="crypto">
                  <Card>
                    <CardHeader><CardTitle>{isAr ? 'زكاة العملات المشفرة' : 'Zakat on Cryptocurrency'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isAr ? 'القيمة الإجمالية (بالعملة المحلية)' : 'Total value (local currency)'}</label>
                        <Input type="number" placeholder="0" value={cryptoValue} onChange={(e) => setCryptoValue(e.target.value)} />
                      </div>
                      <ResultBox label={isAr ? 'الزكاة الواجبة' : 'Zakat amount'} amount={results.crypto} highlight={false} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('crypto', results.crypto)} disabled={results.crypto <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ RETIREMENT / PENSION ============ */}
                <TabsContent value="retirement">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة المعاشات وصناديق التقاعد' : 'Zakat on Pension & Retirement'}</CardTitle>
                      <CardDescription>
                        {isAr ? 'تُزكّى المبالغ التي يمكنك الوصول إليها فعلياً (2.5%). المبالغ المحبوسة قد تُؤجَّل حتى استلامها.' : 'Zakat is due (2.5%) on funds you can actually access. Locked funds may be deferred until received.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isAr ? 'الرصيد المتاح للسحب' : 'Accessible balance'}</label>
                        <Input type="number" placeholder="0" value={retirementValue} onChange={(e) => setRetirementValue(e.target.value)} />
                      </div>
                      <ResultBox label={isAr ? 'الزكاة الواجبة' : 'Zakat amount'} amount={results.retirement} highlight={false} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('retirement', results.retirement)} disabled={results.retirement <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ RENTAL ============ */}
                <TabsContent value="rental">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة دخل الإيجارات' : 'Zakat on Rental Income'}</CardTitle>
                      <CardDescription>
                        {isAr ? 'العقار نفسه لا زكاة فيه؛ وإنما تجب الزكاة على صافي دخل الإيجار المُدَّخر إذا بلغ النصاب.' : 'The property itself is not zakatable; Zakat is due on the net saved rental income if it reaches Nisab.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isAr ? 'صافي دخل الإيجار المدَّخر' : 'Net saved rental income'}</label>
                        <Input type="number" placeholder="0" value={rentalValue} onChange={(e) => setRentalValue(e.target.value)} />
                      </div>
                      <ResultBox label={isAr ? 'الزكاة الواجبة' : 'Zakat amount'} amount={results.rental} highlight={false} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('rental', results.rental)} disabled={results.rental <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ AGRICULTURE ============ */}
                <TabsContent value="agriculture">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الزروع والثمار' : 'Zakat on Crops & Fruits'}</CardTitle>
                      <CardDescription>
                        {isAr ? `النصاب ${AGRICULTURE_NISAB_KG} كجم. تُخرج عند الحصاد بلا حول: 10% للسقي الطبيعي، 5% للسقي بالكلفة، 7.5% للمختلط.` : `Nisab ${AGRICULTURE_NISAB_KG}kg. Due at harvest (no hawl): 10% rain-fed, 5% irrigated, 7.5% mixed.`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm">{isAr ? 'وزن المحصول (كجم)' : 'Harvest weight (kg)'}</label>
                            <Input type="number" value={agriWeight} onChange={(e) => setAgriWeight(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm">{isAr ? 'طريقة حساب القيمة' : 'Pricing method'}</label>
                            <Select value={agriPriceMode} onValueChange={(v) => setAgriPriceMode(v as 'total' | 'perKg')}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="total">{isAr ? 'إجمالي قيمة المحصول' : 'Total market value'}</SelectItem>
                                <SelectItem value="perKg">{isAr ? 'سعر الكيلوجرام الواحد' : 'Price per KG'}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {agriPriceMode === 'total' ? (
                          <div className="space-y-2">
                            <label className="text-sm">{isAr ? 'إجمالي قيمة المحصول السوقية' : 'Total harvest market value'}</label>
                            <Input type="number" value={agriValue} onChange={(e) => setAgriValue(e.target.value)} />
                          </div>
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm">{isAr ? 'سعر الكيلوجرام' : 'Price per KG'}</label>
                              <Input type="number" value={agriPricePerKg} onChange={(e) => setAgriPricePerKg(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-muted-foreground">{isAr ? 'إجمالي القيمة المحسوبة' : 'Calculated total value'}</label>
                              <div className="h-9 px-3 py-1 border rounded-md bg-muted flex items-center font-medium">
                                {new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { style: 'currency', currency }).format((Number(agriWeight) || 0) * (Number(agriPricePerKg) || 0))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">{isAr ? 'طريقة السقي' : 'Irrigation method'}</label>
                        <Select value={irrigation} onValueChange={(v) => setIrrigation(v as IrrigationType)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="natural">{isAr ? 'طبيعي (مطر/أنهار) — 10%' : 'Natural (rain/rivers) — 10%'}</SelectItem>
                            <SelectItem value="artificial">{isAr ? 'بكلفة (ريّ/ضخّ) — 5%' : 'Irrigated (pumped) — 5%'}</SelectItem>
                            <SelectItem value="mixed">{isAr ? 'مختلط — 7.5%' : 'Mixed — 7.5%'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <ResultBox label={isAr ? 'الزكاة الواجبة' : 'Zakat amount'} amount={results.agriculture} />
                        {Number(agriWeight) > 0 && Number(agriWeight) < AGRICULTURE_NISAB_KG && (
                          <Badge variant="destructive">{isAr ? 'لم يبلغ النصاب' : 'Below Nisab'}</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('agriculture', results.agriculture)} disabled={results.agriculture <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* ============ LIVESTOCK ============ */}
                <TabsContent value="livestock">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الأنعام' : 'Zakat on Livestock'}</CardTitle>
                      <CardDescription>
                        {isAr ? 'تجب في السائمة (الراعية) الغنم والبقر والإبل، وتُخرَج عيناً (حيوانات) وفق الجداول الفقهية.' : 'Due on free-grazing sheep, cattle and camels, and paid in-kind (animals) per the classical tables.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'نوع الماشية' : 'Livestock type'}</label>
                          <Select value={livestockKind} onValueChange={(v) => setLivestockKind(v as LivestockKind)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sheep">{isAr ? 'غنم/ماعز (نصاب 40)' : 'Sheep/Goats (nisab 40)'}</SelectItem>
                              <SelectItem value="cattle">{isAr ? 'بقر (نصاب 30)' : 'Cattle (nisab 30)'}</SelectItem>
                              <SelectItem value="camel">{isAr ? 'إبل (نصاب 5)' : 'Camels (nisab 5)'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">{isAr ? 'عدد الرؤوس' : 'Number of head'}</label>
                          <Input type="number" value={livestockCount} onChange={(e) => setLivestockCount(e.target.value)} />
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl border ${results.livestock.due ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
                        <p className="text-sm font-medium text-muted-foreground">{isAr ? 'الواجب إخراجه' : 'What is due'}</p>
                        <p className="text-2xl font-bold text-primary mt-1">{isAr ? results.livestock.descriptionAr : results.livestock.descriptionEn}</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        {isAr ? 'تُدفع زكاة الأنعام عيناً لا نقداً، لذا لا تُضاف إلى الإجمالي النقدي.' : 'Livestock Zakat is paid in animals, not cash, so it is not added to the monetary total.'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ============ FITR ============ */}
                <TabsContent value="fitr">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isAr ? 'زكاة الفطر' : 'Zakat al-Fitr'}</CardTitle>
                      <CardDescription>{isAr ? 'تُخرج عن كل فرد في رمضان قبل صلاة العيد.' : 'Obligatory for every family member in Ramadan, before the Eid prayer.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isAr ? 'عدد أفراد الأسرة' : 'Number of family members'}</label>
                        <Input type="number" placeholder="0" value={fitrMembers} onChange={(e) => setFitrMembers(e.target.value)} />
                      </div>
                      <ResultBox label={isAr ? 'الزكاة الواجبة إجمالاً' : 'Total Zakat al-Fitr'} amount={results.fitr} highlight={false} />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSavePayment('fitr', results.fitr)} disabled={results.fitr <= 0}>{isAr ? 'حفظ' : 'Save'}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* ============ HISTORY SIDEBAR ============ */}
            <div className="lg:col-span-1">
              <Card className="h-full max-h-[820px] flex flex-col">
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-5 h-5" />{isAr ? 'سجل المدفوعات' : 'Payment History'}
                  </CardTitle>
                  <CardDescription>{isAr ? 'يُحفظ محلياً على جهازك' : 'Saved locally on your device'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  {payments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">{isAr ? 'لا توجد مدفوعات مسجلة بعد.' : 'No payments recorded yet.'}</div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="p-3 bg-muted/50 rounded-lg border flex items-center justify-between group">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px]">{payment.type.toUpperCase()}</Badge>
                              <span className="font-semibold text-sm">
                                {new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                              </span>
                            </div>
                            {payment.note && <div className="text-xs text-muted-foreground mt-1 truncate">{payment.note}</div>}
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(payment.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon-sm"
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePayment(payment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {payments.length > 0 && (
                  <CardFooter className="shrink-0 pt-3 border-t flex-col items-stretch gap-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">{isAr ? 'الإجمالي المسجّل' : 'Total recorded'}</span>
                      <span className="text-primary">
                        {formatCurrency(payments.filter((p) => p.currency === currency).reduce((s, p) => s + p.amount, 0))}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{isAr ? `بعملة ${currency} فقط` : `${currency} entries only`}</span>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
