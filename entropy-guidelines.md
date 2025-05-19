# 🕯 Arcana Seed Lodge: Sovereign Seed Generation Protocol

**Arcana Seed Lodge** is an offline, Masonic-inspired tool for generating sovereign Bitcoin seed phrases through a symbolic rite. It combines **geographic memory**, **ritual glyphs**, and **deterministic cryptography** to create a BIP39-compliant mnemonic phrase. All operations are performed on airgapped systems, with no network exposure.

---

## 🧩 Protocol Overview

The user completes a ritual composed of:

1. **Six unique geolocations**  
   
   - Chosen within the **Southern United States**  
   - Encoded using **7-character geohashes**  
   - Must be **≥100km apart** from each other

2. **Four ritual symbols** (user-selected)  
   
   - Chosen from a **fixed set of 32 esoteric glyphs**
   - Serves as a deterministic passphrase component

3. **Four-symbol checksum** (auto-generated)  
   
   - Derived from the combination of locations and symbols  
   - **Does not add entropy**  
   - Used for **integrity verification**

The resulting data is hashed and converted into a **12- or 24-word BIP39 seed phrase**.

---

## 🔐 Entropy Analysis

| Component           | Count | Bits Each | Total Bits      | Notes                                            |
| ------------------- | ----- | --------- | --------------- | ------------------------------------------------ |
| Geohashes (7 chars) | 6     | ~30.7     | ~184.2 bits     | Adjusted for Southern US map constraint          |
| Ritual Symbols      | 4     | 5         | 20 bits         | 32-symbol set → log₂(32) = 5 bits each           |
| **Checksum**        | 4     | 0         | 0 bits          | Deterministic output; no entropy contribution    |
| **Total**           | —     | —         | **~204.2 bits** | Sufficient for 12-word seed (128-bit) and beyond |

> ✅ This setup exceeds BIP39's 128-bit requirement, with enough headroom to optionally derive 24-word seeds using standard BIP39 entropy extension logic.

---

## 📍 Geohash Logic

- Each geohash = 7 characters = 35 theoretical bits
- Adjusted to ~30.7 bits due to:
  - Limited geographic input range (Southern U.S.)
  - Exclusion of oceans/uninhabited zones

Geohashes are rejected if:

- They overlap within a **100km radius** of another
- They fall outside the defined map bounds

---

## 🧿 Symbolic Passphrase

Users select **4 out of 32 symbols**, each contributing 5 bits of entropy.

| ID  | Symbol Name            | Emoji | Meaning                     |
| --- | ---------------------- | ----- | --------------------------- |
| 00  | Square & Compass       | 🜃    | Masonic foundation          |
| 01  | All-Seeing Eye         | 👁️   | Divine watchfulness         |
| 02  | Beehive                | 🐝    | Industry and unity          |
| 03  | Trowel                 | 🧱    | Spreading harmony           |
| 04  | Gavel                  | 🔨    | Order and justice           |
| 05  | Pillar Jachin          | 🗿    | Strength                    |
| 06  | Bee                    | 🐝    | Wisdom and duality          |
| 07  | Sun                    | ☀️    | Light and truth             |
| 08  | Moon                   | 🌙    | Mystery and reflection      |
| 09  | Skull & Crossbones     | ☠️    | Mortality                   |
| 10  | Heart                  | ❤️    | Charity                     |
| 11  | Anchor                 | ⚓     | Hope and grounding          |
| 12  | Ark                    | 🛶    | Journey and preservation    |
| 13  | Ladder                 | 🪜    | Ascension                   |
| 14  | Acacia Branch          | 🌿    | Immortality                 |
| 15  | Blazing Star           | 🌟    | Divine guidance             |
| 16  | Book of Constitutions  | 📜    | Law and order               |
| 17  | Level                  | 📏    | Equality                    |
| 18  | Plumb Line             | 🧭    | Uprightness                 |
| 19  | Rough Ashlar           | 🪨    | Natural state               |
| 20  | Perfect Ashlar         | 🧱    | Perfection                  |
| 21  | 47th Problem of Euclid | 📐    | Geometry and knowledge      |
| 22  | Scythe                 | 🔪    | Time and harvest            |
| 23  | Hourglass              | ⏳     | Mortality's reminder        |
| 24  | Sword                  | 🗡️   | Protection                  |
| 25  | Snake                  | 🐍    | Wisdom and duality          |
| 26  | Turtle                 | 🐢    | Patience and resilience     |
| 27  | Horse                  | 🐎    | Strength and freedom        |
| 28  | Turkey                 | 🦃    | Sacrifice and land          |
| 29  | Crescent Moon          | 🌘    | Transformation              |
| 30  | Cross                  | ✝️    | Faith and sacrifice         |
| 31  | Pillar Boaz            | 🪨    | Establishment               |

These symbols may be replaced with your own **custom glyphs or ritual art**.

---

## 🔍 Checksum Logic

- Once all geohashes and symbols are chosen, a **4-symbol checksum** is calculated
- Derived from a deterministic hash of the full entropy input
- Used for:
  - **Watch-only validation**
  - **Anti-typo recovery**
  - **Ritual verification ritual**

> ⚠️ Checksum **does not increase security**—it verifies correctness.

---

## 🛡 Security Guidelines

- Use **personally significant but non-obvious** locations
- Avoid tourist landmarks, exact addresses, or known public sites
- Choose **symbols with deep personal resonance**
- Always generate seed **offline** (airgapped Raspberry Pi preferred)
- Do not store geohashes or mnemonic phrases in plaintext

---

## 💬 Example Output

```json
{
  "geohashes": ["bb8fwva", "dp3wtxy", "dn2c8d5", "dph2kpg", "dp3ujq9", "dp1m45v"],
  "symbols": ["👁️", "🐝", "🗿", "🪨"],
  "checksum": ["🌿", "📏", "⚓", "🐢"],
  "bip39_seed": "giraffe vapor silver ritual ..."
}
```
