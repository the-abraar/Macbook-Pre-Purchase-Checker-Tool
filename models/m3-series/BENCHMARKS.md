# 🎯 M3 Series Benchmark Targets

### System Specifications
- **M3 Base:** 8-core CPU (4P + 4E), 8 or 10-core GPU, up to 24 GB RAM (100 GB/s bandwidth)
- **M3 Pro:** 11 or 12-core CPU (5P/6E or 6P/6E), 14 or 18-core GPU, up to 36 GB RAM (150 GB/s bandwidth)
- **M3 Max:** 14 or 16-core CPU (10P/4E or 12P/4E), 30 or 40-core GPU, up to 128 GB RAM (300 or 400 GB/s bandwidth)

---

## Benchmark Cheat Sheet

| Metric | Chip Model | Pass / Expected Spec | Red Flag / Throttling |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | All M3 Family Chips | `~3,050 – 3,150` | `< 2,600` |
| **Geekbench 6 Multi-Core** | M3 Base (8-Core) | `~11,800 – 12,200` | `< 9,500` |
| | M3 Pro (11-Core) | `~14,000 – 14,500` | `< 11,500` |
| | M3 Pro (12-Core) | `~15,200 – 15,800` | `< 12,500` |
| | M3 Max (14-Core) | `~19,000 – 19,600` | `< 15,500` |
| | M3 Max (16-Core) | `~21,000 – 21,800` | `< 17,000` |
| **Metal GPU Score** | M3 Base (10-Core GPU) | `~47,000 – 49,000` | `< 40,000` |
| | M3 Pro (18-Core GPU) | `~77,000 – 80,000` | `< 68,000` |
| | M3 Max (30-Core GPU) | `~128,000 – 133,000` | `< 110,000` |
| | M3 Max (40-Core GPU) | `~155,000 – 162,000` | `< 135,000` |
| **Sequential SSD Write** | 256 GB (M3 Air) | `~2,800 – 3,100 MB/s` | `< 1,800 MB/s` |
| | 512 GB+ (M3 / Pro / Max)| `~3,500 – 6,000 MB/s` | `< 2,500 MB/s` |
| **Sequential SSD Read** | All Capacities | `~3,500 – 6,500 MB/s` | `< 2,500 MB/s` |
| **Hardware Diagnostics** | All models | `ADP000` | Any code other than `ADP000` |
