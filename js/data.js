/* =========================================================
   GAME DATA — edit text, hotspots and dialogue here.
   All positions are in "stage" pixels: the game is laid out
   on a 1512 x 892 canvas (same as the Figma frames) and
   scaled to fit the screen.
   ========================================================= */

// ---------- Scenes ----------
// bg: [x, y, width, height] placement of the background image (from Figma)
// hotspots: [x, y, w, h] tap areas.
//   flag:   clue the player gains by tapping it (unlocks questions)
//   action: popup | diary | talk | go | note
const SCENES = {
  john_before: {
    label: "John's Room",
    img: 'assets/scenes/john_before.webp',
    bg: [0, 0, 1620, 971],
    hotspots: [
      { id: 'diary', name: 'Diary', rect: [930, 525, 175, 110], action: { type: 'diary', id: 'before' } },
      { id: 'games', name: 'Board Games', rect: [725, 45, 515, 155], flag: 'SEEN_GAMES', action: { type: 'popup', id: 'boardgames' } },
      { id: 'drawing', name: 'Drawing', rect: [268, 100, 118, 160], flag: 'SEEN_DINO', action: { type: 'note', text: 'A crayon drawing of a green dinosaur under a big yellow sun.' } },
      { id: 'plush', name: 'Plushie', rect: [540, 435, 150, 155], flag: 'SEEN_DINO', action: { type: 'note', text: 'A dinosaur plushie, worn thin from hugging.' } },
      { id: 'door', name: 'Door to Living Room', rect: [1415, 0, 97, 892], action: { type: 'go', to: 'living' } },
    ],
    exits: [],
  },

  john_after: {
    label: "John's Room",
    img: 'assets/scenes/john_after.webp',
    bg: [-25, -26, 1670, 942],
    hotspots: [
      { id: 'john', name: 'John', rect: [105, 285, 285, 530], action: { type: 'talk', id: 'john' } },
      { id: 'diary', name: 'Diary', rect: [960, 495, 165, 105], action: { type: 'diary', id: 'after' } },
      { id: 'ball', name: 'Soccer Ball', rect: [1105, 20, 165, 145], flag: 'SEEN_BALL', action: { type: 'popup', id: 'ball' } },
      { id: 'poster', name: 'Posters', rect: [85, 0, 225, 285], flag: 'SEEN_POSTERS', action: { type: 'popup', id: 'poster' } },
      { id: 'poster2', name: 'Posters', rect: [1025, 330, 100, 120], flag: 'SEEN_POSTERS', action: { type: 'popup', id: 'poster' } },
      { id: 'clock', name: 'Clock', rect: [550, 465, 110, 75], flag: 'SEEN_POSTERS', action: { type: 'note', text: 'A digital clock sits where the dinosaur plushie used to be.' } },
      { id: 'door', name: 'Door to Living Room', rect: [1415, 0, 97, 892], action: { type: 'go', to: 'living' } },
    ],
    exits: [],
  },

  living_empty: {
    label: 'Living Room',
    img: 'assets/scenes/living.webp',
    bg: [-71, 0, 1583, 891],
    hotspots: [
      { id: 'trash', name: 'Trash Can', rect: [795, 535, 105, 135], action: { type: 'popup', id: 'wrapper' } },
      { id: 'pdoor', name: "Parents' Room", rect: [1035, 160, 195, 425], action: { type: 'go', to: 'parents' } },
    ],
    exits: [{ label: "John's Room", side: 'left', to: 'john' }],
  },

  living_grandma: {
    label: 'Living Room',
    img: 'assets/scenes/living_grandma.webp',
    bg: [-61, 0, 1634, 963],
    hotspots: [
      { id: 'grandma', name: 'Grandma', rect: [685, 378, 160, 285], action: { type: 'talk', id: 'grandma' } },
      { id: 'trash', name: 'Trash Can', rect: [808, 588, 100, 125], action: { type: 'popup', id: 'wrapper' } },
      { id: 'pdoor', name: "Parents' Room", rect: [1058, 172, 205, 455], action: { type: 'go', to: 'parents' } },
    ],
    exits: [{ label: "John's Room", side: 'left', to: 'john' }],
  },

  parents: {
    label: "Parents' Room",
    img: 'assets/scenes/parents.webp',
    bg: [-80, -25, 1672, 941],
    hotspots: [
      { id: 'dad', name: 'Dad', rect: [120, 190, 205, 510], action: { type: 'talk', id: 'dad' } },
      { id: 'box', name: 'Bedside Table', rect: [1120, 465, 165, 95], hidden: true, action: { type: 'popup', id: 'nura_box' } },
      { id: 'lamp', name: 'Lamp', rect: [1125, 320, 110, 150], action: { type: 'note', text: "Mum's side of the bed. Neatly made. Working late again." } },
      { id: 'door', name: 'Door to Living Room', rect: [1380, 15, 95, 690], action: { type: 'go', to: 'living' } },
    ],
    exits: [],
  },
};

