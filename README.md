# Land Use / Land Cover (LULC) Classification for Rangpur, Bangladesh (2023)

This repository presents a complete workflow for generating a supervised Land Use / Land Cover (LULC) classification for the Rangpur region of Bangladesh using **Landsat 8 Collection 2 Level-2 Surface Reflectance imagery** and machine-learning techniques in **Google Earth Engine (GEE)**.  
The project implements a **Random Forest classifier** with 200 trees and includes pre-processing steps, spectral index generation, accuracy assessment, and class-wise area statistics.

---

## 🗺️ Study Area

The study area covers the **Rangpur region of northwestern Bangladesh**.  
The Area of Interest (AOI) boundary was uploaded to Google Earth Engine as a polygon FeatureCollection.

The AOI extent (km²) is calculated in the script using:

```js
roi.geometry().area().divide(1e6)
````

A visualization of the AOI is provided in the `docs/` folder.

---

## 🛰️ Data Sources

### **Satellite Data**

| Dataset                    | Description                                        | Link                                                                                                                                                                     |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **LANDSAT/LC08/C02/T1_L2** | Landsat 8 Surface Reflectance Collection 2 Level-2 | [https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2) |

**Filters Applied**

* Date range: **2023-01-01 → 2024-01-01**
* Cloud cover: **< 20%**
* Region: AOI (Rangpur)

### **Training Samples**

Five land-cover classes were digitized manually inside GEE:

1. Water Body
2. Built-up
3. Bareland
4. Crops
5. Vegetation

Each class is stored as a FeatureCollection in the user's GEE Assets.
Metadata descriptions are in `data/training_samples/README.md`.

---

## 🌱 LULC Classification Scheme

| Class ID | Class Name | Description                        | Color     |
| -------- | ---------- | ---------------------------------- | --------- |
| 0        | Water Body | Rivers, wetlands, ponds            | `#002F6C` |
| 1        | Built-up   | Infrastructure, settlements, roads | `#A65428` |
| 2        | Bareland   | Exposed soil, fallow land          | `#F2B700` |
| 3        | Crops      | Agricultural cropland              | `#2EAD95` |
| 4        | Vegetation | Forest, natural vegetation         | `#7CFC00` |

---

## 🔧 Methodology Overview

A high-level summary of the workflow:

1. **Load Landsat 8 SR imagery**
2. **Filter by date** and **cloud cover**
3. **Apply surface reflectance scaling**
4. **Generate median composite**
5. **Clip to AOI**
6. Compute **NDVI**, **NDWI**, **NDBI** indices
7. Merge training sample FeatureCollections
8. Extract training/test pixels (80/20 split)
9. Train **Random Forest (200 trees)**
10. Classify the full image
11. Compute accuracy metrics
12. Calculate area per class (km²)
13. Export outputs (GeoTIFF, CSV)


A complete methodology document is available at:

```
docs/methodology.md
```

---

## 🧠 Algorithm Details

### **Random Forest Classifier**

* Trees: **200**
* Features used:

  * Bands: SR_B1–SR_B7
  * Indices: NDVI, NDWI, NDBI
* Train/test split: **80% / 20%**

### **Spectral Indices Used**

```text
NDVI = (B5 - B4) / (B5 + B4)
NDWI = (B3 - B5) / (B3 + B5)
NDBI = (B6 - B5) / (B6 + B5)
```

These indices improve class separability, especially between vegetation, water, and built-up areas.

---

## 📈 Accuracy Assessment

Accuracy was evaluated using the **20% test set**:

* Confusion Matrix
* **Overall Accuracy (OA)**
* **Kappa Coefficient**

Insert your actual results into:

```
docs/accuracy_report.md
```

---

## 📊 Output Products

All exported outputs are stored in:

```
results/
```

Includes:

### **1. Final Classified LULC Map **

A visualization of the LULC classification for 2023.

### **2. Area Statistics (CSV)**

Area (km²) for each LULC class, generated using pixel area calculations.

### **3. Accuracy Metrics**

Confusion matrix and model accuracy indicators.

---

## 📂 Repository Structure

```
LULC-Rangpur-2023/
│
├── src/
│   └── lulc_classification.js
│
├── docs/
│   ├── methodology.md
│   └── accuracy_report.md
│
│
├── data/
│    └── roi/
│         └── README.md
│  
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ▶️ How to Run This Project in Google Earth Engine

1. Open the GEE Code Editor:
   [https://code.earthengine.google.com](https://code.earthengine.google.com)

2. Import:

   * `lulc_classification.js` script
   * ROI FeatureCollection
   * Training sample FeatureCollections

3. Paste the script into GEE and run it.

4. Outputs:

   * Classified raster exported to Google Drive
   * CSV table of class-wise area statistics
   * Console shows accuracy metrics

---

## 🤝 Contributions

Contributions, pull requests, or suggestions are welcome.
Feel free to open an issue if you have ideas for improving the workflow.

---

## 📄 License

This project is released under the **MIT License**.
See the full text in:

```
LICENSE
```

---

## 📚 Citation

If you use or reference this repository:

```
[Saeed Sourav]. (2023). Land Use / Land Cover Classification for Rangpur, Bangladesh using Landsat 8 and Random Forest. GitHub Repository.
```

---

# 🎉 Thank you for exploring this repository!

