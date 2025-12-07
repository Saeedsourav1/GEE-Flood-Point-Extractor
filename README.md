<p align="center">
  <img src="https://img.shields.io/badge/Google%20Earth%20Engine-Enabled-brightgreen?style=flat-square&logo=googleearth" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Sentinel--1-SAR%20GRD-9cf?style=flat-square&logo=esa" />
  <img src="https://img.shields.io/badge/Output-CSV%20Samples-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Flood%20Detection-SAR%20Based-red?style=flat-square" />
  <img src="https://img.shields.io/badge/Author-Saeed%20Sourav-blueviolet?style=flat-square" />
</p>

# 📘 **GEE Flood Point Extractor – Stratified Flood/Non-Flood Sampling Tool**

### **Author:** *Saeed Sourav (2025)*

### **Platform:** Google Earth Engine (JavaScript API)

### **Output:** CSV file containing stratified **flood** and **non-flood** validation points

### **Satellite Data:** Sentinel-1 SAR (VV polarization, IW mode)

---

## 📌 **Overview**

This repository provides a complete **flood validation point extraction pipeline** built on **Google Earth Engine (GEE)**.
The tool generates **balanced, stratified points** for machine-learning model training and validation using **pre- and post-event Sentinel-1 imagery**.

It is designed for:

* Flood susceptibility mapping
* Flood extent validation
* Machine learning flood modelling (RF, XGBoost, ANN, CNN, etc.)
* Hydrological disaster assessment
* Change-detection analysis

The script outputs a CSV with the following fields:

| Column    | Description                            |
| --------- | -------------------------------------- |
| sample_id | Unique point ID                        |
| longitude | X coordinate (EPSG:4326)               |
| latitude  | Y coordinate (EPSG:4326)               |
| flood     | Class label (1 = flood, 0 = non-flood) |

---

## 🎯 **Key Features**

✔ Automated flood detection using ΔVV (difference in backscatter)
✔ Uses Sentinel-1 GRD (C-band SAR), unaffected by clouds
✔ Generates **balanced** classes (equal number of flood and non-flood points)
✔ User-defined threshold for flood detection
✔ AOI simplification included to avoid memory issues
✔ Visual layers for flood mask and sample distribution
✔ Outputs analysis-ready CSV for ML workflows

---

## 🗂 **Workflow Summary**

### **1. Load AOI**

AOI is simplified to reduce computation time and internal memory errors.

```javascript
aoi = ee.FeatureCollection(aoi.geometry().simplify(100));
```

---

### **2. Load Sentinel-1 (Pre- & Post-Flood)**

Filters:

* IW mode
* VV polarization
* Descending orbit

Median composites are created for the pre-flood and post-flood periods.

---

### **3. Compute ΔVV (Pre − Post)**

Flooded surfaces show reduced SAR backscatter.

```javascript
var vvDiff = pre.subtract(post);
```

---

### **4. Generate Flood Mask**

Flood detection based on user-defined threshold:

```javascript
var floodMask = vvDiff.gt(vvDiffThreshold).selfMask();
```

Binary classification:

* **1 = Flood**
* **0 = Non-Flood**

---

### **5. Stratified Sampling**

Balanced sampling:

```javascript
classPoints: [pointsPerClass, pointsPerClass]
```

This ensures equal numbers of flood and non-flood samples.

The script uses high-resolution (**10 m**) sampling to match Sentinel-1 SAR resolution.

---

### **6. Extract Clean Coordinates**

Coordinates and IDs are reconstructed properly:

```javascript
longitude, latitude, sample_id
```

---

### **7. Export CSV**

Final dataset is exported to Google Drive:

```
GEE_Exports/Flood_NonFlood_Samples_2022.csv
```

---

## 🧪 **User-Configurable Parameters**

| Parameter              | Description                          |
| ---------------------- | ------------------------------------ |
| `preStart`, `preEnd`   | Pre-flood period                     |
| `postStart`, `postEnd` | Post-flood period                    |
| `vvDiffThreshold`      | Sensitivity for flood detection      |
| `pointsPerClass`       | Number of points per class           |
| `scale`                | Sampling scale (default 10 m for S1) |
| `crs`                  | Projection for coordinate extraction |
| `exportFolder`         | Drive folder for export              |
| `exportFileName`       | Output CSV filename                  |

You can tune these depending on flood event and geographic context.

---

## 🕹 **Visualization**

The script displays:

* ΔVV image
* Flood mask
* Flood point locations
* Non-flood point locations

All layers can be toggled inside the GEE Code Editor.

---

## 📦 **Output Example**

A typical exported CSV looks like:

| sample_id | longitude | latitude | flood |
| --------- | --------- | -------- | ----- |
| pt_001    | 89.3021   | 25.6823  | 1     |
| pt_002    | 89.2950   | 25.6742  | 0     |
| pt_003    | 89.3125   | 25.6901  | 1     |

---

## 🧰 **Applications**

This tool is ideal for:

* Flood susceptibility modelling (AHP, ML, ANN)
* Validation point generation for remote sensing research
* Sentinel-1 flood mapping (SAR-based detectors)
* Dataset creation for academic publications
* Hydrological and hazard analysis

---

## 📚 **References**

* Copernicus Sentinel-1 SAR GRD
* Google Earth Engine Developers Guide
* SAR-based flood mapping literature

---

## 📬 **Contact**

**Saeed Sourav**
Civil Engineer | GIS & Remote Sensing Researcher
📧 **[saeedsourav@gmail.com](mailto:saeedsourav@gmail.com)**

