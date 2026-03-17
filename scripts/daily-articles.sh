#!/bin/bash
# daily-articles.sh — Genera 3 articoli blog AppFrame al giorno via claude -p
# Eseguito da launchd ogni giorno alle 10:50

set -euo pipefail

# Path assoluti — cron/launchd hanno PATH minimo
export HOME="/Users/simoneruggiero"
export PATH="$HOME/.local/bin:$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

CLAUDE="$HOME/.local/bin/claude"
GIT="/opt/homebrew/bin/git"
CURL="/usr/bin/curl"
JQ="/opt/homebrew/bin/jq"

PROJECT_DIR="$HOME/appframe"
LOG_DIR="$PROJECT_DIR/scripts/logs"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/$DATE.log"

# Assicura che la directory log esista
mkdir -p "$LOG_DIR"

echo "=== AppFrame Daily Articles — $DATE ===" | tee "$LOG_FILE"
echo "Start: $(date '+%H:%M:%S')" | tee -a "$LOG_FILE"

cd "$PROJECT_DIR"

# Necessario se lanciato da dentro una sessione Claude Code (es. test manuale)
unset CLAUDECODE 2>/dev/null || true

# Sincronizza con remote
echo ">> git pull..." | tee -a "$LOG_FILE"
$GIT pull 2>&1 | tee -a "$LOG_FILE"

# Estrai lista slug esistenti da posts.ts
EXISTING_SLUGS_FILE="$PROJECT_DIR/scripts/existing-slugs.txt"
grep 'slug: "' src/app/blog/posts.ts | sed 's/.*slug: *"\(.*\)".*/\1/' | sort > "$EXISTING_SLUGS_FILE"
SLUG_COUNT=$(wc -l < "$EXISTING_SLUGS_FILE" | tr -d ' ')
echo ">> $SLUG_COUNT articoli esistenti trovati (salvati in existing-slugs.txt)" | tee -a "$LOG_FILE"

# Costruisci il prompt
read -r -d '' PROMPT << HEREDOC || true
You are an expert in iOS app marketing, ASO, and SEO. Generate 3 new blog articles for AppFrame (appfra.me), a tool that creates professional showcase images for iOS apps.

