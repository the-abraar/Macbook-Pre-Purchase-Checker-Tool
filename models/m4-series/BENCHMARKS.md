# 🎯 M4 Series Benchmark Targets

### System Specifications
- **M4 Base:** 10-core CPU (4P + 6E), 10-core GPU, 16 GB, 24 GB, or 32 GB RAM (120 GB/s bandwidth)
- **M4 Pro:** 12 or 14-core CPU (8P/4E or 10P/4E), 16 or 20-core GPU, up to 48 GB RAM (273 GB/s bandwidth)
- **M4 Max:** 14 or 16-core CPU (10P/4E or 12P/4E), 32 or 40-core GPU, up to 128 GB RAM (410 or 546 GB/s bandwidth)

---

## Benchmark Cheat Sheet

| Metric | Chip Model | Pass / Expected Spec | Red Flag / Throttling |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | All M4 Family Chips | `~3,750 – 3,950` | `< 3,200` |
| **Geekbench 6 Multi-Core** | M4 Base (10-Core) | `~14,600 – 15,300` | `< 12,000` |
| | M4 Pro (12-Core) | `~19,000 – 19,800` | `< 16,000` |
| | M4 Pro (14-Core) | `~22,000 – 22,800` | `< 18,500` |
| | M4 Max (14-Core) | `~23,000 – 24,000` | `< 19,500` |
| | M4 Max (16-Core) | `~25,500 – 26,800` | `< 21,500` |
| **Metal GPU Score** | M4 Base (10-Core GPU) | `~57,000 – 60,000` | `< 49,000` |
| | M4 Pro (20-Core GPU) | `~110,000 – 115,000` | `< 95,000` |
| | M4 Max (32-Core GPU) | `~160,000 – 168,000` | `< 140,000` |
| | M4 Max (40-Core GPU) | `~190,000 – 200,000` | `< 165,000` |
| **Sequential SSD Write** | 512 GB Base | `~3,400 – 4,000 MB/s` | `< 2,200 MB/s` |
| | 1 TB+ Upgrades | `~6,000 – 7,400 MB/s` | `< 3,800 MB/s` |
| **Sequential SSD Read** | All Capacities | `~6,000 – 7,500 MB/s` | `< 3,800 MB/s` |
| **Battery Health** | New / Lightly Used | `> 95%` | `< 88%` |
| **Battery Cycles** | Expected Fresh Units | `5 – 150` | `> 400` (Unusually heavy wear for M4) |
| **Hardware Diagnostics** | All models | `ADP000` | Any code other than `ADP000` |
