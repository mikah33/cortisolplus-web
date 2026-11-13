#!/bin/bash
# Proves a branch doesn't change phone or tablet layouts: builds origin/main
# and the current checkout, screenshots the given paths at 390px and 768px,
# and compares the images pixel by pixel.
#   scripts/mobile-diff.sh / /blog/ /download/
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d /tmp/mobile-diff.XXXX)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PATHS=("$@"); [ ${#PATHS[@]} -eq 0 ] && PATHS=(/)

echo "Building origin/main and this checkout..."
git -C "$ROOT" fetch -q origin
git -C "$ROOT" worktree add -q --detach "$WORK/base" origin/main
cp -R "$ROOT/node_modules" "$WORK/base/" 2>/dev/null || true
(cd "$WORK/base" && npm run build >/dev/null 2>&1)
(cd "$ROOT" && npm run build >/dev/null 2>&1)

serve() { (cd "$1" && npx astro preview --port "$2" --host 127.0.0.1 >/dev/null 2>&1 &) ; }
P1=$((4800 + RANDOM % 400)); P2=$((P1 + 1))
serve "$WORK/base" $P1; serve "$ROOT" $P2; sleep 5

python3 -c "import PIL" 2>/dev/null && PY=python3 || { [ -x /tmp/pv/bin/python ] || { python3 -m venv /tmp/pv && /tmp/pv/bin/pip -q install pillow; }; PY=/tmp/pv/bin/python; }

changed=0
for p in "${PATHS[@]}"; do
  for w in 390 768; do
    n=$(echo "${p}_$w" | tr '/' '_')
    # Three shots of the original reveal animated areas, which are ignored.
    for side in base:$P1 base2:$P1 base3:$P1 head:$P2; do
      s=${side%%:*}; port=${side##*:}
      "$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$WORK/prof-$s" \
        --window-size=$w,4000 --virtual-time-budget=4000 --force-prefers-reduced-motion \
        --screenshot="$WORK/$s$n.png" "http://127.0.0.1:$port$p" 2>/dev/null
    done
    d=$($PY - "$WORK/base$n.png" "$WORK/base2$n.png" "$WORK/base3$n.png" "$WORK/head$n.png" <<'EOF'
import sys
from PIL import Image, ImageChops, ImageFilter
a, a2, a3, b = (Image.open(x).convert('RGB') for x in sys.argv[1:5])
if a.size != b.size: print('size'); raise SystemExit
def mask(x, y): return ImageChops.difference(x, y).convert('L').point(lambda v: 255 if v else 0)
moving = ImageChops.lighter(mask(a, a2), mask(a, a3)).filter(ImageFilter.MaxFilter(15))
box = ImageChops.subtract(mask(a, b), moving).getbbox()
print('same' if box is None else f'diff {box}')
EOF
)
    if [ "$d" = same ]; then echo "  same   ${w}px $p"; else echo "  CHANGED ${w}px $p ($d) -> $WORK/base$n.png vs $WORK/head$n.png"; changed=$((changed+1)); fi
  done
done

pkill -f "astro preview --port $P1" 2>/dev/null || true
pkill -f "astro preview --port $P2" 2>/dev/null || true
git -C "$ROOT" worktree remove --force "$WORK/base"
echo "$changed changed page(s)"
