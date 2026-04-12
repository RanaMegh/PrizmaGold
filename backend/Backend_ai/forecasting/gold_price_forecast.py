# gold_price_forecast.py — PrizmaGold Price Forecasting Module
# Forecasts gold jewelry price trends using Facebook Prophet
#
# Usage:
#   pip install prophet pandas numpy matplotlib scikit-learn yfinance psycopg2-binary
#   python gold_price_forecast.py
#
# Outputs:
#   data/forecasts/forecast_results.csv   ← predicted prices + confidence intervals
#   data/forecasts/forecast_plot.png      ← main forecast chart
#   data/forecasts/components_plot.png    ← trend + seasonality breakdown
#   data/forecasts/cluster_forecasts/     ← one forecast per jewelry category

import os
import warnings
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

warnings.filterwarnings("ignore")

# ── Try importing optional dependencies ───────────────
try:
    from prophet import Prophet
    from prophet.diagnostics import cross_validation, performance_metrics
    PROPHET_OK = True
except ImportError:
    print("⚠️  Prophet not found. Run: pip install prophet")
    PROPHET_OK = False

try:
    import yfinance as yf
    YFINANCE_OK = True
except ImportError:
    print("⚠️  yfinance not found. Run: pip install yfinance")
    YFINANCE_OK = False

try:
    import psycopg2
    PSYCOPG2_OK = True
except ImportError:
    PSYCOPG2_OK = False

# ──────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────
INPUT_CSV       = "data/gold_clustered.csv"
OUTPUT_DIR      = "data/forecasts"
CLUSTER_DIR     = f"{OUTPUT_DIR}/cluster_forecasts"
FORECAST_DAYS   = 90        # Predict 90 days ahead
HISTORY_DAYS    = 365       # 1 year of synthetic history
GOLD_TICKER     = "GC=F"    # Gold futures on Yahoo Finance

DB_CONFIG = {
    "host"     : "localhost",
    "database" : "prizmagold",
    "user"     : "postgres",
    "password" : "yousra123",
    "port"     : 5432
}

os.makedirs(OUTPUT_DIR,  exist_ok=True)
os.makedirs(CLUSTER_DIR, exist_ok=True)


# ══════════════════════════════════════════════════════
# 1. LOAD PRODUCT DATA
# ══════════════════════════════════════════════════════
def load_product_data(path: str = INPUT_CSV) -> pd.DataFrame:
    """Load the clustered jewelry CSV produced by clustering.py."""
    print("─── Loading product data ─────────────────────────")
    df = pd.read_csv(path)

    # Clean prices
    df["price"]       = pd.to_numeric(df["price"],       errors="coerce").fillna(0)
    df["trend_score"] = pd.to_numeric(df["trend_score"], errors="coerce").fillna(0)
    df["score"]       = pd.to_numeric(df["score"],       errors="coerce").fillna(0)

    # Keep only products with a valid price
    df = df[df["price"] > 0].copy()

    print(f"  Products with price    : {len(df)}")
    print(f"  Price range            : ${df['price'].min():.2f} — ${df['price'].max():.2f}")
    print(f"  Avg trend score        : {df['trend_score'].mean():.4f}")

    return df


# ══════════════════════════════════════════════════════
# 2. FETCH REAL GOLD MARKET PRICES (optional enrichment)
# ══════════════════════════════════════════════════════
def fetch_gold_market_prices(days: int = HISTORY_DAYS) -> pd.DataFrame | None:
    """
    Fetch real gold futures prices from Yahoo Finance (GC=F).
    Used to compute a gold price index that modulates our synthetic series.
    Returns None if yfinance is unavailable or network fails.
    """
    if not YFINANCE_OK:
        return None

    print("\n─── Fetching gold market prices (Yahoo Finance) ──")
    try:
        end   = pd.Timestamp.today()
        start = end - pd.Timedelta(days=days + 30)

        ticker = yf.Ticker(GOLD_TICKER)
        hist   = ticker.history(start=start.strftime("%Y-%m-%d"),
                                end=end.strftime("%Y-%m-%d"))

        if hist.empty:
            print("  ⚠️  No data returned from Yahoo Finance")
            return None

        hist = hist[["Close"]].reset_index()
        hist.columns = ["date", "gold_price"]
        hist["date"] = pd.to_datetime(hist["date"]).dt.tz_localize(None)

        # Normalize to 0-1 so we can use it as a multiplier
        mn, mx = hist["gold_price"].min(), hist["gold_price"].max()
        hist["gold_index"] = (hist["gold_price"] - mn) / (mx - mn)

        print(f"  Days fetched           : {len(hist)}")
        print(f"  Gold price range       : "
            f"${hist['gold_price'].min():.0f} — ${hist['gold_price'].max():.0f} /oz")
        return hist

    except Exception as e:
        print(f"  ⚠️  Could not fetch market data: {e}")
        return None


