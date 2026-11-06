# hyrox

[![Logo](https://raw.githubusercontent.com/Hyro03/logo-ai/main/baileys.jpg)](https://www.npmjs.com/package/hyrox)

<p align="center">
   HyroX merupakan fork Baileys v7 dengan dependencies yang tetap ringan. Project ini membawa perbaikan newsletter media upload, interactive messages, album support, serta dukungan untuk berbagai message type tambahan.
   <br><br>
   <a href="https://www.npmjs.com/package/hyrox">
      <img src="https://img.shields.io/npm/v/hyrox?style=for-the-badge&logo=npm"/>
   </a>
   <a href="https://www.npmjs.com/package/hyrox">
      <img src="https://img.shields.io/npm/dm/hyrox?style=for-the-badge&logo=npm"/>
   </a>
   <a href="https://github.com/hyroo-x/Hyrox">
      <img src="https://img.shields.io/github/stars/hyroo-x/Hyrox?style=for-the-badge&logo=github"/>
   </a>
   <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge"/>
   </a>
   <a href="https://nodejs.org">
      <img src="https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&labelColor=green&logoColor=white&style=for-the-badge"/>
   </a>
   <a href="https://bun.sh">
      <img src="https://img.shields.io/badge/bun-%3E%3D1.2-fbf0df?logo=bun&labelColor=14151a&logoColor=white&style=for-the-badge"/>
   </a>
   <a href="#">
      <img src="https://img.shields.io/badge/ESM-only?logo=javascript&labelColor=yellow&logoColor=black&style=for-the-badge"/>
   </a>
</p>

☕ For donation: [Saweria](https://saweria.co/hyro)

### 🧭 Daftar Isi

- [🧭 Daftar Isi](#-daftar-isi)
- [🚀 Fitur Unggulan](#-fitur-unggulan)
- [🔧 Perubahan Internal](#-perubahan-internal)
- [💬 Dukungan dan Kompatibilitas Pesan](#-dukungan-dan-kompatibilitas-pesan)
- [⚙️ Opsi Pesan Tambahan](#️-opsi-pesan-tambahan)
- [📦 Instalasi](#-instalasi)
  - [📥 Import (ESM & CJS)](#-import-esm--cjs)
  - [🔌 Menghubungkan ke WhatsApp](#-menghubungkan-ke-whatsapp)
  - [🔐 Authentication State](#-authentication-state)
- [🗄️ Implementasi Data Store](#️-implementasi-data-store)
- [🪪 Penjelasan WhatsApp ID](#-penjelasan-whatsapp-id)
- [📤 Mengirim Pesan](#-mengirim-pesan)
- [🖼️ Mengirim Media](#️-mengirim-media)
- [🎛️ Interactive Messages](#️-interactive-messages)
- [💳 Mengirim Pesan Pembayaran](#-mengirim-pesan-pembayaran)
- [🧰 Opsi Pesan Lainnya](#-opsi-pesan-lainnya)
- [🔄 Mengelola Pesan](#-mengelola-pesan)
- [🧩 Fitur Tambahan](#-fitur-tambahan)
- [🤖 Explore Bot](#-explore-bot)
- [🌿 Project Foundation](#-project-foundation)
- [🏅 Kredit dan Atribusi](#-kredit-dan-atribusi)

### 🚀 Fitur Unggulan

HyroX dirancang untuk production environment dengan mengutamakan code yang mudah dipahami, keamanan, dan workflow development yang lebih praktis.

- Tanpa obfuscation, sehingga code lebih mudah dibaca dan diaudit.
- Tidak ada perilaku auto-follow channel (newsletter).

> [!IMPORTANT]
> Sebagai informasi, HyroX bukan project original Baileys dan bukan dikelola oleh maintainer upstream. Full credit tetap diberikan kepada:
>
> https://github.com/WhiskeySockets/Baileys
>
> **Forking diperbolehkan, tetapi attribution, contributor credits, dan riwayat perubahan wajib tetap disertakan.**
>
> Terima kasih sudah menggunakan HyroX. 🤍

> [!NOTE]
> 📄 HyroX dikembangkan dengan scope tertentu dan tidak dimaksudkan untuk menggantikan Baileys upstream.
>
>

### 🔧 Perubahan Internal
- Memperbaiki masalah pengiriman media ke newsletter yang berasal dari issue pada upstream.
- Menghadirkan kembali [`makeInMemoryStore`](#️-implementasi-data-store) dengan penyesuaian ESM yang ringan agar kompatibel dengan Baileys v7.
- Mengubah eksekusi FFmpeg dari `exec` menjadi `spawn` untuk process handling yang lebih aman.
- Menambahkan [`@napi-rs/image`](https://www.npmjs.com/package/@napi-rs/image) sebagai backend image processing yang didukung melalui [`getImageProcessingLibrary()`](#%EF%B8%8F-image-processing), dengan mempertimbangkan performance dan compatibility.
- ◻️ Mengaktifkan kembali opsi `printQRInTerminal` pada `makeWASocket()`.
- Memindahkan signal transport ke implementasi berbasis Rust WASM.
- Mengurangi transitive dependencies dari 13 menjadi 2, dengan dukungan optional peer integrations.

### 💬 Dukungan dan Kompatibilitas Pesan
- Menambahkan dukungan untuk berbagai jenis message berikut:
   - 🖼️ [Album Message](#%EF%B8%8F-album-image--video)
   - 👤 [Group Status Message](#%E2%80%8D%E2%80%8D-group-status)
   - 👉🏻 [Interactive Message](#-sending-interactive-messages) (buttons, lists, native flows, templates, carousels).
   - 🎞️ [Status Mention Message](#%EF%B8%8F-status-mention)
   - 📦 [Sticker Pack Message](#-sticker-pack)
   - ✨ [Rich Response Message](#-rich-response)
   - 🧾 [Message with Code Blocks](#-message-with-code-block)
   - [🌏 Message with Inline Entities](#-message-with-inline-entities)
   - 📋 [Message with Table](#-message-with-table)
   - 💳 [Payment-related Message](#-sending-payment-messages) (payment requests, invites, orders, invoices).
- Mempermudah pengiriman pesan dengan ad thumbnail melalui [`externalAdReply`](#-external-ad-reply), tanpa perlu mengatur `contextInfo` secara manual.
- Menambahkan kemampuan untuk melakukan reply atau quote pada pesan di channel (newsletter).
- Mendukung penggunaan [custom button icon](#%EF%B8%8F-interactive) pada interactive message.

### ⚙️ Opsi Pesan Tambahan
- Menyediakan beberapa optional boolean flags untuk mengatur perilaku message:
   - 🤖 [`ai`](#-ai-icon) - Menampilkan AI icon pada pesan
   - 📣 [`mentionAll`](#-mention) - Mention seluruh peserta grup tanpa harus mencantumkan JID mereka di `mentions` atau `mentionedJid`
   - 🔧 [`ephemeral`](#-ephemeral), [`groupStatus`](#%E2%80%8D%E2%80%8D-group-status), [`isLottie`](#-lottie-sticker), [`spoiler`](#-spoiler), [`viewOnce`](#%EF%B8%8F-view-once), [`viewOnceV2`](#%EF%B8%8F-view-once-v2), [`viewOnceV2Extension`](#%EF%B8%8F-view-once-v2-extension), [`interactiveAsTemplate`](#%EF%B8%8F-interactive) - Message wrappers (pembungkus pesan)
   - 🔒 [`secureMetaServiceLabel`](#%EF%B8%8F-secure-meta-service-label) - Menampilkan secure meta service label pada pesan
   - 📄 [`raw`](#-raw) - Buat pesan secara manual **(JANGAN DIGUNAKAN UNTUK EKSPLOITASI)**

### 📦 Instalasi

Pilih salah satu metode berikut untuk menginstal `hyrox`.

- Melalui `package.json`

**NPM**
```json
{
  "dependencies": {
    "hyrox": "latest"
  }
}
```

**GitHub**
```json
{
  "dependencies": {
    "hyrox": "github:hyroo-x/Hyrox"
  }
}
```

- ⌨️ Melalui terminal

```bash
# NPM
npm i hyrox@latest

# GitHub
npm i github:hyroo-x/Hyrox
```

- Peer Dependencies (Dependensi Tambahan)
  - One of `@napi-rs/image@^1.12.0`, `jimp@^1.6.0`, or `sharp@>=0.33.0` is required for thumbnail generation and other image processing operations.
  - `better-sqlite3@>=11.0.0` is required for `useSqliteAuthState` when using Node.js versions below `22.13`.
  - `qr@>=0.5.0` is required for `printQRInTerminal`.
  - `ws@^8.13.0` is required when using Node.js versions below `22.0`.

- System Dependencies (Dependensi Sistem)
  - `ffmpeg` is required for video thumbnail extraction, audio waveform generation, and other media processing operations.
  - `ffprobe` is required for media metadata inspection (MediaInfo).

#### 📥 Import (ESM & CJS)

```javascript
// --- ESM
import { makeWASocket } from 'hyrox'

// --- CJS (tested and working on Node.js 24 ✅)
const { makeWASocket } = require('hyrox')
```

### 🔌 Menghubungkan ke WhatsApp

```javascript
import { makeWASocket, delay, DisconnectReason, useMultiFileAuthState } from 'hyrox'

// --- Connect with pairing code
const myPhoneNumber = '6288888888888'

const connectToWhatsApp = async () => {
   const { state, saveCreds } = await useMultiFileAuthState('session')

   const sock = makeWASocket({
      // Optional, "qr" must be installed
      printQRInTerminal: true,

      auth: state
   })

   sock.ev.on('creds.update', saveCreds)

   sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update
      if (qr && !sock.authState.creds.registered) {
         await delay(1500)
         const code = await sock.requestPairingCode(myPhoneNumber)
         console.log('🔗 Pairing code', ':', code)
      }
      else if (connection === 'close') {
         const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
         console.log('⚠️ Connection closed because', lastDisconnect.error, ', reconnecting ', shouldReconnect)
         if (shouldReconnect) {
            connectToWhatsApp()
         }
      }
      else if (connection === 'open') {
         console.log('✅ Successfully connected to WhatsApp')
      }
   })

   sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const message of messages) {
         if (!message.message) continue

         console.log('🔔 Got new message', ':', message)
         await sock.sendMessage(message.key.remoteJid, {
            text: '👋🏻 Hello world'
         })
      }
   })
}

connectToWhatsApp()
```

#### 🔐 Authentication State

```javascript
import {
   useMultiFileAuthState,
   useSingleFileAuthState,
   useSqliteAuthState
} from 'hyrox'
```

- `useMultiFileAuthState(folder?: string)`
   Metode ini menyimpan authentication credentials dan keys dalam beberapa file JSON di satu folder, sehingga cocok untuk pengelolaan session dengan format multi-file.

- `useSingleFileAuthState(fileName?: string)`
   Seluruh authentication credentials dan keys disimpan dalam satu file JSON agar session lebih mudah dikelola.

- `useSqliteAuthState(dbPath?: string, ownedDatabase?: object)`
   Menyimpan kredensial autentikasi dan keys dalam database SQLite. Tidak memerlukan dependency SQLite tambahan jika menggunakan Bun atau Node.js `>=22.13`. Untuk versi Node.js yang lebih lama, instal `better-sqlite3`.

### 🗄️ Implementasi Data Store

> [!CAUTION]
> Sangat disarankan untuk membuat data store sendiri, karena menyimpan seluruh riwayat chat di memory dapat menyebabkan penggunaan RAM yang berlebihan.

```javascript
import { makeWASocket, makeInMemoryStore, delay, DisconnectReason, useMultiFileAuthState } from 'hyrox'

const myPhoneNumber = '6288888888888'

// --- Create your store path
const storePath = './store.json'

const connectToWhatsApp = async () => {
   const { state, saveCreds } = await useMultiFileAuthState('session')

   const sock = makeWASocket({
      auth: state
   })

   const store = makeInMemoryStore({
      socket: sock
   })

   store.bind(sock.ev)

   sock.ev.on('creds.update', saveCreds)

   sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'connecting' && !sock.authState.creds.registered) {
         await delay(1500)
         const code = await sock.requestPairingCode(myPhoneNumber)
         console.log('🔗 Pairing code', ':', code)
      }
      else if (connection === 'close') {
         const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
         console.log('⚠️ Connection closed because', lastDisconnect.error, ', reconnecting ', shouldReconnect)
         if (shouldReconnect) {
            connectToWhatsApp()
         }
      }
      else if (connection === 'open') {
         console.log('✅ Successfully connected to WhatsApp')
      }
   })

   sock.ev.on('chats.upsert', () => {
      console.log('✉️ Got chats', store.chats.all())
   })

   sock.ev.on('contacts.upsert', () => {
      console.log('👥 Got contacts', Object.values(store.contacts))
   })

   // --- Read store from file
   store.readFromFile(storePath)

   // --- Save store every 3 minutes
   setInterval(() => {
      store.writeToFile(storePath)
   }, 180000)
}

connectToWhatsApp()
```

### 🪪 Penjelasan WhatsApp ID

`id` merupakan WhatsApp ID, yang juga dikenal sebagai `jid` atau `lid`, dari orang maupun grup tujuan pengiriman pesan.
- Format ID harus menggunakan `[country code][phone number]@s.whatsapp.net`
   - Contoh untuk pengguna: `19999999999@s.whatsapp.net` and `12699999999@lid`.
   - Untuk grup, format ID harus menggunakan `123456789-123345@g.us`.
- For Meta AI, it's `11111111111@bot`.
- For broadcast lists, it's `[timestamp of creation]@broadcast`.
- Untuk story, ID yang digunakan adalah `status@broadcast`.

### 📤 Mengirim Pesan

> [!NOTE]
> Kamu bisa mendapatkan `jid` dari `message.key.remoteJid` pada contoh pertama.

#### Text

```javascript
// --- Send a regular text message
sock.sendMessage(jid, {
   text: '👋🏻 Hello'
}, {
   quoted: message
})

// --- Send a text message with a link preview
const urlA = 'https://www.npmjs.com/package/hyrox'

sock.sendMessage(jid, {
   text: urlA + ' 👆🏻 Check it out!',
   linkPreview: {
      'matched-text': urlA,
      title: '🌱 hyrox',
      description: 'Underrated Baileys Fork',
      previewType: 0, // --- Use 1 for video playback in the link preview
      jpegThumbnail: fs.readFileSync('./path/to/image.jpg')
   }
})

// --- Send a text message with a large link preview and favicon
import { prepareWAMessageMedia } from 'hyrox'

const urlB = 'https://www.npmjs.com/package/hyrox#readme'

const { imageMessage: image } = await prepareWAMessageMedia({
   image: {
      url: './path/to/image.jpg'
   }
}, {
   upload: sock.waUploadToServer,
   mediaTypeOverride: 'thumbnail-link'
})

// --- Set the thumbnail display size
image.height = 720
image.width = 480

sock.sendMessage(jid, {
   text: urlB + ' 👆🏻 Check it out!',
   linkPreview: {
      'matched-text': urlB,
      title: '🌱 hyrox',
      description: 'Underrated Baileys Fork',
      previewType: 0,
      jpegThumbnail: fs.readFileSync('./path/to/image.jpg'),
      highQualityThumbnail: image,
      linkPreviewMetadata: {
         linkMediaDuration: 0, // --- Duration in seconds (for video/audio content)
         socialMediaPostType: 1, // --- Enum: 0 = NONE, 1 = REEL, 2 = LIVE_VIDEO, 3 = LONG_VIDEO, 4 = SINGLE_IMAGE, 5 = CAROUSEL
      } // --- Additional metadata for large link preview
   },
   favicon: {
      url: './path/to/tiny-image.ico'
   }
})
```

#### Mention

```javascript
// --- Regular mention
sock.sendMessage(jid, {
   text: '👋🏻 Hello @628123456789',
   mentions: ['628123456789@s.whatsapp.net']
}, {
   quoted: message
})

// --- Mention all
sock.sendMessage(jid, {
   text: '👋🏻 Hello @all',
   mentionAll: true
}, {
   quoted: message
})
```

#### Reaction

```javascript
sock.sendMessage(jid, {
   react: {
      key: message.key,
      text: '✨'
   }
})
```

#### Pin Message

```javascript
sock.sendMessage(jid, {
   pin: message.key,
   time: 86400, // --- Set the value in seconds: 86400 (1d), 604800 (7d), or 2592000 (30d)
   type: 1 // --- Or 2 to remove
})
```

#### Keep Chat

> [!NOTE]
> Keep Chat hanya dapat digunakan pada chat atau grup yang mengaktifkan fitur disappearing messages.

```javascript
sock.sendMessage(jid, {
   keep: message.key,
   type: 1 // --- Or 2 to remove
})
```

#### Forward Message

```javascript
sock.sendMessage(jid, {
   forward: message,
   force: true // --- Optional
})
```

#### Contact

```javascript
const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + 'FN:Lia Wynn\n'
            + 'ORG:Waitress;\n'
            + 'TEL;type=CELL;type=VOICE;waid=628123456789:+62 8123 4567 89\n'
            + 'END:VCARD'

sock.sendMessage(jid, {
   contacts: {
      displayName: 'Lia Wynn',
      contacts: [
         { vcard }
      ]
   }
}, {
   quoted: message
})
```

#### Location

```javascript
sock.sendMessage(jid, {
   location: {
      degreesLatitude: 24.121231,
      degreesLongitude: 55.1121221,
      name: '👋🏻 I am here'
   }
}, {
   quoted: message
})
```

#### Event

```javascript
sock.sendMessage(jid, {
   event: {
      name: '🎶 Meet & Mingle Party',
      description: 'Meet & Mingle Party is a fun, casual gathering to connect, chat, and build new relationships within the community.',
      call: 'audio', // --- Or "video", this field is optional
      startDate: new Date(Date.now() + 3600000),
      endDate: new Date(Date.now() + 28800000),
      isCancelled: false, // --- Optional
      isScheduleCall: false, // --- Optional
      extraGuestsAllowed: false, // --- Optional
      location: {
         name: 'Jakarta',
         degreesLatitude: -6.2,
         degreesLongitude: 106.8
      }
   }
}, {
   quoted: message
})
```

#### Group Invite

```javascript
const inviteCode = groupUrl
   .split('chat.whatsapp.com/')[1]
   ?.split('?')[0]

const groupJid = '1201111111111@g.us'
const groupName = 'hyrox'

sock.sendMessage(jid, {
   groupInvite: {
      inviteCode,
      inviteExpiration: Date.now() + 86400000,
      text: '👋🏻 Hello, we invite you to join our group.',
      jid: groupJid,
      subject: groupName,
   }
}, {
   quoted: message
})
```

#### Product

```javascript
import { randomUUID } from 'crypto'

sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   body: '👋🏻 Check my product here!',
   footer: 'hyrox',
   product: {
      currencyCode: 'IDR',
      description: '🛍️ Interesting product!',
      priceAmount1000: 70_000_000,
      productId: randomUUID(),
      productImageCount: 1,
      salePriceAmount1000: 65_000_000,
      signedUrl: 'https://www.npmjs.com/package/hyrox',
      title: '📦 Starseed (Premium)',
      url: 'https://www.npmjs.com/package/hyrox'
   },
   businessOwnerJid: '0@s.whatsapp.net'
})
```

#### Poll

```javascript
// --- Regular poll message
sock.sendMessage(jid, {
   poll: {
      name: '🔥 Voting time',
      values: ['Yes', 'No'],
      selectableCount: 1,
      toAnnouncementGroup: false,
      endDate: new Date(Date.now() + 28800000), // --- Optional
      hideVoter: false, // --- Optional
      canAddOption: false // --- Optional
   }
}, {
   quoted: message
})

// --- Quiz (only for newsletter)
sock.sendMessage('1211111111111@newsletter', {
   poll: {
      name: '🔥 Quiz',
      values: ['Yes', 'No'],
      correctAnswer: 'Yes',
      pollType: 1
   }
}, {
   quoted: message
})

// --- Poll result
sock.sendMessage(jid, {
   pollResult: {
      name: '📝 Poll Result',
      votes: [{
         name: 'Nice',
         voteCount: 10
      }, {
         name: 'Nah',
         voteCount: 2
      }],
      pollType: 0 // Or 1 for quiz
   }
}, {
   quoted: message
})

// --- Poll update
sock.sendMessage(jid, {
   pollUpdate: {
      metadata: {},
      key: message.key,
      vote: {
         enclv: /* <Buffer> */,
         encPayload: /* <Buffer> */
      }
   }
}, {
   quoted: message
})
```

#### Button Response

```javascript
// --- Using buttonsResponseMessage
sock.sendMessage(jid, {
   type: 'plain',
   buttonReply: {
      id: '#Menu',
      displayText: '✨ Interesting Menu'
   }
}, {
   quoted: message
})

// --- Using interactiveResponseMessage
sock.sendMessage(jid, {
   flowReply: {
      format: 0,
      text: '💭 Response',
      name: 'menu_options',
      paramsJson: JSON.stringify({
         id: '#Menu',
         description: '✨ Interesting Menu'
      })
   }
}, {
   quoted: message
})

// --- Using listResponseMessage
sock.sendMessage(jid, {
   listReply: {
      title: '📄 See More',
      description: '✨ Interesting Menu',
      id: '#Menu'
   }
}, {
   quoted: message
})

// --- Using templateButtonReplyMessage
sock.sendMessage(jid, {
   type: 'template',
   buttonReply: {
      id: '#Menu',
      displayText: '✨ Interesting Menu',
      index: 1
   }
}, {
   quoted: message
})
```

#### Rich Response

#### 🧱 AiRich Builder

AiRich Builder is a helper designed to make creating **AI Rich Response** easier and more flexible. You can combine multiple message elements using a single builder without manually constructing the `richResponse` structure.

**Supported Elements:**
- Text content
- Code block with syntax highlighting
- Table
- Multiple elements in a single Rich Response

**Example Usage:**

```javascript
const rich = new AiRich()

rich
   .addText("Hello from HyroX!")
   .addCode('console.log("Hello World")', "javascript")
   .addTable([
      ["Name", "Version"],
      ["HyroX", "7.x"]
   ])

await sock.sendMessage(jid, {
   richResponse: rich.build()
})
```

AiRich Builder makes Rich Response creation simpler, cleaner, and easier to manage.


> [!NOTE]
> `richResponse[]` merupakan representasi dari [`submessages[]`](https://baileys.wiki/docs/api/namespaces/proto/interfaces/IAIRichResponseSubMessage) di dalam `richResponseMessage`.

> [!TIP]
> Kamu juga tetap bisa menggunakan field [`submessages[]`](https://baileys.wiki/docs/api/namespaces/proto/interfaces/IAIRichResponseSubMessage) asli secara langsung.
> Contoh kode di bawah hanya menunjukkan implementasi menggunakan helper, bukan struktur yang wajib digunakan.

```javascript
sock.sendMessage(jid, {
   disclaimerText: 'RAW submessages structure example',
   richResponse: [{
      text: 'Example Usage',
   }, {
      language: 'javascript',
      code: [{
         highlightType: 0,
         codeContent: 'console.log("Hello, World!")'
      }]
   }, {
      text: 'Pretty simple, right?\n'
   }, {
      text: 'Comparison between Node.js, Bun, and Deno',
   }, {
      title: 'Runtime Comparison',
      table: [{
         isHeading: true,
         items: ['', 'Node.js', 'Bun', 'Deno']
      }, {
         isHeading: false,
         items: ['Engine', 'V8 (C++)', 'JavaScriptCore (C++)', 'V8 (C++)']
      }, {
         isHeading: false,
         items: ['Performance', '4/5', '5/5', '4/5']
      }]
   }, {
      text: 'Does this help clarify the differences?'
   }]
})
```

> [!TIP]
> Kamu bisa menambahkan syntax highlighting dengan mudah melalui import `tokenizeCode` langsung dari Baileys.

```javascript
import { tokenizeCode } from 'hyrox'

const language = 'javascript'
const code = 'console.log("Hello, World!")'

sock.sendMessage(jid, {
   disclaimerText: 'Example of tokenizing Code Block',
   richResponse: [{
      text: 'Example Usage',
   }, {
      language,
      code: tokenizeCode(code, language)
   }, {
      text: 'Pretty simple, right?'
   }]
})
```

> 💡 Bahasa yang Didukung: `css`, `html`, `javascript`, `typescript`, `python`, `golang`, `rust`, `c`, `c#`, `c++`, `bash`, `bat`, `powershell`.

#### Message with Code Block

> [!NOTE]
> Fitur ini sudah dilengkapi tokenizer bawaan melalui `tokenizeCode`.

```javascript
sock.sendMessage(jid, {
   disclaimerText: 'Code Block',
   headerText: '## Example Usage',
   contentText: '---',
   code: 'console.log("Hello, World!")',
   language: 'javascript',
   footerText: 'Pretty simple, right?'
})
```

#### Message with Inline Entities

```javascript
sock.sendMessage(jid, {
   disclaimerText: 'Inline Entities',
   headerText: '## Check Out!',
   contentText: '---',
   links: [{
      text: '1. Google',
      title: 'Popular Search Engine',
      url: 'https://www.google.com/'
   }, {
      text: '2. YouTube',
      title: 'Popular Streaming Platform',
      url: 'https://www.youtube.com/'
   }, {
      text: '3. Modded Baileys',
      title: 'Underrated Baileys Fork',
      url: 'https://www.npmjs.com/package/hyrox'
   }],
   footerText: '---'
})
```

#### Message with Table

```javascript
sock.sendMessage(jid, {
   disclaimerText: 'Table',
   headerText: '## Comparison between Node.js, Bun, and Deno',
   contentText: '---',
   title: 'Runtime Comparison',
   table: [
      ['', 'Node.js', 'Bun', 'Deno'],
      ['Engine', 'V8 (C++)', 'JavaScriptCore (C++)', 'V8 (C++)'],
      ['Performance', '4/5', '5/5', '4/5']
   ],
   noHeading: false, // --- Optional
   footerText: 'Does this help clarify the differences?'
})
```

#### Status Mention

```javascript
sock.sendMessage([jidA, jidB, jidC], {
   text: 'Hello! 👋🏻'
})
```

### 🖼️ Mengirim Media

> [!NOTE]
> Untuk mengirim pesan media, kamu bisa menggunakan `Buffer` secara langsung atau object dengan `{ stream: Readable }` maupun `{ url: string }` (path file lokal atau URL HTTP/HTTPS).

#### Image

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '🔥 Superb'
}, {
   quoted: message
})
```

#### Video

```javascript
sock.sendMessage(jid, {
   video: {
      url: './path/to/video.mp4'
   },
   gifPlayback: false, // --- Set true if you want to send video as GIF
   ptv: false,  // --- Set true if you want to send video as PTV
   caption: '🔥 Superb'
}, {
   quoted: message
})
```

#### Sticker

```javascript
sock.sendMessage(jid, {
   sticker: {
      url: './path/to/sticker.webp'
   }
}, {
   quoted: message
})
```

#### Audio

```javascript
sock.sendMessage(jid, {
   audio: {
      url: './path/to/audio.mp3'
   },
   ptt: false // --- Set true if you want to send audio as Voice Note
}, {
   quoted: message
})
```

#### Document

```javascript
sock.sendMessage(jid, {
   document: {
      url: './path/to/document.pdf'
   },
   mimetype: 'application/pdf',
   caption: '✨ My work!'
}, {
   quoted: message
})
```

#### Album (Image & Video)

```javascript
sock.sendMessage(jid, {
   album: [{
      image: {
         url: './path/to/image.jpg'
      },
      caption: '1st image'
   }, {
      video: {
         url: './path/to/video.mp4'
      },
      caption: '1st video'
   }, {
      image: {
         url: './path/to/image.jpg'
      },
      caption: '2nd image'
   }, {
      video: {
         url: './path/to/video.mp4'
      },
      caption: '2nd video'
   }]
}, {
   quoted: message
})
```

#### Sticker Pack

> [!IMPORTANT]
> Jika `sharp` atau `@napi-rs/image` belum terinstal, `cover` dan `stickers` harus sudah menggunakan format WebP.

```javascript
sock.sendMessage(jid, {
   cover: {
      url: './path/to/image.webp'
   },
   stickers: [{
      data: {
         url: './path/to/image.webp'
      }
   }, {
      data: {
         url: './path/to/image.webp'
      }
   }, {
      data: {
         url: './path/to/image.webp'
      }
   }],
   name: '📦 My Sticker Pack',
   publisher: '🌟 Lia Wynn',
   description: 'hyrox'
}, {
   quoted: message
})
```

### 🎛️ Interactive Messages

#### Buttons

```javascript
// --- Regular buttons message
sock.sendMessage(jid, {
   text: '👆🏻 Buttons!',
   footer: 'hyrox',
   buttons: [{
      text: '👋🏻 SignUp',
      id: '#SignUp'
   }]
}, {
   quoted: message
})

// --- Buttons with Media & Native Flow
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👆🏻 Buttons and Native Flow!',
   footer: 'hyrox',
   buttons: [{
      text: '👋🏻 Rating',
      id: '#Rating'
   }, {
      text: '📋 Select',
      sections: [{
         title: '✨ Section 1',
         rows: [{
            header: '',
            title: '💭 Secret Ingredient',
            description: '',
            id: '#SecretIngredient'
         }]
      }, {
         title: '✨ Section 2',
         highlight_label: '🔥 Popular',
         rows: [{
            header: '',
            title: '🏷️ Coupon',
            description: '',
            id: '#CouponCode'
         }]
      }]
   }]
}, {
   quoted: message
})
```

#### List

> [!NOTE]
> Fitur ini hanya bisa digunakan di private chat (`@s.whatsapp.net`).

```javascript
sock.sendMessage(jid, {
   text: '📋 List!',
   footer: 'hyrox',
   buttonText: '📋 Select',
   title: '👋🏻 Hello',
   sections: [{
      title: '🚀 Menu 1',
      rows: [{
         title: '✨ AI',
         description: '',
         rowId: '#AI'
      }]
   }, {
      title: '🌱 Menu 2',
      rows: [{
         title: '🔍 Search',
         description: '',
         rowId: '#Search'
      }]
   }]
}, {
   quoted: message
})
```

#### Interactive

```javascript
// --- Native Flow
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '🗄️️ Interactive!',
   footer: 'hyrox',
   optionText: '👉🏻 Select Options', // --- Optional, wrap all native flow into a single list
   optionTitle: '📄 Select Options', // --- Optional
   offerText: '🏷️ Newest Coupon!', // --- Optional, add an offer into message
   offerCode: 'hyrox', // --- Optional
   offerUrl: 'https://www.npmjs.com/package/hyrox', // --- Optional
   offerExpiration: Date.now() + 3_600_000, // --- Optional
   nativeFlow: [{
      text: '👋🏻 Greeting',
      id: '#Greeting',
      icon: 'review' // --- Optional
   }, {
      text: '📞 Call',
      call: '628123456789'
   }, {
      text: '📋 Copy',
      copy: 'hyrox'
   }, {
      text: '🌐 Source',
      url: 'https://www.npmjs.com/package/hyrox',
      useWebview: true // --- Optional
   }, {
      text: '📋 Select',
      sections: [{
         title: '✨ Section 1',
         rows: [{
            header: '',
            title: '🏷️ Coupon',
            description: '',
            id: '#CouponCode'
         }]
      }, {
         title: '✨ Section 2',
         highlight_label: '🔥 Popular',
         rows: [{
            header: '',
            title: '💭 Secret Ingredient',
            description: '',
            id: '#SecretIngredient'
         }]
      }],
      icon: 'default' // --- Optional
   }],
   interactiveAsTemplate: false, // --- Optional, wrap the interactive message into a template
}, {
   quoted: message
})

// --- Carousel & Native Flow
sock.sendMessage(jid, {
   text: '🗂️ Interactive with Carousel!',
   footer: 'hyrox',
   cards: [{
      image: {
         url: './path/to/image.jpg'
      },
      caption: '🖼️ Image 1',
      footer: '🏷️️ Pinterest',
      nativeFlow: [{
         text: '🌐 Source',
         url: 'https://www.npmjs.com/package/hyrox',
         useWebview: true
      }]
   }, {
      image: {
         url: './path/to/image.jpg'
      },
      caption: '🖼️ Image 2',
      footer: '🏷️ Pinterest',
      offerText: '🏷️ New Coupon!',
      offerCode: 'hyrox',
      offerUrl: 'https://www.npmjs.com/package/hyrox',
      offerExpiration: Date.now() + 3_600_000,
      nativeFlow: [{
         text: '🌐 Source',
         url: 'https://www.npmjs.com/package/hyrox'
      }]
   }, {
      image: {
         url: './path/to/image.jpg'
      },
      caption: '🖼️ Image 3',
      footer: '🏷️ Pinterest',
      optionText: '👉🏻 Select Options',
      optionTitle: '👉🏻 Select Options',
      offerText: '🏷️ New Coupon!',
      offerCode: 'hyrox',
      offerUrl: 'https://www.npmjs.com/package/hyrox',
      offerExpiration: Date.now() + 3_600_000,
      nativeFlow: [{
         text: '🛒 Product',
         id: '#Product',
         icon: 'default'
      }, {
         text: '🌐 Source',
         url: 'https://www.npmjs.com/package/hyrox'
      }]
   }]
}, {
   quoted: message
})

// --- Native Flow with Audio in the Footer
sock.sendMessage(jid, {
   text: '🔈 Music in the footer!',
   audioFooter: {
      url: './path/to/audio.mp3'
   }, // --- Like other media upload methods, buffers and streams are supported
   nativeFlow: [{
      text: '👍🏻 Good, next',
      id: '#Next',
      icon: 'review'
   }, {
      text: '👎🏻 Skip',
      id: '#Skip',
      icon: 'default'
   }]
}, {
   quoted: message
})
```

#### Hydrated Template

```javascript
sock.sendMessage(jid, {
   title: '👋🏻 Hello',
   image: {
      url: './path/to/image.jpg'
   },
   caption: '🫙 Template!',
   footer: 'hyrox',
   templateButtons: [{
      text: '👉🏻 Tap Here',
      id: '#Order'
   }, {
      text: '🌐 Source',
      url: 'https://www.npmjs.com/package/hyrox'
   }, {
      text: '📞 Call',
      call: '628123456789'
   }]
}, {
   quoted: message
})
```

### 💳 Mengirim Pesan Pembayaran

#### Invite Payment

```javascript
sock.sendMessage(jid, {
   paymentInviteServiceType: 3 // 1, 2, or 3
})
```

#### Invoice

> [!NOTE]
> Invoice message saat ini belum didukung.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   invoiceNote: '🏷️ Invoice'
})
```

#### Order

```javascript
sock.sendMessage(chat, {
   orderText: '🛍️ Order',
   thumbnail: fs.readFileSync('./path/to/image.jpg') // --- Harus menggunakan format Buffer
}, {
   quoted: message
})
```

#### Request Payment

```javascript
sock.sendMessage(jid, {
   text: '💳 Request Payment',
   requestPaymentFrom: '0@s.whatsapp.net'
})
```

### 🧰 Opsi Pesan Lainnya

#### AI Icon

> [!NOTE]
> Fitur ini hanya bisa digunakan di private chat (`@s.whatsapp.net`).

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '🤖 With AI icon!',
   ai: true
}, {
   quoted: message
})
```

#### Ephemeral

> [!NOTE]
> Membungkus message ke dalam `ephemeralMessage`.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👁️ Ephemeral',
   ephemeral: true
})
```

#### 📰 External Ad Reply

> [!NOTE]
> Menambahkan thumbnail iklan ke message (tampilan bisa berbeda pada beberapa versi WhatsApp).

```javascript
sock.sendMessage(jid, {
   text: '📰 External Ad Reply',
   externalAdReply: {
      title: '📝 Did you know?',
      body: '❓ I dont know',
      thumbnail: fs.readFileSync('./path/to/image.jpg'), // --- Harus menggunakan format Buffer
      largeThumbnail: false, // --- Gunakan true untuk thumbnail yang lebih besar
      url: 'https://www.npmjs.com/package/hyrox' // --- Optional, digunakan untuk internal thumbnail caching WhatsApp dan direct URL
   }
}, {
   quoted: message
})
```

#### 👥 Group Status

> [!NOTE]
> Fitur ini hanya bisa digunakan di group chat (`@g.us`).

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👥 Group Status!',
   groupStatus: true
})
```

#### 🎞️ Lottie Sticker

> [!NOTE]
> Membungkus message ke dalam `lottieStickerMessage`.

```javascript
sock.sendMessage(jid, {
   sticker: {
      url: './path/to/sticker.webp'
   },
   isLottie: true
})
```

#### 🧩 Raw Message

```javascript
sock.sendMessage(jid, {
   extendedTextMessage: {
      text: '📃 Dibuat secara manual menggunakan raw WhatsApp proto structure',
      contextInfo: {
         externalAdReply: {
            title: 'hyrox',
            thumbnail: fs.readFileSync('./path/to/image.jpg'),
            sourceApp: 'whatsapp',
            showAdAttribution: true,
            mediaType: 1
         }
      }
   },
   raw: true
}, {
   quoted: message
})
```

#### 🏷️ Secure Meta Service Label

```javascript
sock.sendMessage(jid, {
   text: '🏷️ Just a label!',
   secureMetaServiceLabel: true
})
```

#### ❔ Spoiler

> [!NOTE]
> Membungkus message ke dalam `spoilerMessage`.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '❔ Spoiler',
   spoiler: true
})
```

#### 👁️ View Once

> [!NOTE]
> Membungkus message ke dalam `viewOnceMessage`.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👁️ View Once',
   viewOnce: true
})
```

#### 👁️ View Once V2

> [!NOTE]
> Membungkus message ke dalam `viewOnceMessageV2`.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👁️ View Once V2',
   viewOnceV2: true
})
```

#### 👁️ View Once V2 Extension

> [!NOTE]
> Membungkus message ke dalam `viewOnceMessageV2Extension`.

```javascript
sock.sendMessage(jid, {
   image: {
      url: './path/to/image.jpg'
   },
   caption: '👁️ View Once V2 Extension',
   viewOnceV2Extension: true
})
```

### 🔄 Mengelola Pesan

#### 🗑️ Menghapus Pesan

```javascript
sock.sendMessage(jid, {
   delete: message.key
})
```

#### ✏️ Mengedit Pesan

```javascript
// --- Edit plain text message
sock.sendMessage(jid, {
   text: '✨ I mean, nice!',
   edit: message.key
})

// --- Edit caption pada media message
sock.sendMessage(jid, {
   caption: '✨ I mean, here is the image!',
   edit: message.key
})
```

### 🧩 Fitur Tambahan

#### 🔎 Find User ID (JID|PN/LID)

> [!NOTE]
> ID hanya boleh berisi angka (tanpa +, (), atau -) dan harus menyertakan kode negara sesuai format WhatsApp ID.

```javascript
// --- PN (Phone Number)
const phoneNumber = '6281111111111@s.whatsapp.net'

const ids = await sock.findUserId(phoneNumber)

console.log('🏷️ Got user ID', ':', ids)

// --- LID (Local Identifier)
const lid = '43411111111111@lid'

const ids = await sock.findUserId(lid)

console.log('🏷️ Got user ID', ':', ids)

// --- Output
// {
//    phoneNumber: '6281111111111@s.whatsapp.net',
//    lid: '43411111111111@lid'
// }
// --- Output jika proses gagal
// {
//    phoneNumber: '6281111111111@s.whatsapp.net',
//    lid: undefined
// }
// --- Format output tetap sama untuk semua tipe input
```

#### 🔐 Request Custom Pairing Code

> [!NOTE]
> Nomor telepon hanya boleh berisi angka (tanpa +, (), atau -) dan harus menyertakan kode negara.

```javascript
const phoneNumber = '6281111111111'
const customPairingCode = 'STARFALL'

await sock.requestPairingCode(phoneNumber, customPairingCode)

console.log('🔗 Pairing code', ':', customPairingCode)
```

#### 🖼️ Image Processing

> [!NOTE]
> Automatically use available image processing library: `sharp`, `@napi-rs/image`, or `jimp`

```javascript
import { getImageProcessingLibrary } from 'hyrox'
import { readFile } from 'fs/promises'

const lib = await getImageProcessingLibrary()

const bufferOrFilePath = './path/to/image.jpg'
const width = 512

let output

// --- If sharp installed
if (lib.sharp?.default) {
   const img = lib.sharp.default(bufferOrFilePath)

   output = await img.resize(width)
      .jpeg({ quality: 80 })
      .toBuffer()
}

// --- If @napi-rs/image installed
else if (lib.image?.Transformer) {
   // --- Harus menggunakan format Buffer
   const inputBuffer = Buffer.isBuffer(bufferOrFilePath)
      ? bufferOrFilePath
      : await readFile(bufferOrFilePath)

   const img = new lib.image.Transformer(inputBuffer)

   output = await img.resize(width, undefined, 0)
      .jpeg(50)
}

// --- If jimp installed
else if (lib.jimp?.Jimp) {
   const img = await lib.jimp.Jimp.read(bufferOrFilePath)

   output = await img
      .resize({ w: width, mode: lib.jimp.ResizeStrategy.BILINEAR })
      .getBuffer('image/jpeg', { quality: 50 })
}

// --- Fallback
else {
   throw new Error('No image processing available')
}

console.log('✅ Process completed!')
console.dir(output, { depth: null })
```

#### 📣 Newsletter Management

```javascript
// --- Membuat yang baru
sock.newsletterCreate('hyrox', '📣 Fresh updates weekly')

// --- Mengambil informasi
const metadata = sock.newsletterMetadata('1231111111111@newsletter')
console.dir(metadata, { depth: null })

// --- Mengambil jumlah subscribers
const subscribers = await sock.newsletterSubscribers('1231111111111@newsletter')
console.dir(subscribers, { depth: null })

// --- Follow dan unfollow newsletter
sock.newsletterFollow('1231111111111@newsletter')
sock.newsletterUnfollow('1231111111111@newsletter')

// --- Mute dan unmute newsletter
sock.newsletterMute('1231111111111@newsletter')
sock.newsletterUnmute('1231111111111@newsletter')

// --- Menurunkan role admin
sock.newsletterDemote('1231111111111@newsletter', '6281111111111@s.whatsapp.net')

// --- Mengubah owner
sock.newsletterChangeOwner('1231111111111@newsletter', '6281111111111@s.whatsapp.net')

// --- Memperbarui newsletter
sock.newsletterUpdate('1231111111111@newsletter', { name: 'hyrox' })

// --- Mengubah nama
sock.newsletterUpdateName('1231111111111@newsletter', '📦 hyrox')

// --- Mengubah deskripsi
sock.newsletterUpdateDescription('1231111111111@newsletter', '📣 Fresh updates weekly')

// --- Mengubah foto
sock.newsletterUpdatePicture('1231111111111@newsletter', {
   url: 'path/to/image.jpg'
})

// --- Menghapus foto
sock.newsletterRemovePicture('1231111111111@newsletter')

// --- Memberikan reaction pada message
sock.newsletterReactMessage('1231111111111@newsletter', '100', '💛')

// --- Mengambil jumlah admin
const count = await sock.newsletterAdminCount('1231111111111@newsletter')

// --- Mengambil semua newsletter yang diikuti
const newsletters = await sock.newsletterSubscribed()
console.dir(newsletters, { depth: null })

// --- Mengambil pesan newsletter
const messages = sock.newsletterFetchMessages('jid', '1231111111111@newsletter', 50, 0, 0)
console.dir(messages, { depth: null })

// --- Menghapus newsletter
sock.newsletterDelete('1231111111111@newsletter')
```

#### 👥 Group Management

```javascript
// --- Membuat group baru dan menambahkan participants menggunakan JID
const group = sock.groupCreate('hyrox', ['628123456789@s.whatsapp.net'])
console.dir(group, { depth: null })

// --- Mengambil informasi
const metadata = await sock.groupMetadata(jid)
console.dir(metadata, { depth: null })

// --- Mengambil kode undangan group
const inviteCode = await sock.groupInviteCode(jid)
console.dir(inviteCode, { depth: null })


// --- Membatalkan invite link
sock.groupRevokeInvite(jid)

// --- Menerima undangan group
sock.groupAcceptInvite(inviteCode)

// --- Keluar dari group
sock.groupLeave(jid)

// --- Menambahkan participants
sock.groupParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'add')

// --- Menghapus participants
sock.groupParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'remove')

// --- Mengangkat participant menjadi admin
sock.groupParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'promote')

// --- Menurunkan role admin participant
sock.groupParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'demote')

// --- Menerima join request
sock.groupRequestParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'approve')

// --- Mengubah nama
sock.groupUpdateSubject(jid, '📦 hyrox')

// --- Mengubah deskripsi
sock.groupUpdateDescription(jid, 'Updated description')

// --- Mengubah foto
sock.updateProfilePicture(jid, {
   url: 'path/to/image.jpg'
})

// --- Menghapus foto
sock.removeProfilePicture(jid)

// --- Mengatur agar hanya admin yang bisa mengirim pesan
sock.groupSettingUpdate(jid, 'announcement')

// --- Mengizinkan semua participant mengirim pesan
sock.groupSettingUpdate(jid, 'not_announcement')

// --- Hanya admin yang bisa mengubah info group
sock.groupSettingUpdate(jid, 'locked')

// --- Semua participant bisa mengubah info group
sock.groupSettingUpdate(jid, 'unlocked')

// --- Hanya admin yang bisa menambahkan participants
sock.groupMemberAddMode(jid, 'admin_add')

// --- Semua participants bisa menambahkan anggota
sock.groupMemberAddMode(jid, 'all_member_add')

// --- Mengaktifkan atau menonaktifkan temporary messages menggunakan satuan detik
sock.groupToggleEphemeral(jid, 86400)

// --- Menonaktifkan temporary messages
sock.groupToggleEphemeral(jid, 0)

// --- Mengaktifkan atau menonaktifkan membership approval
sock.groupJoinApprovalMode(jid, 'on')
sock.groupJoinApprovalMode(jid, 'off')

// --- Mengambil metadata semua group
const groups = await sock.groupFetchAllParticipating()
console.dir(groups, { depth: null })

// --- Mengambil daftar join request yang menunggu
const requests = await sock.groupRequestParticipantsList(jid)
console.dir(requests, { depth: null })

// --- Mengambil informasi group dari invite link
const group = await sock.groupGetInviteInfo('ABC123456789')
console.log('👥 Got group info from invite code', ':', group)

// --- Memperbarui label member bot
sock.updateMemberLabel(jid, 'hyrox')
```

#### 🌐 Community Management

```javascript
// --- Membuat community baru sekaligus menambahkan deskripsi
const community = await sock.communityCreate('hyrox', '📣 Fresh updates weekly')
console.dir(community, { depth: null })

// --- Membuat subgroup dan menambahkan participants menggunakan JID
const group = await sock.communityCreateGroup('📢 Announcements', ['628123456789@s.whatsapp.net'], communityJid)

// --- Menghubungkan group yang sudah ada
sock.communityLinkGroup(groupJid, communityJid)

// --- Memutuskan hubungan group dari community
sock.communityUnlinkGroup(groupJid, communityJid)

// --- Mengambil informasi
const metadata = await sock.communityMetadata(jid)
console.dir(metadata, { depth: null })

// --- Mengambil kode undangan community
const inviteCode = await sock.communityInviteCode(jid)
console.dir(inviteCode, { depth: null })

// --- Membatalkan invite link
sock.communityRevokeInvite(jid)

// --- Menerima undangan community
sock.communityAcceptInvite(inviteCode)

// --- Keluar dari community
sock.communityLeave(jid)

// --- Menerima join request
sock.communityRequestParticipantsUpdate(jid, ['628123456789@s.whatsapp.net'], 'approve')

// --- Mengubah nama
sock.communityUpdateSubject(jid, '📦 hyrox')

// --- Mengubah deskripsi
sock.communityUpdateDescription(jid, 'Updated description')

// --- Mengatur agar hanya admin yang bisa mengirim pesan
sock.communitySettingUpdate(jid, 'announcement')

// --- Mengizinkan semua participant mengirim pesan
sock.communitySettingUpdate(jid, 'not_announcement')

// --- Hanya admin yang bisa mengubah info community
sock.communitySettingUpdate(jid, 'locked')

// --- Semua participant bisa mengubah info community
sock.communitySettingUpdate(jid, 'unlocked')

// --- Hanya admin yang bisa menambahkan participants
sock.communityMemberAddMode(jid, 'admin_add')

// --- Semua participants bisa menambahkan anggota
sock.communityMemberAddMode(jid, 'all_member_add')

// --- Mengaktifkan atau menonaktifkan temporary messages menggunakan satuan detik
sock.communityToggleEphemeral(jid, 86400)

// --- Menonaktifkan temporary messages
sock.communityToggleEphemeral(jid, 0)

// --- Mengaktifkan atau menonaktifkan membership approval
sock.communityJoinApprovalMode(jid, 'on')
sock.communityJoinApprovalMode(jid, 'off')

// --- Mengambil metadata semua community
const communities = await sock.communityFetchAllParticipating()
console.dir(communities, { depth: null })

// --- Mengambil semua group yang terhubung ke community
const linked = await sock.communityFetchLinkedGroups(jid)
console.dir(linked, { depth: null })

// --- Mengambil daftar join request yang menunggu
const requests = await sock.communityRequestParticipantsList(jid)
console.dir(requests, { depth: null })

// --- Mengambil informasi community dari invite link
const community = await sock.communityGetInviteInfo('ABC123456789')
console.log('👥 Got community info from invite code', ':', community)
```

#### 👤 Profile Management

```javascript
// --- Mengambil foto profil user
const url = await sock.profilePictureUrl(jid, 'image')
console.log('🖼️ Got user profile url', url)

// --- Memperbarui foto profil
sock.updateProfilePicture(jid, buffer)
sock.updateProfilePicture(jid, { url })

// --- Menghapus foto profil
sock.removeProfilePicture(jid)

// --- Memperbarui nama profil
sock.updateProfileName('My Name')

// --- Memperbarui status profil
sock.updateProfileStatus('Available')

// --- Mengatur presence
sock.sendPresenceUpdate('available', jid)
sock.presenceSubscribe(jid)

// --- Mengelola read receipts
sock.readMessages([message.key])
sock.sendReceipt(jid, participant, [messageId], 'read')

// --- Memblokir user
sock.updateBlockStatus(jid, 'block')

// --- Membuka blokir user
sock.updateBlockStatus(jid, 'unblock')

// --- Mengambil daftar blokir
const blocked = await sock.fetchBlocklist()
console.dir(blocked, { depth: null })

// --- Mengubah pengaturan chat
sock.chatModify({
   archive: true,
   lastMessageOrig: message,
   lastMessage: message
}, jid)

// --- Memberikan atau menghapus star pada message
sock.star(jid, [{ id: messageId, fromMe: true }], true)

// --- Mengelola contact
sock.addOrEditContact(jid, { displayName: 'Starseed' })
sock.removeContact(jid)

// --- Mengelola label
sock.addChatLabel(jid, labelId)
sock.removeChatLabel(jid, labelId)
sock.addMessageLabel(jid, messageId, labelId)

// --- Sinkronisasi app state
sock.resyncAppState(['regular', 'critical_block'], true)

// --- Mengambil business profile
const profile = await sock.getBusinessProfile(jid)
console.dir(profile, { depth: null })
```

#### 🏪 Business Management

```javascript
// --- Membuat product baru
const product = await sock.productCreate({
   name: '🧩 Starseed (Premium)',
   description: 'Get a full version of Starseed!',
   price: 100000,
   currency: 'IDR',
   originCountryCode: 'ID',
   images: [
      bufferImage,
      {
         url: './path/to/image.jpg'
      }
   ]
})
console.dir(product, { depth: null })

// --- Memperbarui product
await sock.productUpdate(productId, {
   name: '🧩 Starseed (Premium)',
   description: 'Get a full version of Starseed with more features!',
   price: 75000,
   currency: 'IDR',
   images: [
      {
         url: './path/to/image.jpg'
      }
   ]
})

// --- Menghapus product
sock.productDelete([productId])

// --- Mengambil informasi catalog
const { products, nextPageCursor } = await sock.getCatalog({
  jid: '628123456789@s.whatsapp.net',
  limit: 10
})

// --- Mengambil daftar collections
const collections = await sock.getCollections('628123456789@s.whatsapp.net', 10)
console.dir(collections, { depth: null })

// --- Mengambil informasi order
const order = await sock.getOrderDetails(orderId, tokenBase64)
console.dir(order, { depth: null })

// --- Memperbarui business profile
await sock.updateBusinessProfile({
   address: 'Jakarta, Indonesia',
   description: '🛒 Official Starseed Store',
   websites: ['https://www.npmjs.com/package/hyrox'],
   email: 'more-more@gmail.com',
   hours: {
      timezone: 'Asia/Jakarta',
      days: [{ day: 'mon', mode: 'open_24h' }]
   }
})

// --- Memperbarui cover photo
sock.updateCoverPhoto({
   url: './path/to/image.jpg'
})

// --- Menghapus cover photo
sock.removeCoverPhoto(coverId)

// --- Menambahkan atau memperbarui quick replies
sock.addOrEditQuickReply({
  shortcut: 'hello',
  message: 'Hello from business account',
})

// --- Menghapus quick reply
sock.removeQuickReply(timestamp)
```

#### 🔒 Privacy Management

```javascript
// --- Mengatur privasi last seen
sock.updateLastSeenPrivacy('all')
sock.updateLastSeenPrivacy('contacts')
sock.updateLastSeenPrivacy('contact_blacklist')
sock.updateLastSeenPrivacy('nobody')

// --- Mengatur privasi status online
sock.updateOnlinePrivacy('all')
sock.updateOnlinePrivacy('match_last_seen')

// --- Memperbarui foto profil privacy
sock.updateProfilePicturePrivacy('contacts')

// --- Mengatur privasi status
sock.updateStatusPrivacy('contacts')

// --- Mengatur privasi read receipts
sock.updateReadReceiptsPrivacy('all')
sock.updateReadReceiptsPrivacy('none')

// --- Mengatur privasi undangan group
sock.updateGroupsAddPrivacy('all')
sock.updateGroupsAddPrivacy('contacts')

// --- Mengatur privasi messages
sock.updateMessagesPrivacy('all')
sock.updateMessagesPrivacy('contacts')
sock.updateMessagesPrivacy('nobody')

// --- Mengatur privasi panggilan
sock.updateCallPrivacy('everyone')

// --- Mengatur default disappearing mode
sock.updateDefaultDisappearingMode(86400)

// --- Mengatur privasi link previews
sock.updateDisableLinkPreviewsPrivacy(true)
```

#### 📡 Events

```javascript
sock.ev.on('connection.update', (update) => {})
sock.ev.on('creds.update', (update) => {})
sock.ev.on('messaging-history.set', (update) => {})
sock.ev.on('messaging-history.status', (update) => {})
sock.ev.on('chats.upsert', (update) => {})
sock.ev.on('chats.update', (update) => {})
sock.ev.on('chats.delete', (update) => {})
sock.ev.on('chats.lock', (update) => {})
sock.ev.on('lid-mapping.update', (update) => {})
sock.ev.on('presence.update', (update) => {})
sock.ev.on('contacts.upsert', (update) => {})
sock.ev.on('contacts.update', (update) => {})
sock.ev.on('messages.delete', (update) => {})
sock.ev.on('messages.update', (update) => {})
sock.ev.on('messages.media-update', (update) => {})
sock.ev.on('messages.upsert', (update) => {})
sock.ev.on('messages.reaction', (update) => {})
sock.ev.on('message-receipt.update', (update) => {})
sock.ev.on('groups.upsert', (update) => {})
sock.ev.on('groups.update', (update) => {})
sock.ev.on('group-participants.update', (update) => {})
sock.ev.on('group.join-request', (update) => {})
sock.ev.on('group.member-tag.update', (update) => {})
sock.ev.on('blocklist.set', (update) => {})
sock.ev.on('blocklist.update', (update) => {})
sock.ev.on('call', (update) => {})
sock.ev.on('labels.edit', (update) => {})
sock.ev.on('labels.association', (update) => {})
sock.ev.on('newsletter.reaction', (update) => {})
sock.ev.on('newsletter.view', (update) => {})
sock.ev.on('newsletter-participants.update', (update) => {})
sock.ev.on('newsletter-settings.update', (update) => {})
sock.ev.on('settings.update', (update) => {})
```

### 🤖 Explore Bot

HyroX bisa dijadikan fondasi untuk membangun dan mengembangkan WhatsApp bot sesuai kebutuhan project.

### 🌿 Project Foundation

HyroX menggunakan [Baileys (GitHub)](https://github.com/WhiskeySockets/Baileys) sebagai basis pengembangannya.

### 🏅 Kredit dan Atribusi

Untuk kebutuhan protokol, HyroX menggunakan Protocol Buffer definitions yang dikelola oleh [WPP Connect](https://github.com/wppconnect-team) melalui [`wa-proto`](https://github.com/wppconnect-team/wa-proto).

Apresiasi dan credit tetap diberikan kepada original maintainers serta contributors Baileys:

- [purpshell](https://github.com/purpshell)
- [jlucaso1](https://github.com/jlucaso1)
- [adiwajshing](https://github.com/adiwajshing)

<!-- Please do not replace my name with yours. It's disrespectful. -->

> [!CAUTION]
> ⚠️ **Jangan menghapus, mengganti, atau menyalahgunakan atribusi credit pada bagian ini. Setiap redistribution maupun fork wajib tetap menyertakan credit tersebut secara lengkap.**
