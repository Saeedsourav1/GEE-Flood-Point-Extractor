# Region of Interest (ROI) – Rangpur, Bangladesh

This folder contains metadata and documentation describing the Region of Interest (ROI) used for the Land Use / Land Cover (LULC) classification of the Rangpur region in Bangladesh.  
The actual polygon boundary file (shapefile/GeoJSON) is **not included** due to size restrictions and GitHub storage recommendations. Instead, this README explains how the ROI was prepared and how it should be used inside Google Earth Engine (GEE).

---

## 📍 1. ROI Description

- **Location:** Rangpur region, Northwestern Bangladesh  
- **Geometry Type:** Polygon 
- **Coordinate Reference System (CRS):**  
  - Stored in GEE Asset CRS (EPSG varies internally)  
  - Analysis & export CRS: **EPSG:32645** (UTM Zone 45N)

### Approximate Area
The area was computed inside the GEE script using:

```js
roi.geometry().area().divide(1e6)
````

**Total Study Area:** ~16,318 km² 

---

## 📁 2. Source of ROI Boundary

The ROI polygon was created manually by:

1. Downloading district/upazila administrative boundaries 
2. Editing and defining the exact research boundary in GIS software (ArcMap/QGIS)
3. Exporting to a `.shp` / `.kml` / `.geojson` file
4. Uploading the final polygon to **Google Earth Engine Assets**

This ensures consistent spatial extent across all classification steps.

---

## 🛰 3. How to Load the ROI in Google Earth Engine

Replace the asset path with your actual GEE username and asset name:

```js
var roi = ee.FeatureCollection("users/yourname/Rangpur_ROI");
Map.centerObject(roi, 8);
```

If your ROI is a single geometry rather than a FeatureCollection:

```js
var roi = ee.Feature("users/yourname/Rangpur_ROI");
```

---

## 🧭 4. Usage in the LULC Classification Script

The ROI is used for:

1. **Filtering satellite imagery**

   ```js
   .filterBounds(roi)
   ```

2. **Clipping the composite image**

   ```js
   composite.clip(roi)
   ```

3. **Limiting area calculations**

   ```js
   reducer: ee.Reducer.sum().group({ groupField: 1 }),
   geometry: roi,
   ```

4. **Exporting outputs**

   ```js
   region: roi
   ```

---

##  5. Recommendations for Users

* Always check that your ROI boundary is correctly clipped and aligned.
* Use an appropriate CRS (preferably UTM for Bangladesh: EPSG:32645).
* If extending this project, ensure the ROI naming is consistent.

---
##  7. ROI Download Link

The Region of Interest (ROI) file can be downloaded from:

Google Drive Link:
<https://drive.google.com/drive/folders/1OBxudklYaox4R7tbvJPbLKNrkpv4bQHZ?usp=drive_link>

This file contains the polygon boundary used for the Rangpur LULC classification and can be imported into Google Earth Engine or any GIS software (ArcGIS/QGIS).

---
## ✔ End of ROI Documentation
