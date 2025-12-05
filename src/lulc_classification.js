/***************************************************************
*  LAND USE / LAND COVER (LULC) CLASSIFICATION – RANGPUR (2023)
*  Satellite: Landsat 8 Collection 2 Level-2 (Surface Reflectance)
*  Method: Random Forest (200 Trees)
*  Author: Saeed Sourav
***************************************************************/

/*--------------------------------------------------------------
  1. IMPORTS & STUDY AREA
--------------------------------------------------------------*/
var area_km2 = roi.geometry().area().divide(1e6).round();
print('Study Area Size (km²):', area_km2);

Map.centerObject(roi, 8);

/***************************************************************
  2. LANDSAT 8 DATA PRE-PROCESSING
***************************************************************/
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(roi)
  .filterDate('2023-01-01', '2024-01-01')
  .filter(ee.Filter.lt('CLOUD_COVER', 20))

  // Scale reflectance bands 
  .map(function(img) {
    var scaled = img.select([
        'SR_B1','SR_B2','SR_B3','SR_B4',
        'SR_B5','SR_B6','SR_B7'
      ]).multiply(0.0000275).add(-0.2);

    return scaled
      .copyProperties(img, img.propertyNames());
  })

  .median()
  .clip(roi);

// Add visualization layer
Map.addLayer(l8, {bands: ['SR_B7','SR_B5','SR_B3'], min: 0, max: 0.3}, 'L8 Composite (753)');

// Prepare main working image
var image = l8;


/***************************************************************
  3. SPECTRAL INDEX CALCULATIONS
***************************************************************/
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
var ndwi = image.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');
var ndbi = image.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI');

image = image.addBands([ndvi, ndwi, ndbi]);


/***************************************************************
  4. TRAINING DATA MERGE
***************************************************************/
var trainingFeatures = vegetation
  .merge(Bareland)
  .merge(Water_Body)
  .merge(Built_up)
  .merge(crops);

var label = 'Class';

var predictorBands = [
  'SR_B1','SR_B2','SR_B3','SR_B4',
  'SR_B5','SR_B6','SR_B7',
  'NDVI','NDWI','NDBI'
];


/***************************************************************
  5. SAMPLE TRAINING PIXELS
***************************************************************/
var trainingSamples = image.select(predictorBands).sampleRegions({
  collection: trainingFeatures,
  properties: [label],
  scale: 30,
  geometries: false
});


/***************************************************************
  6. TRAIN / TEST SPLIT
***************************************************************/
var randomSplit = trainingSamples.randomColumn('rand');
var trainSet = randomSplit.filter(ee.Filter.lt('rand', 0.8));
var testSet  = randomSplit.filter(ee.Filter.gte('rand', 0.8));


/***************************************************************
  7. RANDOM FOREST CLASSIFICATION
***************************************************************/
var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 200
}).train({
  features: trainSet,
  classProperty: label,
  inputProperties: predictorBands
});

var classified = image.select(predictorBands).classify(classifier);


/***************************************************************
  8. ACCURACY ASSESSMENT
***************************************************************/
var validated = testSet.classify(classifier);
var confusionMatrix = validated.errorMatrix(label, 'classification');

print('Confusion Matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Kappa Coefficient:', confusionMatrix.kappa());


/***************************************************************
  9. VISUALIZATION OF LULC
***************************************************************/
var palette = [
  '002F6C', // 0 Water
  'A65428', // 1 Built-up
  'F2B700', // 2 Bareland
  '2EAD95', // 3 Crops
  '7CFC00'  // 4 Vegetation
];

var vis = {
  min: 0,
  max: 4,
  palette: palette
};

Map.addLayer(classified, vis, 'LULC 2023', true, 0.6);


/***************************************************************
  10. AREA CALCULATION (KM² PER CLASS)
***************************************************************/
var areaImg = ee.Image.pixelArea().divide(1e6);

var areaStats = areaImg.addBands(classified).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'Class'
  }),
  geometry: roi,
  scale: 30,
  maxPixels: 1e13
});

print('Area per Class (km²):', areaStats);

// Convert dictionary → FeatureCollection for export
var areaTable = ee.FeatureCollection(
  ee.List(areaStats.get('groups')).map(function(item) {
    item = ee.Dictionary(item);
    return ee.Feature(null, {
      Class: item.get('Class'),
      Area_km2: item.get('sum')
    });
  })
);

print('Area Table:', areaTable);


/***************************************************************
  11. EXPORTS
***************************************************************/
Export.image.toDrive({
  image: classified.byte(),
  description: 'LULC_Classification_2023',
  folder: 'GEE_Exports',
  region: roi,
  scale: 30,
  crs: 'EPSG:32645',
  maxPixels: 1e13
});

Export.table.toDrive({
  collection: areaTable,
  description: 'LULC_Area_Statistics_2023',
  fileFormat: 'CSV'
});
