<p align="center">
  <img src="https://img.shields.io/badge/Google%20Earth%20Engine-Enabled-brightgreen?style=flat-square&logo=googleearth" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Sentinel--1-SAR%20GRD-9cf?style=flat-square&logo=esa" />
  <img src="https://img.shields.io/badge/Output-CSV%20Samples-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Flood%20Detection-SAR%20Based-red?style=flat-square" />
  <img src="https://img.shields.io/badge/Author-Saeed%20Sourav-blueviolet?style=flat-square" />
</p>



# 📘 **GEE Flood Sampling Tool – Sentinel-1 Based Flood/Non-Flood Point Extractor**

### **Author:** *Saeed Sourav (2026)*

### **Platform:** Google Earth Engine (JavaScript API)

### **Output:** CSV file containing labeled flood and non-flood sample points

### **Satellite Data:** Sentinel-1 SAR (VV polarization, IW mode)

---

## 📌 **Overview**

This repository presents a **Sentinel-1 SAR-based flood detection and sampling framework** developed in **Google Earth Engine (GEE)**. The workflow identifies flood-affected areas using **temporal backscatter change detection** and generates **balanced training/validation datasets** for geospatial modelling.

The methodology integrates:

* SAR backscatter differencing
* Speckle noise reduction using spatial filtering
* Threshold-based flood delineation
* Stratified random sampling

The final output is a **CSV dataset of 400 labeled points (Flood/Non-Flood)** suitable for:

* Machine learning models (RF, SVM, XGBoost, ANN)
* Flood susceptibility mapping
* Accuracy assessment and validation
* Remote sensing-based disaster analysis

---

## 🎯 **Key Features**

✔ Fully automated flood detection using SAR backscatter difference
✔ Speckle noise reduction via focal median filtering (30 m radius)
✔ Threshold-based flood extraction (ΔVV < -3 dB)
✔ Balanced dataset generation (200 flood + 200 non-flood points)
✔ High-resolution sampling (10 m) aligned with Sentinel-1
✔ Clean coordinate extraction (longitude, latitude)
✔ Class labeling (numeric + descriptive)
✔ Ready-to-use CSV output for modelling workflows

---

## 🗂 **Workflow Summary**

### **1. AOI Preparation**

The Area of Interest (AOI) is simplified to optimize processing and avoid memory limitations:

```javascript
var rangpur = aoi.geometry().simplify(100);
```

---

### **2. Sentinel-1 Data Acquisition**

Filters applied:

* Polarization: VV
* Instrument mode: IW
* Spatial filter: AOI

```javascript
ee.ImageCollection("COPERNICUS/S1_GRD")
```

---

### **3. Pre- and Post-Flood Image Selection**

| Period     | Date Range              |
| ---------- | ----------------------- |
| Pre-Flood  | 2022-05-01 → 2022-05-15 |
| Post-Flood | 2022-10-01 → 2022-10-30 |

Mosaic images are created for both periods.

---

### **4. Speckle Noise Reduction**

A **focal median filter (30 m radius)** is applied:

```javascript
focal_median(30, "circle", "meters")
```

This step improves SAR data quality by reducing speckle noise.

---

### **5. Flood Detection (Backscatter Difference)**

Flooded areas show **reduced backscatter**.

```javascript
var difference = after_s.subtract(before_s);
```

Flood condition:

```javascript
difference < -3
```

* **Flood = 1**
* **Non-Flood = 0**

---

### **6. Binary Classification Image**

A clean classification layer is generated using valid pixel masking:

```javascript
var classImage = flood_extent.rename("class");
```

---

### **7. Stratified Random Sampling**

Balanced sampling ensures equal representation:

```javascript
classPoints: [200, 200]
```

* 200 Flood points
* 200 Non-Flood points

Sampling resolution: **10 meters**

---

### **8. Label Assignment**

Each sample is assigned a descriptive label:

| Class | Label     |
| ----- | --------- |
| 1     | Flood     |
| 0     | Non-Flood |

---

### **9. Coordinate Extraction**

Geographic coordinates are extracted:

```javascript
longitude, latitude
```

---

### **10. Export CSV**

Final dataset is exported to Google Drive:

```
Flood_NonFlood_400_Points_XY.csv
```

---

## 📊 **Output Structure**

| Column     | Description                              |
| ---------- | ---------------------------------------- |
| class      | Numeric label (1 = flood, 0 = non-flood) |
| class_name | Descriptive label                        |
| longitude  | X coordinate (EPSG:4326)                 |
| latitude   | Y coordinate (EPSG:4326)                 |

---

## 🕹 **Visualization Layers**

The script visualizes:

* Pre-flood SAR image
* Post-flood SAR image
* Backscatter difference layer
* Flood extent map
* Classified raster (Flood/Non-Flood)
* Sample points (Flood = red, Non-Flood = green)

---

## ⚙️ **User-Configurable Parameters**

| Parameter        | Description                     |
| ---------------- | ------------------------------- |
| `date ranges`    | Pre- and post-flood periods     |
| `threshold (-3)` | Flood detection sensitivity     |
| `numPoints`      | Total sampling size             |
| `classPoints`    | Samples per class               |
| `scale`          | Spatial resolution (10 m)       |
| `seed`           | Random sampling reproducibility |

---

## 🧪 **Applications**

This tool is highly suitable for:

* Flood susceptibility modelling (AHP, F-AHP, ML)
* Training dataset generation for classification models
* SAR-based flood extent mapping
* Accuracy assessment and validation studies
* GIS-based hazard and risk analysis
* Academic research and journal publications

---

## 📚 **Scientific Basis**

* Sentinel-1 SAR detects surface roughness and moisture changes
* Flooded areas produce **lower backscatter values**
* Temporal differencing enhances flood signal detection
* Spatial filtering improves classification reliability

---

## 📬 **Contact**

**Saeed Sourav**
Civil Engineer | GIS & Remote Sensing Researcher
📧 **[saeedsourav@gmail.com](mailto:saeedsourav@gmail.com)**

---

