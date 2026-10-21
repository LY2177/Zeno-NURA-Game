/* =========================================================
   GAME DATA — edit text, hotspots and dialogue here.
   All positions are in "stage" pixels: the game is laid out
   on a 1512 x 892 canvas (same as the Figma frames) and
   scaled to fit the screen.
   ========================================================= */

// ---------- Scenes ----------
// bg: [x, y, width, height] placement of the background image (from Figma)
// hotspots: [x, y, w, h] tap areas. action types:
//   popup  -> show an item card (see ITEMS)
//   diary  -> open a diary (see DIARIES)
//   talk   -> open a conversation (see CHARACTERS)
//   go     -> move to another scene
//   note   -> short observation toast at the bottom
const SCENES = {
  john_before: {
    label: "John's Room",
    img: 'assets/scenes/john_before.webp',
    bg: [0, 0, 1620, 971],
    hotspots: [
      { id: 'diary', name: 'Diary', rect: [930, 525, 175, 110], action: { type: 'diary', id: 'before' } },
      { id: 'games', name: 'Board Games', rect: [725, 45, 515, 155], action: { type: 'popup', id: 'boardgames' } },
      { id: 'drawing', name: 'Drawing', rect: [268, 100, 118, 160], action: { type: 'note', text: "A crayon drawing of a green dinosaur under a big yellow sun. It's been stuck up with care." } },
      { id: 'plush', name: 'Plushie', rect: [540, 435, 150, 155], action: { type: 'note', text: 'A dinosaur plushie. The fabric on its belly is worn thin from hugging.' } },
      { id: 'door', name: 'Door', rect: [1415, 0, 97, 892], action: { type: 'go', to: 'living' } },
    ],
    exits: [{ label: 'Living Room', side: 'right', to: 'living' }],
  },

  john_after: {
    label: "John's Room",
    img: 'assets/scenes/john_after.webp',
    bg: [-25, -26, 1670, 942],
    hotspots: [
      { id: 'john', name: 'John', rect: [105, 285, 285, 530], action: { type: 'talk', id: 'john' } },
      { id: 'diary', name: 'Diary', rect: [960, 495, 165, 105], action: { type: 'diary', id: 'after' } },
      { id: 'ball', name: 'Soccer Ball', rect: [1105, 20, 165, 145], action: { type: 'popup', id: 'ball' } },
      { id: 'poster', name: 'Posters', rect: [85, 0, 225, 285], action: { type: 'popup', id: 'poster' } },
      { id: 'poster2', name: 'Posters', rect: [1025, 330, 100, 120], action: { type: 'popup', id: 'poster' } },
      { id: 'clock', name: 'Clock', rect: [550, 465, 110, 75], action: { type: 'note', text: 'A digital clock sits where the dinosaur plushie used to be.' } },
      { id: 'door', name: 'Door', rect: [1415, 0, 97, 892], action: { type: 'go', to: 'living' } },
    ],
    exits: [{ label: 'Living Room', side: 'right', to: 'living' }],
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
      { id: 'lamp', name: 'Lamp', rect: [1125, 320, 110, 150], action: { type: 'note', text: "Mum's side of the bed. Neatly made. Nobody's slept in it tonight. Working late again." } },
      { id: 'door', name: 'Door', rect: [1380, 15, 95, 690], action: { type: 'go', to: 'living' } },
    ],
    exits: [{ label: 'Living Room', side: 'right', to: 'living' }],
  },
};

// ---------- Item cards ----------
// img box is placed on the left half of the light panel; rot = tilt in degrees
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
    body: "Hidden in the bedside table. Why do they have so many NURA patches?\n\nA slip is taped to the lid: \"Custom memory: outings with Mum & Dad, park, soccer. Recipient: John, age 6.\"",
    imgs: [{ src: 'assets/items/nura_box.webp', w: 330, rot: -2.4 }],
    flag: 'BOX',
  },
};

