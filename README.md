# Tap2Talk

```
 ████████╗  █████╗  ██████╗  ██████╗  ████████╗  █████╗  ██╗      ██╗  ██╗
 ╚══██╔══╝ ██╔══██╗ ██╔══██╗ ╚════██╗ ╚══██╔══╝ ██╔══██╗ ██║      ██║ ██╔╝
    ██║    ███████║ ██████╔╝  █████╔╝    ██║    ███████║ ██║      █████╔╝ 
    ██║    ██╔══██║ ██╔═══╝  ██╔═══╝     ██║    ██╔══██║ ██║      ██╔═██╗ 
    ██║    ██║  ██║ ██║      ███████╗    ██║    ██║  ██║ ███████╗ ██║  ██╗
    ╚═╝    ╚═╝  ╚═╝ ╚═╝      ╚══════╝    ╚═╝    ╚═╝  ╚═╝ ╚══════╝ ╚═╝  ╚═╝
```

**Talk in ANY app, type nothing.** Works everywhere you type - VSCode, Terminal, Slack, Browser, anywhere. Press a key, speak, and watch your words appear instantly where you're working.

> *"I believe talking to computers is the future. With AI getting smarter, why are we still typing everything? I built Tap2Talk for myself because I wanted to speak naturally in ANY application without switching tools. Now I'm sharing it with you."* - [@unclecode](https://x.com/unclecode)

Built by [@unclecode](https://x.com/unclecode), creator of [Crawl4AI](https://github.com/unclecode/crawl4ai) (50K+ stars).

## Works Everywhere

✅ **Code Editors** - VSCode, Sublime, Vim, IntelliJ, any IDE  
✅ **Terminal** - Dictate complex commands without typing  
✅ **Chat Apps** - Slack, Discord, Teams, WhatsApp Web  
✅ **Browsers** - Gmail, ChatGPT, Google Docs, anywhere on the web  
✅ **Note Taking** - Notion, Obsidian, Apple Notes, OneNote  
✅ **Literally Anywhere** - If you can type there, you can talk there

## Features

- **One Shortcut for Everything**: Press `Ctrl+Space` (double-tap Space) to start recording anywhere
- **Instant Paste**: Your words appear right where your cursor is - no copy/paste needed
- **Powered by Groq Whisper**: Fast and accurate transcription using state-of-the-art AI
- **Customizable Shortcuts**: Set your own recording and abort shortcuts
- **Cross-Platform**: Works on macOS, Windows, and Linux
- **Background Service**: Runs quietly in the background, always ready
- **System Tray Integration**: Clean interface with status indicators

## Groq API Setup

Tap2Talk currently uses Groq's lightning-fast Whisper API for transcription. Support for OpenAI Whisper, local models, and other providers coming soon!

### Why Groq?
- ✅ **Free tier available** - Perfect for personal use (30 requests/min, 14,400 requests/day)
- ✅ **Blazing fast** - Near-instant transcription
- ✅ **High accuracy** - Powered by Whisper Large v3
- ✅ **No credit card required** - Start immediately

### Get Your API Key (2 minutes)

1. **Create Account**: Visit [console.groq.com](https://console.groq.com) and sign up with Google or GitHub
2. **Generate API Key**: Navigate to "API Keys" → Click "Create API Key" → Name it "Tap2Talk"
3. **Copy Your Key**: Copy the key (starts with `gsk_`) - Tap2Talk will ask for it on first run

The free tier includes 30 requests per minute and 14,400 requests per day - more than enough for regular use!

### Coming Soon
- OpenAI Whisper API support
- Local Whisper models (no internet required)
- Other transcription providers

## Installation

```bash
npm install -g tap2talk
```

## Quick Start

1. **Run interactively** (recommended for first time):
   ```bash
   tap2talk
   ```

2. **Start as background service**:
   ```bash
   tap2talk start
   ```

3. **Check status**:
   ```bash
   tap2talk status
   ```

## Commands

- `tap2talk` - Interactive mode with menu
- `tap2talk start` - Start as background service
- `tap2talk stop` - Stop background service
- `tap2talk status` - Check service status
- `tap2talk restart` - Restart service
- `tap2talk logs` - Show recent logs
- `tap2talk update` - Check for updates

## Setup

On first run, you'll need to:

1. Get a free API key from [Groq Console](https://console.groq.com/keys)
2. Enter it when prompted
3. Grant accessibility permissions (macOS) for global shortcuts

## Default Shortcuts

- **Start Recording**: `Ctrl+Space` (hold Ctrl, double-tap Space)
- **Abort Recording**: Double-tap `Escape`

Both shortcuts are fully customizable in Settings.

## How It Works

1. Press your recording shortcut
2. Speak naturally
3. Recording stops automatically or press shortcut again
4. Text is transcribed and pasted instantly

## Status Indicators

The system tray shows real-time status:
- `Tap` - Ready
- `[*] REC` - Recording
- `[~] PRO` - Processing
- `[OK] DON` - Done
- `[X] ERR` - Error
- `[_] ABT` - Aborted

## Configuration

Settings are stored in `~/.tap2talk/config.json`

## Requirements

- Node.js 14 or higher
- Groq API key (free)
- Microphone access

## Privacy

- Audio is processed via Groq API
- No audio is stored locally after transcription
- Settings and logs stay on your machine

## Troubleshooting

### Service won't start
```bash
tap2talk stop
tap2talk start
```

### Permission issues (macOS)
Go to System Preferences → Security & Privacy → Privacy → Accessibility
Add and enable Terminal/iTerm

### Check logs
```bash
tap2talk logs
```

## Contributing

Issues and PRs welcome at [github.com/unclecode/tap2talk](https://github.com/unclecode/tap2talk)

## License

MIT © unclecode

---

Built with inspiration from productivity needs and powered by [Groq](https://groq.com) Whisper API.