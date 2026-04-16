# Mathematical Models & Statistics

This document explains the mathematical logic behind the **Data Insights** screen in FridgeAI. These models turn raw usage data into meaningful insights for the user.

## 1. Calorie Trend Analysis (Linear Regression)
We use a **Least Squares Linear Regression** model to track nutrition trends.
- **Goal**: Predict if the user's calorie intake is increasing, decreasing, or stable over time.
- **Math**: $y = mx + b$
- **Implementation**: The app takes the last 7 recorded meals, maps them to a time axis, and calculates the trend line. This helps users visualize their eating habits beyond just a simple average.

## 2. Pantry Distribution (Mean & Standard Deviation)
To help with inventory management, we analyze the categories (Protein, Veggies, Dairy, etc.) currently in the pantry.
- **Goal**: Measure how balanced the pantry is.
- **Math**: We calculate the **Arithmetic Mean** of items per category and the **Standard Deviation** to see the variance. High variance tells the user they might be overstocked in one area while lacking in another.

## 3. Prep Time Correlation (Averages & Weighting)
We analyze the relationship between recipe difficulty (Easy, Medium, Hard) and the actual time it takes to cook.
- **Goal**: Show users a realistic expectation of prep time.
- **Math**: The app aggregates all saved recipes and suggestions, calculating the average prep time per difficulty level. 

## 4. AI Confidence Scores (Moving Average)
To monitor the "intelligence" of the fridge scanning, we track the confidence scores returned by the GPT-4o vision model.
- **Goal**: Show the reliability of the ingredient detection system.
- **Math**: We use a **Simple Moving Average (SMA)** of the last 6 scans. This filters out "noisy" outliers (like a single blurry photo) and shows the actual performance trend of the AI detection.

---
*Note: These models are implemented using the `simple-statistics` library for accuracy and performance.*