// ---------- Item cards ----------
// img box sits on the left half of the light panel; rot = tilt in degrees
const ITEMS = {
  boardgames: {
    title: "John's Favourite Pastime Activity",
    body: 'The board games look worn. Seems like John really loves playing dinosaur board games.',
    imgs: [{ src: 'assets/items/boardgames.webp', w: 330, rot: 0 }],
  },
  ball: {
    title: "John's Favourite Pastime Activity?",
    body: "The ball looks pristine, as if it's never been played with before.",
    imgs: [{ src: 'assets/items/ball.webp', w: 300, rot: 0 }],
  },
  poster: {
    title: 'New Posters?',
    body: 'His room posters and pictures have been replaced with football motifs...',
    imgs: [{ src: 'assets/items/poster.webp', w: 270, rot: -4 }],
  },
  wrapper: {
    title: 'NURA Wrappers',
    body: "NURA? I've heard about this... it's an AI memory patch that people use to give themselves memories of things they've never experienced.\n\nOdd, why did they get so many different packs?",
    imgs: [
      { src: 'assets/items/nura_packs.webp', w: 450, rot: 0, x: -30, y: -10 },
      { src: 'assets/items/receipt.webp', w: 145, rot: 16, x: 185, y: 80 },
    ],
    flag: 'WRAPPER',
  },
  nura_box: {
    title: 'Unopened Box of NURA',
    body: "Hidden in the bedside table. Why do they have so many NURA patches?\n\nA slip on the lid: \"Custom memory: outings with Mum & Dad, park, soccer. Recipient: John, age 6.\"",
    imgs: [{ src: 'assets/items/nura_box.webp', w: 330, rot: -2.4 }],
    flag: 'BOX',
  },
};

