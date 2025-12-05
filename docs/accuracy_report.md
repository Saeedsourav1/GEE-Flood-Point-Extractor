# Accuracy Assessment Report  
### LULC Classification – Rangpur, Bangladesh (2023)

This report presents the accuracy evaluation of the supervised Land Use / Land Cover (LULC) classification produced using Landsat 8 Surface Reflectance data and a Random Forest classifier (200 trees) in Google Earth Engine (GEE). An 80/20 train-test split was used for model validation.

---

## 1. Confusion Matrix

The confusion matrix obtained from the independent 20% test dataset is:

| Actual \ Predicted | 0 (Water) | 1 (Built-up) | 2 (Bareland) | 3 (Crops) | 4 (Vegetation) |
|--------------------|-----------|--------------|--------------|-----------|----------------|
| **0 – Water**      | 21        | 1            | 1            | 1         | 2              |
| **1 – Built-up**   | 0         | 10           | 0            | 0         | 1              |
| **2 – Bareland**   | 0         | 2            | 17           | 1         | 0              |
| **3 – Crops**      | 0         | 2            | 0            | 17        | 1              |
| **4 – Vegetation** | 0         | 0            | 0            | 0         | 16             |

This matrix shows correct and incorrect predictions for each class.

---

## 2. Overall Accuracy & Kappa Coefficient

- **Overall Accuracy (OA):** `0.8709677419354839`  
- **Kappa Coefficient:** `0.837743530095958`

**Interpretation:**

- An accuracy of **87.09%** indicates strong overall model performance.  
- A **Kappa value of 0.8377** signifies **excellent agreement** beyond chance, indicating the classifier is consistent and reliable.  

---

## 3. Producer’s & User’s Accuracy (Derived)

Using the confusion matrix:

### **Producer’s Accuracy (PA)**  
Measures how well reference pixels were classified.

| Class | PA (%) |
|-------|--------|
| Water       | 21 / 26 = **80.77%** |
| Built-up    | 10 / 11 = **90.91%** |
| Bareland    | 17 / 20 = **85.00%** |
| Crops       | 17 / 20 = **85.00%** |
| Vegetation  | 16 / 16 = **100.00%** |

### **User’s Accuracy (UA)**  
Measures classification reliability for each predicted class.

| Class | UA (%) |
|-------|--------|
| Water       | 21 / 22 = **95.45%** |
| Built-up    | 10 / 15 = **66.67%** |
| Bareland    | 17 / 18 = **94.44%** |
| Crops       | 17 / 19 = **89.47%** |
| Vegetation  | 16 / 20 = **80.00%** |

---

## 4. Class-wise Performance Summary

### **Water Bodies**
- High UA (95%) — predictions are very reliable.
- Moderate PA (~81%) — some confusion with vegetated & crop areas.

### **Built-up**
- Very high PA (91%) — model identifies built-up pixels well.
- Lower UA (~67%) — some crops & vegetation misclassified as built-up.

### **Bareland**
- Excellent accuracy (PA 85%, UA 94%).

### **Crops**
- Strong performance (85% PA, 89% UA).
- Misclassified slightly as vegetation.

### **Vegetation**
- Perfect PA (100%) — all actual vegetation pixels detected.
- UA (80%) — some predicted vegetation pixels were actually other classes.

---

## 5. Area Statistics (km²)

Derived from classified image:

| Class ID | Class Name | Area (km²) |
|----------|------------|-------------|
| 0 | Water Body  | **2043.92** |
| 1 | Built-up    | **1646.36** |
| 2 | Bareland    | **1046.08** |
| 3 | Crops       | **8124.84** |
| 4 | Vegetation  | **3425.35** |

Total study area (as printed): **16,318 km²**

Crops dominate the land cover, followed by vegetation and water bodies.

---

## 6. Interpretation & Conclusions

- The classification achieved **high accuracy**, with strong agreement across classes.
- Vegetation and water classes show excellent separability.
- Built-up areas remain the most challenging class (lower UA), which is common in mixed rural–peri-urban regions.
- The Random Forest classifier with spectral indices performed reliably for this landscape.

Overall, the classification is **robust and suitable for environmental assessment, spatial planning, and future temporal LULC analysis**.

---

## 7. Recommendations for Future Improvement

- Add more training samples for built-up areas (to fix confusion with crops/vegetation).  
- Include **texture metrics** or **Sentinel-1 SAR** to better distinguish built-up structures.  
- Experiment with **SMOTE balancing** to reduce class imbalance effects.  
- Test additional classifiers (e.g., SVM, XGBoost) for comparison.  

---

## 8. Reproducibility

This accuracy assessment corresponds to the script:

```

src/lulc_classification.js

```

Generated using Google Earth Engine with an 80/20 random split.

---

# ✔ End of Report
```
