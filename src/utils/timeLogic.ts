/**
 * English Time Logic Engine for Junior High School Curriculum
 * Handles:
 * - What time is it? / What's the time?
 * - It's ... o'clock
 * - It's [minutes] past [hour] (1-30 mins, quarter past, half past)
 * - It's [60-minutes] to [nextHour] (31-59 mins, quarter to)
 * - Digital reading: [hour] [minutes]
 * - Daily Routine context and grammar rules
 */

export type TimeZoneType =
  | 'O_CLOCK'
  | 'PAST'
  | 'QUARTER_PAST'
  | 'HALF_PAST'
  | 'QUARTER_TO'
  | 'TO';

export interface TimeExpression {
  hour12: number;
  minute: number;
  traditional: string; // e.g. "a quarter past seven"
  traditionalSentence: string; // e.g. "It's a quarter past seven."
  digital: string; // e.g. "seven fifteen"
  digitalSentence: string; // e.g. "It's seven fifteen."
  displayDigital: string; // e.g. "07:15"
  zone: TimeZoneType;
  zoneTitle: string; // e.g. "Past 区间"
  zoneExplanation: string; // Bilingual teaching explanation
  formula: string; // e.g. "a quarter + past + 点钟"
  nextHour12: number;
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
  21: 'twenty-one',
  22: 'twenty-two',
  23: 'twenty-three',
  24: 'twenty-four',
  25: 'twenty-five',
  26: 'twenty-six',
  27: 'twenty-seven',
  28: 'twenty-eight',
  29: 'twenty-nine',
  30: 'thirty',
  31: 'thirty-one',
  32: 'thirty-two',
  33: 'thirty-three',
  34: 'thirty-four',
  35: 'thirty-five',
  36: 'thirty-six',
  37: 'thirty-seven',
  38: 'thirty-eight',
  39: 'thirty-nine',
  40: 'forty',
  41: 'forty-one',
  42: 'forty-two',
  43: 'forty-three',
  44: 'forty-four',
  45: 'forty-five',
  46: 'forty-six',
  47: 'forty-seven',
  48: 'forty-eight',
  49: 'forty-nine',
  50: 'fifty',
  51: 'fifty-one',
  52: 'fifty-two',
  53: 'fifty-three',
  54: 'fifty-four',
  55: 'fifty-five',
  56: 'fifty-six',
  57: 'fifty-seven',
  58: 'fifty-eight',
  59: 'fifty-nine',
};

export function getNumberWord(n: number): string {
  return NUMBER_WORDS[n] || String(n);
}

/**
 * Convert hour (1-12) and minute (0-59) into complete pedagogical English expressions
 */
export function getTimeExpression(hour: number, minute: number): TimeExpression {
  // Normalize hour to 1-12
  let h = hour % 12;
  if (h === 0) h = 12;
  const nextH = h === 12 ? 1 : h + 1;

  const hWord = getNumberWord(h);
  const nextHWord = getNumberWord(nextH);
  const padMinute = minute < 10 ? `0${minute}` : `${minute}`;
  const padHour = h < 10 ? `0${h}` : `${h}`;
  const displayDigital = `${padHour}:${padMinute}`;

  // Digital format
  let digital = '';
  if (minute === 0) {
    digital = `${hWord} o'clock`;
  } else if (minute < 10) {
    digital = `${hWord} oh ${getNumberWord(minute)}`;
  } else {
    digital = `${hWord} ${getNumberWord(minute)}`;
  }

  // Traditional format (Past & To)
  let traditional = '';
  let zone: TimeZoneType = 'O_CLOCK';
  let zoneTitle = "整点 (o'clock)";
  let zoneExplanation = "分钟为0时，用 点钟 + o'clock。";
  let formula = "点钟 + o'clock";

  if (minute === 0) {
    zone = 'O_CLOCK';
    traditional = `${hWord} o'clock`;
    zoneTitle = "整点 (o'clock)";
    zoneExplanation = "当时间为整点时，用「点钟 + o'clock」。也可以直接说点钟数字。";
    formula = `${hWord} + o'clock`;
  } else if (minute === 15) {
    zone = 'QUARTER_PAST';
    traditional = `a quarter past ${hWord}`;
    zoneTitle = '一刻钟 (a quarter past)';
    zoneExplanation = '15分钟在英语中常表达为「a quarter」(一刻钟)。过了该点钟，用「a quarter past + 原点钟」。';
    formula = `a quarter + past + ${hWord}`;
  } else if (minute === 30) {
    zone = 'HALF_PAST';
    traditional = `half past ${hWord}`;
    zoneTitle = '半点 (half past)';
    zoneExplanation = '30分钟在英语中常表达为「half」(一半)。过了该点钟，用「half past + 原点钟」。';
    formula = `half + past + ${hWord}`;
  } else if (minute < 30) {
    zone = 'PAST';
    const mWord = getNumberWord(minute);
    traditional = `${mWord} past ${hWord}`;
    zoneTitle = '过了几分 (past 区间)';
    zoneExplanation = `分钟数在 1~29 分钟内时，使用「分钟数 + past + 原点钟」，表示“过了几点几分”。`;
    formula = `${mWord} + past + ${hWord}`;
  } else if (minute === 45) {
    zone = 'QUARTER_TO';
    traditional = `a quarter to ${nextHWord}`;
    zoneTitle = '差一刻到下一点 (a quarter to)';
    zoneExplanation = `45分钟表示“差一刻钟到下一个点钟”，使用「a quarter to + 下一点钟」。注意是下一点钟(${nextH})！`;
    formula = `a quarter + to + ${nextHWord}`;
  } else {
    zone = 'TO';
    const minsToNext = 60 - minute;
    const mWord = getNumberWord(minsToNext);
    traditional = `${mWord} to ${nextHWord}`;
    zoneTitle = '差几分到下一点 (to 区间)';
    zoneExplanation = `分钟数在 31~59 分钟内时，使用「(60-当前分钟) + to + 下一点钟」，表示“差几分到几点”。当前还差 ${minsToNext} 分钟到 ${nextH} 点！`;
    formula = `${mWord} (差的分钟) + to + ${nextHWord} (下一点钟)`;
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    hour12: h,
    minute,
    traditional,
    traditionalSentence: `It's ${traditional}.`,
    digital,
    digitalSentence: `It's ${digital}.`,
    displayDigital,
    zone,
    zoneTitle,
    zoneExplanation,
    formula,
    nextHour12: nextH,
  };
}