# ══════════════════════════════════════════════════════
# 3. BUILD TIME-SERIES FROM PRODUCT DATA
#
#  Your product catalog is a snapshot (no dates).
#  Strategy: generate a synthetic daily price series that
#  reflects your actual product price distribution and
#  is modulated by real gold market trends when available.
# ══════════════════════════════════════════════════════
def build_time_series(
    df: pd.DataFrame,
    gold_prices: pd.DataFrame | None,
    days: int = HISTORY_DAYS
) -> pd.DataFrame:
    """
    Construct a daily time-series of jewelry prices.

    Logic:
    - Base price  = weighted average of product prices (weight = trend_score)
    - Daily noise = realistic market volatility (~1.5% daily std)
    - Gold modulation = real gold price index shifts the base ±8%
    - Seasonality = Valentine's Day, Mother's Day, Christmas peaks
    """
    print("\n─── Building price time-series ───────────────────")

    # Weighted average price (trend_score is the weight)
    weights    = df["trend_score"].clip(lower=0.01)
    base_price = float(np.average(df["price"], weights=weights))
    print(f"  Weighted base price    : ${base_price:.2f}")

    # Date range ending today
    end_date   = pd.Timestamp.today().normalize()
    start_date = end_date - pd.Timedelta(days=days - 1)
    date_range = pd.date_range(start=start_date, end=end_date, freq="D")

    np.random.seed(42)
    n = len(date_range)

    # ── Trend: slow upward drift over the year (+5%) ──
    trend = np.linspace(0, base_price * 0.05, n)

    # ── Volatility: geometric Brownian motion ─────────
    daily_returns = np.random.normal(loc=0.0002, scale=0.015, size=n)
    price_path    = base_price * np.cumprod(1 + daily_returns)

    # ── Jewelry seasonality (demand peaks) ────────────
    day_of_year = np.array([d.timetuple().tm_yday for d in date_range])
    # Valentine's Day peak (Feb 14 = day 45) ±10 days
    val_peak  = 0.06 * np.exp(-0.5 * ((day_of_year - 45)  / 10) ** 2)
    # Mother's Day peak (May 12 = day 132) ±14 days
    mom_peak  = 0.08 * np.exp(-0.5 * ((day_of_year - 132) / 14) ** 2)
    # Christmas peak (Dec 20 = day 354) ±15 days
    xmas_peak = 0.12 * np.exp(-0.5 * ((day_of_year - 354) / 15) ** 2)
    # Summer slowdown (Aug = day 220) — slight dip
    summer_dip = -0.04 * np.exp(-0.5 * ((day_of_year - 220) / 20) ** 2)

    seasonality = base_price * (val_peak + mom_peak + xmas_peak + summer_dip)

    # ── Gold market modulation (±8% if data available) ─
    gold_modulation = np.zeros(n)
    if gold_prices is not None:
        merged = pd.DataFrame({"date": date_range})
        merged = merged.merge(gold_prices[["date", "gold_index"]],
                              on="date", how="left")
        merged["gold_index"] = merged["gold_index"].interpolate().fillna(0.5)
        # Shift center to 0 (0.5 → 0) so it's a ±4% modulator
        gold_modulation = base_price * 0.08 * (merged["gold_index"].values - 0.5)
        print(f"  Gold market modulation : ±8% applied")

    # ── Final price series ─────────────────────────────
    y = price_path + trend + seasonality + gold_modulation
    y = np.clip(y, base_price * 0.5, base_price * 2.5)   # sanity bounds

    ts = pd.DataFrame({"ds": date_range, "y": y})
    print(f"  Series length          : {len(ts)} days")
    print(f"  Price range in series  : ${ts['y'].min():.2f} — ${ts['y'].max():.2f}")
    return ts


