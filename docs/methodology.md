# Methodology for Land Use / Land Cover (LULC) Classification  
### Rangpur Region, Bangladesh – 2023  
This document provides a detailed description of the workflow used to produce the LULC map for the Rangpur region using Landsat 8 Surface Reflectance data in Google Earth Engine (GEE). The methodology follows a supervised classification framework integrating spectral indices, user-digitized training samples, machine learning, and statistical validation.

---

## 1. Study Area
The Area of Interest (AOI) covers the Rangpur region of northwestern Bangladesh.  
The AOI boundary was imported into GEE as a polygon shapefile and clipped to delineate the study region.

The AOI area was computed using:

```js
roi.geometry().area().divide(1e6)
````

**Unit:** square kilometers (km²)

---

## 2. Data Source

### 2.1 Satellite Data

The analysis uses **Landsat 8 Collection 2 Level-2 (Surface Reflectance)** imagery:

* Dataset ID: `LANDSAT/LC08/C02/T1_L2`
* Date range: **1 January 2023 – 1 January 2024**
* Cloud cover threshold: **< 20%**

This dataset provides atmospherically corrected Surface Reflectance and is suitable for land-cover applications.

### 2.2 Ancillary Data

User-generated training samples representing five land-cover classes were uploaded as FeatureCollections:

1. Water Body
2. Built-up
3. Bareland
4. Crops
5. Vegetation

---

## 3. Pre-processing Workflow

The Landsat 8 Level-2 SR images were pre-processed in several steps:

### **3.1 Filtering**

* Filter by AOI
* Filter by acquisition date
* Filter by cloud cover < 20%

### **3.2 Surface Reflectance Scaling**

Landsat SR values were rescaled using the standard USGS scaling factor:

```
Reflectance = DN × 0.0000275 − 0.2
```

### **3.3 Image Compositing**

A **median composite** was generated to reduce atmospheric noise and cloud contamination.

### **3.4 Clipping**

The composite image was clipped to the AOI boundary.

---

## 4. Spectral Feature Engineering

To enhance class separability, three commonly used spectral indices were computed and added as additional bands.

### **4.1 NDVI**

Highlights vegetation cover.

```
NDVI = (B5 − B4) / (B5 + B4)
```

### **4.2 NDWI**

Enhances water bodies.

```
NDWI = (B3 − B5) / (B3 + B5)
```

### **4.3 NDBI**

Used to detect built-up areas.

```
NDBI = (B6 − B5) / (B6 + B5)
```

The final feature stack included:

* 7 Landsat SR bands
* NDVI
* NDWI
* NDBI

Total = **10 predictor bands**

---

## 5. Training Dataset Preparation

Training data for the five LULC classes were merged into a single FeatureCollection:

```js
var training = vegetation
  .merge(Bareland)
  .merge(Water_Body)
  .merge(Built_up)
  .merge(crops);
```

A stratified sampling of image pixels was performed at **30 m resolution**.

---

## 6. Model Development

### **6.1 Train–Test Split**

Training samples were randomly partitioned:

* **80%** – Model training
* **20%** – Model validation

### **6.2 Classification Algorithm**

A **Random Forest** classifier was used:

* Number of Trees: **200**
* Input features: 10 predictor bands
* Class label: `"Class"`

Random Forest is robust to noise, handles nonlinear separations, and performs well with multi-spectral data.

### **6.3 Prediction**

The trained classifier was applied to the full image stack to generate the final LULC map.

---

## 7. Accuracy Assessment

Accuracy metrics were computed using the independent **20% test set**.

Outputs included:

* Confusion Matrix
* **Overall Accuracy (OA)**
* **Kappa Coefficient**

These metrics quantify classification reliability and agreement beyond chance.

---

## 8. Area Estimation

Area per class (in km²) was derived using pixel area:

```js
areaImage = ee.Image.pixelArea().divide(1e6)
```

A grouped reducer summarized total area for each LULC class.
Outputs were converted to a FeatureCollection and exported as a CSV table.

---

## 9. Output Products

### **9.1 LULC Map (GeoTIFF)**

Exported to Google Drive using:

```js
Export.image.toDrive({
  image: classified.byte(),
  ...
});
```

### **9.2 Area Statistics (CSV)**

Contains class-wise area (km²).

### **9.3 Accuracy Report**

Confusion matrix + OA + Kappa.

---

## 10. Workflow Diagram

See `docs/flowchart.png` for the graphical representation of the complete methodology.

---

## 11. Reproducibility

All steps are fully reproducible within the Google Earth Engine environment.
Source code is available in:

```
src/lulc_classification.js
```

---

## 12. References

* USGS Landsat Collection 2 Documentation
* GEE Developer Guide: Image Preprocessing
* Breiman, L. (2001). Random Forests. Machine Learning.

```