/**
 * Quiz Question Interface
 */
export interface QuizQuestion {
  id: string;
  hour: number;
  minute: number;
  correctAnswer: string;
  type: 'traditional' | 'digital' | 'to-calculation';
  promptChinese: string;
  options: string[];
  explanation: string;
  audioText: string;
}

export function generateRandomQuiz(difficulty: 'beginner' | 'intermediate' | 'advanced'): QuizQuestion {
  let hour = Math.floor(Math.random() * 12) + 1;
  let minute = 0;

  if (difficulty === 'beginner') {
    // 0, 30
    minute = Math.random() < 0.5 ? 0 : 30;
  } else if (difficulty === 'intermediate') {
    // 0, 15, 30, 45
    const presets = [0, 15, 30, 45];
    minute = presets[Math.floor(Math.random() * presets.length)];
  } else {
    // multiples of 5, or any random minute
    const commonMins = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    minute = commonMins[Math.floor(Math.random() * commonMins.length)];
  }

  const timeExp = getTimeExpression(hour, minute);
  const correct = timeExp.traditionalSentence;

  // Generate 3 distractors
  const distractors: string[] = [];

  // Distractor 1: Swapped past/to or wrong hour
  const nextH = hour === 12 ? 1 : hour + 1;
  const prevH = hour === 1 ? 12 : hour - 1;

  if (minute === 0) {
    distractors.push(`It's ${getNumberWord(hour)} fifteen.`);
    distractors.push(`It's half past ${getNumberWord(hour)}.`);
    distractors.push(`It's ${getNumberWord(nextH)} o'clock.`);
  } else if (minute === 15) {
    distractors.push(`It's a quarter to ${getNumberWord(hour)}.`); // wrong preposition
    distractors.push(`It's a quarter past ${getNumberWord(nextH)}.`); // wrong hour
    distractors.push(`It's half past ${getNumberWord(hour)}.`);
  } else if (minute === 30) {
    distractors.push(`It's a quarter past ${getNumberWord(hour)}.`);
    distractors.push(`It's half to ${getNumberWord(nextH)}.`); // common junior high mistake!
    distractors.push(`It's half past ${getNumberWord(nextH)}.`);
  } else if (minute === 45) {
    distractors.push(`It's a quarter to ${getNumberWord(hour)}.`); // didn't increment hour!
    distractors.push(`It's a quarter past ${getNumberWord(nextH)}.`);
    distractors.push(`It's forty-five to ${getNumberWord(nextH)}.`);
  } else if (minute < 30) {
    const minsTo = 60 - minute;
    distractors.push(`It's ${getNumberWord(minute)} to ${getNumberWord(hour)}.`); // used to instead of past
    distractors.push(`It's ${getNumberWord(minsTo)} past ${getNumberWord(hour)}.`);
    distractors.push(`It's ${getNumberWord(minute)} past ${getNumberWord(nextH)}.`);
  } else {
    // minute > 30
    distractors.push(`It's ${getNumberWord(minute)} past ${getNumberWord(hour)}.`); // didn't use to
    distractors.push(`It's ${getNumberWord(60 - minute)} to ${getNumberWord(hour)}.`); // forgot to add 1 to hour!
    distractors.push(`It's ${getNumberWord(60 - minute)} past ${getNumberWord(nextH)}.`);
  }

  // Shuffle options
  const uniqueOptions = Array.from(new Set([correct, ...distractors])).slice(0, 4);
  while (uniqueOptions.length < 4) {
    const randH = Math.floor(Math.random() * 12) + 1;
    const filler = `It's ten past ${getNumberWord(randH)}.`;
    if (!uniqueOptions.includes(filler)) uniqueOptions.push(filler);
  }

  const shuffledOptions = uniqueOptions.sort(() => Math.random() - 0.5);

  return {
    id: `quiz_${Date.now()}_${Math.random()}`,
    hour,
    minute,
    correctAnswer: correct,
    type: 'traditional',
    promptChinese: `钟面上是 ${timeExp.displayDigital}，用英语应该怎么说？`,
    options: shuffledOptions,
    explanation: `${timeExp.displayDigital} 的规范表达是: ${correct} (${timeExp.zoneExplanation})`,
    audioText: `What time is it? ${correct}`,
  };
}