# ══════════════════════════════════════════════════════
# 4. BUILD TIME-SERIES PER CATEGORY
# ══════════════════════════════════════════════════════
CATEGORY_KEYWORDS = {
    "rings"     : ["ring", "band", "solitaire"],
    "necklaces" : ["necklace", "chain", "pendant"],
    "bracelets" : ["bracelet", "bangle", "cuff"],
    "earrings"  : ["earring", "hoop", "stud"],
}

def filter_by_category(df: pd.DataFrame, category: str) -> pd.DataFrame:
    """Return rows whose title matches the given jewelry category."""
    keywords = CATEGORY_KEYWORDS.get(category, [])
    if not keywords:
        return df
    pattern = "|".join(keywords)
    mask = df["title"].str.lower().str.contains(pattern, na=False)
    return df[mask]


# ══════════════════════════════════════════════════════
# 5. TRAIN PROPHET MODEL
# ══════════════════════════════════════════════════════
def train_prophet(
    ts: pd.DataFrame,
    label: str = "Global",
    forecast_days: int = FORECAST_DAYS
) -> tuple[Prophet, pd.DataFrame]:
    """
    Train a Prophet model on the time-series and return
    the fitted model + forecast DataFrame.

    Prophet hyperparameters tuned for jewelry retail:
    - changepoint_prior_scale : flexibility of the trend
      (0.05 = moderate — avoids overfitting on synthetic data)
    - seasonality_prior_scale : strength of seasonal effects
    - yearly_seasonality      : captures holiday peaks
    - weekly_seasonality      : weekend shopping patterns
    """
    print(f"\n─── Training Prophet [{label}] ────────────────────")
    print(f"  Training samples       : {len(ts)}")
    print(f"  Forecast horizon       : {forecast_days} days")

    model = Prophet(
        changepoint_prior_scale  = 0.05,
        seasonality_prior_scale  = 10.0,
        yearly_seasonality       = True,
        weekly_seasonality       = True,
        daily_seasonality        = False,
        interval_width           = 0.95,     # 95% confidence interval
        uncertainty_samples      = 500,
    )

    # ── Custom jewelry seasonalities ──────────────────
    # Valentine's Day (around Feb 14)
    model.add_seasonality(
        name="valentines", period=365.25, fourier_order=3,
        condition_name=None
    )
    # Mother's Day (around May 12)
    model.add_seasonality(
        name="mothers_day", period=365.25, fourier_order=3
    )
    # Christmas shopping season
    model.add_seasonality(
        name="christmas", period=365.25, fourier_order=5
    )

    # ── Holiday regressors ────────────────────────────
    # (adds known demand spikes as external regressors)
    holidays = _make_jewelry_holidays()
    model.holidays = holidays

    model.fit(ts)

    # ── Future dataframe ──────────────────────────────
    future   = model.make_future_dataframe(periods=forecast_days)
    forecast = model.predict(future)

    # Attach actual values for comparison
    forecast = forecast.merge(ts.rename(columns={"y": "actual"}),
                              on="ds", how="left")

    print(f"  Forecast end date      : "
          f"{forecast['ds'].max().strftime('%Y-%m-%d')}")

    # Key forecast metrics
    future_fc  = forecast[forecast["actual"].isna()]
    avg_fc     = future_fc["yhat"].mean()
    lower_fc   = future_fc["yhat_lower"].mean()
    upper_fc   = future_fc["yhat_upper"].mean()
    last_actual = ts["y"].iloc[-1]
    change_pct  = (avg_fc - last_actual) / last_actual * 100

    print(f"  Last actual price      : ${last_actual:.2f}")
    print(f"  Avg forecast (next {forecast_days}d): ${avg_fc:.2f}")
    print(f"  95% CI                 : [${lower_fc:.2f} — ${upper_fc:.2f}]")
    direction = "📈" if change_pct > 0 else "📉"
    print(f"  Expected change        : {direction} {change_pct:+.1f}%")

    return model, forecast


