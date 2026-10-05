# Tricards · Chinese 101

Three-sided notecards for UChicago Chinese 101: **characters → pinyin → definition**.

A static site with no build step. Open `index.html` locally, or host it free with GitHub Pages.

## Features

- **Three-sided cards.** Tap to cycle through characters, pinyin, and definition. You can change the side order in Settings, so a card can start on pinyin or on the definition instead.
- **Slow audio.** Click the pinyin to hear it in Mandarin. Speed is adjustable (0.6× by default), you can pick the voice, and audio can play automatically when the pinyin side appears.
- **Three modes:** Characters, Phrases, and Conversations. Conversation cards show every line, and you can play one line or the whole dialog.
- **Units.** Study one unit, several at once, or all of them.
- **Flashcards.** Swipe right for "know it" and left for "still learning", or use the buttons or arrow keys. Cards you're still learning come back each round until everything is mastered. Includes undo and shuffle, and saves your progress.
- **View all.** See every card at once, with search (`ni hao` finds 你好). You can blur one side to test yourself.
- **Match.** A timed game for pairing characters with pinyin or definitions. Wrong pairs add a penalty, and your best time is saved.
- **Quiz.** Multiple choice for any combination of sides, plus a listening mode (hear it, then pick it).
- **Write.** Type the pinyin (`ni3 hao3` or `nǐ hǎo`), the characters, or the meaning. Answers with the right letters but wrong tones are flagged.
- Tone colors, starred cards, a "Needs work" filter, dark mode, three character styles (黑体 / 宋体 / 楷体), keyboard shortcuts, and a mobile-friendly layout.

Progress is saved in your browser (localStorage).

## Adding cards

Everything lives in [`js/data.js`](js/data.js). Each unit has `characters`, `phrases`, and `conversations`:

```js
{
  id: 'unit-1',
  name: 'Unit 1',
  characters: [
    ['你', 'nǐ', 'you'],
    { hanzi: '好', pinyin: 'hǎo', english: 'good', notes: 'optional note' },
  ],
  phrases: [
    ['你好', 'nǐ hǎo', 'hello'],
  ],
  conversations: [
    {
      title: 'Greetings',
      lines: [
        ['A', '你好！', 'Nǐ hǎo!', 'Hello!'],
        ['B', '你好！', 'Nǐ hǎo!', 'Hello!'],
      ],
    },
  ],
}
```

Use tone marks in pinyin and put spaces between syllables. Don't change a unit's `id` once you've started studying, because your saved progress is linked to it. Changing `name` is fine.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` / `Enter` | Flip card |
| `→` / `←` | Know it / Still learning |
| `Z` | Undo |
| `S` | Play pronunciation |
| `1`–`4` | Quiz answer |
| `/` | Search (View all) |

## Hosting on GitHub Pages

1. Go to **Settings → Pages** in this repo.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. After a minute, the site will be live at `https://jacksonhickey.github.io/Chinese101-Tricards/`.

## Audio

Audio uses a Chinese voice from your device's built-in speech engine when one is installed. If none is found, it switches automatically to an online voice from Google Translate's unofficial text-to-speech endpoint. The online voice needs internet and could stop working without notice. You can choose the audio source in **Settings → Pronunciation**.

To use a voice installed on your device instead:

- **Windows:** go to Settings → Time & language → Speech → Add voices, then install **Chinese (Simplified, China)**.
- **Mac:** go to System Settings → Accessibility → Spoken Content → System voice → Manage voices, then install a Chinese voice.
- **iPhone/Android, Chrome, Edge:** Mandarin voices are usually already included.
