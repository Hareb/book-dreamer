# 🚀 Quick Start Guide

Get BookDreamer running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get API Keys

### Anthropic (Claude) API Key
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy the key (starts with `sk-ant-`)

**Cost**: ~$0.001-0.005 per chapter analysis

### Replicate API Token
1. Go to [replicate.com](https://replicate.com/)
2. Sign up or log in
3. Go to [Account > API Tokens](https://replicate.com/account/api-tokens)
4. Create a new token
5. Copy the token (starts with `r8_`)

**Cost**: ~$0.002-0.02 per image generation

## Step 3: Run the App

```bash
npm run dev
```

The app will open automatically in Electron.

## Step 4: Configure API Keys

1. Click the **Settings** icon (⚙️) in the top right
2. Paste your **Anthropic API Key**
3. Paste your **Replicate API Token**
4. Optionally toggle "Show API Keys" to verify
5. Click **Save Settings**

## Step 5: Open Your First Book

1. Click **Open Book** button
2. Select an EPUB file from your computer
3. The book will load automatically

## Step 6: Generate Your First Illustration

**Option A: Automatic (Recommended)**
- Already enabled by default in Settings
- Images generate as you read each chapter
- Pre-generates upcoming chapters in the background

**Option B: Manual**
- Click the "Generate" button in the reader
- Or press `Ctrl+G` on your keyboard

## 🎨 Customize Your Experience

Click Settings to adjust:

- **Image Style**: Try Realistic, Artistic, or Minimalist
- **Background Opacity**: 30% default (adjust 0-100%)
- **Background Blur**: 8px default (adjust 0-20px)
- **Pre-generate**: 2 chapters ahead (adjust 0-5)

## ⌨️ Essential Keyboard Shortcuts

- `→` Next chapter
- `←` Previous chapter
- `Ctrl+G` Generate image
- `Ctrl+M` Show/hide chapter list
- `Ctrl+,` Open settings

## 💡 Tips

1. **Save Money**: Images are cached! Once generated, they're free forever for that book
2. **Best Results**: Fantasy/Sci-Fi books with rich descriptions work amazingly
3. **Experiment**: Try different art styles for the same chapter to see variations
4. **Performance**: Disable pre-generation if you want to save API costs
5. **Reading Focus**: Adjust opacity and blur for comfortable reading

## ❓ Troubleshooting

**"API key not set"**
- Go to Settings and enter your API keys

**"Image generation failed"**
- Check your API keys are correct
- Verify you have API credits/billing set up
- Check DevTools console (Ctrl+Shift+I) for errors

**Images loading slowly**
- First time: 20-30 seconds is normal (generating from scratch)
- Subsequent times: Should be instant (using cache)
- Enable pre-generation for smoother experience

## 📊 Cost Example

Reading a typical novel (20 chapters):
- Claude analysis: 20 × $0.003 = **$0.06**
- Image generation: 20 × $0.01 = **$0.20**
- **Total: ~$0.26 per book**

But remember - cached images are FREE on re-reads!

## 🎯 Next Steps

- Try different art styles
- Explore keyboard shortcuts (click ⌨️ icon)
- Check out recently opened books
- Adjust settings for your preference
- Share cool illustrations with friends!

---

Enjoy your AI-illustrated reading experience! 📚✨
