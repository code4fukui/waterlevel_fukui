# 福井県河川水位オープンデータ (Fukui River Water Level Open Data)

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

This project automatically scrapes river water level data from the Fukui Prefecture's disaster information website, converts it into an open CSV format, and provides real-time visualizations.

## Live Demos

- **[Map View](https://code4fukui.github.io/waterlevel_fukui/)**: An interactive map showing the latest water level at each sensor, color-coded by the official alert status.
- **[Graph View](https://code4fukui.github.io/waterlevel_fukui/graph.html)**: A map that visualizes the recent water level trend for each sensor as a simple bar chart relative to its danger level.

## Features

- **Automated Data Collection**: A GitHub Action runs hourly to fetch the latest data.
- **Open Data in CSV Format**: All sensor metadata and time-series data are stored in easy-to-use CSV files.
- **Interactive Visualizations**: Two web-based maps for at-a-glance status and trend analysis.
- **Geospatial API**: Includes a JavaScript module to find the nearest water level sensor to any geographic coordinate.

## Open Data (CSV)

- **[sensors.csv](https://code4fukui.github.io/waterlevel_fukui/sensors.csv)**: A master list of all monitoring stations. Includes ID, name, river, geographic location (Geo3x3), and official alert level thresholds (e.g., flood warning level, evacuation level).
- **[Daily Data Directory](https://github.com/code4fukui/waterlevel_fukui/tree/main/data)**: Contains daily time-series data files named `yyyy-mm-dd.csv`. Each file contains readings for all sensors for that day.

## How It Works

1.  A GitHub Actions workflow (`.github/workflows/scheduled-fetch.yml`) is triggered every hour.
2.  The workflow executes the Deno script `makeData.js`.
3.  This script scrapes the HTML from the Fukui Prefecture's river information map.
4.  The raw HTML is parsed to extract the latest water level reading for each sensor.
5.  The new data is appended to the CSV file for the current day in the `/data` directory.
6.  The updated data file is automatically committed and pushed back to this repository.

## Usage for Developers

### Prerequisites

- [Deno](https://deno.land/) (v1.x)

### Running Locally

To perform a one-time data fetch, clone the repository and run:
```sh
deno run -A makeData.js
```

### Finding the Nearest Sensor

You can use the `getNearest.js` module in your own projects to find the closest water level sensor and its latest reading for a given latitude and longitude.

```javascript
import { getNearest } from "https://code4fukui.github.io/waterlevel_fukui/getNearest.js";

// Example: Find the nearest sensor to your current location
const nearestSensor = await getNearest(35.943, 136.188);

console.log(nearestSensor);
/*
Outputs an object with sensor metadata and the latest water level reading:
{
  id: "1",
  観測所名: "九十九橋",
  河川名: "足羽川",
  // ... other sensor metadata
  geo3x3: "E9138735961882",
  distance: 2453.9, // distance in meters
  日時: "2023-09-14T10:10",
  河川水位: