# 🎯 M2 Pro & M2 Max MacBook Pro Benchmark Targets

### System Specifications
- **Chips:**
  - M2 Pro (10 or 12-core CPU, 16 or 19-core GPU)
  - M2 Max (12-core CPU, 30 or 38-core GPU)
- **Memory Bandwidth:** 200 GB/s (M2 Pro) or 400 GB/s (M2 Max)
- **Storage Configurations:** 512 GB, 1 TB, 2 TB, 4 TB, 8 TB

---

## Benchmark Cheat Sheet

| Metric | Configuration | Pass / Factory Target | Red Flag / Throttling |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | All M2 Pro / Max | `~2,650 – 2,750` | `< 2,300` |
| **Geekbench 6 Multi-Core** | M2 Pro (10-Core CPU) | `~12,000 – 12,500` | `< 10,000` |
| | M2 Pro / Max (12-Core CPU) | `~14,300 – 14,800` | `< 11,500` (Cooling defect) |
| **Metal GPU Score** | M2 Pro (16-Core GPU) | `~69,000 – 72,000` | `< 60,000` |
| | M2 Pro (19-Core GPU) | `~80,000 – 83,000` | `< 70,000` |
| | M2 Max (30-Core GPU) | `~130,000 – 135,000` | `< 112,000` |
| | M2 Max (38-Core GPU) | `~150,000 – 155,000` | `< 130,000` |
| **Sequential SSD Write** | **512 GB Base** | `~3,200 – 3,600 MB/s` | `< 2,000 MB/s` |
| | **1 TB+ Upgrades** | `~5,500 – 6,200 MB/s` | `< 3,500 MB/s` |
| **Sequential SSD Read** | All Capacities | `~5,500 – 6,200 MB/s` | `< 3,500 MB/s` |
| **Battery Health** | Used Units | `> 86%` | `< 80%` or Service Warning |
| **Hardware Diagnostics** | All models | `ADP000` | Any code other than `ADP000` |