def _make_jewelry_holidays() -> pd.DataFrame:
    """Define key jewelry retail holiday dates for Prophet."""
    years = [2023, 2024, 2025, 2026]
    rows  = []

    holiday_map = {
        "Valentines_Day" : [(y, 2, 14) for y in years],
        "Mothers_Day"    : [(y, 5, 12) for y in years],   # approx 2nd Sunday May
        "Christmas_Eve"  : [(y, 12, 24) for y in years],
        "Christmas_Day"  : [(y, 12, 25) for y in years],
        "New_Years"      : [(y, 1,  1)  for y in years],
        "Black_Friday"   : [(2023, 11, 24), (2024, 11, 29), (2025, 11, 28)],
    }

    for name, dates in holiday_map.items():
        for y, m, d in dates:
            rows.append({
                "holiday"          : name,
                "ds"               : pd.Timestamp(year=y, month=m, day=d),
                "lower_window"     : -3,   # effect starts 3 days before
                "upper_window"     : 2,    # effect ends 2 days after
            })

    return pd.DataFrame(rows)


# ══════════════════════════════════════════════════════
# 6. CROSS-VALIDATION (model quality check)
# ══════════════════════════════════════════════════════
def run_cross_validation(model: Prophet, ts: pd.DataFrame) -> dict | None:
    """
    Run Prophet's built-in cross-validation.
    Uses a rolling window: train on first 270 days, test on next 30.
    Skipped if training data < 300 days.
    """
    if len(ts) < 300:
        print(f"\n  ⚠️  CV skipped — need ≥300 days, have {len(ts)}")
        return None

    print("\n─── Cross-Validation ──────────────────────────────")
    try:
        cv_results = cross_validation(
            model,
            initial="270 days",
            period ="30 days",
            horizon="30 days",
            parallel=None,
        )
        metrics = performance_metrics(cv_results)

        mae  = metrics["mae"].mean()
        rmse = metrics["rmse"].mean()
        mape = metrics["mape"].mean() * 100

        print(f"  MAE   : ${mae:.2f}")
        print(f"  RMSE  : ${rmse:.2f}")
        print(f"  MAPE  : {mape:.1f}%")

        return {"mae": mae, "rmse": rmse, "mape": mape}
    except Exception as e:
        print(f"  ⚠️  CV failed: {e}")
        return None


# ══════════════════════════════════════════════════════
# 7. PLOTS
# ══════════════════════════════════════════════════════
GOLD_COLOR    = "#D4AF37"
ACCENT_COLOR  = "#C0392B"
BG_COLOR      = "#0F1117"
TEXT_COLOR    = "#F5F5F5"
GRID_COLOR    = "#2A2A3A"


def _style_ax(ax):
    ax.set_facecolor(BG_COLOR)
    ax.tick_params(colors=TEXT_COLOR, labelsize=9)
    ax.xaxis.label.set_color(TEXT_COLOR)
    ax.yaxis.label.set_color(TEXT_COLOR)
    ax.title.set_color(TEXT_COLOR)
    for spine in ax.spines.values():
        spine.set_edgecolor(GRID_COLOR)
    ax.grid(True, color=GRID_COLOR, linewidth=0.5, alpha=0.7)


