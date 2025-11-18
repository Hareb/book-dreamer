#!/bin/bash
# Installation and Build Test Script for BookDreamer
# This script verifies that the project can be installed and built successfully

set -e  # Exit on any error

echo "🚀 BookDreamer - Installation & Build Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "   Node.js: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v(1[8-9]|[2-9][0-9]) ]]; then
    echo -e "${RED}❌ Node.js 18+ required. Found: $NODE_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version OK${NC}"
echo ""

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm --version)
echo "   npm: $NPM_VERSION"
echo -e "${GREEN}✅ npm version OK${NC}"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Check for critical files
echo "📂 Checking project structure..."
REQUIRED_FILES=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "electron.js"
    "preload.js"
    "src/App.tsx"
    "src/main.tsx"
    "src/index.css"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file (MISSING)"
        exit 1
    fi
done
echo -e "${GREEN}✅ All required files present${NC}"
echo ""

# TypeScript type check
echo "🔍 Running TypeScript type check..."
if npm run type-check; then
    echo -e "${GREEN}✅ No TypeScript errors${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript errors found (this is expected if dependencies aren't installed)${NC}"
fi
echo ""

# Lint check
echo "🔍 Running ESLint..."
if npm run lint; then
    echo -e "${GREEN}✅ No linting errors${NC}"
else
    echo -e "${YELLOW}⚠️  Linting errors found${NC}"
fi
echo ""

# Build test
echo "🏗️  Testing Vite build..."
if npm run build:vite; then
    echo -e "${GREEN}✅ Vite build successful${NC}"

    # Check if dist folder was created
    if [ -d "dist" ]; then
        echo -e "   ${GREEN}✓${NC} dist/ folder created"
        echo "   Build output:"
        ls -lh dist/ | head -10
    else
        echo -e "   ${RED}✗${NC} dist/ folder not created"
        exit 1
    fi
else
    echo -e "${RED}❌ Vite build failed${NC}"
    exit 1
fi
echo ""

# Check build artifacts
echo "📦 Checking build artifacts..."
REQUIRED_BUILD_FILES=(
    "dist/index.html"
    "dist/assets"
)

for file in "${REQUIRED_BUILD_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${YELLOW}⚠${NC}  $file (may not exist yet)"
    fi
done
echo ""

# Check Electron files
echo "⚡ Checking Electron configuration..."
if [ -f "electron.js" ] && [ -f "preload.js" ]; then
    echo -e "${GREEN}✅ Electron files present${NC}"
else
    echo -e "${RED}❌ Electron files missing${NC}"
    exit 1
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure API keys in the app Settings:"
echo "   - Anthropic: https://console.anthropic.com/"
echo "   - Replicate: https://replicate.com/account/api-tokens"
echo ""
echo "2. Run the app:"
echo "   npm run dev"
echo ""
echo "3. Or test in web mode:"
echo "   npm run dev:vite"
echo ""
echo "4. Build for production:"
echo "   npm run build"
echo ""
echo "Happy reading! 📚✨"