// ---------- Diary ----------
// One page per entry. "era" decides which clue reading it gives.
const DIARY_PAGES = [
  { era: 'before', date: '12 April', lines: ['Grandma picked me up today.', 'We played my dinosaur board game. I won.', 'Mummy and Daddy came home late again. I wanted to show Daddy my dinosaur but he was busy on his phone.', 'Grandma said we can play tomorrow.', 'I like Grandma.'] },
  { era: 'before', date: '18 April', lines: ["Today I didn't talk much in school.", "The other kids didn't let me play with them.", "I told Grandma but I didn't tell Mummy and Daddy.", 'Grandma hugged me.'] },
  { era: 'before', date: '26 April', lines: ['Daddy said I should talk more.', 'Mummy said I need to make more friends.', "I don't know what to say.", 'I like playing my games with Grandma.'] },
  { era: 'after', date: '15 May', lines: ['Today Daddy took me outside!', 'We played football together.', 'Mummy took a picture of us.', 'I think Mummy and Daddy like doing things with me.', "I don't really remember playing my dinosaur game anymore."] },
  { era: 'after', date: '19 May', lines: ['I made two new friends today!', 'I talked a lot.', 'Daddy says I am more confident now.', 'I think I have always liked playing outside with Mummy and Daddy.', 'Grandma asked me to play my dinosaur game.', "I don't want to."] },
  { era: 'after', date: '30 May', lines: ['Mummy said we went to the park a lot when I was younger.', 'I remember it.', 'I think.', 'Grandma says we used to do lots of things together too.', "But I can't remember."] },
  { era: 'after', date: '6 June', lines: ['I asked Grandma why she always picks me up.', 'She said she has always been taking care of me.', "I don't understand.", 'I thought Mummy and Daddy always did.'] },
];
// pages: which entries the diary holds. startPage: the entry it opens on.
// The June diary opens on 26 April | 15 May so the before/after sits side by side,
// and the player can flip back to the April entries.
const DIARIES = {
  before: { pages: [0, 1, 2], startPage: 0 },
  after: { pages: [0, 1, 2, 3, 4, 5, 6], startPage: 2 },
};

