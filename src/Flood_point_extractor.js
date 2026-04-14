/***************************************************************
 * GEE Flood Point Extractor 
 * Generates stratified validation points (flood / non-flood)
 * Satellite: Sentinel-1 SAR GRD
 * Output: CSV (sample_id, lon, lat, flood)
 * Author: Saeed Sourav
 ***************************************************************/
// Add a shapefile and assign it as aoi

var rangpur = aoi.geometry().simplify(100);
Map.centerObject(rangpur, 8);
Map.addLayer(rangpur, {}, "Rangpur");


var collection = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(aoi)
  .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
  .filter(ee.Filter.eq("instrumentMode", "IW"))
  .select("VV");


// BEFORE AND AFTER FLOOD IMAGERY

var before = collection
  .filterDate("2022-05-01", "2022-05-15")
  .mosaic();

var after = collection
  .filterDate("2022-10-01", "2022-10-30")
  .mosaic();

// Clip to AOI
var before_clip = before.clip(aoi);
var after_clip = after.clip(aoi);


// APPLY SMOOTHING FILTER

var before_s = before_clip.focal_median(30, "circle", "meters");
var after_s = after_clip.focal_median(30, "circle", "meters");


// DIFFERENCE AND FLOOD DETECTION

var difference = after_s.subtract(before_s);

// Flood pixels: threshold less than -3

var flood_extent = difference.lt(-3);

// Mask only flood area for display

var flood = flood_extent.updateMask(flood_extent);

// ---------------------------------------------
// DISPLAY MAP LAYERS
// ---------------------------------------------
Map.addLayer(before_clip, {min: -30, max: 0}, "Before_flood");
Map.addLayer(after_clip, {min: -30, max: 0}, "After_flood");
Map.addLayer(difference, {min: -8, max: 8}, "Difference");
Map.addLayer(flood, {palette: ["blue"]}, "Flood");


// CREATE BINARY CLASS IMAGE
// flood = 1, non-flood = 0

var validMask = before_s.mask().and(after_s.mask());

var classImage = flood_extent
  .rename("class")
  .updateMask(validMask);

Map.addLayer(
  classImage,
  {min: 0, max: 1, palette: ["yellow", "blue"]},
  "Class Image"
);

// ---------------------------------------------
// EXTRACT RANDOM POINTS
// 200 flood + 200 non-flood
// ---------------------------------------------
var samples = classImage.stratifiedSample({
  numPoints: 200,
  classBand: "class",
  classValues: [0, 1],
  classPoints: [200, 200],
  region: aoi,
  scale: 10,
  seed: 42,
  geometries: true
});


// ADD CLASS NAME

var samplesWithLabel = samples.map(function(feat) {
  var cls = ee.Number(feat.get("class"));
  var label = ee.Algorithms.If(cls.eq(1), "Flood", "Non-Flood");
  return feat.set("class_name", label);
});

print("Total sampled points:", samplesWithLabel.size());
print("Sample points:", samplesWithLabel);


// DISPLAY FLOOD AND NON-FLOOD POINTS

var floodPoints = samplesWithLabel.filter(ee.Filter.eq("class", 1));
var nonFloodPoints = samplesWithLabel.filter(ee.Filter.eq("class", 0));

Map.addLayer(floodPoints, {color: "red"}, "Flood Points");
Map.addLayer(nonFloodPoints, {color: "green"}, "Non-Flood Points");


var samplesXY = samplesWithLabel.map(function(feat) {
  var coords = feat.geometry().coordinates();
  
  return ee.Feature(null, {
    class: feat.get("class"),
    class_name: feat.get("class_name"),
    longitude: coords.get(0),
    latitude: coords.get(1)
  });
});

print("Export table preview:", samplesXY.limit(10));

// ---------------------------------------------
// EXPORT TO CSV
// ---------------------------------------------
Export.table.toDrive({
  collection: samplesXY,
  description: "Flood_NonFlood_400_Points_XY",
  fileFormat: "CSV"
});
