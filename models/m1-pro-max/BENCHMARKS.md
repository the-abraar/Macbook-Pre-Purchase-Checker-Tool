# 🎯 M1 Pro & M1 Max MacBook Pro Benchmark Targets

### System Specifications
- **Chips:**
  - M1 Pro (8-core CPU, 14-core GPU / 10-core CPU, 14 or 16-core GPU)
  - M1 Max (10-core CPU, 24 or 32-core GPU)
- **Memory Bandwidth:** 200 GB/s (M1 Pro) or 400 GB/s (M1 Max)
- **Storage Options:** 512 GB, 1 TB, 2 TB, 4 TB, 8 TB (High-speed PCIe 4.0 SSD array)

---

## Benchmark Cheat Sheet

| Metric | Chip Model | Pass / Expected Spec | Red Flag / Throttling |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | All M1 Pro / Max | `~2,350 – 2,450` | `< 2,000` |
| **Geekbench 6 Multi-Core** | M1 Pro (8-Core CPU) | `~10,000 – 10,500` | `< 8,000` |
| | M1 Pro / Max (10-Core CPU) | `~12,300 – 12,800` | `< 10,000` (Thermal limit/fan failure) |
| **Metal GPU Score** | M1 Pro (14-Core GPU) | `~54,000 – 56,000` | `< 48,000` |
| | M1 Pro (16-Core GPU) | `~64,000 – 66,000` | `< 56,000` |
| | M1 Max (24-Core GPU) | `~95,000 – 102,000` | `< 82,000` |
| | M1 Max (32-Core GPU) | `~120,000 – 128,000` | `< 105,000` |
| **Sequential SSD Write** | 512 GB Base | `~4,200 – 4,800 MB/s` | `< 2,500 MB/s` |
| | 1 TB+ | `~5,000 – 5,800 MB/s` | `< 3,000 MB/s` |
| **Sequential SSD Read** | All Capacities | `~5,200 – 5,800 MB/s` | `< 3,500 MB/s` |
| **Battery Health** | All models | `> 83%` | `< 78%` or "Service Battery" |
| **Hardware Diagnostics** | All models | `ADP000` | Any code starting with `PPT`, `VDC`, `NDR` |