There are $SLUG_COUNT existing articles. The list of existing slugs is in \`scripts/existing-slugs.txt\`. Read it to avoid duplicates.

STEP-BY-STEP INSTRUCTIONS:

1. Read \`src/app/blog/posts.ts\` to understand the exact format. Each post is an object in the \`posts\` array with fields: slug, title, description, date, readingTime, content (markdown string).

2. Pick 3 NEW topics from this pool (skip any already covered by existing slugs).
   PRIORITIZE low-competition keywords first (Tier 1), then medium (Tier 2), then general (Tier 3):

   TIER 1 — Low competition, high relevance (prioritize these):
   - "What to Do When Your iOS App Gets Approved" (target: ios app approved next steps, app got approved what to do)
   - "How to Announce Your App Launch on Social Media" (target: app launch announcement, share app approval)
   - "iOS App Launch Checklist: From Approval to First 1000 Downloads" (target: app launch checklist, ios app launch)
   - "How to Create a Press Kit for Your iOS App" (target: ios app press kit, indie app press kit)
   - "How to Share Your App on Twitter, LinkedIn and Instagram" (target: share app on social media, app launch post)
   - "App Store Approval: What Happens Next?" (target: app store approval process, after app approval)
   - "How to Celebrate Your App Launch as an Indie Developer" (target: celebrate app launch, indie dev app launch)
   - "Best Tools for Indie iOS Developers in 2026" (target: indie dev tools, ios developer tools)
   - "How to Create App Launch Images Without Design Skills" (target: app launch image generator, app showcase maker)

   TIER 2 — Medium competition, good volume:
   - "App Store Screenshot Sizes and Requirements in 2026" (target: app store screenshot size, screenshot requirements)
   - "How to Write an App Store Description That Converts" (target: app store description tips)
   - "Indie App Marketing on a Zero Budget" (target: indie app marketing, free app marketing)
   - "App Store A/B Testing: How to Optimize Your Listing" (target: app store a/b testing)
   - "How to Launch Your App on Product Hunt" (target: product hunt launch, app launch product hunt)
   - "Building an App Landing Page That Converts" (target: app landing page, ios app website)
   - "How to Create App Preview Videos That Drive Downloads" (target: app preview video, app store video)
   - "How to Price Your iOS App: Free vs Paid vs Freemium" (target: ios app pricing strategy)
   - "App Store Ratings and Reviews: A Developer's Guide" (target: app store reviews strategy)

   TIER 3 — General topics:
   - "App Store Seasonal Trends: When to Launch Your App"
   - "How to Use Social Media to Promote Your iOS App"
   - "Understanding App Store Search Algorithms in 2026"
   - "Mobile App Analytics: Key Metrics Every Developer Should Track"
   - "Cross-Promotion Strategies for Indie App Developers"
   - "How to Write Release Notes That Users Actually Read"
   - "App Store Category Strategy: Choosing the Right Category"
   - "How to Get Press Coverage for Your iOS App"
   - "Dark Mode Design Best Practices for iOS Apps"
   - "How to Localize Your App Store Listing for Global Markets"
   - "App Onboarding UX Best Practices"
   - "Subscription vs One-Time Purchase: Monetization Strategy"
   - "App Store Rejection: Common Reasons and How to Avoid Them"
   - "How to Use App Store Custom Product Pages"
   - "Accessibility in iOS Apps: Why It Matters for ASO"
   - "User Retention Strategies for Mobile Apps"
   - "How to Leverage Apple Search Ads for App Growth"
   If all topics are covered, invent a NEW relevant topic about app marketing, ASO, or indie dev launches.

3. For each article:
   - Write 1200-1800 words of genuinely useful, informative content
   - Use markdown: ## for main headings, ### for subheadings, **bold**, lists, [links](url)
   - Naturally mention [AppFrame](https://appfra.me) 1-2 times where relevant
   - Set readingTime based on word count (~250 words/min)
   - Use date "$DATE"
   - Add as FIRST elements in the posts array (newest first)

4. Run \`npx next build\` to verify build passes. Fix any errors.

5. If build passes:
   git add -A
   git commit -m "blog: add 3 new articles (automated daily)"
   git push

IMPORTANT:
- Read \`scripts/existing-slugs.txt\` for existing slugs — do NOT duplicate any
- Each article: professional but accessible English tone
- Target real SEO keywords that app developers search for
- Slugs should be lowercase-kebab-case matching the topic
HEREDOC

echo ">> Launching claude -p..." | tee -a "$LOG_FILE"
$CLAUDE -p "$PROMPT" \
  --model claude-sonnet-4-6 \
  --permission-mode bypassPermissions \
  --max-budget-usd 2.00 \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

# Notifica motori di ricerca solo se ci sono nuovi articoli committati
DOMAIN="appfra.me"
# Controlla se ci sono state modifiche a posts.ts nell'ultimo commit
NEW_SLUGS=$($GIT diff --name-only HEAD~1 -- src/app/blog/posts.ts 2>/dev/null || echo "")

if [ -n "$NEW_SLUGS" ]; then
  echo "" | tee -a "$LOG_FILE"

  # Google ping
  echo ">> Pinging Google sitemap..." | tee -a "$LOG_FILE"
  $CURL -s "https://www.google.com/ping?sitemap=https://$DOMAIN/sitemap.xml" > /dev/null 2>&1 &

  wait
  echo "Google sitemap ping done." | tee -a "$LOG_FILE"
else
  echo "" | tee -a "$LOG_FILE"
  echo ">> No new articles found — skipping search engine notifications." | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "End: $(date '+%H:%M:%S')" | tee -a "$LOG_FILE"
echo "Exit code: $EXIT_CODE" | tee -a "$LOG_FILE"
echo "=== Done ===" | tee -a "$LOG_FILE"

exit $EXIT_CODE
