# 🎯 M1 MacBook Air (2020) Benchmark Targets

### System Specifications
- **Chip:** Apple M1 (8-core CPU: 4 Firestorm Performance + 4 Icestorm Efficiency)
- **GPU:** 7-core (Base 256GB models) or 8-core (512GB+ models)
- **Memory Options:** 8 GB or 16 GB unified LPDDR4X (68.25 GB/s bandwidth)
- **Storage Options:** 256 GB, 512 GB, 1 TB, 2 TB (Dual-NAND flash array)

---

## Benchmark Cheat Sheet

| Benchmark Test | Pass / Factory Spec | Warning / Throttling | Immediate Fail / Red Flag |
| :--- | :--- | :--- | :--- |
| **Geekbench 6 Single-Core** | `~2,300 – 2,400` | `2,000 – 2,200` | `< 1,900` |
| **Geekbench 6 Multi-Core** | `~8,200 – 8,700` | `6,800 – 7,800` | `< 6,500` (Thermal cooling failure) |
| **Metal GPU (7-Core)** | `~31,000 – 32,500` | `28,000 – 30,000` | `< 26,000` |
| **Metal GPU (8-Core)** | `~33,000 – 34,500` | `30,000 – 32,000` | `< 28,000` |
| **Sequential SSD Write** | `~2,100 – 2,300 MB/s` | `1,400 – 1,800 MB/s` | `< 1,200 MB/s` (Degraded NAND) |
| **Sequential SSD Read** | `~2,600 – 2,800 MB/s` | `1,800 – 2,200 MB/s` | `< 1,500 MB/s` |
| **Battery Health (System)**| `> 83%` | `79% – 82%` | `< 78%` or "Service Battery" |
| **Battery Cycles** | `150 – 550` | `550 – 750` | `< 25` (Fake/reset) or `> 800` |
| **Apple Diagnostics** | `ADP000` | — | Any code starting with `PPT`, `VDC`, `NDR` |

> [!NOTE]
> Unlike the base M2 MacBook Air, the base 256GB M1 Air uses **two 128GB NAND chips in parallel**, delivering full ~2,200 MB/s write speeds. If an M1 Air writes below 1,500 MB/s, investigate NAND health immediately using DriveDx.