// ---------- Conversations ----------
// Each button shows exactly the line the case worker says.
//   req:    clue(s) needed before the question appears (all of them)
//   any:    the question appears if ANY of these clues is held
//   flag:   clue(s) gained by asking
//   follow: a follow-up line that replaces the question once it's answered
//   confess: ends with the confession
// Fully asked questions disappear from the list.
//
// Clues from looking around:
//   SEEN_GAMES, SEEN_DINO (April room) · DIARY_BEFORE (April pages) · DIARY_AFTER (May/June pages)
//   SEEN_BALL, SEEN_POSTERS (June room) · WRAPPER (trash) · BOX (bedside table)
const CHARACTERS = {
  john: {
    name: 'John',
    sprite: null, // John stays in the scene on the left
    greet: ["Hi! Are you Daddy's friend?"],
    questions: [
      { id: 'football', req: 'DIARY_AFTER',
        q: 'Your diary says Daddy took you to play football.',
        a: ['Uh-huh! Mummy took a picture. I think they like doing things with me now.'],
        follow: { q: 'Now?', a: ['I mean... always. We always did.'] } },
      { id: 'dino', any: ['DIARY_BEFORE', 'SEEN_GAMES', 'SEEN_DINO'],
        q: 'You used to play a dinosaur game with Grandma.',
        a: ["I did? I don't play dinosaur games. Those are for babies."],
        follow: { q: 'Grandma says you played it almost every day.',
          a: ["She gets sad when I don't remember. But I can't.", "It's like there's a hole there."],
          flag: 'MISSING_MEMORY' } },
      { id: 'ball', req: 'SEEN_BALL',
        q: 'Your soccer ball looks brand new.',
        a: ['I play with it lots! ...I think.'],
        follow: { q: 'When did you last play with Daddy?', a: ["The one time. With the picture. Daddy's on his phone a lot."] } },
      { id: 'posters', req: 'SEEN_POSTERS',
        q: 'What happened to your dinosaur pictures?',
        a: ["Mummy put them away. She said I'm a big boy now."] },
      { id: 'sticker', req: 'WRAPPER',
        q: '(Show the wrapper) Have you seen one of these?',
        a: ["That's my sticker! Daddy put it on my neck. He said it helps me make friends."],
        flag: 'JOHN_STICKER',
        follow: { q: 'Are there more stickers?',
          a: ["Lots. In Daddy's room, next to the bed.", "Don't tell Grandma!"],
          flag: 'BOX_HINT' } },
    ],
  },

  grandma: {
    name: 'Grandma',
    sprite: 'assets/scenes/grandma_sprite.webp',
    sceneOverride: 'assets/scenes/living.webp', // hide the sofa Grandma while her big sprite is shown
    greet: ["You're from the agency? Thank you for coming. I've been so worried about Johnny."],
    questions: [
      { id: 'how',
        q: 'How is John doing?',
        a: ["He's a different child. Chatty, cheerful... and a stranger to me."],
        follow: { q: 'A stranger?', a: ["He can't remember our game. Not bored of it. It's just gone."], flag: 'MISSING_MEMORY' } },
      { id: 'park', req: 'DIARY_AFTER',
        q: 'His diary talks about trips to the park with his parents.',
        a: ["Those never happened. I'm the one who takes him out."] },
      { id: 'room', any: ['SEEN_POSTERS', 'SEEN_BALL'],
        q: 'His room looks very different.',
        a: ['They cleared it while I was in hospital. His dinosaur drawings went in the recycling.'],
        follow: { q: 'You were in hospital?',
          a: ["Three weeks. When I came back, he hadn't been to school once. His clothes were filthy."],
          flag: 'NEGLECT' } },
      { id: 'wrapper', req: 'WRAPPER',
        q: 'I found NURA wrappers in your bin.',
        a: ['Those memory patches?', '(a long pause)', 'Oh, Johnny.'],
        follow: { q: 'Did you buy them?', a: ['With my pension? Ask his father.'] } },
      { id: 'memory', req: 'DAD_MEMORY',
        q: "John's father says your memory isn't what it used to be.",
        a: ['My memory is the only one in this house nobody has tampered with.'] },
      { id: 'box', req: 'BOX',
        q: "I found a box of NURA in your son-in-law's room.",
        a: ["Then it wasn't once.", "How many more until he doesn't know me at all?"] },
    ],
  },

  dad: {
    name: 'Dad',
    sprite: null,
    greet: ['(on the phone)', "Sorry, work. You're the case worker? Everything's fine. John's doing great."],
    questions: [
      { id: 'how',
        q: 'John seems very different lately.',
        a: ["He's finally come out of his shell. Two new friends already."] },
      { id: 'football', req: 'DIARY_AFTER',
        q: 'His diary says you took him to play football.',
        a: ['Right. Great day. We should do it more.'],
        follow: { q: 'How often do you go?', a: ["It's about quality, not quantity."] } },
      { id: 'wrapper', req: 'WRAPPER',
        q: 'I found NURA wrappers in your bin.',
        a: ['Mine. For work stress. Perfectly legal.'],
        follow: { q: "The receipt says 'baking cookies as a family'.", a: ["...That's none of your business."] } },
      { id: 'sticker', req: 'JOHN_STICKER',
        q: 'John says you put a sticker on his neck.',
        a: ['(a long pause)', "He was miserable. The other kids wouldn't play with him.", 'I just wanted him to be happy.'] },
      { id: 'grandma', req: 'TALKED_GRANDMA',
        q: 'Grandma says those park trips never happened.',
        a: ["She's getting older. Her memory isn't what it was."],
        flag: 'DAD_MEMORY' },
      { id: 'box', req: 'BOX',
        q: 'Care to explain this box?',
        a: ['Where did you— That\'s private.'],
        follow: { q: "The slip says: 'Outings with Mum & Dad. Recipient: John, age 6.'", confess: true } },
    ],
  },
};

const CONFESSION = [
  '(he puts the phone down)',
  'Fine. We designed them.',
  'We wanted him to remember us being there. The park, the games.',
  'We never had the time to actually be those parents. So we gave him the memories instead.',
];

// Shown on the report screen. Checked if the player found it.
const FINDINGS = [
  { flag: 'CONFESSED', text: 'Parents admitted to giving John NURA patches' },
  { flag: 'BOX', text: 'Found a hidden supply of patches made for John' },
  { flag: 'MISSING_MEMORY', text: 'John can no longer remember his time with Grandma' },
  { flag: 'NEGLECT', text: "John missed school while Grandma was in hospital" },
  { flag: 'JOHN_STICKER', text: 'John described the patch as a "sticker" from Dad' },
];
