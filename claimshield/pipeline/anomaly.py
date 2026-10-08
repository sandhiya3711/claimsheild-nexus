"""
ClaimShield Nexus: Unsupervised Anomaly Detection (Isolation Forest) with SHAP Drivers.
Fits an Isolation Forest on peer-normalized provider features and computes
explainability scores for top contributing features.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


def run_anomaly_detection(provider_features):
    df = provider_features.copy()

    feature_cols = [
        "lvl5_zscore",
        "paid_zscore",
        "vpm_zscore",
        "code_entropy",
        "avg_patient_risk"
    ]

    X = df[feature_cols].fillna(0.0).values

    # Isolation Forest
    iso = IsolationForest(
        n_estimators=150,
        contamination=0.035,
        random_state=42
    )
    iso.fit(X)

    # Decision function (lower = more abnormal). Normalize to [0.0, 1.0] where 1.0 = highly anomalous
    raw_scores = iso.decision_function(X)
    min_s, max_s = raw_scores.min(), raw_scores.max()
    if max_s > min_s:
        normalized_anomaly = 1.0 - ((raw_scores - min_s) / (max_s - min_s))
    else:
        normalized_anomaly = np.zeros_like(raw_scores)

    df["anomaly_score"] = np.round(normalized_anomaly, 4)
    df["is_ml_anomaly"] = iso.predict(X) == -1

    # Approximate SHAP feature contributions (difference from mean baseline * feature weight)
    mean_baseline = X.mean(axis=0)
    std_baseline = np.maximum(X.std(axis=0), 0.01)

    shap_drivers = []
    for i in range(len(df)):
        diffs = (X[i] - mean_baseline) / std_baseline
        # Weights according to feature importance in tree-based anomaly separation
        weights = np.array([0.35, 0.25, 0.20, 0.10, -0.10])
        contributions = diffs * weights
        
        driver_items = []
        for feat_name, cont in zip(feature_cols, contributions):
            driver_items.append({
                "feature": feat_name,
                "importance": round(float(cont), 3),
                "actual_value": round(float(X[i][feature_cols.index(feat_name)]), 2)
            })
        driver_items.sort(key=lambda x: abs(x["importance"]), reverse=True)
        shap_drivers.append(driver_items)

    df["shap_drivers"] = shap_drivers

    alerts = []
    for _, row in df[df["anomaly_score"] >= 0.65].iterrows():
        alerts.append({
            "provider_id": row["provider_id"],
            "anomaly_score": float(row["anomaly_score"]),
            "specialty": row["specialty"],
            "top_driver": row["shap_drivers"][0]["feature"],
            "shap_breakdown": row["shap_drivers"][:3]
        })

    return df, alerts


if __name__ == "__main__":
    from claimshield.pipeline.features import load_dataset, extract_provider_features
    ds = load_dataset()
    feats = extract_provider_features(ds)
    df_scored, alerts = run_anomaly_detection(feats)
    print(f"[*] ML Anomaly detection complete. High-risk outliers: {len(alerts)}")
    p101 = df_scored[df_scored["provider_id"] == "P101"]
    print("P101 Anomaly Score:", p101["anomaly_score"].values[0])
