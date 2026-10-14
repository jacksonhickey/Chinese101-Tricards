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
    description: 'Greetings (Integrated Chinese Lesson 1)',
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
      ['什', 'shén', 'what (first half of the word for "what")', 'Used in 什么 shénme'],
      ['么', 'me', 'suffix (second half of the word for "what")', 'Used in 什么 shénme'],
      ['名', 'míng', 'name'],
      ['字', 'zì', 'character; word', 'Neutral tone (zi) in 名字 míngzi'],
      ['先', 'xiān', 'first; before', 'Used in 先生 xiānsheng (Mr.)'],
      ['生', 'shēng', 'to be born; life; student', 'Neutral tone (sheng) in 先生 xiānsheng'],
      ['李', 'Lǐ', 'a common surname; plum', 'As in 李友 Lǐ Yǒu'],
      ['友', 'yǒu', 'friend', 'As in 李友 Lǐ Yǒu and 朋友 péngyou'],
      ['王', 'Wáng', 'a common surname; king', 'As in 王朋 Wáng Péng'],
      ['朋', 'péng', 'friend; companion', 'As in 王朋 Wáng Péng and 朋友 péngyou'],
      ['是', 'shì', 'to be (am, is, are)'],
      ['老', 'lǎo', 'old', 'As in 老师 lǎoshī (teacher)'],
      ['师', 'shī', 'teacher; master', 'As in 老师 lǎoshī (teacher)'],
      ['吗', 'ma', 'yes/no question particle', 'Put at the end of a statement to make a question: 你是老师吗？'],
      ['不', 'bù', 'not; no', 'Changes to bú before a 4th tone: 不是 bú shì'],
      ['学', 'xué', 'to study; to learn', 'As in 学生 xuésheng (student)'],
      ['也', 'yě', 'also; too'],
      ['人', 'rén', 'person; people', 'As in 中国人 Zhōngguórén (Chinese person)'],
      ['中', 'zhōng', 'middle; center', 'As in 中国 Zhōngguó (China)'],
      ['国', 'guó', 'country; nation', 'As in 中国 Zhōngguó (China) and 美国 Měiguó (USA)'],
      ['美', 'měi', 'beautiful', 'As in 美国 Měiguó (USA)'],
      ['纽', 'niǔ', 'button; knob', 'As in 纽约 Niǔyuē (New York)'],
      ['约', 'yuē', 'to make an appointment; approximately', 'As in 纽约 Niǔyuē (New York)'],
      ['北', 'běi', 'north', 'As in 北京 Běijīng (Beijing)'],
      ['京', 'jīng', 'capital (city)', 'As in 北京 Běijīng (Beijing)'],
      ['小', 'xiǎo', 'small; little; young', 'As in 小姐 xiǎojiě (Miss)'],
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
  {
    id: 'unit-2',
    name: 'Unit 2',
    description: 'Family (Integrated Chinese Lesson 2)',
    characters: [
      ['那', 'nà', 'that', 'Also pronounced nèi'],
      ['的', 'de', "possessive particle ('s)", '我的 wǒ de = my; 你的 nǐ de = your'],
      ['照', 'zhào', 'to shine; to take (a photo)', 'As in 照片 zhàopiàn (photo)'],
      ['片', 'piàn', 'slice; flat, thin piece', 'As in 照片 zhàopiàn (photo)'],
      ['这', 'zhè', 'this', 'Also pronounced zhèi'],
      ['爸', 'bà', 'dad', '爸爸 bàba = dad'],
      ['妈', 'mā', 'mom', '妈妈 māma = mom'],
      ['个', 'gè / ge', 'measure word (general)', 'Usually neutral tone: 一个人 yí ge rén = one person'],
      ['儿', 'ér', 'son; child', "As in 儿子 érzi (son) and 女儿 nǚ'ér (daughter)"],
      ['哥', 'gē', 'older brother', '哥哥 gēge = older brother; 大哥 dàgē = eldest brother'],
      ['他', 'tā', 'he; him'],
      ['弟', 'dì', 'younger brother', '弟弟 dìdi = younger brother'],
      ['男', 'nán', 'male'],
      ['她', 'tā', 'she; her'],
      ['谁', 'shéi', 'who; whom', 'Also pronounced shuí'],
      ['孩', 'hái', 'child', 'As in 孩子 háizi (child)'],
    ],
    phrases: [],
    conversations: [],
  },
];
