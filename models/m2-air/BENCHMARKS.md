# 🎯 M2 MacBook Air Benchmark Targets

### System Specifications
- **Chip:** Apple M2 (8-core CPU: 4 Avalanche Performance + 4 Blizzard Efficiency)
- **GPU:** 8-core (Base 13") or 10-core (Upgraded 13" & standard 15")
- **Unified Memory:** 8 GB, 16 GB, or 24 GB LPDDR5 (100 GB/s bandwidth)
- **Storage Configurations:**
  - 256 GB: Single NAND chip configuration
  - 512 GB, 1 TB, 2 TB: Dual / multi-NAND configuration

---

## Benchmark Cheat Sheet

| Metric | Configuration | Pass / Expected Spec | Red Flag / Defect |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | All M2 Air models | `~2,550 – 2,650` | `< 2,200` |
| **Geekbench 6 Multi-Core** | All M2 Air models | `~9,600 – 10,200` | `< 7,500` (Thermal cooling issue) |
| **Metal GPU Score** | 8-Core GPU | `~38,000 – 40,000` | `< 33,000` |
| | 10-Core GPU | `~45,000 – 47,000` | `< 39,000` |
| **Sequential SSD Write** | **256 GB (Single NAND)**| `~1,450 – 1,600 MB/s` | `< 1,000 MB/s` |
| | **512 GB+ (Dual NAND)** | `~2,800 – 3,200 MB/s` | `< 1,800 MB/s` |
| **Sequential SSD Read** | **256 GB (Single NAND)**| `~1,500 – 1,700 MB/s` | `< 1,100 MB/s` |
| | **512 GB+ (Dual NAND)** | `~3,000 – 3,400 MB/s` | `< 2,000 MB/s` |
| **Battery Health (System)**| All models | `> 85%` | `< 80%` or Service Warning |
| **Battery Cycle Count** | Normal Used Units | `50 – 350` | `< 15` (Suspicious) or `> 550` |
| **Diagnostics** | All models | `ADP000` | Any other error code |