def plot_forecast(
    forecast: pd.DataFrame,
    label: str = "Global",
    output_path: str = None
):
    """Main forecast chart: historical + predicted + confidence band."""
    if output_path is None:
        slug = label.lower().replace(" ", "_")
        output_path = f"{OUTPUT_DIR}/forecast_{slug}.png"

    fig, ax = plt.subplots(figsize=(14, 6))
    fig.patch.set_facecolor(BG_COLOR)
    _style_ax(ax)

    historical = forecast[forecast["actual"].notna()]
    future     = forecast[forecast["actual"].isna()]

    # Historical actual prices
    ax.plot(historical["ds"], historical["actual"],
            color=GOLD_COLOR, linewidth=1.8, label="Historical Price", zorder=3)

    # Fitted values on historical period
    ax.plot(historical["ds"], historical["yhat"],
            color="white", linewidth=1, linestyle="--",
            alpha=0.6, label="Prophet Fit", zorder=2)

    # Forecast line
    ax.plot(future["ds"], future["yhat"],
            color=ACCENT_COLOR, linewidth=2.2, label="Forecast", zorder=4)

    # Confidence interval band
    ax.fill_between(future["ds"],
                    future["yhat_lower"], future["yhat_upper"],
                    color=ACCENT_COLOR, alpha=0.18, label="95% CI")

    # Vertical separator — today
    today = pd.Timestamp.today().normalize()
    ax.axvline(today, color=GOLD_COLOR, linestyle=":", linewidth=1.5, alpha=0.8)
    ax.text(today, ax.get_ylim()[1] * 0.98, " Today",
            color=GOLD_COLOR, fontsize=8, va="top")

    # Annotations: last actual + end of forecast
    last_price = historical["actual"].iloc[-1]
    end_price  = future["yhat"].iloc[-1]
    change_pct = (end_price - last_price) / last_price * 100
    arrow_color = "#2ECC71" if change_pct > 0 else ACCENT_COLOR

    ax.annotate(f"${end_price:.0f}\n({change_pct:+.1f}%)",
                xy=(future["ds"].iloc[-1], end_price),
                xytext=(-60, 20), textcoords="offset points",
                color=arrow_color, fontsize=9, fontweight="bold",
                arrowprops=dict(arrowstyle="->", color=arrow_color, lw=1.5))

    ax.set_title(f"PrizmaGold — {label} Price Forecast (90 days)",
                 fontsize=14, fontweight="bold", pad=15)
    ax.set_xlabel("Date")
    ax.set_ylabel("Price (USD)")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2))
    plt.xticks(rotation=30)

    legend = ax.legend(loc="upper left", facecolor="#1A1A2E",
                       edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR, fontsize=9)

    plt.tight_layout()
    plt.savefig(output_path, dpi=120, bbox_inches="tight",
                facecolor=BG_COLOR)
    plt.close()
    print(f"  Chart saved            : {output_path}")


def plot_components(model: Prophet, forecast: pd.DataFrame, label: str = "Global"):
    """Prophet decomposition: trend + weekly + yearly."""
    slug = label.lower().replace(" ", "_")
    output_path = f"{OUTPUT_DIR}/components_{slug}.png"

    fig = model.plot_components(forecast)
    fig.patch.set_facecolor(BG_COLOR)
    for ax in fig.axes:
        _style_ax(ax)
    fig.suptitle(f"Forecast Components — {label}",
                 color=TEXT_COLOR, fontsize=12, y=1.01)
    plt.tight_layout()
    plt.savefig(output_path, dpi=100, bbox_inches="tight",
                facecolor=BG_COLOR)
    plt.close()
    print(f"  Components saved       : {output_path}")


def plot_category_comparison(category_forecasts: dict):
    """
    Bar chart: expected price change (%) per jewelry category
    over the forecast horizon.
    """
    output_path = f"{OUTPUT_DIR}/category_comparison.png"

    labels  = []
    changes = []
    colors  = []

    for cat, (_, fc) in category_forecasts.items():
        future = fc[fc["actual"].isna()]
        if future.empty:
            continue
        hist   = fc[fc["actual"].notna()]
        last   = hist["actual"].iloc[-1] if len(hist) else 0
        avg_fc = future["yhat"].mean()
        pct    = (avg_fc - last) / last * 100 if last else 0
        labels.append(cat.title())
        changes.append(round(pct, 2))
        colors.append("#2ECC71" if pct > 0 else ACCENT_COLOR)

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_facecolor(BG_COLOR)
    _style_ax(ax)

    bars = ax.bar(labels, changes, color=colors, edgecolor=GRID_COLOR, width=0.5)
    ax.axhline(0, color=TEXT_COLOR, linewidth=0.8, alpha=0.5)

    for bar, val in zip(bars, changes):
        va = "bottom" if val >= 0 else "top"
        offset = 0.15 if val >= 0 else -0.15
        ax.text(bar.get_x() + bar.get_width() / 2,
                val + offset, f"{val:+.1f}%",
                ha="center", va=va, color=TEXT_COLOR,
                fontsize=10, fontweight="bold")

    ax.set_title("Expected Price Change by Category — Next 90 Days",
                 fontsize=13, fontweight="bold", color=TEXT_COLOR)
    ax.set_ylabel("Expected Change (%)")
    plt.tight_layout()
    plt.savefig(output_path, dpi=120, bbox_inches="tight",
                facecolor=BG_COLOR)
    plt.close()
    print(f"  Category comparison    : {output_path}")


