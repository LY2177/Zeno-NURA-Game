# Case File: NURA

A short point-and-click investigation game, built for phones and iPads (landscape).
It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Run it locally

Opening `index.html` straight from the folder won't load the images in some browsers, so run a tiny local server:

```bash
cd nura-game
python3 -m http.server 8000
# then open http://localhost:8000
```

To test on your phone, connect it to the same Wi-Fi and open `http://<your-computer-ip>:8000`.

## Put it on GitHub

```bash
cd nura-game
git init            # skip if the folder is already a repo
git add .
git commit -m "Case File: NURA"
git branch -M main
git remote add origin https://github.com/<your-username>/nura-game.git
git push -u origin main
```

(Create the empty repo on github.com first, without a README, so the push isn't rejected.)

## Host it on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the `nura-game` repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. **Save and Deploy**. You'll get a `https://<name>.pages.dev` link.

Every push to `main` redeploys automatically. `_headers` sets image caching for faster repeat visits.

Tip for playtesters on iPhone: open the link in Safari → Share → **Add to Home Screen**. It then launches full screen without the browser bars, which gives the game noticeably more room.

## Where to change things

| What | Where |
| --- | --- |
| Questions, answers, follow-ups, clue gating | `js/data.js` → `CHARACTERS` |
| Item card titles/text/images | `js/data.js` → `ITEMS` |
| Diary entries and which diary shows which | `js/data.js` → `DIARY_PAGES`, `DIARIES` |
| Tap areas (hotspots), exits | `js/data.js` → `SCENES` (stage coordinates, 1512 × 892, same as Figma) |
| Ending checklist | `js/data.js` → `FINDINGS` |
| Story order, gates, title/ending screens | `js/game.js` |
| Colours, fonts, layout | `css/style.css` |

**Finding hotspot coordinates:** in Figma, draw a rectangle over the object in a 1512 × 892 frame and copy its X, Y, W and H into `rect: [x, y, w, h]`.

**Debugging:** open the browser console and use `NURA.go('parents')`, `NURA.set('BOX')`, `NURA.flags()` or `NURA.end()` to jump around.

## Story flow

1. John's room (April): diary, board games, plushie, drawing → door to living room
2. Living room: trash can → NURA wrappers → *"Six weeks later"*
3. Living room (June) → John's room (changed): John, diary (flips back to April), ball, posters
4. Living room now has Grandma → Parents' room: Dad, hidden box in the bedside table
5. Ask Dad about the box → confession → report

Rooms are linked by tapping doors (in the living room: centre door = John's room, right-edge door = parents' room). Item cards and the diary close by tapping outside them.

**Submit Report** (bottom-right) ends the game at any time. The outcome depends on whether Dad confessed.

## How questions unlock

Each button is exactly what the case worker says. A question only appears once the player has the clue it's about, and disappears once it (and its follow-up) has been asked.

| Clue | Gained by |
| --- | --- |
| `SEEN_GAMES`, `SEEN_DINO` | Board games, drawing, plushie (April room) |
| `DIARY_BEFORE` / `DIARY_AFTER` | Reading an April / May–June diary page |
| `SEEN_BALL`, `SEEN_POSTERS` | Soccer ball; posters or clock (June room) |
| `WRAPPER`, `BOX` | Trash can; bedside table |
| `JOHN_STICKER`, `BOX_HINT` | Asking John about the wrapper |
| `TALKED_GRANDMA`, `DAD_MEMORY` | Talking to Grandma; Dad's comment about her memory |
| `MISSING_MEMORY`, `NEGLECT`, `CONFESSED` | Answers that count toward the report |

## Credits

- Font: [Jersey 10](https://fonts.google.com/specimen/Jersey+10) (SIL Open Font License, see `fonts/`).