// ---------- Diaries ----------
// Each spread = [left page, right page]. Lines starting with "#" are the date.
const DIARIES = {
  before: [
    [
      ['# 12 April', 'Grandma picked me up today.', 'We played my dinosaur board game. I won.', 'Mummy and Daddy came home late again. I wanted to show Daddy my dinosaur but he was busy on his phone.', 'Grandma said we can play tomorrow.', 'I like Grandma.'],
      ['# 18 April', "Today I didn't talk much in school.", "The other kids didn't let me play with them.", "I told Grandma but I didn't tell Mummy and Daddy.", 'Grandma hugged me.'],
    ],
    [
      ['# 26 April', 'Daddy said I should talk more.', 'Mummy said I need to make more friends.', "I don't know what to say.", 'I like playing my games with Grandma.'],
      [],
    ],
  ],
  after: [
    [
      ['# 15 May', 'Today Daddy took me outside!', 'We played football together.', 'Mummy took a picture of us.', 'I think Mummy and Daddy like doing things with me.', "I don't really remember playing my dinosaur game anymore."],
      ['# 19 May', 'I made two new friends today!', 'I talked a lot.', 'Daddy says I am more confident now.', 'I think I have always liked playing outside with Mummy and Daddy.', 'Grandma asked me to play my dinosaur game.', "I don't want to."],
    ],
    [
      ['# 30 May', 'Mummy said we went to the park a lot when I was younger.', 'I remember it.', 'I think.', 'Grandma says we used to do lots of things together too.', "But I can't remember."],
      ['# 6 June', 'I asked Grandma why she always picks me up.', 'She said she has always been taking care of me.', "I don't understand.", 'I thought Mummy and Daddy always did.'],
    ],
  ],
};

