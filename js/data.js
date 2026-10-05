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
 *   - Use tone marks in pinyin (nǐ hǎo). Put a space between syllables if you
 *     want characters to be tone-colored one-by-one.
 *   - Unit `id`s are used to save your progress, so don't rename them once
 *     you've started studying (changing `name` is fine).
 *   - Add more units by copying one of the blocks below.
 */

window.TRICARDS_UNITS = [
  {
    id: 'unit-1',
    name: 'Unit 1',
    description: '',
    characters: [],
    phrases: [],
    conversations: [],
  },
  {
    id: 'unit-2',
    name: 'Unit 2',
    description: '',
    characters: [],
    phrases: [],
    conversations: [],
  },
  {
    id: 'unit-3',
    name: 'Unit 3',
    description: '',
    characters: [],
    phrases: [],
    conversations: [],
  },
  {
    id: 'unit-4',
    name: 'Unit 4',
    description: '',
    characters: [],
    phrases: [],
    conversations: [],
  },
  {
    id: 'unit-5',
    name: 'Unit 5',
    description: '',
    characters: [],
    phrases: [],
    conversations: [],
  },
];
