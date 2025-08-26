import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus } from 'lucide-react';
import { CeilingConfiguration, ProjectConfiguration } from '../../types/CalculationTypes';
import { 
  FloorConstructionType, 
  ScreedType,
  CladdingType,
  ElementType 
} from '@vbacoustic/lib/src/models/AcousticTypes';
import { JunctionStiffness, StandardType } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface CeilingConfigurationFormProps {
  onNext: (data: CeilingConfiguration) => void;
  onPrev: () => void;
  defaultValues?: Partial<CeilingConfiguration>;
  projectConfig?: ProjectConfiguration | null;
}

/**
 * Ceiling configuration form - mirrors WallConfigurationForm structure
 * This includes ceiling type selection, dimensions, layers, and flanking elements
 */
export const CeilingConfigurationForm: React.FC<CeilingConfigurationFormProps> = ({
  onNext,
  onPrev,
  defaultValues,
  projectConfig
}) => {
  const { t } = useTranslation();
  const { register, control, watch, handleSubmit, setValue, formState: { errors } } = useForm<CeilingConfiguration>({
    defaultValues: {
      ceilingType: FloorConstructionType.MassTimberFloor,
      thickness: 160,
      spanWidth: 4.0,
      estrichType: ScreedType.CementOnMineralFiber,
      estrichThickness: 50,
      layers: [],
      flankingElements: [],
      ...defaultValues
    }
  });

  const { fields: layers, append: addLayer, remove: removeLayer } = useFieldArray({
    control,
    name: 'layers'
  });

  const { fields: flankingElements, append: addFlankingElement, remove: removeFlankingElement } = useFieldArray({
    control,
    name: 'flankingElements'
  });

  const ceilingType = watch('ceilingType');
  const estrichType = watch('estrichType');
  
  // Check if we're using DIN 4109 standard for flanking element restrictions
  const isDIN4109 = projectConfig?.calculationStandard === StandardType.DIN4109;
  
  // Set default screed thickness when screed type changes
  // Based on VBA analysis: different screed types had fixed thicknesses (e.g., sCE50 = 50mm, sCE80 = 80mm)
  // We provide reasonable defaults while allowing user customization unlike the original VBA
  useEffect(() => {
    if (estrichType) {
      let defaultThickness: number;
      switch (estrichType) {
        case ScreedType.CementOnMineralFiber:
        case ScreedType.CementOnWoodFiber:
          defaultThickness = 50; // Standard cement screed thickness
          break;
        case ScreedType.DryScreed:
          defaultThickness = 20; // Typical dry screed thickness
          break;
        default:
          defaultThickness = 50;
      }
      setValue('estrichThickness', defaultThickness);
    }
  }, [estrichType, setValue]);

  // Estrich (screed) is available for ALL ceiling types according to VBA implementation
  const showEstrich = Boolean(ceilingType);
  const showUnterdecke = ceilingType === FloorConstructionType.MassTimberWithCeiling;

  const addLayerHandler = () => {
    addLayer({
      id: `layer-${Date.now()}`,
      name: '',
      thickness: 0,
      material: '',
      density: 0
    });
  };

  const addFlankingElementHandler = () => {
    // DIN 4109 only allows one flanking element based on VBA analysis
    if (isDIN4109 && flankingElements.length >= 1) {
      return; // Prevent adding more than one element for DIN 4109
    }
    
    addFlankingElement({ 
      id: `flanking-${Date.now()}`,
      elementType: ElementType.Wall, 
      thickness: 0, 
      length: 4.0,
      material: '', 
      position: 'left',
      junctionType: JunctionStiffness.RIGID,
      connectionDetails: ''
    });
  };

  return (
    <div>
      <form
        id="ceiling-form"
        onSubmit={handleSubmit(onNext)}
        className="space-y-8"
      >
        {/* Ceiling Type Selection */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {t("ceilingConfig.title")}
          </h3>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">
                {t("ceilingConfig.ceilingSystem")}
              </label>
              <select
                {...register("ceilingType", {
                  required: t("ceilingConfig.errors.ceilingTypeRequired"),
                })}
                className="form-select"
              >
                <option value="">{t("ceilingConfig.selectOption")}</option>
                <option value={FloorConstructionType.TimberBeamOpen}>
                  {t("ceilingConfig.timberBeamOpen")}
                </option>
                <option value={FloorConstructionType.TimberBeamWithBattensGK}>
                  {t("ceilingConfig.timberBeamWithBattensGK")}
                </option>
                <option value={FloorConstructionType.TimberBeamWithCeilingGK}>
                  {t("ceilingConfig.timberBeamWithCeilingGK")}
                </option>
                <option value={FloorConstructionType.TimberBeamWithCeiling2GK}>
                  {t("ceilingConfig.timberBeamWithCeiling2GK")}
                </option>
                <option value={FloorConstructionType.MassTimberFloor}>
                  {t("ceilingConfig.massTimberFloor")}
                </option>
                <option value={FloorConstructionType.MassTimberWithCeiling}>
                  {t("ceilingConfig.massTimberWithCeiling")}
                </option>
                <option value={FloorConstructionType.MassTimberRibbed}>
                  {t("ceilingConfig.massTimberRibbed")}
                </option>
                <option value={FloorConstructionType.TimberConcreteComposite}>
                  {t("ceilingConfig.timberConcreteComposite")}
                </option>
              </select>
              {errors.ceilingType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ceilingType.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Dimensions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {t("ceilingConfig.dimensions")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">
                {t("ceilingConfig.thickness")} (mm)
              </label>
              <input
                type="number"
                step="1"
                min="10"
                max="1000"
                {...register("thickness", {
                  required: t("ceilingConfig.errors.thicknessRequired"),
                  min: {
                    value: 10,
                    message: t("ceilingConfig.errors.thicknessMin"),
                  },
                  max: {
                    value: 1000,
                    message: t("ceilingConfig.errors.thicknessMax"),
                  },
                })}
                className="form-input"
                placeholder="160"
              />
              {errors.thickness && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thickness.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t("ceilingConfig.spanWidth")} (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="20.0"
                {...register("spanWidth", {
                  required: t("ceilingConfig.errors.spanWidthRequired"),
                  min: {
                    value: 1.0,
                    message: t("ceilingConfig.errors.spanWidthMin"),
                  },
                  max: {
                    value: 20.0,
                    message: t("ceilingConfig.errors.spanWidthMax"),
                  },
                })}
                className="form-input"
                placeholder="4.0"
              />
              {errors.spanWidth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.spanWidth.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estrich Configuration */}
        {showEstrich && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {t("ceilingConfig.estrich")}
            </h3>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  {t("ceilingConfig.estrichType")}
                </label>
                <select {...register("estrichType")} className="form-select">
                  <option value="">{t("ceilingConfig.selectOption")}</option>
                  <option value={ScreedType.CementOnMineralFiber}>
                    {t("ceilingConfig.cementOnMineralFiber")}
                  </option>
                  <option value={ScreedType.CementOnWoodFiber}>
                    {t("ceilingConfig.cementOnWoodFiber")}
                  </option>
                  <option value={ScreedType.DryScreed}>
                    {t("ceilingConfig.dryScreed")}
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("ceilingConfig.estrichThickness")} (mm)
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="200"
                  {...register("estrichThickness", {
                    min: {
                      value: 10,
                      message: t("ceilingConfig.errors.estrichThicknessMin"),
                    },
                    max: {
                      value: 200,
                      message: t("ceilingConfig.errors.estrichThicknessMax"),
                    },
                  })}
                  className="form-input"
                  placeholder="50"
                />
                {errors.estrichThickness && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estrichThickness.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unterdecke Configuration */}
        {showUnterdecke && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {t("ceilingConfig.unterdecke")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  {t("ceilingConfig.cavityHeight")} (mm)
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="500"
                  {...register("cavityHeight", {
                    min: {
                      value: 10,
                      message: t("ceilingConfig.errors.cavityHeightMin"),
                    },
                    max: {
                      value: 500,
                      message: t("ceilingConfig.errors.cavityHeightMax"),
                    },
                  })}
                  className="form-input"
                  placeholder="100"
                />
                {errors.cavityHeight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cavityHeight.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("ceilingConfig.underCeilingType")}
                </label>
                <select
                  {...register("underCeilingType")}
                  className="form-select"
                >
                  <option value="">{t("ceilingConfig.selectOption")}</option>
                  <option value={CladdingType.WoodBoardPlusGK}>
                    {t("ceilingConfig.woodBoardPlusGK")}
                  </option>
                  <option value={CladdingType.GypsusFiber}>
                    {t("ceilingConfig.gypsusFiber")}
                  </option>
                  <option value={CladdingType.WoodBoardOnly}>
                    {t("ceilingConfig.woodBoardOnly")}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Layer Configuration */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("ceilingConfig.layers")}
            </h3>
            <button
              type="button"
              onClick={addLayerHandler}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t("ceilingConfig.addLayer")}</span>
            </button>
          </div>

          {/* Explanation text for layers */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {t("ceilingConfig.layersExplanation")}
            </p>
          </div>

          {layers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t("ceilingConfig.noLayersYet")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {layers.map((layer, index) => (
                <div key={layer.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      {t("ceilingConfig.layer")} {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeLayer(index)}
                      className="text-red-600 hover:text-red-800"
                      title={t("ceilingConfig.removeLayer")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.layerMaterial")}
                      </label>
                      <input
                        {...register(`layers.${index}.material`, {
                          required: t("ceilingConfig.errors.materialRequired"),
                        })}
                        className="form-input"
                        placeholder={t("ceilingConfig.materialDesignation")}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.layerThickness")} (mm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        {...register(`layers.${index}.thickness`, {
                          required: t(
                            "ceilingConfig.errors.layerThicknessRequired"
                          ),
                          min: {
                            value: 1,
                            message: t(
                              "ceilingConfig.errors.layerThicknessMin"
                            ),
                          },
                        })}
                        className="form-input"
                        placeholder="160"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.layerDensity")} (kg/m³)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        {...register(`layers.${index}.density`, {
                          required: t("ceilingConfig.errors.densityRequired"),
                          min: {
                            value: 1,
                            message: t("ceilingConfig.errors.densityMin"),
                          },
                        })}
                        className="form-input"
                        placeholder="470"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flanking Elements */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("ceilingConfig.flankingElements")}
            </h3>
            <button
              type="button"
              onClick={addFlankingElementHandler}
              disabled={isDIN4109 && flankingElements.length >= 1}
              className={`btn-secondary flex items-center space-x-2 ${
                isDIN4109 && flankingElements.length >= 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t("ceilingConfig.addElement")}</span>
            </button>
          </div>

          {/* DIN 4109 Explanation */}
          {isDIN4109 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {t("ceilingConfig.din4109FlankingRestriction")}
              </p>
            </div>
          )}

          {flankingElements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t("ceilingConfig.noFlankingElementsYet")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flankingElements.map((element, index) => (
                <div key={element.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      {t("ceilingConfig.flankingElement")} {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFlankingElement(index)}
                      className="text-red-600 hover:text-red-800"
                      title={t("ceilingConfig.removeElement")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.elementType")}
                      </label>
                      <select
                        {...register(`flankingElements.${index}.elementType`)}
                        className="form-select"
                      >
                        <option value="wall">{t("wallConfig.wall")}</option>
                        <option value="ceiling">
                          {t("wallConfig.ceiling")}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.elementThickness")} (mm)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        {...register(`flankingElements.${index}.thickness`, {
                          required: t(
                            "ceilingConfig.errors.elementThicknessRequired"
                          ),
                          min: {
                            value: 1,
                            message: t(
                              "ceilingConfig.errors.elementThicknessMin"
                            ),
                          },
                        })}
                        className="form-input"
                        placeholder="200"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.elementMaterial")}
                      </label>
                      <input
                        {...register(`flankingElements.${index}.material`, {
                          required: t("ceilingConfig.errors.materialRequired"),
                        })}
                        className="form-input"
                        placeholder={t("ceilingConfig.materialDesignation")}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        {t("ceilingConfig.elementPosition")}
                      </label>
                      <select
                        {...register(`flankingElements.${index}.position`)}
                        className="form-select"
                      >
                        <option value="left">
                          {t("ceilingConfig.positionLeft")}
                        </option>
                        <option value="right">
                          {t("ceilingConfig.positionRight")}
                        </option>
                        <option value="front">
                          {t("ceilingConfig.positionFront")}
                        </option>
                        <option value="back">
                          {t("ceilingConfig.positionBack")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="alert-error">
            <p className="font-medium">{t("ceilingConfig.errorSummary")}</p>
            <ul className="list-disc list-inside mt-2 text-sm">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>{error?.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="btn-secondary">
            {t("ceilingConfig.backToProjectConfig")}
          </button>
          <button type="submit" form="ceiling-form" className="btn-primary">
            {t("ceilingConfig.continueToCalculationParams")}
          </button>
        </div>
      </div>
    </div>
  );
};
