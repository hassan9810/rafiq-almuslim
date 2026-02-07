import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, Moon, Sun, Type, Languages, BookOpen, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/lib/quranApi';

interface MushafSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const MushafSettings = memo(function MushafSettings({
  open,
  onClose
}: MushafSettingsProps) {
  const { language } = useTranslation();
  const { settings, updateSettings } = useMushafStore();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {language === 'ar' ? 'إعدادات المصحف' : 'Mushaf Settings'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Type className="w-4 h-4" />
              {language === 'ar' ? 'العرض' : 'Display'}
            </h3>

            {/* Night Mode */}
            <div className="flex items-center justify-between">
              <Label htmlFor="night-mode" className="flex items-center gap-2">
                {settings.nightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {language === 'ar' ? 'الوضع الليلي' : 'Night Mode'}
              </Label>
              <Switch
                id="night-mode"
                checked={settings.nightMode}
                onCheckedChange={(checked) => updateSettings({ nightMode: checked })}
              />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                {language === 'ar' ? 'حجم الخط' : 'Font Size'}
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-xs">A</span>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([val]) => updateSettings({ fontSize: val })}
                  min={16}
                  max={40}
                  step={2}
                  className="flex-1"
                />
                <span className="text-lg">A</span>
                <span className="text-xs text-muted-foreground w-8">{settings.fontSize}px</span>
              </div>
            </div>

            {/* Show Tashkeel */}
            <div className="flex items-center justify-between">
              <Label htmlFor="tashkeel">
                {language === 'ar' ? 'إظهار التشكيل' : 'Show Tashkeel'}
              </Label>
              <Switch
                id="tashkeel"
                checked={settings.showTashkeel}
                onCheckedChange={(checked) => updateSettings({ showTashkeel: checked })}
              />
            </div>
          </div>

          {/* Translation Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Languages className="w-4 h-4" />
              {language === 'ar' ? 'الترجمة' : 'Translation'}
            </h3>

            {/* Show Translation */}
            <div className="flex items-center justify-between">
              <Label htmlFor="show-translation">
                {language === 'ar' ? 'إظهار الترجمة' : 'Show Translation'}
              </Label>
              <Switch
                id="show-translation"
                checked={settings.showTranslation}
                onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
              />
            </div>

            {/* Translation Edition */}
            {settings.showTranslation && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'نسخة الترجمة' : 'Translation Edition'}</Label>
                <Select
                  value={settings.translationEdition}
                  onValueChange={(val) => updateSettings({ translationEdition: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {translations.map((t) => (
                      <SelectItem key={t.code} value={t.code}>
                        {t.name} ({t.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Tafsir Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {language === 'ar' ? 'التفسير' : 'Tafsir'}
            </h3>

            {/* Show Tafsir */}
            <div className="flex items-center justify-between">
              <Label htmlFor="show-tafsir">
                {language === 'ar' ? 'إظهار التفسير' : 'Show Tafsir'}
              </Label>
              <Switch
                id="show-tafsir"
                checked={settings.showTafsir}
                onCheckedChange={(checked) => updateSettings({ showTafsir: checked })}
              />
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {language === 'ar' ? 'الصوت' : 'Audio'}
            </h3>

            {/* Audio Sync */}
            <div className="flex items-center justify-between">
              <Label htmlFor="audio-sync">
                {language === 'ar' ? 'مزامنة الصوت' : 'Audio Sync'}
              </Label>
              <Switch
                id="audio-sync"
                checked={settings.audioSync}
                onCheckedChange={(checked) => updateSettings({ audioSync: checked })}
              />
            </div>

            {/* Auto Scroll */}
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-scroll">
                {language === 'ar' ? 'التمرير التلقائي' : 'Auto Scroll'}
              </Label>
              <Switch
                id="auto-scroll"
                checked={settings.autoScroll}
                onCheckedChange={(checked) => updateSettings({ autoScroll: checked })}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
