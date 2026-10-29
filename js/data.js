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
      ['有', 'yǒu', 'to have; there is / there are', 'Negated with 没 méi, not 不: 没有 méiyǒu'],
      ['没', 'méi', 'not (to have)', '没有 méiyǒu = to not have'],
      ['高', 'gāo', 'tall; high; a surname', 'As in 高文中 Gāo Wénzhōng'],
      ['文', 'wén', 'writing; language; script', 'As in 中文 Zhōngwén (Chinese language) and 高文中 Gāo Wénzhōng'],
      ['家', 'jiā', 'family; home', '你家有几个人？ How many people are in your family?'],
      ['几', 'jǐ', 'how many (usually fewer than ten)', 'Used with a measure word: 几个人 jǐ ge rén'],
      ['两', 'liǎng', 'two (before a measure word)', '两个人 liǎng ge rén, not 二个人'],
      ['妹', 'mèi', 'younger sister', '妹妹 mèimei = younger sister'],
      ['和', 'hé', 'and', 'Joins nouns only: 爸爸和妈妈'],
      ['做', 'zuò', 'to do; to make', '做什么 zuò shénme = do what'],
      ['作', 'zuò', 'to do; work (as in the word for "job")', 'As in 工作 gōngzuò (job; to work)'],
      ['律', 'lǜ', 'law; rule', 'As in 律师 lǜshī (lawyer)'],
      ['都', 'dōu', 'both; all', 'Goes before the verb: 我们都是学生'],
      ['医', 'yī', 'medicine; medical', 'As in 医生 yīshēng (doctor)'],
      ['白', 'bái', 'white; a surname', "As in 白英爱 Bái Yīng'ài"],
      ['英', 'yīng', 'hero; flower; English', "As in 英文 Yīngwén (English) and 白英爱 Bái Yīng'ài"],
      ['爱', 'ài', 'love; to love', "As in 白英爱 Bái Yīng'ài"],
    ],
    phrases: [],
    conversations: [],
  },
  {
    id: 'unit-3',
    name: 'Unit 3',
    description: 'Dates and Time (Integrated Chinese Lesson 3)',
    characters: [
      ['号', 'hào', 'day of the month; number', '九月十二号 jiǔ yuè shí\'èr hào = September 12th'],
      ['星', 'xīng', 'star', 'As in 星期 xīngqī (week)'],
      ['期', 'qī', 'period of time', 'As in 星期 xīngqī (week); 星期一 = Monday'],
      ['天', 'tiān', 'day; sky', 'As in 今天 jīntiān (today)'],
      ['今', 'jīn', 'now; present', 'As in 今天 jīntiān (today) and 今年 jīnnián (this year)'],
      ['年', 'nián', 'year', 'As in 今年 jīnnián (this year)'],
      ['多', 'duō', 'many; much; how (old, many…)', '多大 duō dà = how old'],
      ['岁', 'suì', 'years old; age', '我十八岁 = I am 18 years old'],
      ['吃', 'chī', 'to eat'],
      ['饭', 'fàn', 'meal; cooked rice', '吃饭 chī fàn = to eat (a meal)'],
      ['怎', 'zěn', 'how (first part of "how about it?")', 'As in 怎么样 zěnmeyàng (how about it?) and 怎么 zěnme (how)'],
      ['样', 'yàng', 'appearance; manner; kind', 'As in 怎么样 zěnmeyàng (how about it?)'],
      ['太', 'tài', 'too; extremely', '太…了 tài…le: 太好了！ = Great!'],
      ['了', 'le', 'particle (completed action; change; "too…!")', '太好了 tài hǎo le = that\'s great'],
      ['谢', 'xiè', 'to thank', '谢谢 xièxie = thank you'],
      ['喜', 'xǐ', 'happy; to like', 'As in 喜欢 xǐhuan (to like)'],
      ['欢', 'huān', 'joyful (second part of "to like")', 'Neutral tone (huan) in 喜欢 xǐhuan'],
      ['菜', 'cài', 'dish; cuisine; vegetable', '中国菜 Zhōngguó cài = Chinese food'],
      ['还', 'hái', 'also; in addition; still', 'As in 还是 háishi (or, in questions)'],
      ['可', 'kě', 'can; may', 'As in 可是 kěshì (but) and 可以 kěyǐ (can)'],
      ['们', 'men', 'plural suffix (for people)', '我们 wǒmen = we; 你们 nǐmen = you all'],
      ['点', 'diǎn', "o'clock; dot; a little", "七点 qī diǎn = seven o'clock"],
      ['半', 'bàn', 'half', '七点半 qī diǎn bàn = 7:30'],
      ['晚', 'wǎn', 'evening; late', 'As in 晚上 wǎnshang (evening)'],
      ['上', 'shàng', 'up; above; on', 'Neutral tone (shang) in 晚上 wǎnshang'],
      ['见', 'jiàn', 'to see', 'As in 再见 zàijiàn (goodbye)'],
      ['再', 'zài', 'again', 'As in 再见 zàijiàn (goodbye; "see you again")'],
      ['日', 'rì', 'sun; day', 'As in 生日 shēngrì (birthday) and 星期日 xīngqīrì (Sunday)'],
      ['现', 'xiàn', 'present; current', 'As in 现在 xiànzài (now)'],
      ['在', 'zài', 'at; in; to be (located) at', 'As in 现在 xiànzài (now)'],
      ['刻', 'kè', 'quarter (of an hour)', '三点一刻 sān diǎn yí kè = 3:15'],
      ['事', 'shì', 'matter; thing; affair', '有事 yǒu shì = to have something to do; to be busy'],
      ['很', 'hěn', 'very', 'Often used before adjectives even without stress: 我很忙'],
      ['忙', 'máng', 'busy'],
      ['明', 'míng', 'bright; next (day / year)', 'As in 明天 míngtiān (tomorrow)'],
      ['为', 'wèi', 'for; because of', 'As in 因为 yīnwèi (because) and 为什么 wèishénme (why)'],
      ['因', 'yīn', 'cause; reason', 'As in 因为 yīnwèi (because)'],
      ['同', 'tóng', 'same; together', 'As in 同学 tóngxué (classmate)'],
      ['认', 'rèn', 'to recognize', 'As in 认识 rènshi (to know someone; to meet)'],
      ['识', 'shí', 'to know; knowledge', 'Neutral tone (shi) in 认识 rènshi'],
    ],
    phrases: [],
    conversations: [],
  },
];
