import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, FileText, Info } from 'lucide-react';
import { DIN4109CeilingComponent, DIN4109FlankingComponent, DIN4109ComponentFilter } from '../types/DIN4109Types';
import { DIN4109ComponentService } from '../services/DIN4109ComponentService';

interface DIN4109ComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (component: DIN4109CeilingComponent | DIN4109FlankingComponent) => void;
  mode: 'ceiling' | 'flanking';
  filter?: DIN4109ComponentFilter;
  flankingType?: string;
}

/**
 * DIN 4109-33 Component Picker Dialog
 * Mirrors the VBA forms: frmDIN4109_33_Decken and frmDIN4109_33_Flanken
 */
export const DIN4109ComponentPicker: React.FC<DIN4109ComponentPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode,
  filter = {},
  flankingType
}) => {
  const { t, i18n } = useTranslation();
  const [components, setComponents] = useState<(DIN4109CeilingComponent | DIN4109FlankingComponent)[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [currentTable, setCurrentTable] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setComponents([]);
      setSelectedComponent(null);
      setCurrentTable(null);
      return;
    }

    // Always reset selection when opening, regardless of mode
    setSelectedComponent(null);

    if (mode === 'ceiling') {
      const ceilingComponents = DIN4109ComponentService.getApplicableCeilingComponents(filter);
      setComponents(ceilingComponents);
      
      // Set initial table based on first component
      if (ceilingComponents.length > 0 && ceilingComponents[0]) {
        setCurrentTable(ceilingComponents[0].tableNumber);
      } else {
        setCurrentTable(null);
      }
    } else {
      const flankingComponents = DIN4109ComponentService.getApplicableFlankingComponents(flankingType);
      setComponents(flankingComponents);
      
      // Set initial table based on first component
      if (flankingComponents.length > 0 && flankingComponents[0]) {
        setCurrentTable(flankingComponents[0].tableNumber);
      } else {
        setCurrentTable(null);
      }
    }
  }, [isOpen, mode, filter?.ceilingType, filter?.screedType, flankingType]);

  const handleSelect = () => {
    if (!selectedComponent) {
      console.warn('DIN4109ComponentPicker: No component selected');
      return;
    }
    
    const component = components.find(c => c.id === selectedComponent);
    
    if (component) {
      console.log('DIN4109ComponentPicker: Selecting component:', component.id);
      onSelect(component);
      onClose(); // Close the dialog after selection
    } else {
      console.error('DIN4109ComponentPicker: Component not found with ID:', selectedComponent);
      console.error('Available component IDs:', components.map(c => c.id));
    }
  };

  const handleDoubleClick = (component: DIN4109CeilingComponent | DIN4109FlankingComponent) => {
    // Immediate selection on double-click, like VBA click handlers
    console.log('DIN4109ComponentPicker: Double-click selecting component:', component.id);
    onSelect(component);
    onClose(); // Close the dialog after selection
  };

  const getTableTitle = (tableNumber: number): string => {
    const tableTitles: Record<number, string> = {
      15: t('din4109.tables.t15.title'),
      16: t('din4109.tables.t16.title'), 
      20: t('din4109.tables.t20.title'),
      21: t('din4109.tables.t21.title'),
      24: t('din4109.tables.t24.title'),
      25: t('din4109.tables.t25.title'),
      26: t('din4109.tables.t26.title'),
      27: t('din4109.tables.t27.title'),
      36: t('din4109.tables.t36.title')
    };
    return tableTitles[tableNumber] || `Table ${tableNumber}`;
  };

  const getAvailableTables = (): number[] => {
    const tables = [...new Set(components.map(c => c.tableNumber))];
    return tables.sort();
  };

  const getComponentsForTable = (tableNumber: number) => {
    return components.filter(c => c.tableNumber === tableNumber);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'ceiling' 
                  ? t('din4109.picker.ceilingTitle') 
                  : t('din4109.picker.flankingTitle')
                }
              </h2>
              <p className="text-sm text-gray-500">
                {t('din4109.picker.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Info */}
        {mode === 'ceiling' && (filter.ceilingType || filter.screedType) && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Info className="h-4 w-4" />
              <span>{t('din4109.picker.filterInfo')}:</span>
              {filter.ceilingType && (
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {t(`ceilingConfig.${filter.ceilingType}`)}
                </span>
              )}
              {filter.screedType && (
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {t(`ceilingConfig.${filter.screedType}`)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          
          {/* Table Navigation */}
          {getAvailableTables().length > 1 && (
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  {t('din4109.picker.tables')}
                </h3>
                <nav className="space-y-1">
                  {getAvailableTables().map(tableNumber => (
                    <button
                      key={tableNumber}
                      onClick={() => setCurrentTable(tableNumber)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentTable === tableNumber
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getTableTitle(tableNumber)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Component List */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              {currentTable && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {getTableTitle(currentTable)}
                  </h3>
                  
                  <div className="space-y-3">
                    {getComponentsForTable(currentTable).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No components found for table {currentTable}</p>
                        <p className="text-xs">Total components loaded: {components.length}</p>
                      </div>
                    ) : (
                      getComponentsForTable(currentTable).map(component => (
                      <div
                        key={component.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all select-none ${
                          selectedComponent === component.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                        onDoubleClick={() => handleDoubleClick(component)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {i18n.language === 'de' ? component.descriptions.de.short : component.descriptions.en.short}
                              </span>
                              <span className="text-xs text-gray-500">
                                T{component.tableNumber}.{component.rowNumber}
                              </span>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-2">
                              {i18n.language === 'de' ? component.descriptions.de.description : component.descriptions.en.description}
                            </h4>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {i18n.language === 'de' ? component.descriptions.de.constructionDetails : component.descriptions.en.constructionDetails}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {'rw' in component && (
                                <div>
                                  <span className="text-gray-500">R'w:</span>
                                  <span className="font-medium ml-1">{component.rw} dB</span>
                                </div>
                              )}
                              {'lnw' in component && (
                                <div>
                                  <span className="text-gray-500">L'n,w:</span>
                                  <span className="font-medium ml-1">{component.lnw} dB</span>
                                </div>
                              )}
                              {'dnfw' in component && (
                                <div>
                                  <span className="text-gray-500">Dn,f,w:</span>
                                  <span className="font-medium ml-1">{component.dnfw} dB</span>
                                </div>
                              )}
                              {'mass' in component && component.mass && (
                                <div>
                                  <span className="text-gray-500">{t('din4109.picker.mass')}:</span>
                                  <span className="font-medium ml-1">{component.mass} kg/m²</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {selectedComponent === component.id && (
                            <div className="ml-4">
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )))}
                  </div>
                </>
              )}
              
              {components.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {t('din4109.picker.noComponents')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-500">
            {components.length > 0 && (
              <span>
                {t('din4109.picker.componentsCount', { count: components.length })}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedComponent}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('din4109.picker.selectComponent')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