// ---------- Conversations ----------
// Each topic has 2-3 options. An option can have:
//   req:    flag needed before it appears
//   flag:   flag(s) granted when asked
//   a:      answer lines ("(...)" lines show as actions)
//   follow: a follow-up question that appears after the answer
//   end:    true -> case can be closed after this answer
// Topics can also have req.
const CHARACTERS = {
  john: {
    name: 'John',
    sprite: null, // John stays in the scene on the left
    greet: ["Hi! Are you Daddy's friend? Do you want to see my soccer ball?"],
    topics: [
      {
        id: 'diary', label: 'Ask about Diary',
        options: [
          { id: 'a', q: 'Do you like writing in your diary?',
            a: ['Uh-huh! I write the fun stuff. Like when Daddy took me outside to play football. Mummy took a picture!'],
            follow: { q: 'Do you write about Grandma too?',
              a: ["Sometimes. She picks me up from school. She's always there. I don't know why, though.", 'She was in the hospital for a long, long time. I stayed home and watched lots of TV.', '(giggles)', 'My shirt got really smelly!'],
              flag: 'NEGLECT' } },
          { id: 'b', q: 'Your older pages talk about a dinosaur game. Remember that?',
            a: ["A dinosaur game? ...I wrote that? That's weird. I don't play dinosaur games. Those are for babies."],
            follow: { q: 'It says you played it with Grandma almost every day.',
              a: ["Grandma says that too. She gets sad when I don't remember. But I can't.", "It's like there's a hole there."],
              flag: 'MISSING_MEMORY' } },
          { id: 'c', q: "In April you wrote the other kids wouldn't play with you.",
            a: ["No way! I have two new friends. I talk a lot now. Daddy says I'm confident."],
            follow: { q: 'Were you always this chatty?', a: ["I think so. I've always liked talking... right?"] } },
        ],
      },
      {
        id: 'soccer', label: 'Ask about Soccer',
        options: [
          { id: 'a', q: 'You must really like soccer!',
            a: ["Soccer's the best! Daddy and me play at the park every weekend. We always did, since I was little."] },
          { id: 'b', q: 'Your soccer ball looks brand new.',
            a: ["It's... new-ish. I play with it lots. I think."],
            follow: { q: 'When did you last play with Daddy?',
              a: ["Um... the one time. With the picture. Daddy's busy on his phone a lot. But he'll play again soon!"] } },
          { id: 'c', q: 'What happened to your dinosaur pictures?',
            a: ["What dinosaur pictures? ...Oh, the green ones? Mummy put them away. She said I'm a big boy now."],
            follow: { q: 'Did you used to like dinosaurs?',
              a: ['Grandma says I loved them. She says Chomper was my favourite.', "I don't know who Chomper is."],
              flag: 'MISSING_MEMORY' } },
        ],
      },
      {
        id: 'nura', label: 'Ask about NURA',
        options: [
          { id: 'a', q: '(Show the wrapper) Have you seen one of these before?',
            a: ["That's my sticker! Daddy put it on my neck. It was cold.", "He said it's medicine to help me make friends."],
            flag: 'JOHN_STICKER',
            follow: { q: 'How many stickers have you had?',
              a: ["Lots, I think? Daddy said not to tell Grandma, 'cause she'd worry.", "There's more in Daddy's room. Next to the bed."],
              flag: 'BOX_HINT' } },
          { id: 'b', q: 'Do you know what NURA is?',
            a: ['Nura? Is it a dinosaur?', '(laughs)', "Wait. I don't like dinosaurs."] },
        ],
      },
    ],
  },

  grandma: {
    name: 'Grandma',
    sprite: 'assets/scenes/grandma_sprite.webp',
    sceneOverride: 'assets/scenes/living.webp', // hide the sofa Grandma while her big sprite is shown
    greet: ["Oh, you must be from the agency. Thank you for coming. I've been so worried about Johnny."],
    topics: [
      {
        id: 'diary', label: "Ask about John's Diary",
        options: [
          { id: 'a', q: "Have you read John's diary?",
            a: ['He used to show it to me every night. Pages and pages of Chomper, his dinosaur.', 'Now he closes it when I come in.'] },
          { id: 'b', q: 'His new entries talk about trips to the park with his parents.',
            a: ["Those trips never happened. They haven't taken him to the park in years. I'm the one who takes him out."],
            follow: { q: 'Why would he write about them, then?', a: ["Because he believes it. That's what frightens me."] } },
          { id: 'c', q: 'In June he asked you why you always pick him up.',
            a: ['He did. As if I were a neighbour helping out.', "I've cared for him since he was a baby. I pick him up, I cook, I wash his uniform."] },
        ],
      },
      {
        id: 'behaviour', label: "Ask about John's Behaviour",
        options: [
          { id: 'a', q: 'Has John changed recently?',
            a: ["He's a different child. Talking, laughing, telling everyone about the park."],
            follow: { q: "Isn't that a good thing?",
              a: ["I'd be glad if it were real. But he can't remember our game.", "Not bored of it. It's just... gone."],
              flag: 'MISSING_MEMORY' } },
          { id: 'b', q: 'When did you first notice?',
            a: ['Early May. Not long after I came home from hospital.'],
            follow: { q: 'What happened while you were away?',
              a: ["Johnny hadn't been to kindergarten once. His clothes were filthy. Nobody had washed a thing."],
              flag: 'NEGLECT' } },
          { id: 'c', q: 'His room looks very different.',
            a: ['They took everything down while I was in hospital. His dinosaur drawings, the ones we made together... I found them in the recycling.', 'That boy has never kicked a ball in his life.'] },
        ],
      },
      {
        id: 'nura', label: 'Ask about NURA',
        options: [
          { id: 'a', q: 'Do you know what NURA is?',
            a: ["I've seen the adverts. 'Change your past.' Toys for people with more money than time."] },
          { id: 'b', q: 'Did you buy anything like this?',
            a: ['Me? I can barely afford my medicine. Those things cost a fortune.'],
            follow: { q: 'Then who do you think used it?',
              a: ["I can't prove anything. But I would never want him to forget me.", 'Can you say the same for everyone in this house?'] } },
        ],
      },
      {
        id: 'wrapper', label: 'Ask about NURA wrapper in trash',
        options: [
          { id: 'a', q: 'I found NURA wrappers in your bin.',
            a: ['In our bin?', '(a long pause)', 'Oh no. Oh, Johnny.'] },
          { id: 'b', q: "There was a receipt too. Several patches, some marked 'custom memory'.",
            a: ["Custom... They're choosing what he remembers? Like picking from a menu?"] },
        ],
      },
      {
        id: 'dadc', label: "Ask about Dad's Comments", req: 'TALKED_DAD',
        options: [
          { id: 'a', q: "John's father says you're exaggerating.",
            a: ["Exaggerating? Ask him the name of Johnny's teacher. Ask him what Johnny eats for breakfast.", "He won't know."] },
          { id: 'b', q: 'He says the changes are good for John.',
            a: ['Good for whom? Johnny thinks his parents love spending time with him. But they still aren\'t here.', "When he works that out, he won't even have his memories of me to fall back on."] },
          { id: 'c', q: "He says your memory isn't what it used to be.", req: 'DAD_MEMORY',
            a: ['(a bitter laugh)', 'My memory is the only one in this house nobody has tampered with.'] },
        ],
      },
      {
        id: 'box', label: 'Ask about the NURA Box', req: 'BOX',
        options: [
          { id: 'a', q: "I found this in the parents' room.",
            a: ['A whole box...', "How many more until he doesn't know me at all?"] },
          { id: 'b', q: 'Did you know this was in the house?',
            a: ['No. They keep their room shut when I\'m around. Now I know why.'],
            follow: { q: 'The order slip names John. Recipient, age 6.',
              a: ["Then it wasn't an accident, and it wasn't once.", 'They chose what he would remember. And they chose to leave me out.'] } },
        ],
      },
    ],
  },

  dad: {
    name: 'Dad',
    sprite: null,
    greet: ['(looking at his phone)', "Sorry, work. You're the case worker? Look, everything's fine here. John's doing great."],
    topics: [
      {
        id: 'diary', label: "Ask about John's Diary",
        options: [
          { id: 'a', q: "Have you read John's diary?",
            a: ["His diary? No. That's his private stuff. He's six, what's he going to write about?"] },
          { id: 'b', q: 'He writes about you taking him to play football.',
            a: ['Right, yeah. Great day. We should do it more.'],
            follow: { q: 'How often do you go?',
              a: ["It's about quality, not quantity. Look, work's been insane."] } },
          { id: 'c', q: "He writes that he can't remember things he did with Grandma.",
            a: ["Kids forget stuff. I don't remember half my childhood either."] },
        ],
      },
      {
        id: 'nura', label: 'Ask about NURA',
        options: [
          { id: 'a', q: 'Do you know what NURA is?',
            a: ["Sure. Half my office uses them. A beach weekend without taking leave. It's perfectly legal."] },
          { id: 'b', q: 'Has John ever used NURA?',
            a: ['Absolutely not. Do you know what those things cost?', "(he doesn't look up from his phone)"] },
          { id: 'c', q: "John says you put a 'sticker' on his neck.", req: 'JOHN_STICKER',
            a: ['(a long pause)', "...He was miserable. The other kids wouldn't play with him. He barely talked to us.", 'I just wanted him to be happy.'],
            follow: { q: 'Just once?', a: ['Once. ...Maybe a couple of times.', "I don't have to answer that."] } },
        ],
      },
      {
        id: 'behaviour', label: "Ask about John's Behaviour",
        options: [
          { id: 'a', q: 'John seems a lot more outgoing now.',
            a: ["Right? Two new friends already. His teacher's thrilled. That's all we ever wanted for him."],
            follow: { q: 'His dinosaur things are all gone.',
              a: ["He outgrew the dinosaur phase. We gave him a fresh start. Soccer's a better fit for a boy his age."] } },
          { id: 'b', q: 'What do you think caused the change?',
            a: ["Kids grow up. And we've been spending more quality time with him."] },
          { id: 'c', q: "Where was John while his grandma was in hospital?",
            a: ['With us. Obviously.'],
            follow: { q: 'Did he go to school?',
              a: ["...It was a hard few weeks. Work was insane.", "It's kindergarten. He didn't miss much."],
              flag: 'NEGLECT' } },
        ],
      },
      {
        id: 'gmac', label: "Ask about Grandma's Comments", req: 'TALKED_GRANDMA',
        options: [
          { id: 'a', q: "Grandma says she's been John's main caregiver.",
            a: ["She helps. She's always been a bit possessive of him, honestly. I'm his father."] },
          { id: 'b', q: 'Grandma says those park trips never happened.',
            a: ["She's getting older. Her memory isn't what it was."], flag: 'DAD_MEMORY' },
          { id: 'c', q: "Grandma says John doesn't remember her anymore.",
            a: ['(quietly)', 'He remembers her. He just... remembers us more now.', 'Is that so bad?'] },
        ],
      },
      {
        id: 'wrapper', label: 'Ask about NURA wrapper in trash',
        options: [
          { id: 'a', q: 'I found NURA wrappers in your bin.',
            a: ['Those are mine. I use them for work. Stress management.'],
            follow: { q: 'The receipt lists family picnics. Baking cookies as a family.',
              a: ["That's... for me and my wife. Not that it's any of your business."] } },
          { id: 'b', q: "Some patches were marked 'custom memory'. What were they?",
            a: ["A holiday. We didn't have time for a real one.", '(he puts the phone face down)'] },
        ],
      },
      {
        id: 'box', label: 'Ask about the NURA Box', req: 'BOX',
        options: [
          { id: 'a', q: 'Care to explain this?',
            a: ['Where did you— That\'s private property.'],
            follow: { q: "There's an order slip. 'Outings with Mum & Dad, park, soccer. Recipient: John, age 6.'", confess: true } },
          { id: 'b', q: 'The label says not for use under 18.',
            a: ['Everyone ignores that label. It was for his own good.'],
            follow: { q: 'Then why hide the box from his grandma?', confess: true } },
        ],
      },
    ],
  },
};

const CONFESSION = [
  '(he puts his phone down)',
  'Fine. Yes. We designed them.',
  'We wanted him to remember us being there. Taking him to the park, playing with him, being the parents he talks about at school.',
  '(a pause)',
  'We just never had the time to actually be those parents. So we gave him the memories instead.',
];

// Shown on the ending screen. Checked if the player found it.
const FINDINGS = [
  { flag: 'CONFESSED', text: 'Parents admitted to giving John NURA patches' },
  { flag: 'BOX', text: 'Found a hidden supply of custom patches made for John' },
  { flag: 'MISSING_MEMORY', text: 'John can no longer remember his time with Grandma' },
  { flag: 'NEGLECT', text: "John missed school and wasn't cared for while Grandma was in hospital" },
  { flag: 'JOHN_STICKER', text: 'John described the patch as a "sticker" from Dad' },
];