# ══════════════════════════════════════════════════════
# 8. EXPORT RESULTS
# ══════════════════════════════════════════════════════
def export_forecast(forecast: pd.DataFrame, label: str = "global"):
    """Save forecast to CSV."""
    cols = ["ds", "yhat", "yhat_lower", "yhat_upper", "actual",
            "trend", "weekly", "yearly"]
    cols = [c for c in cols if c in forecast.columns]

    slug = label.lower().replace(" ", "_")
    path = f"{OUTPUT_DIR}/forecast_{slug}.csv"
    forecast[cols].to_csv(path, index=False, encoding="utf-8-sig")
    print(f"  CSV saved              : {path}")
    return path


# ══════════════════════════════════════════════════════
# 9. SAVE FORECAST TO POSTGRESQL (optional)
# ══════════════════════════════════════════════════════
def save_forecast_to_db(forecast: pd.DataFrame, category: str = "global"):
    """
    Persist forecast results to PostgreSQL.
    Creates the table if it doesn't exist.
    """
    if not PSYCOPG2_OK:
        print("  ⚠️  psycopg2 not available — skipping DB save")
        return

    CREATE_SQL = """
    CREATE TABLE IF NOT EXISTS gold_price_forecasts (
        id              SERIAL PRIMARY KEY,
        category        VARCHAR(50)     NOT NULL,
        forecast_date   DATE            NOT NULL,
        predicted_price NUMERIC(10,2)   NOT NULL,
        lower_bound     NUMERIC(10,2),
        upper_bound     NUMERIC(10,2),
        actual_price    NUMERIC(10,2),
        generated_at    TIMESTAMPTZ     DEFAULT NOW(),
        UNIQUE (category, forecast_date)
    );
    """

    INSERT_SQL = """
    INSERT INTO gold_price_forecasts
        (category, forecast_date, predicted_price, lower_bound, upper_bound, actual_price)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (category, forecast_date) DO UPDATE SET
        predicted_price = EXCLUDED.predicted_price,
        lower_bound     = EXCLUDED.lower_bound,
        upper_bound     = EXCLUDED.upper_bound,
        actual_price    = EXCLUDED.actual_price,
        generated_at    = NOW();
    """

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur  = conn.cursor()
        cur.execute(CREATE_SQL)

        inserted = 0
        for _, row in forecast.iterrows():
            actual = None if pd.isna(row.get("actual")) else float(row["actual"])
            cur.execute(INSERT_SQL, (
                category,
                row["ds"].date(),
                round(float(row["yhat"]),       2),
                round(float(row["yhat_lower"]), 2),
                round(float(row["yhat_upper"]), 2),
                actual
            ))
            inserted += 1

        conn.commit()
        cur.close()
        conn.close()
        print(f"  DB rows upserted       : {inserted} ({category})")

    except Exception as e:
        print(f"  ⚠️  DB error: {e}")


# ══════════════════════════════════════════════════════
# 10. FASTAPI ENDPOINT HELPER
#     Add these routes to your main.py
# ══════════════════════════════════════════════════════
FASTAPI_SNIPPET = '''
# ── Add to main.py ────────────────────────────────────
import json, os, pandas as pd
from fastapi import Query

FORECAST_DIR = "data/forecasts"

@app.get("/forecast/global")
def get_global_forecast(days: int = Query(default=30)):
    path = f"{FORECAST_DIR}/forecast_global.csv"
    if not os.path.exists(path):
        return {"status": "error", "message": "Run gold_price_forecast.py first"}
    fc = pd.read_csv(path, parse_dates=["ds"])
    future = fc[fc["actual"].isna()].head(days)
    return {
        "status"   : "success",
        "category" : "global",
        "horizon"  : days,
        "forecast" : [
            {
                "date"  : row["ds"].strftime("%Y-%m-%d"),
                "price" : round(float(row["yhat"]), 2),
                "lower" : round(float(row["yhat_lower"]), 2),
                "upper" : round(float(row["yhat_upper"]), 2),
            }
            for _, row in future.iterrows()
        ]
    }

@app.get("/forecast/categories")
def get_category_forecasts():
    results = {}
    for cat in ["rings", "necklaces", "bracelets", "earrings"]:
        path = f"{FORECAST_DIR}/forecast_{cat}.csv"
        if not os.path.exists(path):
            continue
        fc = pd.read_csv(path, parse_dates=["ds"])
        future   = fc[fc["actual"].isna()]
        hist     = fc[fc["actual"].notna()]
        last     = float(hist["actual"].iloc[-1]) if len(hist) else 0
        avg_fc   = float(future["yhat"].mean())
        change   = round((avg_fc - last) / last * 100, 2) if last else 0
        results[cat] = {
            "avg_forecast" : round(avg_fc, 2),
            "change_pct"   : change,
            "direction"    : "up" if change > 0 else "down"
        }
    return {"status": "success", "categories": results}
'''