/**
 * Junior High Daily Routine Activities connected to times
 */
export interface DailyRoutineItem {
  id: string;
  activityEn: string;
  activityZh: string;
  sentenceQuestion: string;
  sentenceAnswer: string;
  hour: number;
  minute: number;
  timePhrase: string;
  period: 'morning' | 'afternoon' | 'evening';
  iconName: string;
}

export const DAILY_ROUTINES: DailyRoutineItem[] = [
  {
    id: 'get_up',
    activityEn: 'get up',
    activityZh: '起床',
    sentenceQuestion: 'What time do you get up?',
    sentenceAnswer: 'I get up at half past six in the morning.',
    hour: 6,
    minute: 30,
    timePhrase: 'half past six',
    period: 'morning',
    iconName: 'Sun',
  },
  {
    id: 'breakfast',
    activityEn: 'have breakfast',
    activityZh: '吃早餐',
    sentenceQuestion: 'What time do you have breakfast?',
    sentenceAnswer: 'I have breakfast at a quarter past seven.',
    hour: 7,
    minute: 15,
    timePhrase: 'a quarter past seven',
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'go_to_school',
    activityEn: 'go to school',
    activityZh: '去上学',
    sentenceQuestion: 'What time do you go to school?',
    sentenceAnswer: 'I go to school at twenty to eight.',
    hour: 7,
    minute: 40,
    timePhrase: 'twenty to eight',
    period: 'morning',
    iconName: 'Backpack',
  },
  {
    id: 'start_class',
    activityEn: 'English class starts',
    activityZh: '英语课开始',
    sentenceQuestion: 'What time does English class start?',
    sentenceAnswer: 'English class starts at eight o\'clock.',
    hour: 8,
    minute: 0,
    timePhrase: 'eight o\'clock',
    period: 'morning',
    iconName: 'BookOpen',
  },
  {
    id: 'lunch',
    activityEn: 'have lunch',
    activityZh: '吃午餐',
    sentenceQuestion: 'What time do you have lunch?',
    sentenceAnswer: 'I have lunch at twelve o\'clock noon.',
    hour: 12,
    minute: 0,
    timePhrase: 'twelve o\'clock',
    period: 'afternoon',
    iconName: 'Utensils',
  },
  {
    id: 'play_sports',
    activityEn: 'play basketball / exercise',
    activityZh: '课后体育锻炼',
    sentenceQuestion: 'What time do you play basketball?',
    sentenceAnswer: 'I play basketball at a quarter past four in the afternoon.',
    hour: 4,
    minute: 15,
    timePhrase: 'a quarter past four',
    period: 'afternoon',
    iconName: 'Activity',
  },
  {
    id: 'have_dinner',
    activityEn: 'have dinner',
    activityZh: '吃晚餐',
    sentenceQuestion: 'What time do you have dinner with your family?',
    sentenceAnswer: 'I have dinner at half past six in the evening.',
    hour: 6,
    minute: 30,
    timePhrase: 'half past six',
    period: 'evening',
    iconName: 'Soup',
  },
  {
    id: 'do_homework',
    activityEn: 'do homework',
    activityZh: '做作业与阅读',
    sentenceQuestion: 'What time do you do your homework?',
    sentenceAnswer: 'I do my homework at a quarter to eight.',
    hour: 7,
    minute: 45,
    timePhrase: 'a quarter to eight',
    period: 'evening',
    iconName: 'Pencil',
  },
  {
    id: 'go_to_bed',
    activityEn: 'go to bed',
    activityZh: '睡觉休息',
    sentenceQuestion: 'What time do you go to bed?',
    sentenceAnswer: 'I go to bed at ten o\'clock.',
    hour: 10,
    minute: 0,
    timePhrase: 'ten o\'clock',
    period: 'evening',
    iconName: 'Moon',
  },
];
