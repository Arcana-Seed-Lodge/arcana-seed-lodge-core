🌍🗝️ Arcana Seed Lodge
A Bitcoin wallet experience shaped by memory, mystery, and map-based entropy.

![image](https://github.com/user-attachments/assets/4051caf8-dedb-496e-b251-1d541535dba8)



🔥 What is Arcana Seed Lodge?
Arcana Seed Lodge is a location-based Bitcoin wallet generator that lets you create secure, human-friendly seeds by selecting six meaningful locations on a map. It's wrapped in a retro-RPG aesthetic, complete with symbolic rituals and outlaw lore—but the story is optional.

⚡ TL;DR Features
🗺️ Generate deterministic Bitcoin seeds from 6 memorable places

🎮 Optional lore-driven story mode with Freemason vibes

🧾 Supports offline PSBT signing (Sparrow-compatible)

🔐 Built for privacy-first, device-free recovery

⚠️ Includes a demo wallet (not secure—just for testing)


🌀 Choose Your Path
From the title screen, users can decide to:

Enter Story: Begin the interactive memory ritual guided by mysterious figures from the Arcana Order.

Skip Story: Go straight to the demo wallet. (Useful for testing, but not secure for real funds.)


🧙 “The Rite of Twelve Segments Begins with Memory...”
![image](https://github.com/user-attachments/assets/185cf76b-9834-4c91-a82a-0be6388603f0)

Users entering the story will be guided through a symbolic journey with cryptic characters like Brother Alder Blackpaw. While this story mode adds flavor and memorability, it is entirely optional. Power users can skip it and go straight to the signing tool.


🌐 Pick Six Locations, Create One Seed
![image](https://github.com/user-attachments/assets/15c24241-1aa4-4dd4-83f0-e9bc5a3197bc)
Using a map-based UI, users select six personal locations. These are turned into geohashes, converted to entropy, and used to deterministically generate a BIP39-compatible seed.

Bonus: add an optional passphrase by selecting Freemason-inspired symbols.

The goal: Replace forgettable words with deeply memorable places and stories.


💼 Try the Wallet (Carefully)
![image](https://github.com/user-attachments/assets/8c29f757-ca2d-4478-9ba2-e9d3386b1230)

Once a seed is generated, users can:

View their xpub

Send/Receive via PSBT (with Sparrow Wallet)

Delete the seed

⚠️ Warning: The in-app wallet is only for demonstration. Treat it as hot and insecure—do not store real Bitcoin using the demo seed.

🛠️ Tech Stack
TypeScript + Vite for fast frontend dev

Tauri for secure, offline-first desktop apps

OpenStreetMap + Geohash for spatial entropy

All logic runs client-side—no server ever touches your seed

🎩 Inspiration
What can Jesse James teach us about Bitcoin self-custody?

We were inspired by tales of hidden treasure, outlaw cryptography, and Masonic secrecy. Just like the Knights of the Golden Circle buried gold with maps and riddles, Arcana Seed Lodge invites you to do the same—only now, with Bitcoin.

🧪 Demo & Source
🔗 GitHub Repo

🎥 Demo Video: https://www.youtube.com/watch?v=9HRkEo8TK3M