# ══════════════════════════════════════════════════════
# MAIN PIPELINE
# ══════════════════════════════════════════════════════
def run_forecast_pipeline():
    if not PROPHET_OK:
        print("❌ Prophet is required. Install with: pip install prophet")
        return

    print("🚀 PrizmaGold — Gold Price Forecast Pipeline\n")

    # 1. Load data
    df = load_product_data()

    # 2. Fetch real gold market prices
    gold_prices = fetch_gold_market_prices()

    # ── GLOBAL FORECAST ───────────────────────────────
    print("\n══════════════════════════════════════════════════")
    print("  GLOBAL FORECAST (all categories combined)")
    print("══════════════════════════════════════════════════")

    ts_global        = build_time_series(df, gold_prices)
    model_g, fc_g    = train_prophet(ts_global, label="Global")
    cv_metrics       = run_cross_validation(model_g, ts_global)

    plot_forecast(fc_g, label="Global")
    plot_components(model_g, fc_g, label="Global")
    export_forecast(fc_g, label="global")
    save_forecast_to_db(fc_g, category="global")

    # ── PER-CATEGORY FORECASTS ─────────────────────────
    print("\n══════════════════════════════════════════════════")
    print("  CATEGORY FORECASTS")
    print("══════════════════════════════════════════════════")

    category_forecasts = {}

    for category in ["rings", "necklaces", "bracelets", "earrings"]:
        df_cat = filter_by_category(df, category)

        if len(df_cat) < 3:
            print(f"\n  ⚠️  [{category}] only {len(df_cat)} products — skipping")
            continue

        print(f"\n  [{category.upper()}] — {len(df_cat)} products")
        ts_cat   = build_time_series(df_cat, gold_prices)
        model_c, fc_c = train_prophet(ts_cat, label=category.title())

        slug = category.lower()
        plot_forecast(fc_c, label=category.title(),
                      output_path=f"{CLUSTER_DIR}/forecast_{slug}.png")
        export_forecast(fc_c, label=slug)
        save_forecast_to_db(fc_c, category=category)

        category_forecasts[category] = (model_c, fc_c)

    # ── COMPARISON CHART ──────────────────────────────
    if category_forecasts:
        print("\n─── Category Comparison Chart ────────────────────")
        plot_category_comparison(category_forecasts)

    # ── SUMMARY ───────────────────────────────────────
    print("\n══════════════════════════════════════════════════")
    print("  PIPELINE COMPLETE")
    print("══════════════════════════════════════════════════")
    print(f"\n  Output directory       : {OUTPUT_DIR}/")
    print(f"  Files generated:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if not os.path.isdir(f"{OUTPUT_DIR}/{f}"):
            print(f"    {f}")
    if cv_metrics:
        print(f"\n  Model quality (global) :")
        print(f"    MAE  = ${cv_metrics['mae']:.2f}")
        print(f"    RMSE = ${cv_metrics['rmse']:.2f}")
        print(f"    MAPE = {cv_metrics['mape']:.1f}%")

    print("\n  FastAPI endpoints to add → see FASTAPI_SNIPPET in code")
    print("\n✅ Forecasting pipeline done — Ready for dashboard integration")


if __name__ == "__main__":
    run_forecast_pipeline()