/*
 * Tricards vocabulary data
 * ------------------------
 * Each unit has three lists, one per mode:
 *
 *   characters    – single characters        e.g. 你
 *   phrases       – words / phrases          e.g. 你好
 *   conversations – short multi-line dialogs
 *
 * Characters and phrases can be written either as objects or as short arrays:
 *
 *   { hanzi: '你', pinyin: 'nǐ', english: 'you', notes: 'optional' }
 *   ['你', 'nǐ', 'you']                      // [hanzi, pinyin, english, notes?]
 *
 * Conversations have a title and a list of lines:
 *
 *   {
 *     title: 'Greetings',
 *     lines: [
 *       { speaker: 'A', hanzi: '你好！', pinyin: 'Nǐ hǎo!', english: 'Hello!' },
 *       ['B', '你好！', 'Nǐ hǎo!', 'Hello!'],  // [speaker, hanzi, pinyin, english]
 *     ],
 *   }
 *
 * Tips:
 *   - Use tone marks in pinyin (nǐ hǎo).
 *   - Unit `id`s are used to save your progress, so don't rename them once
 *     you've started studying (changing `name` is fine).
 *   - Add more units by copying the block below.
 */

window.TRICARDS_UNITS = [
  {
    id: 'unit-1',
    name: 'Unit 1',
    description: 'Names and greetings',
    characters: [
      ['你', 'nǐ', 'you'],
      ['贵', 'guì', 'honorable; expensive'],
      ['姓', 'xìng', 'surname; to be surnamed'],
      ['呢', 'ne', 'question particle ("and…?")'],
      ['我', 'wǒ', 'I; me'],
      ['王', 'Wáng', 'Wang (a surname); king'],
      ['叫', 'jiào', 'to be called; to call'],
      ['什', 'shén', 'what (in 什么)', 'Used in 什么 shénme'],
      ['么', 'me', '(suffix in 什么)', 'Used in 什么 shénme'],
      ['名', 'míng', 'name'],
      ['字', 'zì', 'character; word', 'Neutral tone (zi) in 名字 míngzi'],
      ['不', 'bù', 'not; no'],
      ['老', 'lǎo', 'old'],
      ['师', 'shī', 'teacher'],
      ['先', 'xiān', 'first; before'],
      ['生', 'shēng', 'to be born; life', 'Neutral tone (sheng) in 先生 xiānsheng'],
    ],
    phrases: [
      ['你贵姓？', 'Nǐ guì xìng?', 'What is your (honorable) surname?'],
      ['你呢？', 'Nǐ ne?', 'And you?'],
      ['我姓王。', 'Wǒ xìng Wáng.', 'My surname is Wang.'],
      ['你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'What is your name?'],
      ['什么', 'shénme', 'what'],
      ['名字', 'míngzi', 'name'],
      ['不', 'bù', 'not; no'],
      ['老师', 'lǎoshī', 'teacher'],
      ['先生', 'xiānsheng', 'Mr.; sir; husband'],
    ],
    conversations: [],
  },
];
