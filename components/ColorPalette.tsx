import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface ColorPaletteProps {
  colors: string[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const { t } = useTranslation();
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('modal.details.palette')}</h4>
      <div className="flex space-x-2">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};