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
    description: 'Greetings: exchanging names',
    characters: [
      ['你', 'nǐ', 'you'],
      ['好', 'hǎo', 'good; fine; OK'],
      ['请', 'qǐng', 'please; to invite'],
      ['问', 'wèn', 'to ask'],
      ['贵', 'guì', 'honorable; expensive'],
      ['姓', 'xìng', 'surname; to be surnamed'],
      ['我', 'wǒ', 'I; me'],
      ['呢', 'ne', 'question particle ("and…?")'],
      ['姐', 'jiě', 'older sister', 'Used in 小姐 xiǎojiě (Miss)'],
      ['叫', 'jiào', 'to be called; to call'],
      ['什', 'shén', 'what (in 什么)', 'Used in 什么 shénme'],
      ['么', 'me', '(suffix in 什么)', 'Used in 什么 shénme'],
      ['名', 'míng', 'name'],
      ['字', 'zì', 'character; word', 'Neutral tone (zi) in 名字 míngzi'],
      ['先', 'xiān', 'first; before', 'Used in 先生 xiānsheng (Mr.)'],
    ],
    phrases: [
      ['你好！', 'Nǐ hǎo!', 'Hello!'],
      ['请问', 'qǐng wèn', 'excuse me; may I ask…'],
      ['你贵姓？', 'Nǐ guì xìng?', 'What is your (honorable) surname?'],
      ['我姓李。', 'Wǒ xìng Lǐ.', 'My surname is Li.'],
      ['你呢？', 'Nǐ ne?', 'And you?'],
      ['我姓王。', 'Wǒ xìng Wáng.', 'My surname is Wang.'],
      ['小姐', 'xiǎojiě', 'Miss; young lady'],
      ['李小姐', 'Lǐ xiǎojiě', 'Miss Li'],
      ['什么', 'shénme', 'what'],
      ['名字', 'míngzi', 'name'],
      ['你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'What is your name?'],
      ['我叫李友。', 'Wǒ jiào Lǐ Yǒu.', 'My name is Li You.'],
      ['先生', 'xiānsheng', 'Mr.; sir; husband'],
      ['王先生', 'Wáng xiānsheng', 'Mr. Wang'],
      ['我叫王朋。', 'Wǒ jiào Wáng Péng.', 'My name is Wang Peng.'],
    ],
    conversations: [
      {
        title: 'Dialogue 1: At school, Wang Peng and Li You meet for the first time',
        lines: [
          ['Wang', '你好！', 'Nǐ hǎo!', 'Hello!'],
          ['Li', '你好！', 'Nǐ hǎo!', 'Hello!'],
          ['Wang', '请问，你贵姓？', 'Qǐng wèn, nǐ guì xìng?', 'Excuse me, what is your surname?'],
          ['Li', '我姓李。你呢？', 'Wǒ xìng Lǐ. Nǐ ne?', 'My surname is Li. And yours?'],
          ['Wang', '我姓王。李小姐，你叫什么名字？', 'Wǒ xìng Wáng. Lǐ xiǎojiě, nǐ jiào shénme míngzi?', 'My surname is Wang. Miss Li, what is your name?'],
          ['Li', '我叫李友。王先生，你叫什么名字？', 'Wǒ jiào Lǐ Yǒu. Wáng xiānsheng, nǐ jiào shénme míngzi?', 'My name is Li You. Mr. Wang, what is your name?'],
          ['Wang', '我叫王朋。', 'Wǒ jiào Wáng Péng.', 'My name is Wang Peng.'],
        ],
      },
    ],
  },
];
