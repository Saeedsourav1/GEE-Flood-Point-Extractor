/***************************************************************
 * GEE Flood Point Extractor 
 * Generates stratified validation points (flood / non-flood)
 * Satellite: Sentinel-1 SAR GRD (C-band
 * Output: CSV (sample_id, lon, lat, flood)
 * Author: Saeed Sourav
 ***************************************************************/

var preStart  = '2022-03-01';
var preEnd    = '2022-04-15';
var postStart = '2022-06-16';
var postEnd   = '2022-08-30';

var vhDiffThreshold = 2.0;
var pointsPerClass  = 200;
var seed            = 42;
var scale           = 10;
var exportFolder    = 'GEE_Exports';
var exportFileName  = 'Flood_Samples';

// ======================= AOI ========================

var region = aoi.geometry().simplify(100);

Map.centerObject(region, 8);
print("AOI area (km²):", region.area().divide(1e6));

// ========================= LOAD S1 ===========================

var s1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(region)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .select('VH');

var pre = s1
  .filterDate(preStart, ee.Date(preEnd).advance(1, 'day'))
  .median()
  .clip(region);

var post = s1
  .filterDate(postStart, ee.Date(postEnd).advance(1, 'day'))
  .median()
  .clip(region);

print('Pre-event image count:',
  s1.filterDate(preStart, ee.Date(preEnd).advance(1, 'day')).size());
print('Post-event image count:',
  s1.filterDate(postStart, ee.Date(postEnd).advance(1, 'day')).size());

// ======================= SPECKLE FILTER ======================

function speckleFilter(img) {
  return ee.Image(img).focalMean(10, 'circle', 'meters');
}

var preFiltered  = speckleFilter(pre);
var postFiltered = speckleFilter(post);

// ===================== VH DIFFERENCE =========================

var vhDiff = ee.Image(preFiltered).subtract(postFiltered).rename('vhDiff');

Map.addLayer(vhDiff, {min: -5, max: 5, palette: ['blue', 'white', 'red']}, 'VH Difference');

// ======================= FLOOD MASK ==========================

var floodMask = vhDiff.gt(vhDiffThreshold).selfMask();
Map.addLayer(floodMask, {palette: ['cyan']}, 'Flood Mask');

var classImage = vhDiff.gt(vhDiffThreshold)
  .rename('flood')
  .toByte()
  .clip(region);

// ==================== STRATIFIED SAMPLING ====================

var samples = classImage.stratifiedSample({
  numPoints: 0,
  classBand: 'flood',
  region: region,
  scale: scale,
  classValues: [0, 1],
  classPoints: [pointsPerClass, pointsPerClass],
  seed: seed,
  dropNulls: true,
  geometries: true
});

print('Raw sample count:', samples.size());
print('Sample count by class:', samples.aggregate_histogram('flood'));

// ================= COORDINATE EXTRACTION =====================

var samplesFixed = samples.map(function(f) {
  var coords = f.geometry().coordinates();
  return f.set({
    sample_id: f.get('system:index'),
    longitude: coords.get(0),
    latitude: coords.get(1)
  });
});

// ========================= MAP LAYERS ========================

Map.addLayer(
  samplesFixed.filter(ee.Filter.eq('flood', 1)),
  {color: 'blue'},
  'Flood Points (1)',
  false
);

Map.addLayer(
  samplesFixed.filter(ee.Filter.eq('flood', 0)),
  {color: 'red'},
  'Non-Flood Points (0)',
  false
);

// ========================= EXPORT CSV ========================

Export.table.toDrive({
  collection: samplesFixed.select(['sample_id', 'longitude', 'latitude', 'flood']),
  description: exportFileName,
  folder: exportFolder,
  fileNamePrefix: exportFileName,
  fileFormat: 'CSV'
});

print('Export task ready in Tasks panel.');
