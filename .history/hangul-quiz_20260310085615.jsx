import { useState, useEffect } from "react";
import { translationBank, LEVELS, QUESTIONS_PER_LEVEL } from "./hangul-translation-data.js";

const STORAGE_LEVELS = "hangul-quiz-level-scores";
const STORAGE_WORD_LEVELS = "hangul-quiz-word-level-scores";
const STORAGE_PHRASE_LEVELS = "hangul-quiz-phrase-level-scores";
const STORAGE_GLOBAL = "hangul-quiz-global";

function getLevelScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LEVELS) || "{}");
  } catch {
    return {};
  }
}

function getGlobalStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_GLOBAL) || "{}");
  } catch {
    return {};
  }
}

function saveLevelScore(level, correct, total) {
  const scores = getLevelScores();
  const prev = scores[level] || { best: 0, last: 0, lastTotal: 0, totalCorrect: 0, totalQuestions: 0 };
  scores[level] = {
    best: Math.max(prev.best, correct),
    last: correct,
    lastTotal: total,
    totalCorrect: prev.totalCorrect + correct,
    totalQuestions: prev.totalQuestions + total,
  };
  localStorage.setItem(STORAGE_LEVELS, JSON.stringify(scores));
}

function getWordLevelScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_WORD_LEVELS) || "{}");
  } catch {
    return {};
  }
}

function getPhraseLevelScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PHRASE_LEVELS) || "{}");
  } catch {
    return {};
  }
}

function saveWordLevelScore(level, correct, total) {
  const scores = getWordLevelScores();
  const prev = scores[level] || { best: 0, last: 0, lastTotal: 0, totalCorrect: 0, totalQuestions: 0 };
  scores[level] = {
    best: Math.max(prev.best, correct),
    last: correct,
    lastTotal: total,
    totalCorrect: prev.totalCorrect + correct,
    totalQuestions: prev.totalQuestions + total,
  };
  localStorage.setItem(STORAGE_WORD_LEVELS, JSON.stringify(scores));
}

function savePhraseLevelScore(level, correct, total) {
  const scores = getPhraseLevelScores();
  const prev = scores[level] || { best: 0, last: 0, lastTotal: 0, totalCorrect: 0, totalQuestions: 0 };
  scores[level] = {
    best: Math.max(prev.best, correct),
    last: correct,
    lastTotal: total,
    totalCorrect: prev.totalCorrect + correct,
    totalQuestions: prev.totalQuestions + total,
  };
  localStorage.setItem(STORAGE_PHRASE_LEVELS, JSON.stringify(scores));
}

function saveGlobalStats(correct, total) {
  const g = getGlobalStats();
  const next = {
    totalCorrect: (g.totalCorrect || 0) + correct,
    totalQuestions: (g.totalQuestions || 0) + total,
  };
  localStorage.setItem(STORAGE_GLOBAL, JSON.stringify(next));
}

const COURSE_CONSONANTS = [
  { char: "ㄱ", roman: "g/k", name: "기역" },
  { char: "ㄴ", roman: "n", name: "니은" },
  { char: "ㄷ", roman: "d/t", name: "디귿" },
  { char: "ㄹ", roman: "r/l", name: "리을" },
  { char: "ㅁ", roman: "m", name: "미음" },
  { char: "ㅂ", roman: "b/p", name: "비읍" },
  { char: "ㅅ", roman: "s", name: "시옷" },
  { char: "ㅇ", roman: "-/ng", name: "이응" },
  { char: "ㅈ", roman: "j", name: "지읒" },
  { char: "ㅊ", roman: "ch", name: "치읓" },
  { char: "ㅋ", roman: "k", name: "키읔" },
  { char: "ㅌ", roman: "t", name: "티읕" },
  { char: "ㅍ", roman: "p", name: "피읍" },
  { char: "ㅎ", roman: "h", name: "히읗" },
  { char: "ㄲ", roman: "kk", name: "쌍기역" },
  { char: "ㄸ", roman: "tt", name: "쌍디귿" },
  { char: "ㅃ", roman: "pp", name: "쌍비읍" },
  { char: "ㅆ", roman: "ss", name: "쌍시옷" },
  { char: "ㅉ", roman: "jj", name: "쌍지읒" },
];

const COURSE_VOWELS = [
  { char: "ㅏ", roman: "a" },
  { char: "ㅑ", roman: "ya" },
  { char: "ㅓ", roman: "eo" },
  { char: "ㅕ", roman: "yeo" },
  { char: "ㅗ", roman: "o" },
  { char: "ㅛ", roman: "yo" },
  { char: "ㅜ", roman: "u" },
  { char: "ㅠ", roman: "yu" },
  { char: "ㅡ", roman: "eu" },
  { char: "ㅣ", roman: "i" },
  { char: "ㅐ", roman: "ae" },
  { char: "ㅒ", roman: "yae" },
  { char: "ㅔ", roman: "e" },
  { char: "ㅖ", roman: "ye" },
  { char: "ㅘ", roman: "wa" },
  { char: "ㅙ", roman: "wae" },
  { char: "ㅚ", roman: "oe" },
  { char: "ㅝ", roman: "wo" },
  { char: "ㅞ", roman: "we" },
  { char: "ㅟ", roman: "wi" },
  { char: "ㅢ", roman: "ui" },
];

const COURSE_READING_TIPS = [
  "Chaque syllabe se lit en bloc : consonne + voyelle (ex. 가 = ga), ou consonne + voyelle + consonne finale (ex. 간 = gan).",
  "L’ordre de lecture est de gauche à droite, puis de haut en bas dans le bloc.",
  "ㅇ en début de syllabe ne se prononce pas ; en fin de syllabe il se lit « ng » (ex. 방 = bang).",
  "Les consonnes doubles (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ) sont plus tendues et courtes que les simples.",
  "En fin de syllabe (batchim), ㄱ, ㄷ, ㅂ se prononcent souvent comme k, t, p (sans explosion).",
  "ㄹ en milieu de mot se rapproche du « r » ; en batchim ou avant ㄹ il peut sonner « l ».",
  "Les voyelles verticales (ㅣ, ㅏ, ㅓ) se placent à droite de la consonne ; les horizontales (ㅡ, ㅗ, ㅜ) en dessous.",
  "Quand deux voyelles se combinent (ㅗ + ㅏ = ㅘ wa), la lecture est souvent la somme des deux : ㅘ = wa, ㅝ = wo.",
  "Le batchim (consonne finale) peut se lier à la syllabe suivante : 막내 [망내] (mang-nae). C'est la liaison (연음).",
  "ㅅ, ㅆ en batchim se prononcent « t » (ex. 옷 = ot). ㅈ, ㅊ, ㅌ en batchim aussi : « t ».",
  "Plusieurs consonnes en batchim : seule une est prononcée (ex. 닭 = dak, ㅎ et ㄱ muets comme batchim final).",
  "ㄴ et ㅁ en batchim gardent leur son (n, m) : 산 = san, 감 = gam.",
  "Pour les syllabes avec ㅖ, ㅒ : en pratique ㅖ se dit souvent « ye » comme ㅔ dans beaucoup de mots.",
  "Les voyelles ㅐ et ㅔ se prononcent aujourd'hui presque pareil (entre « è » et « é ») en coréen standard.",
];

const COURSE_TRANSLATION_TIPS = [
  "L’ordre des mots en coréen est souvent Sujet – Objet – Verbe (SOV), différent du français.",
  "Les particules (은/는, 이/가, 을/를) indiquent le rôle du mot ; ne les oublie pas pour comprendre la phrase.",
  "Un même mot peut avoir plusieurs traductions selon le contexte (ex. « 하다 » = faire, mais entre dans beaucoup de verbes).",
  "Les niveaux de politesse changent la forme du verbe (해요, 합니다, 해) ; repère la fin du verbe pour le sens.",
  "Les mots d’origine sino-coréenne (한자어) ressemblent souvent au chinois ; ça peut aider pour deviner le sens.",
  "Pour les noms, vérifie si c’est un mot seul ou un mot composé (ex. 학교 = école, 학생 = élève).",
  "은/는 marque le thème (sujet ou topic) ; 이/가 marque le sujet grammatical.",
  "을/를 est la particule d'objet (나는 밥을 먹어요 = je mange du riz).",
  "에 = lieu ou moment ; 에서 = lieu où l'action se déroule.",
  "Les adjectifs coréens se conjuguent comme des verbes (예쁘다 → 예뻐요).",
  "하다 après un nom sino-coréen forme un verbe : 공부하다 = étudier.",
  "Le négatif : 안 + verbe (안 가요), ou verbe + 지 않다 (몰라요).",
  "와/과 = avec (et) ; 랑/이랑 plus familier (친구와, 친구랑).",
  "Mots de liaison : 그래서 (donc), 그런데 (mais), 하지만 (cependant).",
];

const COURSE_SYLLABLE_STRUCTURE = [
  { pattern: "C + V", example: "가", roman: "ga", note: "Consonne + voyelle" },
  { pattern: "C + V + C", example: "간", roman: "gan", note: "Avec batchim (finale)" },
  { pattern: "C + VV", example: "과", roman: "gwa", note: "Voyelle composée" },
  { pattern: "C + VV + C", example: "관", roman: "gwan", note: "Composée + batchim" },
  { pattern: "ㅇ + V", example: "아", roman: "a", note: "ㅇ muet en début" },
];

const COURSE_PARTICLES = [
  { particle: "은 / 는", usage: "Thème (topic)", ex: "저는 학생이에요" },
  { particle: "이 / 가", usage: "Sujet", ex: "날씨가 좋아요" },
  { particle: "을 / 를", usage: "Objet", ex: "밥을 먹어요" },
  { particle: "에", usage: "Lieu / temps", ex: "학교에 가요" },
  { particle: "에서", usage: "Lieu (action)", ex: "집에서 자요" },
  { particle: "와 / 과", usage: "Avec (et)", ex: "친구와 만나요" },
  { particle: "의", usage: "Possessif", ex: "제 이름" },
];

const PHRASE_QUESTIONS_PER_LEVEL = 20;
const PHRASE_QUIZ_SIZE = 15;
const TOTAL_PHRASE_LEVELS = 50;
const PHRASE_LEVELS = Array.from({ length: TOTAL_PHRASE_LEVELS }, (_, i) => i + 1);

const PHRASE_SEED = [
  ["안녕하세요", "Bonjour", "annyeonghaseyo"],
  ["감사합니다", "Merci beaucoup", "gamsahamnida"],
  ["잘 먹겠습니다", "Bon appétit", "jal meokgetseumnida"],
  ["몇 시예요?", "Quelle heure est-il ?", "myeot siyeyo?"],
  ["이름이 뭐예요?", "Comment vous appelez-vous ?", "ireumi mwoyeyo?"],
  ["한국어를 배워요", "J'apprends le coréen", "hangugeoreul baewoyo"],
  ["오늘 날씨가 좋아요", "Il fait beau aujourd'hui", "oneul nalssiga joayo"],
  ["맛있어요", "C'est délicieux", "masisseoyo"],
  ["괜찮아요", "Ça va", "gwaenchanayo"],
  ["미안해요", "Désolé", "mianhaeyo"],
  ["알겠어요", "Je comprends", "algesseoyo"],
  ["몰라요", "Je ne sais pas", "mollayo"],
  ["다시 말해 주세요", "Pouvez-vous répéter ?", "dasi malhae juseyo"],
  ["천천히 말해 주세요", "Parlez lentement, s'il vous plaît", "cheoncheonhi malhae juseyo"],
  ["도움이 필요해요", "J'ai besoin d'aide", "doumi piryohaeyo"],
  ["화장실이 어디예요?", "Où sont les toilettes ?", "hwajangsiri eodiyeyo?"],
  ["얼마예요?", "C'est combien ?", "eolmayeyo?"],
  ["카드 돼요?", "Est-ce que vous prenez la carte ?", "kadeu dwaeyo?"],
  ["영수증 주세요", "L'addition, s'il vous plaît", "yeongsujeung juseyo"],
  ["여기 있어요", "Je suis là", "yeogi isseoyo"],
  ["내일 봐요", "À demain", "naeil bwayo"],
  ["잘 지냈어요?", "Comment allez-vous ?", "jal jinaesseoyo?"],
  ["처음 뵙겠습니다", "Enchanté", "cheoeum boepgetseumnida"],
  ["잘 부탁해요", "Comptez sur moi", "jal butakhaeyo"],
  ["수고하세요", "Bon travail", "sugohaseyo"],
  ["잘 가요", "Au revoir", "jal gayo"],
  ["안녕히 가세요", "Au revoir (poliment)", "annyeonghi gaseyo"],
  ["안녕히 계세요", "Restez bien", "annyeonghi gyeseyo"],
  ["생일 축하해요", "Joyeux anniversaire", "saengil chukahaeyo"],
  ["건강하세요", "Portez-vous bien", "geonganghaseyo"],
  ["잘 자요", "Bonne nuit", "jal jayo"],
  ["좋은 아침이에요", "Bonjour (matin)", "joeun achimieyo"],
  ["맛있게 드세요", "Bon appétit (à table)", "masitge deuseyo"],
  ["실례합니다", "Excusez-moi", "sillyehamnida"],
  ["괜찮아요?", "Ça va ?", "gwaenchanayo?"],
  ["네, 괜찮아요", "Oui, ça va", "ne, gwaenchanayo"],
  ["아니요, 괜찮지 않아요", "Non, ça ne va pas", "aniyo, gwaenchanji anayo"],
  ["뭐 해요?", "Qu'est-ce que vous faites ?", "mwo haeyo?"],
  ["어디 가요?", "Où allez-vous ?", "eodi gayo?"],
  ["언제 와요?", "Quand venez-vous ?", "eonje wayo?"],
  ["왜요?", "Pourquoi ?", "waeyo?"],
  ["어떻게 지내요?", "Comment allez-vous ?", "eotteoke jinaeyo?"],
  ["뭐 먹을래요?", "Qu'est-ce que vous voulez manger ?", "mwo meogeullaeyo?"],
  ["커피 마실래요?", "Voulez-vous un café ?", "keopi masillaeyo?"],
  ["물 주세요", "De l'eau, s'il vous plaît", "mul juseyo"],
  ["여기 앉아도 돼요?", "Puis-je m'asseoir ici ?", "yeogi anjado dwaeyo?"],
  ["사진 찍어도 돼요?", "Puis-je prendre une photo ?", "sajin jjigeodo dwaeyo?"],
  ["천천히 해도 돼요", "Prenez votre temps", "cheoncheonhi haedo dwaeyo"],
  ["바쁘세요?", "Êtes-vous occupé ?", "bappeuseyo?"],
  ["지금 시간 있어요?", "Avez-vous du temps maintenant ?", "jigeum sigan isseoyo?"],
  ["나중에 해요", "On le fera plus tard", "najunge haeyo"],
  ["바로 가요", "J'y vais tout de suite", "baro gayo"],
  ["조금만 기다려 주세요", "Attendez un peu, s'il vous plaît", "jogeumman gidaryeo juseyo"],
  ["늦어서 미안해요", "Désolé d'être en retard", "neujeoseo mianhaeyo"],
  ["도착했어요", "Je suis arrivé", "dochakaesseoyo"],
  ["출발해요", "On part", "chulbalhaeyo"],
  ["여행 가요", "Je pars en voyage", "yeohaeng gayo"],
  ["공부해요", "J'étudie", "gongbuhaeyo"],
  ["일해요", "Je travaille", "ilhaeyo"],
  ["쉬어요", "Je me repose", "swieoyo"],
  ["운동해요", "Je fais du sport", "undonghaeyo"],
  ["영화 봐요", "Je regarde un film", "yeonghwa bwayo"],
  ["음악 들어요", "J'écoute de la musique", "eumak deureoyo"],
  ["책 읽어요", "Je lis un livre", "chaek ilgeoyo"],
  ["친구 만나요", "Je rencontre des amis", "chingu mannayo"],
  ["집에 가요", "Je rentre à la maison", "jibe gayo"],
  ["회사에 가요", "Je vais au bureau", "hoesae gayo"],
  ["학교에 가요", "Je vais à l'école", "hakgyoe gayo"],
  ["버스 타요", "Je prends le bus", "beoseu tayo"],
  ["지하철 타요", "Je prends le métro", "jihacheol tayo"],
  ["택시 타요", "Je prends un taxi", "taeksi tayo"],
  ["비가 와요", "Il pleut", "biga wayo"],
  ["눈이 와요", "Il neige", "nuni wayo"],
  ["날씨가 추워요", "Il fait froid", "nalssiga chuweoyo"],
  ["날씨가 더워요", "Il fait chaud", "nalssiga deowoyo"],
  ["배고파요", "J'ai faim", "baegopayo"],
  ["목말라요", "J'ai soif", "mongmallayo"],
  ["피곤해요", "Je suis fatigué", "pigonhaeyo"],
  ["기뻐요", "Je suis content", "gippeoyo"],
  ["슬퍼요", "Je suis triste", "seulpeoyo"],
  ["걱정해요", "Je m'inquiète", "geokjeonghaeyo"],
  ["사랑해요", "Je t'aime", "saranghaeyo"],
  ["보고 싶어요", "Tu me manques", "bogo sipeoyo"],
  ["도와주세요", "Aidez-moi", "dowajuseyo"],
  ["가르쳐 주세요", "Apprenez-moi", "gareuchyeo juseyo"],
  ["알려 주세요", "Dites-moi", "allyeo juseyo"],
  ["기다려 주세요", "Attendez-moi", "gidaryeo juseyo"],
  ["전화해 주세요", "Appelez-moi", "jeonhwahae juseyo"],
  ["문자 보내요", "J'envoie un message", "munja bonaeyo"],
  ["이메일 보내요", "J'envoie un e-mail", "imeil bonaeyo"],
  ["만나서 반가워요", "Ravi de vous rencontrer", "mannaseo bangawoyo"],
  ["다음에 또 봐요", "À la prochaine", "daeume tto bwayo"],
  ["조심히 가세요", "Allez-y doucement", "josimhi gaseyo"],
  ["즐거운 하루 되세요", "Bonne journée", "jeulgeoun haru doeseyo"],
  ["편히 쉬세요", "Reposez-vous bien", "pyeonhi swiseyo"],
  ["성공하세요", "Bonne chance (réussir)", "seonggonghaseyo"],
  ["힘내세요", "Courage", "himnaeseyo"],
  ["화이팅", "Allez, courage", "hwaiting"],
  ["정말요?", "Vraiment ?", "jeongmallyo?"],
  ["그래요?", "Ah oui ?", "geuraeyo?"],
  ["그렇군요", "Je vois", "geureokunnyo"],
  ["알겠어요", "D'accord", "algesseoyo"],
  ["네, 알겠어요", "Oui, compris", "ne, algesseoyo"],
  ["아니에요", "Non", "anieyo"],
  ["네", "Oui", "ne"],
  ["여기요", "Ici", "yeogiyo"],
  ["저기요", "S'il vous plaît (pour appeler)", "jeogiyo"],
  ["잠깐만요", "Un instant", "jamkkanmanyo"],
  ["조금만요", "Un peu", "jogeummanyo"],
  ["많이", "Beaucoup", "mani"],
  ["조금", "Un peu", "jogeum"],
  ["매우", "Très", "maeu"],
  ["너무", "Trop", "neomu"],
  ["아주", "Très", "aju"],
  ["정말", "Vraiment", "jeongmal"],
  ["항상", "Toujours", "hangsang"],
  ["가끔", "Parfois", "gakkeum"],
  ["자주", "Souvent", "jaju"],
  ["절대", "Jamais", "jeoldae"],
  ["빨리", "Vite", "ppalli"],
  ["천천히", "Lentement", "cheoncheonhi"],
  ["같이", "Ensemble", "gachi"],
  ["혼자", "Seul", "honja"],
  ["함께", "Ensemble", "hamkke"],
  ["지금", "Maintenant", "jigeum"],
  ["나중에", "Plus tard", "najunge"],
  ["아까", "Tout à l'heure", "akka"],
  ["벌써", "Déjà", "beolsseo"],
  ["아직", "Encore (négatif)", "ajik"],
  ["더", "Plus", "deo"],
  ["덜", "Moins", "deol"],
  // +100 phrases (facile → composé)
  ["좋아요", "C'est bon", "joayo"],
  ["재미있어요", "C'est amusant", "jaemiisseoyo"],
  ["어려워요", "C'est difficile", "eoryeowoyo"],
  ["쉬워요", "C'est facile", "swiwoyo"],
  ["맛없어요", "Ce n'est pas bon", "madeopseoyo"],
  ["추워요", "Il fait froid", "chuweoyo"],
  ["더워요", "Il fait chaud", "deowoyo"],
  ["날씨가 좋아요", "Il fait beau", "nalssiga joayo"],
  ["비가 오네요", "Il pleut (constat)", "biga oneyo"],
  ["눈이 오네요", "Il neige (constat)", "nuni oneyo"],
  ["몇 시에요?", "Quelle heure est-il ?", "myeot sieyo?"],
  ["오늘 뭐 해요?", "Qu'est-ce que tu fais aujourd'hui ?", "oneul mwo haeyo?"],
  ["내일 만나요", "On se voit demain", "naeil mannayo"],
  ["어디서 만나요?", "Où on se retrouve ?", "eodiseo mannayo?"],
  ["뭐 드실래요?", "Que voulez-vous prendre ?", "mwo deusillaeyo?"],
  ["이거 주세요", "Donnez-moi ça", "igeo juseyo"],
  ["저거 주세요", "Donnez-moi ça (là-bas)", "jeogeo juseyo"],
  ["얼마예요?", "C'est combien ?", "eolmayeyo?"],
  ["비싸요", "C'est cher", "bissayo"],
  ["싸요", "C'est pas cher", "ssayo"],
  ["할인해요?", "Vous faites des réductions ?", "halinhaeyo?"],
  ["영수증 주실 수 있어요?", "Pouvez-vous me donner l'addition ?", "yeongsujeung jusil su isseoyo?"],
  ["화장실 어디예요?", "Où sont les toilettes ?", "hwajangsil eodiyeyo?"],
  ["여기 앉아도 돼요?", "Je peux m'asseoir ici ?", "yeogi anjado dwaeyo?"],
  ["사진 찍어도 돼요?", "Je peux prendre une photo ?", "sajin jjigeodo dwaeyo?"],
  ["늦어서 죄송해요", "Désolé d'être en retard", "neujeoseo joesonghaeyo"],
  ["괜찮으세요?", "Ça va ? (poliment)", "gwaenchanseuseyo?"],
  ["잘 지내세요", "Portez-vous bien", "jal jinaeseyo"],
  ["다음에 만나요", "À la prochaine", "daeume mannayo"],
  ["연락할게요", "Je vous contacterai", "yeollakhalgeyo"],
  ["전화 주세요", "Appelez-moi", "jeonhwa juseyo"],
  ["문자 보내 주세요", "Envoyez-moi un message", "munja bonae juseyo"],
  ["기다릴게요", "J'attendrai", "gidarilgeyo"],
  ["빨리 오세요", "Venez vite", "ppalli oseyo"],
  ["천천히 오세요", "Prenez votre temps", "cheoncheonhi oseyo"],
  ["조심히 가세요", "Allez-y prudemment", "josimhi gaseyo"],
  ["수고 많으셨어요", "Merci pour vos efforts", "sugo maneusyeosseoyo"],
  ["고생하셨어요", "Merci pour le travail", "gosaenghasyeosseoyo"],
  ["덕분에 잘 했어요", "J'ai réussi grâce à vous", "deokbune jal haesseoyo"],
  ["도움이 많이 됐어요", "Ça m'a beaucoup aidé", "doumi mani dwaesseoyo"],
  ["설명해 주셔서 감사해요", "Merci de m'avoir expliqué", "seolmyeonghae jusyeoseo gamsahaeyo"],
  ["알려 주셔서 감사해요", "Merci de me l'avoir dit", "allyeo jusyeoseo gamsahaeyo"],
  ["기다려 주셔서 감사해요", "Merci d'avoir attendu", "gidaryeo jusyeoseo gamsahaeyo"],
  ["한국에 왜 왔어요?", "Pourquoi êtes-vous venu en Corée ?", "hanguge wae wasseoyo?"],
  ["한국어를 얼마나 배웠어요?", "Depuis combien de temps apprenez-vous le coréen ?", "hangugeoreul eolmana baewoosseoyo?"],
  ["어디서 한국어를 배워요?", "Où apprenez-vous le coréen ?", "eodiseo hangugeoreul baewoyo?"],
  ["한국 음식을 좋아해요?", "Vous aimez la cuisine coréenne ?", "hanguk eumsigeul joahaeyo?"],
  ["한국 드라마 봐요?", "Vous regardez les dramas coréens ?", "hanguk deurama bwayo?"],
  ["K-pop 좋아해요?", "Vous aimez la K-pop ?", "K-pop joahaeyo?"],
  ["한국에 언제까지 있어요?", "Jusqu'à quand restez-vous en Corée ?", "hanguge eonjekkaji isseoyo?"],
  ["한국 여행은 어땠어요?", "Comment était votre voyage en Corée ?", "hanguk yeohaengeun eottaesseoyo?"],
  ["다음에 또 올게요", "Je reviendrai", "daeume tto olgeyo"],
  ["여기 처음 와요", "C'est ma première fois ici", "yeogi cheoeum wayo"],
  ["혼자 왔어요", "Je suis venu(e) seul(e)", "honja wasseoyo"],
  ["친구랑 왔어요", "Je suis venu(e) avec un ami", "chingurang wasseoyo"],
  ["가족이랑 왔어요", "Je suis venu(e) avec ma famille", "gajokirang wasseoyo"],
  ["일 때문에 왔어요", "Je suis venu(e) pour le travail", "il ttaemune wasseoyo"],
  ["여행하러 왔어요", "Je suis venu(e) en voyage", "yeohaenghareo wasseoyo"],
  ["공부하러 왔어요", "Je suis venu(e) pour étudier", "gongbuhareo wasseoyo"],
  ["여기서 살아요", "J'habite ici", "yeogiseo sarayo"],
  ["서울에 살아요", "J'habite à Séoul", "seoure sarayo"],
  ["한국에 산 지 얼마나 됐어요?", "Depuis combien de temps vivez-vous en Corée ?", "hanguge san ji eolmana dwaesseoyo?"],
  ["한국 생활은 어때요?", "Comment est la vie en Corée ?", "hanguk saenghwareun eottaeyo?"],
  ["한국 음식은 맛있어요?", "La nourriture coréenne est bonne ?", "hanguk eumsigeun masisseoyo?"],
  ["김치 먹어 봤어요?", "Vous avez déjà goûté le kimchi ?", "gimchi meogeo bwasseoyo?"],
  ["불고기 좋아해요?", "Vous aimez le bulgogi ?", "bulgogi joahaeyo?"],
  ["라면 자주 먹어요?", "Vous mangez souvent des ramyeon ?", "ramyeon jaju meogeoyo?"],
  ["커피 한잔 할래요?", "On prend un café ?", "keopi hanjan hallaeyo?"],
  ["점심 먹었어요?", "Vous avez déjeuné ?", "jeomsim meogeosseoyo?"],
  ["저녁 같이 먹을래요?", "On dîne ensemble ?", "jeonyeok gachi meogeullaeyo?"],
  ["내가 살게요", "C'est moi qui paie", "naega salgeyo"],
  ["같이 나눠 낼까요?", "On partage l'addition ?", "gachi nanwo naelkkayo?"],
  ["다음에 제가 살게요", "La prochaine fois c'est moi qui paie", "daeume jega salgeyo"],
  ["오늘 일정이 있어요?", "Vous avez des plans aujourd'hui ?", "oneul iljeongi isseoyo?"],
  ["시간 있으시면 만나요", "Si vous avez le temps, on se voit", "sigan isseusimyeon mannayo"],
  ["바쁘시면 괜찮아요", "Si vous êtes occupé, ce n'est pas grave", "bappeusimyeon gwaenchanayo"],
  ["편하실 때 연락 주세요", "Contactez-moi quand ça vous arrange", "pyeonhasil ttae yeollak juseyo"],
  ["내일 가능해요?", "C'est possible demain ?", "naeil ganeunghaeyo?"],
  ["이번 주말에 뭐 해요?", "Qu'est-ce que vous faites ce week-end ?", "ibeon jumare mwo haeyo?"],
  ["주말에 보통 뭐 해요?", "Qu'est-ce que vous faites d'habitude le week-end ?", "jumare botong mwo haeyo?"],
  ["취미가 뭐예요?", "Quel est votre hobby ?", "chwimiga mwoyeyo?"],
  ["운동 좋아해요?", "Vous aimez le sport ?", "undong joahaeyo?"],
  ["영화 좋아해요?", "Vous aimez les films ?", "yeonghwa joahaeyo?"],
  ["책 읽는 걸 좋아해요?", "Vous aimez lire ?", "chaek ingneun geol joahaeyo?"],
  ["요리할 줄 알아요?", "Vous savez cuisiner ?", "yorihal jul arayo?"],
  ["운전할 줄 알아요?", "Vous savez conduire ?", "unjeonhal jul arayo?"],
  ["한국어로 말해 주세요", "Parlez en coréen, s'il vous plaît", "hangugeoro malhae juseyo"],
  ["천천히 말씀해 주세요", "Parlez lentement, s'il vous plaît", "cheoncheonhi malsseumhae juseyo"],
  ["다시 한번 말해 주세요", "Répétez encore une fois", "dasi hanbeon malhae juseyo"],
  ["무슨 뜻이에요?", "Qu'est-ce que ça veut dire ?", "museun tteusieyo?"],
  ["이걸 한국어로 뭐라고 해요?", "Comment on dit ça en coréen ?", "igeol hangugeoro mworago haeyo?"],
  ["발음이 어려워요", "La prononciation est difficile", "bareumi eoryeowoyo"],
  ["문법이 헷갈려요", "La grammaire me semble confuse", "munbeobi hetgallyeoyo"],
  ["단어를 외우고 있어요", "J'apprends le vocabulaire par cœur", "daneoreul oeugo isseoyo"],
  ["매일 연습해요", "Je m'entraîne tous les jours", "maeil yeonseuphaeyo"],
  ["한국 친구가 있어요", "J'ai un ami coréen", "hanguk chinguga isseoyo"],
  ["한국 친구랑 한국어로 이야기해요", "Je parle coréen avec mon ami coréen", "hanguk chingurang hangugeoro iyagihaeyo"],
  ["아직 잘 못해요", "Je ne parle pas encore bien", "ajik jal motaeyo"],
  ["조금씩 배우고 있어요", "J'apprends petit à petit", "jogeumssik baeugo isseoyo"],
  ["열심히 공부하고 있어요", "J'étudie avec assiduité", "yeolsimhi gongbuhago isseoyo"],
  ["한국어가 점점 나아지고 있어요", "Mon coréen s'améliore peu à peu", "hangugeoga jeomjeom naajigo isseoyo"],
  ["도와주시면 감사하겠어요", "Je vous serais reconnaissant de m'aider", "dowajusimyeon gamsahagesseoyo"],
  ["궁금한 게 있으면 물어봐도 돼요?", "Je peux vous poser des questions si j'en ai ?", "gunggeumhan ge isseumyeon mureobwado dwaeyo?"],
  ["실수해도 괜찮아요", "Ce n'est pas grave de faire des erreurs", "silsuhaedo gwaenchanayo"],
  ["천천히 배우고 있어요", "J'apprends à mon rythme", "cheoncheonhi baeugo isseoyo"],
  ["한국 문화에 관심이 있어요", "Je m'intéresse à la culture coréenne", "hanguk munhwae gwansimi isseoyo"],
  ["한국 역사를 공부하고 있어요", "J'étudie l'histoire de la Corée", "hanguk yeoksareul gongbuhago isseoyo"],
  ["다음 주에 시험이 있어요", "J'ai un examen la semaine prochaine", "daeum jue siheomi isseoyo"],
  ["오늘 회의가 있어요", "J'ai une réunion aujourd'hui", "oneul hoeuiga isseoyo"],
  ["내일 아침에 일찍 일어나야 해요", "Je dois me lever tôt demain matin", "naeil achime iljjik ireonaya haeyo"],
  ["저녁에 약속이 있어요", "J'ai un rendez-vous ce soir", "jeonyeoge yaksogi isseoyo"],
  ["주말에 쉬고 싶어요", "Je voudrais me reposer ce week-end", "jumare swigo sipeoyo"],
  ["피곤해서 일찍 잘 거예요", "Je suis fatigué, je vais me coucher tôt", "pigonhaeseo iljjik jal geoyeyo"],
  ["날씨가 좋으면 밖에 나갈 거예요", "S'il fait beau, je sortirai", "nalssiga joeumyeon bakke nagal geoyeyo"],
  ["비가 오면 집에 있을 거예요", "S'il pleut, je resterai à la maison", "biga omyeon jibe isseul geoyeyo"],
  ["시간이 있으면 같이 영화 볼래요?", "Si tu as le temps, on regarde un film ensemble ?", "sigani isseumyeon gachi yeonghwa bollaeyo?"],
  ["가능하면 내일 만나요", "Si possible, on se voit demain", "ganeunghamyeon naeil mannayo"],
  ["문제가 있으면 말해 주세요", "S'il y a un problème, dites-le-moi", "munjega isseumyeon malhae juseyo"],
  ["궁금한 점이 있으면 언제든 물어보세요", "Si vous avez des questions, n'hésitez pas à demander", "gunggeumhan jeomi isseumyeon eonjedeun mureoboseyo"],
];

function buildPhraseBank() {
  const bank = [];
  for (let i = 0; i < TOTAL_PHRASE_LEVELS * PHRASE_QUESTIONS_PER_LEVEL; i++) {
    const level = Math.floor(i / PHRASE_QUESTIONS_PER_LEVEL) + 1;
    const idx = i % PHRASE_SEED.length;
    const [hangul, translation, roman] = PHRASE_SEED[idx];
    bank.push({ hangul, translation, roman: roman ?? "", level });
  }
  return bank;
}

const phraseBank = buildPhraseBank();

const questions = [
  // Basic syllables (ㅏ vowel)
  { hangul: "가", options: ["ga", "na", "da", "ba"], answer: "ga" },
  { hangul: "나", options: ["ga", "na", "ma", "ra"], answer: "na" },
  { hangul: "다", options: ["ta", "da", "ba", "sa"], answer: "da" },
  { hangul: "라", options: ["na", "la", "ra", "ma"], answer: "ra" },
  { hangul: "마", options: ["ba", "na", "ma", "pa"], answer: "ma" },
  { hangul: "바", options: ["ba", "pa", "da", "sa"], answer: "ba" },
  { hangul: "사", options: ["ja", "sa", "ha", "ba"], answer: "sa" },
  { hangul: "아", options: ["ya", "wa", "a", "eo"], answer: "a" },
  { hangul: "자", options: ["cha", "ja", "sa", "ra"], answer: "ja" },
  { hangul: "차", options: ["ja", "cha", "ha", "ka"], answer: "cha" },
  { hangul: "카", options: ["ka", "ga", "ha", "ta"], answer: "ka" },
  { hangul: "타", options: ["da", "ta", "pa", "ka"], answer: "ta" },
  { hangul: "파", options: ["pa", "ba", "ma", "ha"], answer: "pa" },
  { hangul: "하", options: ["sa", "ja", "ha", "na"], answer: "ha" },
  // Vowels & ㅣ, ㅜ, ㅗ, ㅓ, ㅡ
  { hangul: "이", options: ["u", "i", "e", "o"], answer: "i" },
  { hangul: "우", options: ["u", "o", "i", "eu"], answer: "u" },
  { hangul: "오", options: ["a", "o", "u", "eo"], answer: "o" },
  { hangul: "어", options: ["eo", "eu", "o", "a"], answer: "eo" },
  { hangul: "으", options: ["u", "eu", "i", "eo"], answer: "eu" },
  { hangul: "거", options: ["geo", "go", "gu", "gi"], answer: "geo" },
  { hangul: "너", options: ["neo", "na", "no", "nu"], answer: "neo" },
  { hangul: "더", options: ["deo", "da", "do", "du"], answer: "deo" },
  { hangul: "머", options: ["meo", "ma", "mo", "mu"], answer: "meo" },
  { hangul: "버", options: ["beo", "ba", "bo", "bu"], answer: "beo" },
  { hangul: "서", options: ["seo", "sa", "so", "su"], answer: "seo" },
  { hangul: "저", options: ["jeo", "ja", "jo", "ju"], answer: "jeo" },
  { hangul: "고", options: ["go", "ga", "gu", "geo"], answer: "go" },
  { hangul: "노", options: ["no", "na", "nu", "neo"], answer: "no" },
  { hangul: "도", options: ["do", "da", "du", "deo"], answer: "do" },
  { hangul: "로", options: ["ro", "ra", "ru", "reo"], answer: "ro" },
  { hangul: "모", options: ["mo", "ma", "mu", "meo"], answer: "mo" },
  { hangul: "보", options: ["bo", "ba", "bu", "beo"], answer: "bo" },
  { hangul: "소", options: ["so", "sa", "su", "seo"], answer: "so" },
  { hangul: "조", options: ["jo", "ja", "ju", "jeo"], answer: "jo" },
  { hangul: "구", options: ["gu", "ga", "go", "geo"], answer: "gu" },
  { hangul: "누", options: ["nu", "na", "no", "neo"], answer: "nu" },
  { hangul: "두", options: ["du", "da", "do", "deo"], answer: "du" },
  { hangul: "루", options: ["ru", "ra", "ro", "reo"], answer: "ru" },
  { hangul: "무", options: ["mu", "ma", "mo", "meo"], answer: "mu" },
  { hangul: "부", options: ["bu", "ba", "bo", "beo"], answer: "bu" },
  { hangul: "수", options: ["su", "sa", "so", "seo"], answer: "su" },
  { hangul: "주", options: ["ju", "ja", "jo", "jeo"], answer: "ju" },
  { hangul: "기", options: ["gi", "ga", "gu", "geo"], answer: "gi" },
  { hangul: "니", options: ["ni", "na", "nu", "neo"], answer: "ni" },
  { hangul: "디", options: ["di", "da", "du", "deo"], answer: "di" },
  { hangul: "리", options: ["ri", "ra", "ru", "reo"], answer: "ri" },
  { hangul: "미", options: ["mi", "ma", "mu", "meo"], answer: "mi" },
  { hangul: "비", options: ["bi", "ba", "bu", "beo"], answer: "bi" },
  { hangul: "시", options: ["si", "sa", "su", "seo"], answer: "si" },
  { hangul: "지", options: ["ji", "ja", "ju", "jeo"], answer: "ji" },
  { hangul: "키", options: ["ki", "ka", "ku", "keo"], answer: "ki" },
  { hangul: "티", options: ["ti", "ta", "tu", "teo"], answer: "ti" },
  { hangul: "피", options: ["pi", "pa", "pu", "peo"], answer: "pi" },
  { hangul: "히", options: ["hi", "ha", "hu", "heo"], answer: "hi" },
  // ㅐ, ㅔ, ㅑ, ㅕ, ㅛ, ㅠ
  { hangul: "개", options: ["gae", "ge", "ga", "gwa"], answer: "gae" },
  { hangul: "내", options: ["nae", "ne", "na", "no"], answer: "nae" },
  { hangul: "배", options: ["bae", "be", "ba", "bo"], answer: "bae" },
  { hangul: "세", options: ["se", "sae", "sa", "so"], answer: "se" },
  { hangul: "예", options: ["ye", "yae", "ya", "yo"], answer: "ye" },
  { hangul: "야", options: ["ya", "yae", "yeo", "yo"], answer: "ya" },
  { hangul: "여", options: ["yeo", "ya", "ye", "yu"], answer: "yeo" },
  { hangul: "요", options: ["yo", "ya", "yu", "yeo"], answer: "yo" },
  { hangul: "유", options: ["yu", "yo", "ya", "yeo"], answer: "yu" },
  { hangul: "의", options: ["ui", "eui", "i", "eu"], answer: "ui" },
  { hangul: "와", options: ["wa", "wae", "wo", "we"], answer: "wa" },
  { hangul: "워", options: ["wo", "wa", "we", "wi"], answer: "wo" },
  { hangul: "위", options: ["wi", "we", "wa", "wo"], answer: "wi" },
  // Words – greetings & basics
  { hangul: "한국", options: ["han-guk", "han-kuk", "han-kul", "han-gul"], answer: "han-guk" },
  { hangul: "사랑", options: ["sa-rang", "sa-lang", "sa-ran", "sa-ram"], answer: "sa-rang" },
  { hangul: "안녕", options: ["an-nyong", "an-nyeong", "an-neong", "al-nyeong"], answer: "an-nyeong" },
  { hangul: "감사", options: ["gam-sa", "kam-sa", "gam-ja", "gan-sa"], answer: "gam-sa" },
  { hangul: "물", options: ["mul", "mur", "bul", "mol"], answer: "mul" },
  { hangul: "밥", options: ["bap", "map", "pap", "bab"], answer: "bap" },
  { hangul: "집", options: ["jip", "zip", "chip", "jib"], answer: "jip" },
  { hangul: "책", options: ["chaek", "cheok", "jaek", "taek"], answer: "chaek" },
  { hangul: "학교", options: ["hak-gyo", "hak-kyo", "hag-gyo", "hak-jo"], answer: "hak-gyo" },
  { hangul: "친구", options: ["chin-gu", "cin-ku", "chin-ku", "jin-gu"], answer: "chin-gu" },
  { hangul: "고마워", options: ["go-ma-weo", "go-ma-wo", "ko-ma-wo", "go-mo-wo"], answer: "go-ma-wo" },
  { hangul: "사람", options: ["sa-ram", "sa-lam", "sa-ran", "sa-rang"], answer: "sa-ram" },
  { hangul: "이름", options: ["i-reum", "ee-reum", "i-rum", "yi-reum"], answer: "i-reum" },
  { hangul: "오늘", options: ["o-neul", "o-nul", "o-neol", "oneul"], answer: "o-neul" },
  { hangul: "내일", options: ["nae-il", "ne-il", "na-il", "nae-il"], answer: "nae-il" },
  { hangul: "어제", options: ["eo-je", "o-je", "eo-jae", "e-je"], answer: "eo-je" },
  { hangul: "시간", options: ["si-gan", "shi-gan", "si-kan", "see-gan"], answer: "si-gan" },
  { hangul: "음식", options: ["eum-sik", "um-sik", "eum-shik", "eum-sig"], answer: "eum-sik" },
  { hangul: "커피", options: ["keo-pi", "ko-pi", "keo-fi", "kopi"], answer: "keo-pi" },
  { hangul: "차", options: ["cha", "ja", "sa", "ta"], answer: "cha" },
  { hangul: "우유", options: ["u-yu", "yu-yu", "u-yo", "wo-yu"], answer: "u-yu" },
  { hangul: "빵", options: ["ppang", "pang", "bbang", "bang"], answer: "ppang" },
  { hangul: "고기", options: ["go-gi", "go-ki", "ko-gi", "go-gui"], answer: "go-gi" },
  { hangul: "과일", options: ["gwa-il", "kwa-il", "gwa-il", "go-il"], answer: "gwa-il" },
  { hangul: "사과", options: ["sa-gwa", "sa-gua", "sa-kwa", "sa-go"], answer: "sa-gwa" },
  { hangul: "바나나", options: ["ba-na-na", "pa-na-na", "ba-na-na", "banana"], answer: "ba-na-na" },
  { hangul: "물고기", options: ["mul-go-gi", "mul-ko-gi", "mur-go-gi", "mul-gogi"], answer: "mul-go-gi" },
  { hangul: "강", options: ["gang", "kang", "gang", "kan"], answer: "gang" },
  { hangul: "산", options: ["san", "san", "shan", "sam"], answer: "san" },
  { hangul: "바다", options: ["ba-da", "pa-da", "ba-ta", "bad-da"], answer: "ba-da" },
  { hangul: "하늘", options: ["ha-neul", "ha-nul", "ha-neol", "han-eul"], answer: "ha-neul" },
  { hangul: "땅", options: ["ttang", "tang", "ddang", "dang"], answer: "ttang" },
  { hangul: "나무", options: ["na-mu", "na-mo", "nam-mu", "na-moo"], answer: "na-mu" },
  { hangul: "꽃", options: ["kkot", "kot", "ggot", "kkoth"], answer: "kkot" },
  { hangul: "동물", options: ["dong-mul", "tong-mul", "dong-mur", "dom-mul"], answer: "dong-mul" },
  { hangul: "고양이", options: ["go-yang-i", "ko-yang-i", "go-yangi", "goyang-i"], answer: "go-yang-i" },
  { hangul: "개", options: ["gae", "ge", "kai", "gea"], answer: "gae" },
  { hangul: "새", options: ["sae", "se", "sai", "say"], answer: "sae" },
  { hangul: "가족", options: ["ga-jok", "ka-jok", "ga-juk", "gajok"], answer: "ga-jok" },
  { hangul: "엄마", options: ["eom-ma", "om-ma", "eom-ma", "um-ma"], answer: "eom-ma" },
  { hangul: "아빠", options: ["a-ppa", "a-pa", "appa", "a-ba"], answer: "a-ppa" },
  { hangul: "형", options: ["hyeong", "hyung", "hyong", "hyeung"], answer: "hyeong" },
  { hangul: "누나", options: ["nu-na", "noo-na", "nuna", "nu-na"], answer: "nu-na" },
  { hangul: "오빠", options: ["oppa", "o-ppa", "o-pa", "obba"], answer: "oppa" },
  { hangul: "동생", options: ["dong-saeng", "tong-saeng", "dong-seng", "dongseng"], answer: "dong-saeng" },
  { hangul: "선생님", options: ["seon-saeng-nim", "sun-saeng-nim", "seon-seng-nim", "seonsaengnim"], answer: "seon-saeng-nim" },
  { hangul: "학생", options: ["hak-saeng", "hak-seng", "hag-saeng", "haksaeng"], answer: "hak-saeng" },
  { hangul: "직업", options: ["jik-eop", "jik-up", "jig-eop", "jigeop"], answer: "jik-eop" },
  { hangul: "의사", options: ["ui-sa", "eui-sa", "wi-sa", "uisa"], answer: "ui-sa" },
  { hangul: "간호사", options: ["gan-ho-sa", "kan-ho-sa", "gan-hosa", "ganhosa"], answer: "gan-ho-sa" },
  { hangul: "버스", options: ["beo-seu", "bo-seu", "beoseu", "bus"], answer: "beo-seu" },
  { hangul: "지하철", options: ["ji-ha-cheol", "ji-ha-chul", "jihacheol", "ji-ha-chel"], answer: "ji-ha-cheol" },
  { hangul: "택시", options: ["taek-si", "tek-si", "taeksi", "taxi"], answer: "taek-si" },
  { hangul: "비행기", options: ["bi-haeng-gi", "bi-heng-gi", "bihaenggi", "bi-haeng-gi"], answer: "bi-haeng-gi" },
  { hangul: "여행", options: ["yeo-haeng", "yo-haeng", "yeohaeng", "yeo-heng"], answer: "yeo-haeng" },
  { hangul: "호텔", options: ["ho-tel", "ho-tell", "hotel", "ho-tel"], answer: "ho-tel" },
  { hangul: "병원", options: ["byeong-won", "byung-won", "byeongwon", "byeong-won"], answer: "byeong-won" },
  { hangul: "은행", options: ["eun-haeng", "eun-heng", "eunhaeng", "un-haeng"], answer: "eun-haeng" },
  { hangul: "우체국", options: ["u-che-guk", "u-che-gook", "ucheguk", "u-che-guk"], answer: "u-che-guk" },
  { hangul: "편의점", options: ["pyeon-ui-jeom", "pyon-ui-jeom", "pyeon-uijeom", "pyon-uijeom"], answer: "pyeon-ui-jeom" },
  { hangul: "백화점", options: ["baek-hwa-jeom", "baek-hwa-jum", "baekhwajeom", "bek-hwajeom"], answer: "baek-hwa-jeom" },
  { hangul: "화장실", options: ["hwa-jang-sil", "hwa-jang-shil", "hwajangsil", "hwa-jang-sil"], answer: "hwa-jang-sil" },
  { hangul: "문", options: ["mun", "moon", "mun", "moun"], answer: "mun" },
  { hangul: "창문", options: ["chang-mun", "chang-moon", "changmun", "chang-mun"], answer: "chang-mun" },
  { hangul: "의자", options: ["ui-ja", "eui-ja", "uija", "wi-ja"], answer: "ui-ja" },
  { hangul: "탁자", options: ["tak-ja", "tag-ja", "takja", "tak-ja"], answer: "tak-ja" },
  { hangul: "침대", options: ["chim-dae", "chim-de", "chimdae", "chim-dae"], answer: "chim-dae" },
  { hangul: "전화", options: ["jeon-hwa", "jun-hwa", "jeonhwa", "jeon-hwa"], answer: "jeon-hwa" },
  { hangul: "컴퓨터", options: ["keom-pyu-teo", "kom-pyu-teo", "keompyuteo", "computer"], answer: "keom-pyu-teo" },
  { hangul: "텔레비전", options: ["tel-le-bi-jeon", "tel-le-bi-jun", "tellebijeon", "television"], answer: "tel-le-bi-jeon" },
  { hangul: "영화", options: ["yeong-hwa", "yong-hwa", "yeonghwa", "young-hwa"], answer: "yeong-hwa" },
  { hangul: "음악", options: ["eum-ak", "um-ak", "eumak", "eum-ak"], answer: "eum-ak" },
  { hangul: "노래", options: ["no-rae", "no-re", "norae", "no-rae"], answer: "no-rae" },
  { hangul: "춤", options: ["chum", "choom", "chum", "choum"], answer: "chum" },
  { hangul: "운동", options: ["un-dong", "oon-dong", "undong", "un-dong"], answer: "un-dong" },
  { hangul: "축구", options: ["chuk-gu", "chuk-ku", "chukgu", "chuk-gu"], answer: "chuk-gu" },
  { hangul: "야구", options: ["ya-gu", "ya-ku", "yagu", "ya-gu"], answer: "ya-gu" },
  { hangul: "수영", options: ["su-yeong", "su-yong", "suyeong", "su-young"], answer: "su-yeong" },
  { hangul: "날씨", options: ["nal-ssi", "nal-si", "nalssi", "nal-ssi"], answer: "nal-ssi" },
  { hangul: "비", options: ["bi", "bee", "bi", "pi"], answer: "bi" },
  { hangul: "눈", options: ["nun", "noon", "nun", "noun"], answer: "nun" },
  { hangul: "맑다", options: ["mak-da", "mal-da", "makda", "mak-ta"], answer: "mak-da" },
  { hangul: "춥다", options: ["chup-da", "chub-da", "chupda", "chup-ta"], answer: "chup-da" },
  { hangul: "덥다", options: ["deop-da", "deob-da", "deopda", "deop-ta"], answer: "deop-da" },
  { hangul: "크다", options: ["keu-da", "ku-da", "keuda", "keu-da"], answer: "keu-da" },
  { hangul: "작다", options: ["jak-da", "jak-ta", "jakda", "jak-da"], answer: "jak-da" },
  { hangul: "예쁘다", options: ["ye-ppeu-da", "ye-peu-da", "yeppeuda", "ye-ppeu-da"], answer: "ye-ppeu-da" },
  { hangul: "맛있다", options: ["mas-it-da", "mat-it-da", "masitta", "mas-it-da"], answer: "mas-it-da" },
  { hangul: "재미있다", options: ["jae-mi-it-da", "jae-mi-it-ta", "jaemiitta", "jae-mi-it-da"], answer: "jae-mi-it-da" },
  { hangul: "좋다", options: ["jot-da", "joh-da", "jota", "jot-da"], answer: "jot-da" },
  { hangul: "싫다", options: ["sil-ta", "sil-da", "silta", "sil-ta"], answer: "sil-ta" },
  { hangul: "맛다", options: ["mat-da", "mas-da", "matda", "mat-ta"], answer: "mat-da" },
  { hangul: "먹다", options: ["meok-da", "mok-da", "meokda", "meok-ta"], answer: "meok-da" },
  { hangul: "마시다", options: ["ma-si-da", "ma-shi-da", "masida", "ma-si-da"], answer: "ma-si-da" },
  { hangul: "자다", options: ["ja-da", "ja-ta", "jada", "ja-da"], answer: "ja-da" },
  { hangul: "일어나다", options: ["i-reo-na-da", "il-eo-na-da", "ireonada", "i-reo-na-da"], answer: "i-reo-na-da" },
  { hangul: "가다", options: ["ga-da", "ka-da", "gada", "ga-da"], answer: "ga-da" },
  { hangul: "오다", options: ["o-da", "o-ta", "oda", "o-da"], answer: "o-da" },
  { hangul: "보다", options: ["bo-da", "po-da", "boda", "bo-da"], answer: "bo-da" },
  { hangul: "듣다", options: ["deut-da", "deud-da", "deutda", "deut-ta"], answer: "deut-da" },
  { hangul: "말하다", options: ["mal-ha-da", "mal-ha-ta", "malhada", "mal-ha-da"], answer: "mal-ha-da" },
  { hangul: "읽다", options: ["ik-da", "ilk-da", "ikda", "ik-ta"], answer: "ik-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "만나다", options: ["man-na-da", "man-na-ta", "mannada", "man-na-da"], answer: "man-na-da" },
  { hangul: "사다", options: ["sa-da", "sa-ta", "sada", "sa-da"], answer: "sa-da" },
  { hangul: "주다", options: ["ju-da", "ju-ta", "juda", "ju-da"], answer: "ju-da" },
  { hangul: "받다", options: ["bat-da", "bad-da", "batda", "bat-ta"], answer: "bat-da" },
  { hangul: "열다", options: ["yeol-da", "yol-da", "yeolda", "yeol-ta"], answer: "yeol-da" },
  { hangul: "닫다", options: ["dat-da", "dad-da", "datda", "dat-ta"], answer: "dat-da" },
  { hangul: "열쇠", options: ["yeol-soe", "yol-soe", "yeolsoe", "yeol-soi"], answer: "yeol-soe" },
  { hangul: "문자", options: ["mun-ja", "moon-ja", "munja", "mun-ja"], answer: "mun-ja" },
  { hangul: "인터넷", options: ["in-teo-net", "in-ter-net", "inteonet", "internet"], answer: "in-teo-net" },
  { hangul: "인사", options: ["in-sa", "in-sa", "insa", "in-sa"], answer: "in-sa" },
  { hangul: "미안", options: ["mi-an", "mi-an", "mian", "mi-an"], answer: "mi-an" },
  { hangul: "괜찮다", options: ["gwaen-chan-ta", "gwaen-chan-da", "gwaenchanhta", "gwaen-chanta"], answer: "gwaen-chan-ta" },
  { hangul: "천천히", options: ["cheon-cheon-hi", "chon-chon-hi", "cheoncheonhi", "cheon-cheon-hi"], answer: "cheon-cheon-hi" },
  { hangul: "빨리", options: ["ppal-li", "pal-li", "ppalli", "ppal-li"], answer: "ppal-li" },
  { hangul: "여기", options: ["yeo-gi", "yo-gi", "yeogi", "yeo-gi"], answer: "yeo-gi" },
  { hangul: "저기", options: ["jeo-gi", "jo-gi", "jeogi", "jeo-gi"], answer: "jeo-gi" },
  { hangul: "어디", options: ["eo-di", "o-di", "eodi", "eo-di"], answer: "eo-di" },
  { hangul: "언제", options: ["eon-je", "on-je", "eonje", "eon-je"], answer: "eon-je" },
  { hangul: "왜", options: ["wae", "we", "wae", "why"], answer: "wae" },
  { hangul: "어떻게", options: ["eo-tteo-ke", "o-tteo-ke", "eotteoke", "eo-tteo-ke"], answer: "eo-tteo-ke" },
  { hangul: "뭐", options: ["mwo", "mo", "mwo", "muo"], answer: "mwo" },
  { hangul: "누구", options: ["nu-gu", "noo-gu", "nugu", "nu-gu"], answer: "nu-gu" },
  { hangul: "몇", options: ["myeot", "myot", "myeot", "myut"], answer: "myeot" },
  { hangul: "얼마", options: ["eol-ma", "ol-ma", "eolma", "eol-ma"], answer: "eol-ma" },
  { hangul: "네", options: ["ne", "nae", "ne", "ni"], answer: "ne" },
  { hangul: "아니요", options: ["a-ni-yo", "a-ni-yo", "aniyo", "a-ni-o"], answer: "a-ni-yo" },
  { hangul: "몰라요", options: ["mol-la-yo", "mol-ra-yo", "mollayo", "mol-la-yo"], answer: "mol-la-yo" },
  { hangul: "알겠어요", options: ["al-ge-sseo-yo", "al-get-sseo-yo", "algeosseoyo", "al-ge-sseo-yo"], answer: "al-ge-sseo-yo" },
  { hangul: "처음", options: ["cheo-eum", "cho-eum", "cheoeum", "cheo-eum"], answer: "cheo-eum" },
  { hangul: "다시", options: ["da-si", "da-shi", "dasi", "da-si"], answer: "da-si" },
  { hangul: "항상", options: ["hang-sang", "hang-sang", "hangsang", "hang-sang"], answer: "hang-sang" },
  { hangul: "가끔", options: ["ga-kkeum", "ga-keum", "gakkeum", "ga-kkeum"], answer: "ga-kkeum" },
  { hangul: "전혀", options: ["jeon-hyeo", "jun-hyeo", "jeonhyeo", "jeon-hyeo"], answer: "jeon-hyeo" },
  { hangul: "매우", options: ["mae-u", "me-u", "maeu", "mae-u"], answer: "mae-u" },
  { hangul: "조금", options: ["jo-geum", "jo-keum", "jogeum", "jo-geum"], answer: "jo-geum" },
  // Niveau 6+ – vocabulaire étendu
  { hangul: "눈물", options: ["nun-mul", "noon-mul", "nunmur", "nun-mur"], answer: "nun-mul" },
  { hangul: "미소", options: ["mi-so", "mee-so", "miso", "mi-so"], answer: "mi-so" },
  { hangul: "행복", options: ["haeng-bok", "heng-bok", "haengbok", "heng-bok"], answer: "haeng-bok" },
  { hangul: "꿈", options: ["kkum", "kum", "ggum", "kkoum"], answer: "kkum" },
  { hangul: "희망", options: ["hui-mang", "hee-mang", "heemang", "hui-mang"], answer: "hui-mang" },
  { hangul: "걱정", options: ["geok-jeong", "gok-jeong", "geokjeong", "gek-jeong"], answer: "geok-jeong" },
  { hangul: "두려움", options: ["du-ryeo-um", "du-ryeoum", "duryeoum", "du-ryeo-um"], answer: "du-ryeo-um" },
  { hangul: "건강", options: ["geon-gang", "gon-gang", "geongang", "geon-gang"], answer: "geon-gang" },
  { hangul: "병", options: ["byeong", "byung", "byeong", "byong"], answer: "byeong" },
  { hangul: "약", options: ["yak", "yag", "yak", "yack"], answer: "yak" },
  { hangul: "휴식", options: ["hyu-sik", "hyu-shik", "hyusik", "hyu-sik"], answer: "hyu-sik" },
  { hangul: "일", options: ["il", "eel", "il", "ill"], answer: "il" },
  { hangul: "회사", options: ["hoe-sa", "hwe-sa", "hoesa", "hoe-sa"], answer: "hoe-sa" },
  { hangul: "회의", options: ["hoe-ui", "hwe-ui", "hoeui", "hoe-ui"], answer: "hoe-ui" },
  { hangul: "프로젝트", options: ["peu-ro-jek-teu", "pro-ject", "peurojekteu", "peu-ro-jek-teu"], answer: "peu-ro-jek-teu" },
  { hangul: "계획", options: ["gye-hoek", "gye-hwek", "gyehoek", "gye-hoek"], answer: "gye-hoek" },
  { hangul: "결과", options: ["gyeol-gwa", "gyol-gwa", "gyeolgwa", "gyeol-gwa"], answer: "gyeol-gwa" },
  { hangul: "이유", options: ["i-yu", "ee-yu", "iyu", "i-yu"], answer: "i-yu" },
  { hangul: "방법", options: ["bang-beop", "bang-bop", "bangbeop", "bang-beop"], answer: "bang-beop" },
  { hangul: "문제", options: ["mun-je", "moon-je", "munje", "mun-je"], answer: "mun-je" },
  { hangul: "해결", options: ["hae-gyeol", "he-gyeol", "haegyeol", "hae-gyeol"], answer: "hae-gyeol" },
  { hangul: "변화", options: ["byeon-hwa", "byon-hwa", "byeonhwa", "byeon-hwa"], answer: "byeon-hwa" },
  { hangul: "기회", options: ["gi-hoe", "gi-hwe", "gihoe", "gi-hoe"], answer: "gi-hoe" },
  { hangul: "경험", options: ["gyeong-heom", "gyong-heom", "gyeongheom", "gyeong-heom"], answer: "gyeong-heom" },
  { hangul: "지식", options: ["ji-sik", "ji-shik", "jisik", "ji-sik"], answer: "ji-sik" },
  { hangul: "기억", options: ["gi-eok", "gi-ok", "gieok", "gi-eok"], answer: "gi-eok" },
  { hangul: "선물", options: ["seon-mul", "sun-mul", "seonmul", "seon-mul"], answer: "seon-mul" },
  { hangul: "파티", options: ["pa-ti", "pa-ti", "pati", "party"], answer: "pa-ti" },
  { hangul: "초대", options: ["cho-dae", "cho-de", "chodae", "cho-dae"], answer: "cho-dae" },
  { hangul: "축하", options: ["chuk-ha", "chuk-ha", "chukha", "chuk-ha"], answer: "chuk-ha" },
  { hangul: "성공", options: ["seong-gong", "sung-gong", "seonggong", "seong-gong"], answer: "seong-gong" },
  { hangul: "실패", options: ["sil-pae", "sil-pe", "silpae", "sil-pae"], answer: "sil-pae" },
  { hangul: "노력", options: ["no-ryeok", "no-ryok", "noryeok", "no-ryeok"], answer: "no-ryeok" },
  { hangul: "연습", options: ["yeon-seup", "yon-seup", "yeonseup", "yeon-seup"], answer: "yeon-seup" },
  { hangul: "시작", options: ["si-jak", "shi-jak", "sijak", "si-jak"], answer: "si-jak" },
  { hangul: "끝", options: ["kkeut", "keut", "ggut", "kkeut"], answer: "kkeut" },
  { hangul: "중간", options: ["jung-gan", "jung-gan", "junggan", "jung-gan"], answer: "jung-gan" },
  { hangul: "앞", options: ["ap", "ab", "ap", "app"], answer: "ap" },
  { hangul: "뒤", options: ["dwi", "dwee", "dwi", "dwi"], answer: "dwi" },
  { hangul: "위", options: ["wi", "wee", "wi", "wii"], answer: "wi" },
  { hangul: "아래", options: ["a-rae", "a-re", "arae", "a-rae"], answer: "a-rae" },
  { hangul: "안", options: ["an", "ahn", "an", "ann"], answer: "an" },
  { hangul: "밖", options: ["bak", "bag", "bak", "back"], answer: "bak" },
  { hangul: "왼쪽", options: ["oen-jjok", "wen-jjok", "oenjjok", "oen-jjok"], answer: "oen-jjok" },
  { hangul: "오른쪽", options: ["o-reun-jjok", "o-reun-jok", "oreunjjok", "o-reun-jjok"], answer: "o-reun-jjok" },
  { hangul: "가까이", options: ["ga-kka-i", "ga-ka-i", "gakkai", "ga-kka-i"], answer: "ga-kka-i" },
  { hangul: "멀리", options: ["meol-li", "mol-li", "meolli", "meol-li"], answer: "meol-li" },
  { hangul: "빨간색", options: ["ppal-gan-saek", "pal-gan-saek", "ppalgansaek", "ppal-gan-saek"], answer: "ppal-gan-saek" },
  { hangul: "파란색", options: ["pa-ran-saek", "pa-ran-saek", "paransaek", "pa-ran-saek"], answer: "pa-ran-saek" },
  { hangul: "초록색", options: ["cho-rok-saek", "cho-rok-saek", "choroksaek", "cho-rok-saek"], answer: "cho-rok-saek" },
  { hangul: "노란색", options: ["no-ran-saek", "no-ran-saek", "noransaek", "no-ran-saek"], answer: "no-ran-saek" },
  { hangul: "검은색", options: ["geom-eun-saek", "gom-eun-saek", "geomeunsaek", "geom-eun-saek"], answer: "geom-eun-saek" },
  { hangul: "흰색", options: ["hin-saek", "heen-saek", "hinsaek", "hin-saek"], answer: "hin-saek" },
  { hangul: "커피숍", options: ["keo-pi-syop", "ko-pi-shop", "keopisyop", "keo-pi-syop"], answer: "keo-pi-syop" },
  { hangul: "레스토랑", options: ["re-seu-to-rang", "restaurant", "resutorang", "re-seu-to-rang"], answer: "re-seu-to-rang" },
  { hangul: "공항", options: ["gong-hang", "kong-hang", "gonghang", "gong-hang"], answer: "gong-hang" },
  { hangul: "역", options: ["yeok", "yok", "yeok", "yek"], answer: "yeok" },
  { hangul: "주차", options: ["ju-cha", "ju-cha", "jucha", "ju-cha"], answer: "ju-cha" },
  { hangul: "엘리베이터", options: ["el-li-be-i-teo", "elevator", "ellibeiteo", "el-li-be-i-teo"], answer: "el-li-be-i-teo" },
  { hangul: "계단", options: ["gye-dan", "gye-dan", "gyedan", "gye-dan"], answer: "gye-dan" },
  { hangul: "출구", options: ["chul-gu", "chul-ku", "chulgu", "chul-gu"], answer: "chul-gu" },
  { hangul: "입구", options: ["ip-gu", "ip-ku", "ipgu", "ip-gu"], answer: "ip-gu" },
  { hangul: "안내", options: ["an-nae", "an-ne", "annae", "an-nae"], answer: "an-nae" },
  { hangul: "아침", options: ["a-chim", "a-chim", "achim", "a-chim"], answer: "a-chim" },
  { hangul: "점심", options: ["jeom-sim", "jum-sim", "jeomsim", "jeom-sim"], answer: "jeom-sim" },
  { hangul: "저녁", options: ["jeo-nyeok", "jo-nyeok", "jeonyeok", "jeo-nyeok"], answer: "jeo-nyeok" },
  { hangul: "밤", options: ["bam", "bam", "bam", "bamm"], answer: "bam" },
  { hangul: "주말", options: ["ju-mal", "ju-mal", "jumal", "ju-mal"], answer: "ju-mal" },
  { hangul: "월요일", options: ["wol-yo-il", "wol-yo-il", "wolyoil", "wol-yo-il"], answer: "wol-yo-il" },
  { hangul: "화요일", options: ["hwa-yo-il", "hwa-yo-il", "hwayoil", "hwa-yo-il"], answer: "hwa-yo-il" },
  { hangul: "수요일", options: ["su-yo-il", "su-yo-il", "suyoil", "su-yo-il"], answer: "su-yo-il" },
  { hangul: "목요일", options: ["mok-yo-il", "mok-yo-il", "mokyoil", "mok-yo-il"], answer: "mok-yo-il" },
  { hangul: "금요일", options: ["geum-yo-il", "geum-yo-il", "geumyoil", "geum-yo-il"], answer: "geum-yo-il" },
  { hangul: "토요일", options: ["to-yo-il", "to-yo-il", "toyoil", "to-yo-il"], answer: "to-yo-il" },
  { hangul: "일요일", options: ["il-yo-il", "il-yo-il", "ilyoil", "il-yo-il"], answer: "il-yo-il" },
  { hangul: "생일", options: ["saeng-il", "saeng-il", "saengil", "saeng-il"], answer: "saeng-il" },
  { hangul: "휴일", options: ["hyu-il", "hyu-il", "hyuil", "hyu-il"], answer: "hyu-il" },
  { hangul: "방", options: ["bang", "bang", "bang", "bangg"], answer: "bang" },
  { hangul: "주방", options: ["ju-bang", "ju-bang", "jubang", "ju-bang"], answer: "ju-bang" },
  { hangul: "거실", options: ["geo-sil", "go-sil", "geosil", "geo-sil"], answer: "geo-sil" },
  { hangul: "침실", options: ["chim-sil", "chim-shil", "chimsil", "chim-sil"], answer: "chim-sil" },
  { hangul: "도시", options: ["do-si", "do-shi", "dosi", "do-si"], answer: "do-si" },
  { hangul: "나라", options: ["na-ra", "na-ra", "nara", "na-ra"], answer: "na-ra" },
  { hangul: "세계", options: ["se-gye", "se-gye", "segye", "se-gye"], answer: "se-gye" },
  { hangul: "지도", options: ["ji-do", "ji-do", "jido", "ji-do"], answer: "ji-do" },
  { hangul: "길", options: ["gil", "gil", "gil", "gill"], answer: "gil" },
  { hangul: "기차", options: ["gi-cha", "gi-cha", "gicha", "gi-cha"], answer: "gi-cha" },
  { hangul: "배", options: ["bae", "be", "bae", "bai"], answer: "bae" },
  { hangul: "돈", options: ["don", "don", "don", "donn"], answer: "don" },
  { hangul: "가격", options: ["ga-gyeok", "ga-gyok", "gagyeok", "ga-gyeok"], answer: "ga-gyeok" },
  { hangul: "할인", options: ["hal-in", "hal-in", "halin", "hal-in"], answer: "hal-in" },
  { hangul: "영수증", options: ["yeong-su-jeung", "yong-su-jeung", "yeongsujeung", "yeong-su-jeung"], answer: "yeong-su-jeung" },
  { hangul: "옷", options: ["ot", "ot", "ot", "ott"], answer: "ot" },
  { hangul: "신발", options: ["sin-bal", "shin-bal", "sinbal", "sin-bal"], answer: "sin-bal" },
  { hangul: "모자", options: ["mo-ja", "mo-ja", "moja", "mo-ja"], answer: "mo-ja" },
  { hangul: "가방", options: ["ga-bang", "ga-bang", "gabang", "ga-bang"], answer: "ga-bang" },
  { hangul: "숙제", options: ["suk-je", "suk-je", "sukje", "suk-je"], answer: "suk-je" },
  { hangul: "시험", options: ["si-heom", "shi-heom", "siheom", "si-heom"], answer: "si-heom" },
  { hangul: "공부", options: ["gong-bu", "kong-bu", "gongbu", "gong-bu"], answer: "gong-bu" },
  { hangul: "질문", options: ["jil-mun", "jil-moon", "jilmun", "jil-mun"], answer: "jil-mun" },
  { hangul: "대답", options: ["dae-dap", "de-dap", "daedap", "dae-dap"], answer: "dae-dap" },
  { hangul: "이야기", options: ["i-ya-gi", "ee-ya-gi", "iyagi", "i-ya-gi"], answer: "i-ya-gi" },
  { hangul: "뉴스", options: ["nyu-seu", "news", "nyuseu", "nyu-seu"], answer: "nyu-seu" },
  { hangul: "날짜", options: ["nal-jja", "nal-jja", "naljja", "nal-jja"], answer: "nal-jja" },
  { hangul: "나이", options: ["na-i", "na-ee", "nai", "na-i"], answer: "na-i" },
  { hangul: "주소", options: ["ju-so", "ju-so", "juso", "ju-so"], answer: "ju-so" },
  { hangul: "전화번호", options: ["jeon-hwa-beon-ho", "jun-hwa-beon-ho", "jeonhwabeonho", "jeon-hwa-beon-ho"], answer: "jeon-hwa-beon-ho" },
  { hangul: "이메일", options: ["i-me-il", "ee-me-il", "imeil", "i-me-il"], answer: "i-me-il" },
  { hangul: "사진", options: ["sa-jin", "sa-jin", "sajin", "sa-jin"], answer: "sa-jin" },
  { hangul: "카메라", options: ["ka-me-ra", "camera", "kamera", "ka-me-ra"], answer: "ka-me-ra" },
  { hangul: "음료", options: ["eum-ryo", "eum-ryo", "eumryo", "eum-ryo"], answer: "eum-ryo" },
  { hangul: "아이스크림", options: ["a-i-seu-keu-rim", "ice-cream", "aiseukeurim", "a-i-seu-keu-rim"], answer: "a-i-seu-keu-rim" },
  { hangul: "과자", options: ["gwa-ja", "gwa-ja", "gwaja", "gwa-ja"], answer: "gwa-ja" },
  { hangul: "채소", options: ["chae-so", "chae-so", "chaeso", "chae-so"], answer: "chae-so" },
  { hangul: "고추", options: ["go-chu", "go-chu", "gochu", "go-chu"], answer: "go-chu" },
  { hangul: "마늘", options: ["ma-neul", "ma-nul", "maneul", "ma-neul"], answer: "ma-neul" },
  { hangul: "양파", options: ["yang-pa", "yang-pa", "yangpa", "yang-pa"], answer: "yang-pa" },
  { hangul: "당근", options: ["dang-geun", "dang-geun", "danggeun", "dang-geun"], answer: "dang-geun" },
  { hangul: "감자", options: ["gam-ja", "gam-ja", "gamja", "gam-ja"], answer: "gam-ja" },
  { hangul: "토마토", options: ["to-ma-to", "tomato", "tomato", "to-ma-to"], answer: "to-ma-to" },
  { hangul: "바지", options: ["ba-ji", "ba-ji", "baji", "ba-ji"], answer: "ba-ji" },
  { hangul: "치마", options: ["chi-ma", "chi-ma", "chima", "chi-ma"], answer: "chi-ma" },
  { hangul: "셔츠", options: ["syeo-cheu", "shirt", "syeocheu", "syeo-cheu"], answer: "syeo-cheu" },
  { hangul: "코트", options: ["ko-teu", "coat", "koteu", "ko-teu"], answer: "ko-teu" },
  { hangul: "한", options: ["han", "han", "han", "hann"], answer: "han" },
  { hangul: "두", options: ["du", "doo", "du", "duu"], answer: "du" },
  { hangul: "세", options: ["se", "se", "se", "say"], answer: "se" },
  { hangul: "넷", options: ["net", "net", "naet", "nit"], answer: "net" },
  { hangul: "다섯", options: ["da-seot", "da-sot", "daseot", "da-seot"], answer: "da-seot" },
  { hangul: "여섯", options: ["yeo-seot", "yo-seot", "yeoseot", "yeo-seot"], answer: "yeo-seot" },
  { hangul: "일곱", options: ["il-gop", "il-gop", "ilgop", "il-gop"], answer: "il-gop" },
  { hangul: "여덟", options: ["yeo-deol", "yo-deol", "yeodeol", "yeo-deol"], answer: "yeo-deol" },
  { hangul: "아홉", options: ["a-hop", "a-hop", "ahop", "a-hop"], answer: "a-hop" },
  { hangul: "열", options: ["yeol", "yol", "yeol", "yol"], answer: "yeol" },
  { hangul: "스무", options: ["seu-mu", "seu-mu", "seumu", "seu-mu"], answer: "seu-mu" },
  { hangul: "서른", options: ["seo-reun", "so-reun", "seoreun", "seo-reun"], answer: "seo-reun" },
  { hangul: "마흔", options: ["ma-heun", "ma-heun", "maheun", "ma-heun"], answer: "ma-heun" },
  { hangul: "쉬다", options: ["swi-da", "swi-da", "swida", "swi-da"], answer: "swi-da" },
  { hangul: "일하다", options: ["il-ha-da", "il-ha-da", "ilhada", "il-ha-da"], answer: "il-ha-da" },
  { hangul: "공부하다", options: ["gong-bu-ha-da", "kong-bu-ha-da", "gongbuhada", "gong-bu-ha-da"], answer: "gong-bu-ha-da" },
  { hangul: "운전하다", options: ["un-jeon-ha-da", "oon-jeon-ha-da", "unjeonhada", "un-jeon-ha-da"], answer: "un-jeon-ha-da" },
  { hangul: "요리하다", options: ["yo-ri-ha-da", "yo-ri-ha-da", "yorihada", "yo-ri-ha-da"], answer: "yo-ri-ha-da" },
  { hangul: "청소하다", options: ["cheong-so-ha-da", "chong-so-ha-da", "cheongsohada", "cheong-so-ha-da"], answer: "cheong-so-ha-da" },
  { hangul: "전화하다", options: ["jeon-hwa-ha-da", "jun-hwa-ha-da", "jeonhwahada", "jeon-hwa-ha-da"], answer: "jeon-hwa-ha-da" },
  { hangul: "걷다", options: ["geot-da", "gut-da", "geotda", "geot-ta"], answer: "geot-da" },
  { hangul: "뛰다", options: ["ttwi-da", "dwi-da", "ttwida", "ttwi-da"], answer: "ttwi-da" },
  { hangul: "앉다", options: ["an-da", "an-ja", "anda", "an-da"], answer: "an-da" },
  { hangul: "서다", options: ["seo-da", "so-da", "seoda", "seo-da"], answer: "seo-da" },
  { hangul: "웃다", options: ["ut-da", "oot-da", "utda", "ut-da"], answer: "ut-da" },
  { hangul: "울다", options: ["ul-da", "ool-da", "ulda", "ul-da"], answer: "ul-da" },
  { hangul: "생각하다", options: ["saeng-gak-ha-da", "saeng-gak-ha-da", "saenggakhada", "saeng-gak-ha-da"], answer: "saeng-gak-ha-da" },
  { hangul: "알다", options: ["al-da", "al-da", "alda", "al-da"], answer: "al-da" },
  { hangul: "모르다", options: ["mo-reu-da", "mo-ru-da", "moreuda", "mo-reu-da"], answer: "mo-reu-da" },
  { hangul: "원하다", options: ["won-ha-da", "won-ha-da", "wonhada", "won-ha-da"], answer: "won-ha-da" },
  { hangul: "필요하다", options: ["pil-yo-ha-da", "pil-yo-ha-da", "pilyohada", "pil-yo-ha-da"], answer: "pil-yo-ha-da" },
  { hangul: "좋아하다", options: ["jo-a-ha-da", "jo-a-ha-da", "joahada", "jo-a-ha-da"], answer: "jo-a-ha-da" },
  { hangul: "싫어하다", options: ["sil-eo-ha-da", "sil-o-ha-da", "sileohada", "sil-eo-ha-da"], answer: "sil-eo-ha-da" },
  { hangul: "기다리다", options: ["gi-da-ri-da", "gi-da-ri-da", "gidarida", "gi-da-ri-da"], answer: "gi-da-ri-da" },
  { hangul: "도와주다", options: ["do-wa-ju-da", "do-wa-ju-da", "dowajuda", "do-wa-ju-da"], answer: "do-wa-ju-da" },
  { hangul: "찾다", options: ["chat-da", "chaj-da", "chatda", "chat-ta"], answer: "chat-da" },
  { hangul: "놓다", options: ["not-da", "no-ta", "notda", "not-da"], answer: "not-da" },
  { hangul: "입다", options: ["ip-da", "ip-ta", "ipda", "ip-da"], answer: "ip-da" },
  { hangul: "벗다", options: ["beot-da", "but-da", "beotda", "beot-ta"], answer: "beot-da" },
  { hangul: "씻다", options: ["ssit-da", "ssit-ta", "ssitda", "ssit-da"], answer: "ssit-da" },
  { hangul: "자르다", options: ["ja-reu-da", "ja-ru-da", "jareuda", "ja-reu-da"], answer: "ja-reu-da" },
  { hangul: "붙이다", options: ["bu-chi-da", "bu-chi-da", "buchida", "bu-chi-da"], answer: "bu-chi-da" },
  { hangul: "떼다", options: ["tte-da", "te-da", "tteda", "tte-da"], answer: "tte-da" },
  { hangul: "켜다", options: ["kyeo-da", "kyo-da", "kyeoda", "kyeo-da"], answer: "kyeo-da" },
  { hangul: "끄다", options: ["kkeu-da", "kku-da", "kkeuda", "kkeu-da"], answer: "kkeu-da" },
  { hangul: "높다", options: ["nop-da", "nop-ta", "nopda", "nop-da"], answer: "nop-da" },
  { hangul: "낮다", options: ["nat-da", "naj-da", "natda", "nat-ta"], answer: "nat-da" },
  { hangul: "길다", options: ["gil-da", "gil-ta", "gilda", "gil-da"], answer: "gil-da" },
  { hangul: "짧다", options: ["jjal-da", "jjal-ta", "jjalda", "jjal-da"], answer: "jjal-da" },
  { hangul: "넓다", options: ["neol-da", "nol-da", "neolda", "neol-da"], answer: "neol-da" },
  { hangul: "좁다", options: ["jop-da", "jop-ta", "jopda", "jop-da"], answer: "jop-da" },
  { hangul: "무겁다", options: ["mu-geop-da", "mu-gop-da", "mugeopda", "mu-geop-da"], answer: "mu-geop-da" },
  { hangul: "가볍다", options: ["ga-byeop-da", "ga-byop-da", "gabyeopda", "ga-byeop-da"], answer: "ga-byeop-da" },
  { hangul: "많다", options: ["man-ta", "man-da", "manta", "man-ta"], answer: "man-ta" },
  { hangul: "적다", options: ["jeok-da", "juk-da", "jeokda", "jeok-da"], answer: "jeok-da" },
  { hangul: "빠르다", options: ["ppa-reu-da", "pa-reu-da", "ppareuda", "ppa-reu-da"], answer: "ppa-reu-da" },
  { hangul: "느리다", options: ["neu-ri-da", "nu-ri-da", "neurida", "neu-ri-da"], answer: "neu-ri-da" },
  { hangul: "쉽다", options: ["swip-da", "swip-ta", "swipda", "swip-da"], answer: "swip-da" },
  { hangul: "어렵다", options: ["eo-ryeop-da", "o-ryeop-da", "eoryeopda", "eo-ryeop-da"], answer: "eo-ryeop-da" },
  { hangul: "바쁘다", options: ["ba-ppeu-da", "ba-peu-da", "bappeuda", "ba-ppeu-da"], answer: "ba-ppeu-da" },
  { hangul: "한가하다", options: ["han-ga-ha-da", "han-ga-ha-da", "hangahada", "han-ga-ha-da"], answer: "han-ga-ha-da" },
  { hangul: "피곤하다", options: ["pi-gon-ha-da", "pi-gon-ha-da", "pigonhada", "pi-gon-ha-da"], answer: "pi-gon-ha-da" },
  { hangul: "아프다", options: ["a-peu-da", "a-peu-da", "apeuda", "a-peu-da"], answer: "a-peu-da" },
  { hangul: "건강하다", options: ["geon-gang-ha-da", "gon-gang-ha-da", "geonganghada", "geon-gang-ha-da"], answer: "geon-gang-ha-da" },
  { hangul: "배고프다", options: ["bae-go-peu-da", "be-go-peu-da", "baegopeuda", "bae-go-peu-da"], answer: "bae-go-peu-da" },
  { hangul: "목마르다", options: ["mok-ma-reu-da", "mok-ma-ru-da", "mokmareuda", "mok-ma-reu-da"], answer: "mok-ma-reu-da" },
  { hangul: "졸리다", options: ["jol-li-da", "jol-ri-da", "jollida", "jol-li-da"], answer: "jol-li-da" },
  { hangul: "심심하다", options: ["sim-sim-ha-da", "shim-shim-ha-da", "simsimhada", "sim-sim-ha-da"], answer: "sim-sim-ha-da" },
  { hangul: "재미없다", options: ["jae-mi-eop-da", "jae-mi-up-da", "jaemieopda", "jae-mi-eop-da"], answer: "jae-mi-eop-da" },
  { hangul: "슬프다", options: ["seul-peu-da", "seul-peu-da", "seulpeuda", "seul-peu-da"], answer: "seul-peu-da" },
  { hangul: "화나다", options: ["hwa-na-da", "hwa-na-da", "hwanada", "hwa-na-da"], answer: "hwa-na-da" },
  { hangul: "신나다", options: ["sin-na-da", "shin-na-da", "sinnada", "sin-na-da"], answer: "sin-na-da" },
  { hangul: "놀라다", options: ["nol-la-da", "nol-ra-da", "nollada", "nol-la-da"], answer: "nol-la-da" },
  { hangul: "걱정하다", options: ["geok-jeong-ha-da", "gok-jeong-ha-da", "geokjeonghada", "geok-jeong-ha-da"], answer: "geok-jeong-ha-da" },
  { hangul: "기쁘다", options: ["gi-ppeu-da", "gi-peu-da", "gippeuda", "gi-ppeu-da"], answer: "gi-ppeu-da" },
  { hangul: "편하다", options: ["pyeon-ha-da", "pyon-ha-da", "pyeonhada", "pyeon-ha-da"], answer: "pyeon-ha-da" },
  { hangul: "불편하다", options: ["bul-pyeon-ha-da", "bul-pyon-ha-da", "bulpyeonhada", "bul-pyeon-ha-da"], answer: "bul-pyeon-ha-da" },
  { hangul: "위험하다", options: ["wi-heom-ha-da", "wi-heom-ha-da", "wiheomhada", "wi-heom-ha-da"], answer: "wi-heom-ha-da" },
  { hangul: "안전하다", options: ["an-jeon-ha-da", "an-jun-ha-da", "anjeonhada", "an-jeon-ha-da"], answer: "an-jeon-ha-da" },
  { hangul: "중요하다", options: ["jung-yo-ha-da", "jung-yo-ha-da", "jungyohada", "jung-yo-ha-da"], answer: "jung-yo-ha-da" },
  { hangul: "특별하다", options: ["teuk-byeol-ha-da", "teuk-byol-ha-da", "teukbyeolhada", "teuk-byeol-ha-da"], answer: "teuk-byeol-ha-da" },
  { hangul: "보통", options: ["bo-tong", "bo-tong", "botong", "bo-tong"], answer: "bo-tong" },
  { hangul: "자주", options: ["ja-ju", "ja-ju", "jaju", "ja-ju"], answer: "ja-ju" },
  { hangul: "가득", options: ["ga-deuk", "ga-duk", "gadeuk", "ga-deuk"], answer: "ga-deuk" },
  { hangul: "비슷하다", options: ["bi-seut-ha-da", "bi-seut-ha-da", "biseuthada", "bi-seut-ha-da"], answer: "bi-seut-ha-da" },
  { hangul: "다르다", options: ["da-reu-da", "da-ru-da", "dareuda", "da-reu-da"], answer: "da-reu-da" },
  { hangul: "같다", options: ["gat-da", "gat-ta", "gatda", "gat-da"], answer: "gat-da" },
  { hangul: "새롭다", options: ["sae-rop-da", "se-rop-da", "saeropda", "sae-rop-da"], answer: "sae-rop-da" },
  { hangul: "오래되다", options: ["o-rae-doe-da", "o-re-doe-da", "oraedoeda", "o-rae-doe-da"], answer: "o-rae-doe-da" },
  { hangul: "맛없다", options: ["mat-eop-da", "mas-eop-da", "mateopda", "mat-eop-da"], answer: "mat-eop-da" },
  { hangul: "맑다", options: ["mak-da", "mal-da", "makda", "mak-ta"], answer: "mak-da" },
  { hangul: "흐리다", options: ["heu-ri-da", "hu-ri-da", "heurida", "heu-ri-da"], answer: "heu-ri-da" },
  { hangul: "춥다", options: ["chup-da", "chub-da", "chupda", "chup-ta"], answer: "chup-da" },
  { hangul: "덥다", options: ["deop-da", "dob-da", "deopda", "deop-ta"], answer: "deop-da" },
  { hangul: "시원하다", options: ["si-won-ha-da", "shi-won-ha-da", "siwonhada", "si-won-ha-da"], answer: "si-won-ha-da" },
  { hangul: "따뜻하다", options: ["tta-tteut-ha-da", "tta-tteut-ha-da", "ttatteuthada", "tta-tteut-ha-da"], answer: "tta-tteut-ha-da" },
  { hangul: "젊다", options: ["jeom-da", "jeol-da", "jeomda", "jeom-ta"], answer: "jeom-da" },
  { hangul: "늙다", options: ["neuk-da", "nulk-da", "neukda", "neuk-ta"], answer: "neuk-da" },
  { hangul: "어리다", options: ["eo-ri-da", "o-ri-da", "eorida", "eo-ri-da"], answer: "eo-ri-da" },
  { hangul: "젊은이", options: ["jeol-meun-i", "jeom-meun-i", "jeolmeuni", "jeol-meun-i"], answer: "jeol-meun-i" },
  { hangul: "어른", options: ["eo-reun", "o-reun", "eoreun", "eo-reun"], answer: "eo-reun" },
  { hangul: "아이", options: ["a-i", "a-ee", "ai", "a-i"], answer: "a-i" },
  { hangul: "청년", options: ["cheong-nyeon", "chong-nyon", "cheongnyeon", "cheong-nyeon"], answer: "cheong-nyeon" },
  { hangul: "노인", options: ["no-in", "no-in", "noin", "no-in"], answer: "no-in" },
  { hangul: "이웃", options: ["i-ut", "ee-ut", "iut", "i-ut"], answer: "i-ut" },
  { hangul: "손님", options: ["son-nim", "son-nim", "sonnim", "son-nim"], answer: "son-nim" },
  { hangul: "남자", options: ["nam-ja", "nam-ja", "namja", "nam-ja"], answer: "nam-ja" },
  { hangul: "여자", options: ["yeo-ja", "yo-ja", "yeoja", "yeo-ja"], answer: "yeo-ja" },
  { hangul: "남편", options: ["nam-pyeon", "nam-pyon", "nampyeon", "nam-pyeon"], answer: "nam-pyeon" },
  { hangul: "아내", options: ["a-nae", "a-ne", "anae", "a-nae"], answer: "a-nae" },
  { hangul: "할머니", options: ["hal-meo-ni", "hal-mo-ni", "halmeoni", "hal-meo-ni"], answer: "hal-meo-ni" },
  { hangul: "할아버지", options: ["hal-a-beo-ji", "hal-a-bo-ji", "halabeoji", "hal-a-beo-ji"], answer: "hal-a-beo-ji" },
  { hangul: "손자", options: ["son-ja", "son-ja", "sonja", "son-ja"], answer: "son-ja" },
  { hangul: "손녀", options: ["son-nyeo", "son-nyo", "sonnyeo", "son-nyeo"], answer: "son-nyeo" },
  { hangul: "머리", options: ["meo-ri", "mo-ri", "meori", "meo-ri"], answer: "meo-ri" },
  { hangul: "얼굴", options: ["eol-gul", "ol-gul", "eolgul", "eol-gul"], answer: "eol-gul" },
  { hangul: "눈", options: ["nun", "noon", "nun", "noun"], answer: "nun" },
  { hangul: "코", options: ["ko", "ko", "ko", "koh"], answer: "ko" },
  { hangul: "입", options: ["ip", "eep", "ip", "ipp"], answer: "ip" },
  { hangul: "귀", options: ["gwi", "gwee", "gwi", "gwi"], answer: "gwi" },
  { hangul: "손", options: ["son", "son", "son", "sonn"], answer: "son" },
  { hangul: "발", options: ["bal", "bal", "bal", "ball"], answer: "bal" },
  { hangul: "배", options: ["bae", "be", "bae", "bai"], answer: "bae" },
  { hangul: "심장", options: ["sim-jang", "shim-jang", "simjang", "sim-jang"], answer: "sim-jang" },
  { hangul: "피", options: ["pi", "pee", "pi", "pii"], answer: "pi" },
  { hangul: "뼈", options: ["ppyeo", "pyo", "ppyeo", "ppyeo"], answer: "ppyeo" },
  { hangul: "살", options: ["sal", "sal", "sal", "sall"], answer: "sal" },
  { hangul: "피부", options: ["pi-bu", "pi-bu", "pibu", "pi-bu"], answer: "pi-bu" },
  { hangul: "머리카락", options: ["meo-ri-ka-rak", "mo-ri-ka-rak", "meorikarak", "meo-ri-ka-rak"], answer: "meo-ri-ka-rak" },
  { hangul: "이", options: ["i", "ee", "i", "yi"], answer: "i" },
  { hangul: "혀", options: ["hyeo", "hyo", "hyeo", "hyeo"], answer: "hyeo" },
  { hangul: "목", options: ["mok", "mok", "mok", "mokk"], answer: "mok" },
  { hangul: "어깨", options: ["eo-kkae", "o-kkae", "eokkae", "eo-kkae"], answer: "eo-kkae" },
  { hangul: "팔", options: ["pal", "pal", "pal", "pall"], answer: "pal" },
  { hangul: "손가락", options: ["son-ga-rak", "son-ga-rak", "songarak", "son-ga-rak"], answer: "son-ga-rak" },
  { hangul: "가슴", options: ["ga-seum", "ga-seum", "gaseum", "ga-seum"], answer: "ga-seum" },
  { hangul: "등", options: ["deung", "deung", "deung", "deungg"], answer: "deung" },
  { hangul: "허리", options: ["heo-ri", "ho-ri", "heori", "heo-ri"], answer: "heo-ri" },
  { hangul: "두통", options: ["du-tong", "doo-tong", "dutong", "du-tong"], answer: "du-tong" },

  // Verbes
  { hangul: "가다", options: ["ga-da", "ka-da", "gada", "ga-ta"], answer: "ga-da" },
  { hangul: "오다", options: ["o-da", "o-ta", "oda", "o-da"], answer: "o-da" },
  // +500 questions – vocabulaire étendu
  { hangul: "하다", options: ["ha-da", "ha-ta", "hada", "ha-da"], answer: "ha-da" },
  { hangul: "되다", options: ["doe-da", "dwe-da", "doeda", "doe-da"], answer: "doe-da" },
  { hangul: "있다", options: ["it-da", "iss-da", "itda", "it-ta"], answer: "it-da" },
  { hangul: "없다", options: ["eop-da", "up-da", "eopda", "eop-ta"], answer: "eop-da" },
  { hangul: "나다", options: ["na-da", "na-ta", "nada", "na-da"], answer: "na-da" },
  { hangul: "살다", options: ["sal-da", "sal-ta", "salda", "sal-da"], answer: "sal-da" },
  { hangul: "죽다", options: ["juk-da", "juk-ta", "jukda", "juk-da"], answer: "juk-da" },
  { hangul: "먹이다", options: ["meog-i-da", "mok-i-da", "meogida", "meog-i-da"], answer: "meog-i-da" },
  { hangul: "자다", options: ["ja-da", "ja-ta", "jada", "ja-da"], answer: "ja-da" },
  { hangul: "깨다", options: ["kkae-da", "gae-da", "kkaeda", "kkae-da"], answer: "kkae-da" },
  { hangul: "웃기다", options: ["ut-gi-da", "oot-gi-da", "utgida", "ut-gi-da"], answer: "ut-gi-da" },
  { hangul: "울리다", options: ["ul-li-da", "ool-li-da", "ullida", "ul-li-da"], answer: "ul-li-da" },
  { hangul: "돕다", options: ["dop-da", "dob-da", "dopda", "dop-ta"], answer: "dop-da" },
  { hangul: "덥다", options: ["deop-da", "deob-da", "deopda", "deop-ta"], answer: "deop-da" },
  { hangul: "춥다", options: ["chup-da", "chub-da", "chupda", "chup-ta"], answer: "chup-da" },
  { hangul: "같이", options: ["gat-i", "gachi", "gat-i", "ga-chi"], answer: "gat-i" },
  { hangul: "함께", options: ["ham-kke", "ham-ge", "hamkke", "ham-kke"], answer: "ham-kke" },
  { hangul: "혼자", options: ["hon-ja", "hon-ja", "honja", "hon-ja"], answer: "hon-ja" },
  { hangul: "바로", options: ["ba-ro", "ba-ro", "baro", "ba-ro"], answer: "ba-ro" },
  { hangul: "벌써", options: ["beol-sseo", "bol-sseo", "beolsseo", "beol-sseo"], answer: "beol-sseo" },
  { hangul: "아직", options: ["a-jik", "a-jig", "ajik", "a-jik"], answer: "a-jik" },
  { hangul: "이미", options: ["i-mi", "ee-mi", "imi", "i-mi"], answer: "i-mi" },
  { hangul: "항상", options: ["hang-sang", "hang-sang", "hangsang", "hang-sang"], answer: "hang-sang" },
  { hangul: "절대", options: ["jeol-dae", "jol-dae", "jeoldae", "jeol-dae"], answer: "jeol-dae" },
  { hangul: "매일", options: ["mae-il", "me-il", "maeil", "mae-il"], answer: "mae-il" },
  { hangul: "매년", options: ["mae-nyeon", "me-nyon", "maenyeon", "mae-nyeon"], answer: "mae-nyeon" },
  { hangul: "언제나", options: ["eon-je-na", "on-je-na", "eonjena", "eon-je-na"], answer: "eon-je-na" },
  { hangul: "가득히", options: ["ga-deuk-hi", "ga-duk-hi", "gadeukhi", "ga-deuk-hi"], answer: "ga-deuk-hi" },
  { hangul: "조용히", options: ["jo-yong-hi", "jo-yong-hi", "joyonghi", "jo-yong-hi"], answer: "jo-yong-hi" },
  { hangul: "빨리", options: ["ppal-li", "pal-li", "ppalli", "ppal-li"], answer: "ppal-li" },
  { hangul: "천천히", options: ["cheon-cheon-hi", "chon-chon-hi", "cheoncheonhi", "cheon-cheon-hi"], answer: "cheon-cheon-hi" },
  { hangul: "갑자기", options: ["gap-ja-gi", "gap-ja-gi", "gapjagi", "gap-ja-gi"], answer: "gap-ja-gi" },
  { hangul: "같이", options: ["gat-i", "gachi", "gat-i", "ga-chi"], answer: "gat-i" },
  { hangul: "특히", options: ["teuk-hi", "teuk-hee", "teukhi", "teuk-hi"], answer: "teuk-hi" },
  { hangul: "단지", options: ["dan-ji", "dan-ji", "danji", "dan-ji"], answer: "dan-ji" },
  { hangul: "오직", options: ["o-jik", "o-jig", "ojik", "o-jik"], answer: "o-jik" },
  { hangul: "또한", options: ["tto-han", "tto-han", "ttohan", "tto-han"], answer: "tto-han" },
  { hangul: "그리고", options: ["geu-ri-go", "geu-ri-go", "geurigo", "geu-ri-go"], answer: "geu-ri-go" },
  { hangul: "그러나", options: ["geu-reo-na", "geu-ro-na", "geureona", "geu-reo-na"], answer: "geu-reo-na" },
  { hangul: "그래서", options: ["geu-rae-seo", "geu-re-seo", "geuraeseo", "geu-rae-seo"], answer: "geu-rae-seo" },
  { hangul: "그런데", options: ["geu-reon-de", "geu-ron-de", "geureonde", "geu-reon-de"], answer: "geu-reon-de" },
  { hangul: "하지만", options: ["ha-ji-man", "ha-ji-man", "hajiman", "ha-ji-man"], answer: "ha-ji-man" },
  { hangul: "그래도", options: ["geu-rae-do", "geu-re-do", "geuraedo", "geu-rae-do"], answer: "geu-rae-do" },
  { hangul: "아니면", options: ["a-ni-myeon", "a-ni-myon", "animyeon", "a-ni-myeon"], answer: "a-ni-myeon" },
  { hangul: "그래요", options: ["geu-rae-yo", "geu-re-yo", "geuraeyo", "geu-rae-yo"], answer: "geu-rae-yo" },
  { hangul: "그럼", options: ["geu-reom", "geu-rom", "geureom", "geu-reom"], answer: "geu-reom" },
  { hangul: "그래", options: ["geu-rae", "geu-re", "geurae", "geu-rae"], answer: "geu-rae" },
  { hangul: "그래요", options: ["geu-rae-yo", "geu-re-yo", "geuraeyo", "geu-rae-yo"], answer: "geu-rae-yo" },
  { hangul: "사실", options: ["sa-sil", "sa-shil", "sasil", "sa-sil"], answer: "sa-sil" },
  { hangul: "물론", options: ["mul-lon", "mool-lon", "mullon", "mul-lon"], answer: "mul-lon" },
  { hangul: "당연히", options: ["dang-yeon-hi", "dang-yon-hi", "dangyeonhi", "dang-yeon-hi"], answer: "dang-yeon-hi" },
  { hangul: "아마", options: ["a-ma", "a-ma", "ama", "a-ma"], answer: "a-ma" },
  { hangul: "혹시", options: ["hok-si", "hok-shi", "hoksi", "hok-si"], answer: "hok-si" },
  { hangul: "정말", options: ["jeong-mal", "jung-mal", "jeongmal", "jeong-mal"], answer: "jeong-mal" },
  { hangul: "진짜", options: ["jin-jja", "jin-jja", "jinjja", "jin-jja"], answer: "jin-jja" },
  { hangul: "너무", options: ["neo-mu", "no-mu", "neomu", "neo-mu"], answer: "neo-mu" },
  { hangul: "참", options: ["cham", "cham", "cham", "chamm"], answer: "cham" },
  { hangul: "꽤", options: ["kkwae", "kwae", "kkwae", "ggwae"], answer: "kkwae" },
  { hangul: "더", options: ["deo", "do", "deo", "de"], answer: "deo" },
  { hangul: "덜", options: ["deol", "dol", "deol", "deol"], answer: "deol" },
  { hangul: "가장", options: ["ga-jang", "ga-jang", "gajang", "ga-jang"], answer: "ga-jang" },
  { hangul: "제일", options: ["je-il", "je-eel", "jeil", "je-il"], answer: "je-il" },
  { hangul: "많이", options: ["man-hi", "man-hee", "manhi", "man-hi"], answer: "man-hi" },
  { hangul: "조금", options: ["jo-geum", "jo-keum", "jogeum", "jo-geum"], answer: "jo-geum" },
  { hangul: "약간", options: ["yak-gan", "yak-gan", "yakgan", "yak-gan"], answer: "yak-gan" },
  { hangul: "조금만", options: ["jo-geum-man", "jo-keum-man", "jogeumman", "jo-geum-man"], answer: "jo-geum-man" },
  { hangul: "많이", options: ["man-hi", "man-hee", "manhi", "man-hi"], answer: "man-hi" },
  { hangul: "적게", options: ["jeok-ge", "juk-ge", "jeokge", "jeok-ge"], answer: "jeok-ge" },
  { hangul: "빨리", options: ["ppal-li", "pal-li", "ppalli", "ppal-li"], answer: "ppal-li" },
  { hangul: "느리게", options: ["neu-ri-ge", "nu-ri-ge", "neurige", "neu-ri-ge"], answer: "neu-ri-ge" },
  { hangul: "잘", options: ["jal", "jal", "jal", "jall"], answer: "jal" },
  { hangul: "못", options: ["mot", "mot", "mot", "mott"], answer: "mot" },
  { hangul: "안", options: ["an", "ahn", "an", "ann"], answer: "an" },
  { hangul: "못", options: ["mot", "mot", "mot", "mott"], answer: "mot" },
  { hangul: "거의", options: ["geo-ui", "go-ui", "geoui", "geo-ui"], answer: "geo-ui" },
  { hangul: "전부", options: ["jeon-bu", "jun-bu", "jeonbu", "jeon-bu"], answer: "jeon-bu" },
  { hangul: "다", options: ["da", "da", "da", "daa"], answer: "da" },
  { hangul: "전체", options: ["jeon-che", "jun-che", "jeonche", "jeon-che"], answer: "jeon-che" },
  { hangul: "일부", options: ["il-bu", "il-bu", "ilbu", "il-bu"], answer: "il-bu" },
  { hangul: "대부분", options: ["dae-bu-bun", "de-bu-bun", "daebubun", "dae-bu-bun"], answer: "dae-bu-bun" },
  { hangul: "항상", options: ["hang-sang", "hang-sang", "hangsang", "hang-sang"], answer: "hang-sang" },
  { hangul: "가끔", options: ["ga-kkeum", "ga-keum", "gakkeum", "ga-kkeum"], answer: "ga-kkeum" },
  { hangul: "자주", options: ["ja-ju", "ja-ju", "jaju", "ja-ju"], answer: "ja-ju" },
  { hangul: "가끔", options: ["ga-kkeum", "ga-keum", "gakkeum", "ga-kkeum"], answer: "ga-kkeum" },
  { hangul: "때때로", options: ["ttae-ttae-ro", "tte-tte-ro", "ttaettaero", "ttae-ttae-ro"], answer: "ttae-ttae-ro" },
  { hangul: "항상", options: ["hang-sang", "hang-sang", "hangsang", "hang-sang"], answer: "hang-sang" },
  { hangul: "절대", options: ["jeol-dae", "jol-dae", "jeoldae", "jeol-dae"], answer: "jeol-dae" },
  { hangul: "전혀", options: ["jeon-hyeo", "jun-hyeo", "jeonhyeo", "jeon-hyeo"], answer: "jeon-hyeo" },
  { hangul: "별로", options: ["byeol-lo", "byol-lo", "byeollo", "byeol-lo"], answer: "byeol-lo" },
  { hangul: "너무", options: ["neo-mu", "no-mu", "neomu", "neo-mu"], answer: "neo-mu" },
  { hangul: "매우", options: ["mae-u", "me-u", "maeu", "mae-u"], answer: "mae-u" },
  { hangul: "아주", options: ["a-ju", "a-ju", "aju", "a-ju"], answer: "a-ju" },
  { hangul: "정말", options: ["jeong-mal", "jung-mal", "jeongmal", "jeong-mal"], answer: "jeong-mal" },
  { hangul: "굉장히", options: ["goeng-jang-hi", "gwang-jang-hi", "goengjanghi", "goeng-jang-hi"], answer: "goeng-jang-hi" },
  { hangul: "엄청", options: ["eom-cheong", "om-cheong", "eomcheong", "eom-cheong"], answer: "eom-cheong" },
  { hangul: "괜찮다", options: ["gwaen-chan-ta", "gwaen-chan-da", "gwaenchanhta", "gwaen-chanta"], answer: "gwaen-chan-ta" },
  { hangul: "힘들다", options: ["him-deul-da", "him-dul-da", "himdeulda", "him-deul-da"], answer: "him-deul-da" },
  { hangul: "쉽다", options: ["swip-da", "swip-ta", "swipda", "swip-da"], answer: "swip-da" },
  { hangul: "어렵다", options: ["eo-ryeop-da", "o-ryeop-da", "eoryeopda", "eo-ryeop-da"], answer: "eo-ryeop-da" },
  { hangul: "재미있다", options: ["jae-mi-it-da", "jae-mi-it-ta", "jaemiitta", "jae-mi-it-da"], answer: "jae-mi-it-da" },
  { hangul: "지루하다", options: ["ji-ru-ha-da", "ji-ru-ha-da", "jiruhada", "ji-ru-ha-da"], answer: "ji-ru-ha-da" },
  { hangul: "심심하다", options: ["sim-sim-ha-da", "shim-shim-ha-da", "simsimhada", "sim-sim-ha-da"], answer: "sim-sim-ha-da" },
  { hangul: "즐겁다", options: ["jeul-geop-da", "jeul-gop-da", "jeulgeopda", "jeul-geop-da"], answer: "jeul-geop-da" },
  { hangul: "슬프다", options: ["seul-peu-da", "seul-peu-da", "seulpeuda", "seul-peu-da"], answer: "seul-peu-da" },
  { hangul: "기쁘다", options: ["gi-ppeu-da", "gi-peu-da", "gippeuda", "gi-ppeu-da"], answer: "gi-ppeu-da" },
  { hangul: "화나다", options: ["hwa-na-da", "hwa-na-da", "hwanada", "hwa-na-da"], answer: "hwa-na-da" },
  { hangul: "무섭다", options: ["mu-seop-da", "mu-sop-da", "museopda", "mu-seop-da"], answer: "mu-seop-da" },
  { hangul: "무서워하다", options: ["mu-seo-wo-ha-da", "mu-so-wo-ha-da", "museowohada", "mu-seo-wo-ha-da"], answer: "mu-seo-wo-ha-da" },
  { hangul: "부끄럽다", options: ["bu-kkeu-reop-da", "bu-keu-reop-da", "bukkeureopda", "bu-kkeu-reop-da"], answer: "bu-kkeu-reop-da" },
  { hangul: "부럽다", options: ["bu-reop-da", "bu-rop-da", "bureopda", "bu-reop-da"], answer: "bu-reop-da" },
  { hangul: "그리워하다", options: ["geu-ri-wo-ha-da", "geu-ri-wo-ha-da", "geuriwohada", "geu-ri-wo-ha-da"], answer: "geu-ri-wo-ha-da" },
  { hangul: "사랑하다", options: ["sa-rang-ha-da", "sa-rang-ha-da", "saranghada", "sa-rang-ha-da"], answer: "sa-rang-ha-da" },
  { hangul: "미워하다", options: ["mi-wo-ha-da", "mee-wo-ha-da", "miwohada", "mi-wo-ha-da"], answer: "mi-wo-ha-da" },
  { hangul: "싫어하다", options: ["sil-eo-ha-da", "sil-o-ha-da", "sileohada", "sil-eo-ha-da"], answer: "sil-eo-ha-da" },
  { hangul: "좋아하다", options: ["jo-a-ha-da", "jo-a-ha-da", "joahada", "jo-a-ha-da"], answer: "jo-a-ha-da" },
  { hangul: "걱정하다", options: ["geok-jeong-ha-da", "gok-jeong-ha-da", "geokjeonghada", "geok-jeong-ha-da"], answer: "geok-jeong-ha-da" },
  { hangul: "걱정되다", options: ["geok-jeong-doe-da", "gok-jeong-doe-da", "geokjeongdoeda", "geok-jeong-doe-da"], answer: "geok-jeong-doe-da" },
  { hangul: "기대하다", options: ["gi-dae-ha-da", "gi-de-ha-da", "gidaehada", "gi-dae-ha-da"], answer: "gi-dae-ha-da" },
  { hangul: "희망하다", options: ["hui-mang-ha-da", "hee-mang-ha-da", "huimanghada", "hui-mang-ha-da"], answer: "hui-mang-ha-da" },
  { hangul: "실망하다", options: ["sil-mang-ha-da", "shil-mang-ha-da", "silmanghada", "sil-mang-ha-da"], answer: "sil-mang-ha-da" },
  { hangul: "놀라다", options: ["nol-la-da", "nol-ra-da", "nollada", "nol-la-da"], answer: "nol-la-da" },
  { hangul: "놀라워하다", options: ["nol-la-wo-ha-da", "nol-ra-wo-ha-da", "nollawohada", "nol-la-wo-ha-da"], answer: "nol-la-wo-ha-da" },
  { hangul: "부탁하다", options: ["bu-tak-ha-da", "bu-tak-ha-da", "butakhada", "bu-tak-ha-da"], answer: "bu-tak-ha-da" },
  { hangul: "제안하다", options: ["je-an-ha-da", "je-an-ha-da", "jeanhada", "je-an-ha-da"], answer: "je-an-ha-da" },
  { hangul: "거절하다", options: ["geo-jeol-ha-da", "go-jeol-ha-da", "geojolhada", "geo-jeol-ha-da"], answer: "geo-jeol-ha-da" },
  { hangul: "동의하다", options: ["dong-ui-ha-da", "dong-ee-ha-da", "donguihada", "dong-ui-ha-da"], answer: "dong-ui-ha-da" },
  { hangul: "반대하다", options: ["ban-dae-ha-da", "ban-de-ha-da", "bandaehada", "ban-dae-ha-da"], answer: "ban-dae-ha-da" },
  { hangul: "설명하다", options: ["seol-myeong-ha-da", "sol-myong-ha-da", "seolmyeonghada", "seol-myeong-ha-da"], answer: "seol-myeong-ha-da" },
  { hangul: "이해하다", options: ["i-hae-ha-da", "ee-he-ha-da", "ihaehada", "i-hae-ha-da"], answer: "i-hae-ha-da" },
  { hangul: "잊다", options: ["it-da", "ij-da", "itda", "it-ta"], answer: "it-da" },
  { hangul: "기억나다", options: ["gi-eok-na-da", "gi-ok-na-da", "gieoknada", "gi-eok-na-da"], answer: "gi-eok-na-da" },
  { hangul: "생각나다", options: ["saeng-gak-na-da", "saeng-gak-na-da", "saenggaknada", "saeng-gak-na-da"], answer: "saeng-gak-na-da" },
  { hangul: "결심하다", options: ["gyeol-sim-ha-da", "gyol-sim-ha-da", "gyolsimhada", "gyeol-sim-ha-da"], answer: "gyeol-sim-ha-da" },
  { hangul: "결정하다", options: ["gyeol-jeong-ha-da", "gyol-jung-ha-da", "gyoljeonghada", "gyeol-jeong-ha-da"], answer: "gyeol-jeong-ha-da" },
  { hangul: "선택하다", options: ["seon-taek-ha-da", "son-taek-ha-da", "seontaekhada", "seon-taek-ha-da"], answer: "seon-taek-ha-da" },
  { hangul: "시도하다", options: ["si-do-ha-da", "shi-do-ha-da", "sidohada", "si-do-ha-da"], answer: "si-do-ha-da" },
  { hangul: "성취하다", options: ["seong-chwi-ha-da", "sung-chwi-ha-da", "seongchwihada", "seong-chwi-ha-da"], answer: "seong-chwi-ha-da" },
  { hangul: "실현하다", options: ["sil-hyeon-ha-da", "shil-hyon-ha-da", "silhyeonhada", "sil-hyeon-ha-da"], answer: "sil-hyeon-ha-da" },
  { hangul: "포기하다", options: ["po-gi-ha-da", "po-gi-ha-da", "pogihada", "po-gi-ha-da"], answer: "po-gi-ha-da" },
  { hangul: "계속하다", options: ["gye-sok-ha-da", "gye-sok-ha-da", "gyesokhada", "gye-sok-ha-da"], answer: "gye-sok-ha-da" },
  { hangul: "멈추다", options: ["meom-chu-da", "mom-chu-da", "meomchuda", "meom-chu-da"], answer: "meom-chu-da" },
  { hangul: "시작하다", options: ["si-jak-ha-da", "shi-jak-ha-da", "sijakhada", "si-jak-ha-da"], answer: "si-jak-ha-da" },
  { hangul: "끝내다", options: ["kkeut-nae-da", "keut-ne-da", "kkeutnaeda", "kkeut-nae-da"], answer: "kkeut-nae-da" },
  { hangul: "변경하다", options: ["byeon-gyeong-ha-da", "byon-gyong-ha-da", "byeongyeonghada", "byeon-gyeong-ha-da"], answer: "byeon-gyeong-ha-da" },
  { hangul: "바꾸다", options: ["ba-kku-da", "ba-ku-da", "bakkuda", "ba-kku-da"], answer: "ba-kku-da" },
  { hangul: "교환하다", options: ["gyo-hwan-ha-da", "gyo-hwan-ha-da", "gyohwanhada", "gyo-hwan-ha-da"], answer: "gyo-hwan-ha-da" },
  { hangul: "대체하다", options: ["dae-che-ha-da", "de-che-ha-da", "daechehada", "dae-che-ha-da"], answer: "dae-che-ha-da" },
  { hangul: "준비하다", options: ["jun-bi-ha-da", "joon-bi-ha-da", "junbihada", "jun-bi-ha-da"], answer: "jun-bi-ha-da" },
  { hangul: "준비되다", options: ["jun-bi-doe-da", "joon-bi-doe-da", "junbidoeda", "jun-bi-doe-da"], answer: "jun-bi-doe-da" },
  { hangul: "연결하다", options: ["yeon-gyeol-ha-da", "yon-gyol-ha-da", "yeongyeolhada", "yeon-gyeol-ha-da"], answer: "yeon-gyeol-ha-da" },
  { hangul: "분리하다", options: ["bun-ri-ha-da", "bun-ri-ha-da", "bunrihada", "bun-ri-ha-da"], answer: "bun-ri-ha-da" },
  { hangul: "합치다", options: ["hap-chi-da", "hap-chi-da", "hapchida", "hap-chi-da"], answer: "hap-chi-da" },
  { hangul: "나누다", options: ["na-nu-da", "na-noo-da", "nanuda", "na-nu-da"], answer: "na-nu-da" },
  { hangul: "공유하다", options: ["gong-yu-ha-da", "kong-yu-ha-da", "gongyuhada", "gong-yu-ha-da"], answer: "gong-yu-ha-da" },
  { hangul: "나타나다", options: ["na-ta-na-da", "na-ta-na-da", "natanada", "na-ta-na-da"], answer: "na-ta-na-da" },
  { hangul: "사라지다", options: ["sa-ra-ji-da", "sa-ra-ji-da", "sarajida", "sa-ra-ji-da"], answer: "sa-ra-ji-da" },
  { hangul: "발생하다", options: ["bal-saeng-ha-da", "bal-saeng-ha-da", "balsaenghada", "bal-saeng-ha-da"], answer: "bal-saeng-ha-da" },
  { hangul: "일어나다", options: ["i-reo-na-da", "il-eo-na-da", "ireonada", "i-reo-na-da"], answer: "i-reo-na-da" },
  { hangul: "증가하다", options: ["jeung-ga-ha-da", "jeung-ga-ha-da", "jeunggahada", "jeung-ga-ha-da"], answer: "jeung-ga-ha-da" },
  { hangul: "감소하다", options: ["gam-so-ha-da", "gam-so-ha-da", "gamsohada", "gam-so-ha-da"], answer: "gam-so-ha-da" },
  { hangul: "올라가다", options: ["ol-la-ga-da", "ol-ra-ga-da", "ollagada", "ol-la-ga-da"], answer: "ol-la-ga-da" },
  { hangul: "내려가다", options: ["nae-ryeo-ga-da", "ne-ryo-ga-da", "naeryeogada", "nae-ryeo-ga-da"], answer: "nae-ryeo-ga-da" },
  { hangul: "들어가다", options: ["deul-eo-ga-da", "dul-o-ga-da", "deureogada", "deul-eo-ga-da"], answer: "deul-eo-ga-da" },
  { hangul: "나가다", options: ["na-ga-da", "na-ga-da", "nagada", "na-ga-da"], answer: "na-ga-da" },
  { hangul: "올라오다", options: ["ol-la-o-da", "ol-ra-o-da", "ollaoda", "ol-la-o-da"], answer: "ol-la-o-da" },
  { hangul: "내려오다", options: ["nae-ryeo-o-da", "ne-ryo-o-da", "naeryeooda", "nae-ryeo-o-da"], answer: "nae-ryeo-o-da" },
  { hangul: "들어오다", options: ["deul-eo-o-da", "dul-o-o-da", "deureooda", "deul-eo-o-da"], answer: "deul-eo-o-da" },
  { hangul: "나오다", options: ["na-o-da", "na-o-da", "naoda", "na-o-da"], answer: "na-o-da" },
  { hangul: "건너가다", options: ["geon-neo-ga-da", "gon-no-ga-da", "geonneogada", "geon-neo-ga-da"], answer: "geon-neo-ga-da" },
  { hangul: "건너오다", options: ["geon-neo-o-da", "gon-no-o-da", "geonneooda", "geon-neo-o-da"], answer: "geon-neo-o-da" },
  { hangul: "따라가다", options: ["tta-ra-ga-da", "tta-ra-ga-da", "ttaragada", "tta-ra-ga-da"], answer: "tta-ra-ga-da" },
  { hangul: "따라오다", options: ["tta-ra-o-da", "tta-ra-o-da", "ttaraoda", "tta-ra-o-da"], answer: "tta-ra-o-da" },
  { hangul: "만나오다", options: ["man-na-o-da", "man-na-o-da", "mannaoda", "man-na-o-da"], answer: "man-na-o-da" },
  { hangul: "데려가다", options: ["de-ryeo-ga-da", "de-ryo-ga-da", "deryeogada", "de-ryeo-ga-da"], answer: "de-ryeo-ga-da" },
  { hangul: "데려오다", options: ["de-ryeo-o-da", "de-ryo-o-da", "deryeooda", "de-ryeo-o-da"], answer: "de-ryeo-o-da" },
  { hangul: "가져가다", options: ["ga-jyeo-ga-da", "ga-jyo-ga-da", "gajyeogada", "ga-jyeo-ga-da"], answer: "ga-jyeo-ga-da" },
  { hangul: "가져오다", options: ["ga-jyeo-o-da", "ga-jyo-o-da", "gajyeooda", "ga-jyeo-o-da"], answer: "ga-jyeo-o-da" },
  { hangul: "보내다", options: ["bo-nae-da", "bo-ne-da", "bonaeda", "bo-nae-da"], answer: "bo-nae-da" },
  { hangul: "받다", options: ["bat-da", "bad-da", "batda", "bat-ta"], answer: "bat-da" },
  { hangul: "빌리다", options: ["bil-li-da", "bil-ri-da", "billida", "bil-li-da"], answer: "bil-li-da" },
  { hangul: "빌려주다", options: ["bil-lyeo-ju-da", "bil-lyo-ju-da", "billyeojuda", "bil-lyeo-ju-da"], answer: "bil-lyeo-ju-da" },
  { hangul: "갚다", options: ["gap-da", "gab-da", "gapda", "gap-ta"], answer: "gap-da" },
  { hangul: "돌려주다", options: ["dol-lyeo-ju-da", "dol-lyo-ju-da", "dollyeojuda", "dol-lyeo-ju-da"], answer: "dol-lyeo-ju-da" },
  { hangul: "돌아가다", options: ["do-ra-ga-da", "do-ra-ga-da", "doragada", "do-ra-ga-da"], answer: "do-ra-ga-da" },
  { hangul: "돌아오다", options: ["do-ra-o-da", "do-ra-o-da", "doraoda", "do-ra-o-da"], answer: "do-ra-o-da" },
  { hangul: "돌다", options: ["dol-da", "dol-ta", "dolda", "dol-da"], answer: "dol-da" },
  { hangul: "돌리다", options: ["dol-li-da", "dol-ri-da", "dollida", "dol-li-da"], answer: "dol-li-da" },
  { hangul: "넣다", options: ["neot-da", "not-da", "neotda", "neot-ta"], answer: "neot-da" },
  { hangul: "꺼내다", options: ["kkeo-nae-da", "keo-ne-da", "kkeonaeda", "kkeo-nae-da"], answer: "kkeo-nae-da" },
  { hangul: "담다", options: ["dam-da", "dam-ta", "damda", "dam-da"], answer: "dam-da" },
  { hangul: "쌓다", options: ["ssa-ta", "ssa-da", "ssata", "ssa-ta"], answer: "ssa-ta" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "지우다", options: ["ji-u-da", "ji-oo-da", "jiuda", "ji-u-da"], answer: "ji-u-da" },
  { hangul: "그리다", options: ["geu-ri-da", "geu-ri-da", "geurida", "geu-ri-da"], answer: "geu-ri-da" },
  { hangul: "칠하다", options: ["chil-ha-da", "chil-ha-da", "chilhada", "chil-ha-da"], answer: "chil-ha-da" },
  { hangul: "붙이다", options: ["bu-chi-da", "bu-chi-da", "buchida", "bu-chi-da"], answer: "bu-chi-da" },
  { hangul: "떼다", options: ["tte-da", "te-da", "tteda", "tte-da"], answer: "tte-da" },
  { hangul: "감다", options: ["gam-da", "gam-ta", "gamda", "gam-da"], answer: "gam-da" },
  { hangul: "씻기다", options: ["ssit-gi-da", "ssit-ki-da", "ssitgida", "ssit-gi-da"], answer: "ssit-gi-da" },
  { hangul: "말리다", options: ["mal-li-da", "mal-ri-da", "mallida", "mal-li-da"], answer: "mal-li-da" },
  { hangul: "닦다", options: ["dak-da", "dag-da", "dakda", "dak-ta"], answer: "dak-da" },
  { hangul: "빨다", options: ["ppal-da", "pal-da", "ppalda", "ppal-da"], answer: "ppal-da" },
  { hangul: "다림질하다", options: ["da-rim-jil-ha-da", "da-rim-jil-ha-da", "darimjilhada", "da-rim-jil-ha-da"], answer: "da-rim-jil-ha-da" },
  { hangul: "정리하다", options: ["jeong-ri-ha-da", "jung-ri-ha-da", "jeongrihada", "jeong-ri-ha-da"], answer: "jeong-ri-ha-da" },
  { hangul: "치우다", options: ["chi-u-da", "chi-oo-da", "chiuda", "chi-u-da"], answer: "chi-u-da" },
  { hangul: "버리다", options: ["beo-ri-da", "bo-ri-da", "beorida", "beo-ri-da"], answer: "beo-ri-da" },
  { hangul: "모으다", options: ["mo-eu-da", "mo-u-da", "moeuda", "mo-eu-da"], answer: "mo-eu-da" },
  { hangul: "모이다", options: ["mo-i-da", "mo-ee-da", "moida", "mo-i-da"], answer: "mo-i-da" },
  { hangul: "흩다", options: ["heut-da", "heud-da", "heutda", "heut-ta"], answer: "heut-da" },
  { hangul: "섞다", options: ["seok-da", "sok-da", "seokda", "seok-ta"], answer: "seok-da" },
  { hangul: "섞이다", options: ["seok-i-da", "sok-ee-da", "seokida", "seok-i-da"], answer: "seok-i-da" },
  { hangul: "나누다", options: ["na-nu-da", "na-noo-da", "nanuda", "na-nu-da"], answer: "na-nu-da" },
  { hangul: "나뉘다", options: ["na-nwi-da", "na-nwee-da", "nanwida", "na-nwi-da"], answer: "na-nwi-da" },
  { hangul: "합치다", options: ["hap-chi-da", "hap-chi-da", "hapchida", "hap-chi-da"], answer: "hap-chi-da" },
  { hangul: "합쳐지다", options: ["hap-chyeo-ji-da", "hap-chyo-ji-da", "hapchyeojida", "hap-chyeo-ji-da"], answer: "hap-chyeo-ji-da" },
  { hangul: "쪼개다", options: ["jjo-gae-da", "jo-ge-da", "jjogaeda", "jjo-gae-da"], answer: "jjo-gae-da" },
  { hangul: "쪼개지다", options: ["jjo-gae-ji-da", "jo-ge-ji-da", "jjogaejida", "jjo-gae-ji-da"], answer: "jjo-gae-ji-da" },
  { hangul: "깨다", options: ["kkae-da", "gae-da", "kkaeda", "kkae-da"], answer: "kkae-da" },
  { hangul: "깨지다", options: ["kkae-ji-da", "gae-ji-da", "kkaejida", "kkae-ji-da"], answer: "kkae-ji-da" },
  { hangul: "부수다", options: ["bu-su-da", "bu-soo-da", "busuda", "bu-su-da"], answer: "bu-su-da" },
  { hangul: "부서지다", options: ["bu-seo-ji-da", "bu-so-ji-da", "buseojida", "bu-seo-ji-da"], answer: "bu-seo-ji-da" },
  { hangul: "고치다", options: ["go-chi-da", "go-chi-da", "gochida", "go-chi-da"], answer: "go-chi-da" },
  { hangul: "고쳐지다", options: ["go-chyeo-ji-da", "go-chyo-ji-da", "gochyeojida", "go-chyeo-ji-da"], answer: "go-chyeo-ji-da" },
  { hangul: "만들다", options: ["man-deul-da", "man-dul-da", "mandulda", "man-deul-da"], answer: "man-deul-da" },
  { hangul: "만들어지다", options: ["man-deul-eo-ji-da", "man-dul-o-ji-da", "mandureojida", "man-deul-eo-ji-da"], answer: "man-deul-eo-ji-da" },
  { hangul: "짓다", options: ["jit-da", "jis-da", "jitda", "jit-ta"], answer: "jit-da" },
  { hangul: "지어지다", options: ["ji-eo-ji-da", "ji-o-ji-da", "jieojida", "ji-eo-ji-da"], answer: "ji-eo-ji-da" },
  { hangul: "짓다", options: ["jit-da", "jis-da", "jitda", "jit-ta"], answer: "jit-da" },
  { hangul: "세우다", options: ["se-u-da", "se-oo-da", "seuda", "se-u-da"], answer: "se-u-da" },
  { hangul: "세워지다", options: ["se-wo-ji-da", "se-wo-ji-da", "sewojida", "se-wo-ji-da"], answer: "se-wo-ji-da" },
  { hangul: "넓히다", options: ["neol-pi-da", "nol-pi-da", "neolpida", "neol-pi-da"], answer: "neol-pi-da" },
  { hangul: "넓어지다", options: ["neol-beo-ji-da", "nol-bo-ji-da", "neolbeojida", "neol-beo-ji-da"], answer: "neol-beo-ji-da" },
  { hangul: "좁히다", options: ["jop-hi-da", "jop-hee-da", "jophida", "jop-hi-da"], answer: "jop-hi-da" },
  { hangul: "좁아지다", options: ["jo-ba-ji-da", "jo-ba-ji-da", "jobajida", "jo-ba-ji-da"], answer: "jo-ba-ji-da" },
  { hangul: "늘리다", options: ["neul-li-da", "nul-li-da", "neullida", "neul-li-da"], answer: "neul-li-da" },
  { hangul: "늘다", options: ["neul-da", "nul-da", "neulda", "neul-da"], answer: "neul-da" },
  { hangul: "줄이다", options: ["ju-ri-da", "joo-ri-da", "jurida", "ju-ri-da"], answer: "ju-ri-da" },
  { hangul: "줄다", options: ["jul-da", "jool-da", "julda", "jul-da"], answer: "jul-da" },
  { hangul: "늘다", options: ["neul-da", "nul-da", "neulda", "neul-da"], answer: "neul-da" },
  { hangul: "줄다", options: ["jul-da", "jool-da", "julda", "jul-da"], answer: "jul-da" },
  { hangul: "키우다", options: ["ki-u-da", "ki-oo-da", "kiuda", "ki-u-da"], answer: "ki-u-da" },
  { hangul: "자라다", options: ["ja-ra-da", "ja-ra-da", "jarada", "ja-ra-da"], answer: "ja-ra-da" },
  { hangul: "줄다", options: ["jul-da", "jool-da", "julda", "jul-da"], answer: "jul-da" },
  { hangul: "커지다", options: ["keo-ji-da", "ko-ji-da", "keojida", "keo-ji-da"], answer: "keo-ji-da" },
  { hangul: "작아지다", options: ["ja-ga-ji-da", "jak-ga-ji-da", "jagajida", "ja-ga-ji-da"], answer: "ja-ga-ji-da" },
  { hangul: "높이다", options: ["nop-i-da", "nop-ee-da", "nopida", "nop-i-da"], answer: "nop-i-da" },
  { hangul: "낮추다", options: ["nat-chu-da", "naj-chu-da", "natchuda", "nat-chu-da"], answer: "nat-chu-da" },
  { hangul: "올리다", options: ["ol-li-da", "ol-ri-da", "ollida", "ol-li-da"], answer: "ol-li-da" },
  { hangul: "내리다", options: ["nae-ri-da", "ne-ri-da", "naerida", "nae-ri-da"], answer: "nae-ri-da" },
  { hangul: "올라가다", options: ["ol-la-ga-da", "ol-ra-ga-da", "ollagada", "ol-la-ga-da"], answer: "ol-la-ga-da" },
  { hangul: "내려가다", options: ["nae-ryeo-ga-da", "ne-ryo-ga-da", "naeryeogada", "nae-ryeo-ga-da"], answer: "nae-ryeo-ga-da" },
  { hangul: "올리다", options: ["ol-li-da", "ol-ri-da", "ollida", "ol-li-da"], answer: "ol-li-da" },
  { hangul: "내리다", options: ["nae-ri-da", "ne-ri-da", "naerida", "nae-ri-da"], answer: "nae-ri-da" },
  { hangul: "들다", options: ["deul-da", "dul-da", "deulda", "deul-da"], answer: "deul-da" },
  { hangul: "들리다", options: ["deul-li-da", "dul-li-da", "deullida", "deul-li-da"], answer: "deul-li-da" },
  { hangul: "듣다", options: ["deut-da", "deud-da", "deutda", "deut-ta"], answer: "deut-da" },
  { hangul: "말하다", options: ["mal-ha-da", "mal-ha-ta", "malhada", "mal-ha-da"], answer: "mal-ha-da" },
  { hangul: "대답하다", options: ["dae-dap-ha-da", "de-dap-ha-da", "daedaphada", "dae-dap-ha-da"], answer: "dae-dap-ha-da" },
  { hangul: "질문하다", options: ["jil-mun-ha-da", "jil-moon-ha-da", "jilmunhada", "jil-mun-ha-da"], answer: "jil-mun-ha-da" },
  { hangul: "부르다", options: ["bu-reu-da", "bu-ru-da", "bureuda", "bu-reu-da"], answer: "bu-reu-da" },
  { hangul: "울리다", options: ["ul-li-da", "ool-li-da", "ullida", "ul-li-da"], answer: "ul-li-da" },
  { hangul: "노래하다", options: ["no-rae-ha-da", "no-re-ha-da", "noraehada", "no-rae-ha-da"], answer: "no-rae-ha-da" },
  { hangul: "연주하다", options: ["yeon-ju-ha-da", "yon-ju-ha-da", "yeonjuhada", "yeon-ju-ha-da"], answer: "yeon-ju-ha-da" },
  { hangul: "춤추다", options: ["chum-chu-da", "choom-chu-da", "chumchuda", "chum-chu-da"], answer: "chum-chu-da" },
  { hangul: "연기하다", options: ["yeon-gi-ha-da", "yon-gi-ha-da", "yeongihada", "yeon-gi-ha-da"], answer: "yeon-gi-ha-da" },
  { hangul: "찍다", options: ["jjik-da", "jik-da", "jjikda", "jjik-ta"], answer: "jjik-da" },
  { hangul: "촬영하다", options: ["chwal-yeong-ha-da", "chwal-yong-ha-da", "chwallyeonghada", "chwal-yeong-ha-da"], answer: "chwal-yeong-ha-da" },
  { hangul: "녹화하다", options: ["nok-hwa-ha-da", "nok-hwa-ha-da", "nokhwahada", "nok-hwa-ha-da"], answer: "nok-hwa-ha-da" },
  { hangul: "재생하다", options: ["jae-saeng-ha-da", "je-saeng-ha-da", "jaesaenghada", "jae-saeng-ha-da"], answer: "jae-saeng-ha-da" },
  { hangul: "멈추다", options: ["meom-chu-da", "mom-chu-da", "meomchuda", "meom-chu-da"], answer: "meom-chu-da" },
  { hangul: "멈추다", options: ["meom-chu-da", "mom-chu-da", "meomchuda", "meom-chu-da"], answer: "meom-chu-da" },
  { hangul: "켜다", options: ["kyeo-da", "kyo-da", "kyeoda", "kyeo-da"], answer: "kyeo-da" },
  { hangul: "끄다", options: ["kkeu-da", "kku-da", "kkeuda", "kkeu-da"], answer: "kkeu-da" },
  { hangul: "열다", options: ["yeol-da", "yol-da", "yeolda", "yeol-ta"], answer: "yeol-da" },
  { hangul: "닫다", options: ["dat-da", "dad-da", "datda", "dat-ta"], answer: "dat-da" },
  { hangul: "피우다", options: ["pi-u-da", "pi-oo-da", "piuda", "pi-u-da"], answer: "pi-u-da" },
  { hangul: "끄다", options: ["kkeu-da", "kku-da", "kkeuda", "kkeu-da"], answer: "kkeu-da" },
  { hangul: "타다", options: ["ta-da", "ta-ta", "tada", "ta-da"], answer: "ta-da" },
  { hangul: "타오르다", options: ["ta-o-reu-da", "ta-o-ru-da", "taoreuda", "ta-o-reu-da"], answer: "ta-o-reu-da" },
  { hangul: "꺼지다", options: ["kkeo-ji-da", "keo-ji-da", "kkeojida", "kkeo-ji-da"], answer: "kkeo-ji-da" },
  { hangul: "꺼지다", options: ["kkeo-ji-da", "keo-ji-da", "kkeojida", "kkeo-ji-da"], answer: "kkeo-ji-da" },
  { hangul: "켜지다", options: ["kyeo-ji-da", "kyo-ji-da", "kyeojida", "kyeo-ji-da"], answer: "kyeo-ji-da" },
  { hangul: "열리다", options: ["yeol-li-da", "yol-li-da", "yeollida", "yeol-li-da"], answer: "yeol-li-da" },
  { hangul: "닫히다", options: ["dat-chi-da", "dach-i-da", "datchida", "dat-chi-da"], answer: "dat-chi-da" },
  { hangul: "잠기다", options: ["jam-gi-da", "jam-ki-da", "jamgida", "jam-gi-da"], answer: "jam-gi-da" },
  { hangul: "잠그다", options: ["jam-geu-da", "jam-ku-da", "jamgeuda", "jam-geu-da"], answer: "jam-geu-da" },
  { hangul: "풀다", options: ["pul-da", "pool-da", "pulda", "pul-da"], answer: "pul-da" },
  { hangul: "묶다", options: ["muk-da", "mook-da", "mukda", "muk-ta"], answer: "muk-da" },
  { hangul: "풀리다", options: ["pul-li-da", "pool-li-da", "pullida", "pul-li-da"], answer: "pul-li-da" },
  { hangul: "묶이다", options: ["muk-i-da", "mook-ee-da", "mukida", "muk-i-da"], answer: "muk-i-da" },
  { hangul: "감다", options: ["gam-da", "gam-ta", "gamda", "gam-da"], answer: "gam-da" },
  { hangul: "풀다", options: ["pul-da", "pool-da", "pulda", "pul-da"], answer: "pul-da" },
  { hangul: "감기다", options: ["gam-gi-da", "gam-ki-da", "gamgida", "gam-gi-da"], answer: "gam-gi-da" },
  { hangul: "풀리다", options: ["pul-li-da", "pool-li-da", "pullida", "pul-li-da"], answer: "pul-li-da" },
  { hangul: "입다", options: ["ip-da", "ip-ta", "ipda", "ip-da"], answer: "ip-da" },
  { hangul: "벗다", options: ["beot-da", "but-da", "beotda", "beot-ta"], answer: "beot-da" },
  { hangul: "신다", options: ["sin-da", "shin-da", "sinda", "sin-da"], answer: "sin-da" },
  { hangul: "벗다", options: ["beot-da", "but-da", "beotda", "beot-ta"], answer: "beot-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "빼다", options: ["ppae-da", "pae-da", "ppaeda", "ppae-da"], answer: "ppae-da" },
  { hangul: "꽂다", options: ["kkot-da", "kot-da", "kkotda", "kkot-ta"], answer: "kkot-da" },
  { hangul: "꽂다", options: ["kkot-da", "kot-da", "kkotda", "kkot-ta"], answer: "kkot-da" },
  { hangul: "꽂히다", options: ["kkochi-da", "kochi-da", "kkochida", "kkochi-da"], answer: "kkochi-da" },
  { hangul: "씌우다", options: ["sswi-u-da", "sswee-oo-da", "sswiuda", "sswi-u-da"], answer: "sswi-u-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "먹다", options: ["meok-da", "mok-da", "meokda", "meok-ta"], answer: "meok-da" },
  { hangul: "마시다", options: ["ma-si-da", "ma-shi-da", "masida", "ma-si-da"], answer: "ma-si-da" },
  { hangul: "맛보다", options: ["mat-bo-da", "mas-bo-da", "matboda", "mat-bo-da"], answer: "mat-bo-da" },
  { hangul: "삼키다", options: ["sam-ki-da", "sam-kee-da", "samkida", "sam-ki-da"], answer: "sam-ki-da" },
  { hangul: "씹다", options: ["ssip-da", "ssip-ta", "ssipda", "ssip-da"], answer: "ssip-da" },
  { hangul: "냄새", options: ["naem-sae", "nem-se", "naemsae", "naem-sae"], answer: "naem-sae" },
  { hangul: "냄새나다", options: ["naem-sae-na-da", "nem-se-na-da", "naemsaenada", "naem-sae-na-da"], answer: "naem-sae-na-da" },
  { hangul: "향기", options: ["hyang-gi", "hyang-kee", "hyanggi", "hyang-gi"], answer: "hyang-gi" },
  { hangul: "냄새", options: ["naem-sae", "nem-se", "naemsae", "naem-sae"], answer: "naem-sae" },
  { hangul: "맛", options: ["mat", "mas", "mat", "matt"], answer: "mat" },
  { hangul: "맛있다", options: ["mas-it-da", "mat-it-da", "masitta", "mas-it-da"], answer: "mas-it-da" },
  { hangul: "맛없다", options: ["mat-eop-da", "mas-eop-da", "mateopda", "mat-eop-da"], answer: "mat-eop-da" },
  { hangul: "달다", options: ["dal-da", "dal-ta", "dalda", "dal-da"], answer: "dal-da" },
  { hangul: "짜다", options: ["jja-da", "ja-da", "jjada", "jja-da"], answer: "jja-da" },
  { hangul: "맵다", options: ["maep-da", "mep-da", "maepda", "maep-ta"], answer: "maep-da" },
  { hangul: "싱겁다", options: ["sing-geop-da", "sing-gop-da", "singgeopda", "sing-geop-da"], answer: "sing-geop-da" },
  { hangul: "짜다", options: ["jja-da", "ja-da", "jjada", "jja-da"], answer: "jja-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "시다", options: ["si-da", "shi-da", "sida", "si-da"], answer: "si-da" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "쓴맛", options: ["sseun-mat", "sseun-mas", "sseunmat", "sseun-mat"], answer: "sseun-mat" },
  { hangul: "단맛", options: ["dan-mat", "dan-mas", "danmat", "dan-mat"], answer: "dan-mat" },
  { hangul: "짠맛", options: ["jjan-mat", "jjan-mas", "jjanmat", "jjan-mat"], answer: "jjan-mat" },
  { hangul: "매운맛", options: ["mae-un-mat", "me-un-mat", "maeunmat", "mae-un-mat"], answer: "mae-un-mat" },
  { hangul: "신맛", options: ["sin-mat", "shin-mat", "sinmat", "sin-mat"], answer: "sin-mat" },
  { hangul: "쓰다", options: ["sseu-da", "sseu-ta", "sseuda", "sseu-da"], answer: "sseu-da" },
  { hangul: "고소하다", options: ["go-so-ha-da", "go-so-ha-da", "gosohada", "go-so-ha-da"], answer: "go-so-ha-da" },
  { hangul: "바삭하다", options: ["ba-sak-ha-da", "ba-sak-ha-da", "basakhada", "ba-sak-ha-da"], answer: "ba-sak-ha-da" },
  { hangul: "부드럽다", options: ["bu-deu-reop-da", "bu-du-reop-da", "budeureopda", "bu-deu-reop-da"], answer: "bu-deu-reop-da" },
  { hangul: "딱딱하다", options: ["ttak-ttak-ha-da", "ttak-ttak-ha-da", "ttakttakhada", "ttak-ttak-ha-da"], answer: "ttak-ttak-ha-da" },
  { hangul: "미끄럽다", options: ["mi-kkeu-reop-da", "mee-kku-reop-da", "mikkeureopda", "mi-kkeu-reop-da"], answer: "mi-kkeu-reop-da" },
  { hangul: "미끄럽다", options: ["mi-kkeu-reop-da", "mee-kku-reop-da", "mikkeureopda", "mi-kkeu-reop-da"], answer: "mi-kkeu-reop-da" },
  { hangul: "미끄러지다", options: ["mi-kkeu-reo-ji-da", "mee-kku-ro-ji-da", "mikkeureojida", "mi-kkeu-reo-ji-da"], answer: "mi-kkeu-reo-ji-da" },
  { hangul: "미끄러뜨리다", options: ["mi-kkeu-reo-tteu-ri-da", "mee-kku-ro-tteu-ri-da", "mikkeureotteurida", "mi-kkeu-reo-tteu-ri-da"], answer: "mi-kkeu-reo-tteu-ri-da" },
  { hangul: "미끄러지다", options: ["mi-kkeu-reo-ji-da", "mee-kku-ro-ji-da", "mikkeureojida", "mi-kkeu-reo-ji-da"], answer: "mi-kkeu-reo-ji-da" },
  { hangul: "미끄럽다", options: ["mi-kkeu-reop-da", "mee-kku-reop-da", "mikkeureopda", "mi-kkeu-reop-da"], answer: "mi-kkeu-reop-da" },
  { hangul: "끈적하다", options: ["kkeun-jeok-ha-da", "kkeun-jok-ha-da", "kkeunjeokhada", "kkeun-jeok-ha-da"], answer: "kkeun-jeok-ha-da" },
  { hangul: "차갑다", options: ["cha-gap-da", "cha-gab-da", "chagapda", "cha-gap-da"], answer: "cha-gap-da" },
  { hangul: "뜨겁다", options: ["tteu-geop-da", "tteu-gop-da", "tteugeopda", "tteu-geop-da"], answer: "tteu-geop-da" },
  { hangul: "덥다", options: ["deop-da", "dob-da", "deopda", "deop-ta"], answer: "deop-da" },
  { hangul: "춥다", options: ["chup-da", "chub-da", "chupda", "chup-ta"], answer: "chup-da" },
  { hangul: "따뜻하다", options: ["tta-tteut-ha-da", "tta-tteut-ha-da", "ttatteuthada", "tta-tteut-ha-da"], answer: "tta-tteut-ha-da" },
  { hangul: "시원하다", options: ["si-won-ha-da", "shi-won-ha-da", "siwonhada", "si-won-ha-da"], answer: "si-won-ha-da" },
  { hangul: "차갑다", options: ["cha-gap-da", "cha-gab-da", "chagapda", "cha-gap-da"], answer: "cha-gap-da" },
  { hangul: "뜨겁다", options: ["tteu-geop-da", "tteu-gop-da", "tteugeopda", "tteu-geop-da"], answer: "tteu-geop-da" },
  { hangul: "덥다", options: ["deop-da", "dob-da", "deopda", "deop-ta"], answer: "deop-da" },
  { hangul: "춥다", options: ["chup-da", "chub-da", "chupda", "chup-ta"], answer: "chup-da" },
  { hangul: "사십", options: ["sa-sip", "sa-ship", "sasip", "sa-sip"], answer: "sa-sip" },
  { hangul: "오십", options: ["o-sip", "o-ship", "osip", "o-sip"], answer: "o-sip" },
  { hangul: "육십", options: ["yuk-sip", "yook-ship", "yuksip", "yuk-sip"], answer: "yuk-sip" },
  { hangul: "칠십", options: ["chil-sip", "chil-ship", "chilsip", "chil-sip"], answer: "chil-sip" },
  { hangul: "팔십", options: ["pal-sip", "pal-ship", "palsip", "pal-sip"], answer: "pal-sip" },
  { hangul: "구십", options: ["gu-sip", "goo-ship", "gusip", "gu-sip"], answer: "gu-sip" },
  { hangul: "백", options: ["baek", "bek", "baek", "baeg"], answer: "baek" },
  { hangul: "천", options: ["cheon", "chon", "cheon", "cheun"], answer: "cheon" },
  { hangul: "만", options: ["man", "man", "man", "mann"], answer: "man" },
  { hangul: "첫째", options: ["cheot-jjae", "chot-jjae", "cheotjjae", "cheot-jjae"], answer: "cheot-jjae" },
  { hangul: "둘째", options: ["dul-jjae", "dool-jjae", "duljjae", "dul-jjae"], answer: "dul-jjae" },
  { hangul: "셋째", options: ["set-jjae", "set-jjae", "setjjae", "set-jjae"], answer: "set-jjae" },
  { hangul: "나중", options: ["na-jung", "na-joong", "najung", "na-jung"], answer: "na-jung" },
  { hangul: "지금", options: ["ji-geum", "ji-keum", "jigeum", "ji-geum"], answer: "ji-geum" },
  { hangul: "아까", options: ["a-kka", "a-ka", "akka", "a-kka"], answer: "a-kka" },
  { hangul: "방금", options: ["bang-geum", "bang-keum", "banggeum", "bang-geum"], answer: "bang-geum" },
  { hangul: "곧", options: ["got", "god", "got", "gott"], answer: "got" },
  { hangul: "때때로", options: ["ttae-ttae-ro", "tte-tte-ro", "ttaettaero", "ttae-ttae-ro"], answer: "ttae-ttae-ro" },
  { hangul: "반드시", options: ["ban-deu-si", "ban-du-shi", "bandeusi", "ban-deu-si"], answer: "ban-deu-si" },
  { hangul: "꼭", options: ["kkok", "kok", "kkok", "ggok"], answer: "kkok" },
  { hangul: "혼자서", options: ["hon-ja-seo", "hon-ja-so", "honjaseo", "hon-ja-seo"], answer: "hon-ja-seo" },
  { hangul: "서로", options: ["seo-ro", "so-ro", "seoro", "seo-ro"], answer: "seo-ro" },
  { hangul: "서로", options: ["seo-ro", "so-ro", "seoro", "seo-ro"], answer: "seo-ro" },
  { hangul: "함께", options: ["ham-kke", "ham-ge", "hamkke", "ham-kke"], answer: "ham-kke" },
  { hangul: "따로", options: ["tta-ro", "ta-ro", "ttaro", "tta-ro"], answer: "tta-ro" },
  { hangul: "각각", options: ["gak-gak", "gak-gak", "gakgak", "gak-gak"], answer: "gak-gak" },
  { hangul: "모두", options: ["mo-du", "mo-doo", "modu", "mo-du"], answer: "mo-du" },
  { hangul: "전부", options: ["jeon-bu", "jun-bu", "jeonbu", "jeon-bu"], answer: "jeon-bu" },
  { hangul: "다", options: ["da", "da", "da", "daa"], answer: "da" },
  { hangul: "아무", options: ["a-mu", "a-moo", "amu", "a-mu"], answer: "a-mu" },
  { hangul: "아무도", options: ["a-mu-do", "a-moo-do", "amudo", "a-mu-do"], answer: "a-mu-do" },
  { hangul: "아무것도", options: ["a-mu-geot-do", "a-mu-got-do", "amugeotdo", "a-mu-geot-do"], answer: "a-mu-geot-do" },
  { hangul: "무엇", options: ["mu-eot", "moo-ot", "mueot", "mu-eot"], answer: "mu-eot" },
  { hangul: "무슨", options: ["mu-seun", "moo-seun", "museun", "mu-seun"], answer: "mu-seun" },
  { hangul: "어떤", options: ["eo-tteon", "o-tteon", "eotteon", "eo-tteon"], answer: "eo-tteon" },
  { hangul: "어떤", options: ["eo-tteon", "o-tteon", "eotteon", "eo-tteon"], answer: "eo-tteon" },
  { hangul: "이런", options: ["i-reon", "ee-reon", "ireon", "i-reon"], answer: "i-reon" },
  { hangul: "그런", options: ["geu-reon", "geu-ron", "geureon", "geu-reon"], answer: "geu-reon" },
  { hangul: "저런", options: ["jeo-reon", "jo-reon", "jeoreon", "jeo-reon"], answer: "jeo-reon" },
  { hangul: "여러", options: ["yeo-reo", "yo-ro", "yeoreo", "yeo-reo"], answer: "yeo-reo" },
  { hangul: "다른", options: ["da-reun", "da-run", "dareun", "da-reun"], answer: "da-reun" },
  { hangul: "같은", options: ["gat-eun", "gach-eun", "gateun", "gat-eun"], answer: "gat-eun" },
  { hangul: "새", options: ["sae", "se", "sae", "sai"], answer: "sae" },
  { hangul: "옛날", options: ["yen-nal", "yet-nal", "yennal", "yen-nal"], answer: "yen-nal" },
  { hangul: "최근", options: ["choe-geun", "chwe-geun", "choegeun", "choe-geun"], answer: "choe-geun" },
  { hangul: "요즘", options: ["yo-jeum", "yo-jeum", "yojeum", "yo-jeum"], answer: "yo-jeum" },
  { hangul: "요전", options: ["yo-jeon", "yo-jon", "yojeon", "yo-jeon"], answer: "yo-jeon" },
  { hangul: "내년", options: ["nae-nyeon", "ne-nyon", "naenyeon", "nae-nyeon"], answer: "nae-nyeon" },
  { hangul: "작년", options: ["jak-nyeon", "jak-nyon", "jaknyeon", "jak-nyeon"], answer: "jak-nyeon" },
  { hangul: "올해", options: ["ol-hae", "ol-he", "olhae", "ol-hae"], answer: "ol-hae" },
  { hangul: "작년", options: ["jak-nyeon", "jak-nyon", "jaknyeon", "jak-nyeon"], answer: "jak-nyeon" },
  { hangul: "내후년", options: ["nae-hu-nyeon", "ne-hu-nyon", "naehunyeon", "nae-hu-nyeon"], answer: "nae-hu-nyeon" },
  { hangul: "재작년", options: ["jae-jak-nyeon", "je-jak-nyon", "jaejaknyeon", "jae-jak-nyeon"], answer: "jae-jak-nyeon" },
  { hangul: "그해", options: ["geu-hae", "geu-he", "geuhae", "geu-hae"], answer: "geu-hae" },
  { hangul: "이번", options: ["i-beon", "ee-bon", "ibeon", "i-beon"], answer: "i-beon" },
  { hangul: "다음", options: ["da-eum", "da-um", "daeum", "da-eum"], answer: "da-eum" },
  { hangul: "이전", options: ["i-jeon", "ee-jon", "ijeon", "i-jeon"], answer: "i-jeon" },
  { hangul: "앞으로", options: ["ap-eu-ro", "ab-eu-ro", "apeuro", "ap-eu-ro"], answer: "ap-eu-ro" },
  { hangul: "뒤로", options: ["dwi-ro", "dwee-ro", "dwiro", "dwi-ro"], answer: "dwi-ro" },
  { hangul: "나머지", options: ["na-meo-ji", "na-mo-ji", "nameoji", "na-meo-ji"], answer: "na-meo-ji" },
  { hangul: "나머지", options: ["na-meo-ji", "na-mo-ji", "nameoji", "na-meo-ji"], answer: "na-meo-ji" },
  { hangul: "나머지", options: ["na-meo-ji", "na-mo-ji", "nameoji", "na-meo-ji"], answer: "na-meo-ji" },
  { hangul: "전체", options: ["jeon-che", "jun-che", "jeonche", "jeon-che"], answer: "jeon-che" },
  { hangul: "일부", options: ["il-bu", "il-bu", "ilbu", "il-bu"], answer: "il-bu" },
  { hangul: "대부분", options: ["dae-bu-bun", "de-bu-bun", "daebubun", "dae-bu-bun"], answer: "dae-bu-bun" },
  { hangul: "절반", options: ["jeol-ban", "jol-ban", "jeolban", "jeol-ban"], answer: "jeol-ban" },
  { hangul: "반", options: ["ban", "ban", "ban", "bann"], answer: "ban" },
  { hangul: "쌍", options: ["ssang", "sang", "ssang", "ssangg"], answer: "ssang" },
  { hangul: "쌍", options: ["ssang", "sang", "ssang", "ssangg"], answer: "ssang" },
  { hangul: "겹", options: ["gyeop", "gyop", "gyeop", "gyeob"], answer: "gyeop" },
  { hangul: "배", options: ["bae", "be", "bae", "bai"], answer: "bae" },
  { hangul: "번", options: ["beon", "bon", "beon", "beun"], answer: "beon" },
  { hangul: "번째", options: ["beon-jjae", "bon-jjae", "beonjjae", "beon-jjae"], answer: "beon-jjae" },
  { hangul: "달", options: ["dal", "dal", "dal", "dall"], answer: "dal" },
  { hangul: "해", options: ["hae", "he", "hae", "hai"], answer: "hae" },
  { hangul: "세", options: ["se", "se", "se", "say"], answer: "se" },
  { hangul: "시", options: ["si", "shi", "si", "see"], answer: "si" },
  { hangul: "분", options: ["bun", "bun", "bun", "boon"], answer: "bun" },
  { hangul: "초", options: ["cho", "cho", "cho", "choh"], answer: "cho" },
  { hangul: "년", options: ["nyeon", "nyon", "nyeon", "nyun"], answer: "nyeon" },
  { hangul: "월", options: ["wol", "wol", "wol", "wool"], answer: "wol" },
  { hangul: "일", options: ["il", "eel", "il", "ill"], answer: "il" },
  { hangul: "시간", options: ["si-gan", "shi-gan", "sigan", "si-gan"], answer: "si-gan" },
  { hangul: "동안", options: ["dong-an", "dong-ahn", "dongan", "dong-an"], answer: "dong-an" },
  { hangul: "사이", options: ["sa-i", "sa-ee", "sai", "sa-i"], answer: "sa-i" },
  { hangul: "안", options: ["an", "ahn", "an", "ann"], answer: "an" },
  { hangul: "속", options: ["sok", "sok", "sok", "sokk"], answer: "sok" },
  { hangul: "위", options: ["wi", "wee", "wi", "wii"], answer: "wi" },
  { hangul: "아래", options: ["a-rae", "a-re", "arae", "a-rae"], answer: "a-rae" },
  { hangul: "앞", options: ["ap", "ab", "ap", "app"], answer: "ap" },
  { hangul: "뒤", options: ["dwi", "dwee", "dwi", "dwi"], answer: "dwi" },
  { hangul: "옆", options: ["yeop", "yop", "yeop", "yeob"], answer: "yeop" },
  { hangul: "밖", options: ["bak", "bag", "bak", "back"], answer: "bak" },
  { hangul: "근처", options: ["geun-cheo", "geun-cho", "geuncheo", "geun-cheo"], answer: "geun-cheo" },
  { hangul: "주변", options: ["ju-byeon", "ju-byon", "jubyeon", "ju-byeon"], answer: "ju-byeon" },
  { hangul: "반대", options: ["ban-dae", "ban-de", "bandae", "ban-dae"], answer: "ban-dae" },
  { hangul: "중심", options: ["jung-sim", "joong-shim", "jungsim", "jung-sim"], answer: "jung-sim" },
  { hangul: "끝", options: ["kkeut", "keut", "kkeut", "ggut"], answer: "kkeut" },
  { hangul: "시작", options: ["si-jak", "shi-jak", "sijak", "si-jak"], answer: "si-jak" },
  { hangul: "가운데", options: ["ga-un-de", "ga-oon-de", "gaunde", "ga-un-de"], answer: "ga-un-de" },
  { hangul: "양쪽", options: ["yang-jjok", "yang-jok", "yangjjok", "yang-jjok"], answer: "yang-jjok" },
  { hangul: "왼쪽", options: ["oen-jjok", "wen-jjok", "oenjjok", "oen-jjok"], answer: "oen-jjok" },
  { hangul: "오른쪽", options: ["o-reun-jjok", "o-reun-jok", "oreunjjok", "o-reun-jjok"], answer: "o-reun-jjok" },
  { hangul: "직진", options: ["jik-jin", "jik-jin", "jikjin", "jik-jin"], answer: "jik-jin" },
  { hangul: "우회전", options: ["u-hoe-jeon", "oo-hoe-jon", "uhoejeon", "u-hoe-jeon"], answer: "u-hoe-jeon" },
  { hangul: "좌회전", options: ["jwa-hoe-jeon", "jwa-hoe-jon", "jwahoejeon", "jwa-hoe-jeon"], answer: "jwa-hoe-jeon" },
  { hangul: "유턴", options: ["yu-teon", "yoo-ton", "yuteon", "yu-teon"], answer: "yu-teon" },
  { hangul: "건너", options: ["geon-neo", "gon-no", "geonneo", "geon-neo"], answer: "geon-neo" },
  { hangul: "건너편", options: ["geon-neo-pyeon", "gon-no-pyon", "geonneopyeon", "geon-neo-pyeon"], answer: "geon-neo-pyeon" },
  { hangul: "골목", options: ["gol-mok", "gol-mok", "golmok", "gol-mok"], answer: "gol-mok" },
  { hangul: "거리", options: ["geo-ri", "go-ri", "geori", "geo-ri"], answer: "geo-ri" },
  { hangul: "건물", options: ["geon-mul", "gon-mul", "geonmul", "geon-mul"], answer: "geon-mul" },
  { hangul: "다리", options: ["da-ri", "da-ri", "dari", "da-ri"], answer: "da-ri" },
  { hangul: "터널", options: ["teo-neol", "to-nol", "teoneol", "teo-neol"], answer: "teo-neol" },
  { hangul: "푸르다", options: ["pu-reu-da", "poo-ru-da", "pureuda", "pu-reu-da"], answer: "pu-reu-da" },
  { hangul: "노랗다", options: ["no-rat-da", "no-rach-da", "noratda", "no-rat-da"], answer: "no-rat-da" },
  { hangul: "빨갛다", options: ["ppal-gat-da", "pal-gat-da", "ppalgatda", "ppal-gat-da"], answer: "ppal-gat-da" },
  { hangul: "파랗다", options: ["pa-rat-da", "pa-rach-da", "paratda", "pa-rat-da"], answer: "pa-rat-da" },
  { hangul: "검다", options: ["geom-da", "gom-da", "geomda", "geom-ta"], answer: "geom-da" },
  { hangul: "희다", options: ["hui-da", "hee-da", "huida", "hui-da"], answer: "hui-da" },
  { hangul: "밝다", options: ["balg-da", "bal-da", "balgda", "balg-ta"], answer: "balg-da" },
  { hangul: "어둡다", options: ["eo-dub-da", "o-dub-da", "eodubda", "eo-dub-da"], answer: "eo-dub-da" },
  { hangul: "투명하다", options: ["tu-myeong-ha-da", "too-myong-ha-da", "tumyeonghada", "tu-myeong-ha-da"], answer: "tu-myeong-ha-da" },
  { hangul: "진하다", options: ["jin-ha-da", "jin-ha-da", "jinhada", "jin-ha-da"], answer: "jin-ha-da" },
  { hangul: "연하다", options: ["yeon-ha-da", "yon-ha-da", "yeonhada", "yeon-ha-da"], answer: "yeon-ha-da" },
  { hangul: "선명하다", options: ["seon-myeong-ha-da", "son-myong-ha-da", "seonmyeonghada", "seon-myeong-ha-da"], answer: "seon-myeong-ha-da" },
  { hangul: "희미하다", options: ["hui-mi-ha-da", "hee-mi-ha-da", "huimihada", "hui-mi-ha-da"], answer: "hui-mi-ha-da" },
  { hangul: "다양하다", options: ["da-yang-ha-da", "da-yang-ha-da", "dayanghada", "da-yang-ha-da"], answer: "da-yang-ha-da" },
  { hangul: "단순하다", options: ["dan-sun-ha-da", "dan-soon-ha-da", "dansunhada", "dan-sun-ha-da"], answer: "dan-sun-ha-da" },
  { hangul: "복잡하다", options: ["bok-jap-ha-da", "bok-jab-ha-da", "bokjaphada", "bok-jap-ha-da"], answer: "bok-jap-ha-da" },
  { hangul: "간단하다", options: ["gan-dan-ha-da", "gan-dan-ha-da", "gandanhada", "gan-dan-ha-da"], answer: "gan-dan-ha-da" },
  { hangul: "어렵다", options: ["eo-ryeop-da", "o-ryeop-da", "eoryeopda", "eo-ryeop-da"], answer: "eo-ryeop-da" },
  { hangul: "쉽다", options: ["swip-da", "swip-ta", "swipda", "swip-da"], answer: "swip-da" },
  { hangul: "명확하다", options: ["myeong-hwak-ha-da", "myong-hwak-ha-da", "myeonghwakhada", "myeong-hwak-ha-da"], answer: "myeong-hwak-ha-da" },
  { hangul: "모호하다", options: ["mo-ho-ha-da", "mo-ho-ha-da", "mohohada", "mo-ho-ha-da"], answer: "mo-ho-ha-da" },
  { hangul: "정확하다", options: ["jeong-hwak-ha-da", "jung-hwak-ha-da", "jeonghwakhada", "jeong-hwak-ha-da"], answer: "jeong-hwak-ha-da" },
  { hangul: "부정확하다", options: ["bu-jeong-hwak-ha-da", "bu-jung-hwak-ha-da", "bujeonghwakhada", "bu-jeong-hwak-ha-da"], answer: "bu-jeong-hwak-ha-da" },
  { hangul: "틀리다", options: ["teul-li-da", "teul-ri-da", "teullida", "teul-li-da"], answer: "teul-li-da" },
  { hangul: "맞다", options: ["mat-da", "maj-da", "matda", "mat-ta"], answer: "mat-da" },
  { hangul: "올바르다", options: ["ol-ba-reu-da", "ol-ba-ru-da", "olbareuda", "ol-ba-reu-da"], answer: "ol-ba-reu-da" },
  { hangul: "그릇되다", options: ["geu-reut-doe-da", "geu-rut-doe-da", "geureutdoeda", "geu-reut-doe-da"], answer: "geu-reut-doe-da" },
  { hangul: "당연하다", options: ["dang-yeon-ha-da", "dang-yon-ha-da", "dangyeonhada", "dang-yeon-ha-da"], answer: "dang-yeon-ha-da" },
  { hangul: "이상하다", options: ["i-sang-ha-da", "ee-sang-ha-da", "isanghada", "i-sang-ha-da"], answer: "i-sang-ha-da" },
  { hangul: "자연스럽다", options: ["ja-yeon-seu-reop-da", "ja-yon-seu-reop-da", "jayeonseureopda", "ja-yeon-seu-reop-da"], answer: "ja-yeon-seu-reop-da" },
  { hangul: "부자연스럽다", options: ["bu-ja-yeon-seu-reop-da", "bu-ja-yon-seu-reop-da", "bujayeonseureopda", "bu-ja-yeon-seu-reop-da"], answer: "bu-ja-yeon-seu-reop-da" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const allHangul = [...new Set(questions.map(q => q.hangul))];

// Romanisation (intonation) pour l’affichage du quiz traduction
const hangulToRoman = Object.fromEntries(questions.map((q) => [q.hangul, q.answer]));
const hangulToRomanTranslation = Object.fromEntries(translationBank.map((x) => [x.hangul, x.roman]).filter(([, r]) => r != null && r !== ""));
const translationToHangul = Object.fromEntries(translationBank.map((x) => [x.translation, x.hangul]));
const hangulToTranslation = Object.fromEntries(translationBank.map((x) => [x.hangul, x.translation]));
const phraseTranslationToHangul = Object.fromEntries(phraseBank.map((x) => [x.translation, x.hangul]));
const hangulToTranslationPhrase = Object.fromEntries(phraseBank.map((x) => [x.hangul, x.translation]));
const hangulToRomanPhrase = Object.fromEntries(phraseBank.map((x) => [x.hangul, x.roman]).filter(([, r]) => r != null && r !== ""));

const WORD_QUESTIONS_PER_LEVEL = 50;
const WORD_QUIZ_SIZE = 15;
const TOTAL_WORD_LEVELS = 50;
const WORD_LEVELS = Array.from({ length: TOTAL_WORD_LEVELS }, (_, i) => i + 1);

function getWordQuestionsForLevel(level) {
  const L = questions.length;
  return Array.from({ length: WORD_QUESTIONS_PER_LEVEL }, (_, i) => {
    const idx = ((level - 1) * WORD_QUESTIONS_PER_LEVEL + i) % L;
    return questions[idx];
  });
}

function getWordQuizForLevel(level) {
  const levelQuestions = getWordQuestionsForLevel(level);
  const picked = shuffle(levelQuestions).slice(0, Math.min(WORD_QUIZ_SIZE, levelQuestions.length));
  const levelHangul = [...new Set(levelQuestions.map((q) => q.hangul))];
  return picked.map((q) => {
    const isReverse = Math.random() > 0.5;
    if (isReverse) {
      const wrongHangul = shuffle(levelHangul.filter((h) => h !== q.hangul)).slice(0, 3);
      const options = shuffle([q.hangul, ...wrongHangul]);
      return {
        prompt: q.answer,
        options,
        answer: q.hangul,
        hangul: q.hangul,
        roman: q.answer,
        type: "roman-to-hangul",
      };
    }
    return {
      prompt: q.hangul,
      options: shuffle(q.options),
      answer: q.answer,
      hangul: q.hangul,
      roman: q.answer,
      type: "hangul-to-roman",
    };
  });
}

const PER_LEVEL_QUIZ_SIZE = 15;

function getTranslationQuizForLevel(level) {
  const levelQuestions = translationBank.filter((q) => q.level === level);
  const picked = shuffle(levelQuestions).slice(0, Math.min(PER_LEVEL_QUIZ_SIZE, levelQuestions.length));
  const allTranslations = [...new Set(translationBank.map((q) => q.translation))];
  return picked.map((q) => {
    const wrong = shuffle(allTranslations.filter((t) => t !== q.translation)).slice(0, 3);
    const options = shuffle([q.translation, ...wrong]);
    const isReverse = Math.random() > 0.5;
    if (isReverse) {
      const others = translationBank.filter((x) => x.hangul !== q.hangul);
      const wrongHangul = shuffle(others).slice(0, 3).map((x) => x.hangul);
      return {
        prompt: q.translation,
        options: shuffle([q.hangul, ...wrongHangul]),
        answer: q.hangul,
        hangul: q.hangul,
        translation: q.translation,
        roman: q.roman ?? hangulToRoman[q.hangul] ?? "",
        type: "translation-to-hangul",
      };
    }
    return {
      prompt: q.hangul,
      options,
      answer: q.translation,
      hangul: q.hangul,
      translation: q.translation,
      roman: q.roman ?? hangulToRoman[q.hangul] ?? "",
      type: "hangul-to-translation",
    };
  });
}

function getPhraseQuizForLevel(level) {
  const levelQuestions = phraseBank.filter((q) => q.level === level);
  const picked = shuffle(levelQuestions).slice(0, Math.min(PHRASE_QUIZ_SIZE, levelQuestions.length));
  const allTranslations = [...new Set(phraseBank.map((q) => q.translation))];
  return picked.map((q) => {
    const wrong = shuffle(allTranslations.filter((t) => t !== q.translation)).slice(0, 3);
    const options = shuffle([q.translation, ...wrong]);
    const isReverse = Math.random() > 0.5;
    if (isReverse) {
      const others = phraseBank.filter((x) => x.hangul !== q.hangul);
      const wrongHangul = shuffle(others).slice(0, 3).map((x) => x.hangul);
      return {
        prompt: q.translation,
        options: shuffle([q.hangul, ...wrongHangul]),
        answer: q.hangul,
        hangul: q.hangul,
        translation: q.translation,
        roman: q.roman ?? "",
        type: "translation-to-hangul",
      };
    }
    return {
      prompt: q.hangul,
      options,
      answer: q.translation,
      hangul: q.hangul,
      translation: q.translation,
      roman: q.roman ?? "",
      type: "hangul-to-translation",
    };
  });
}

export default function HangulQuiz() {
  const [view, setView] = useState("menu");
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);
  const [shake, setShake] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [wordLevel, setWordLevel] = useState(null);
  const [translationLevel, setTranslationLevel] = useState(null);
  const [translationQuiz, setTranslationQuiz] = useState([]);
  const [phraseLevel, setPhraseLevel] = useState(null);
  const [phraseQuiz, setPhraseQuiz] = useState([]);
  const [wordLevelScores, setWordLevelScores] = useState(getWordLevelScores);
  const [levelScores, setLevelScores] = useState(getLevelScores);
  const [phraseLevelScores, setPhraseLevelScores] = useState(getPhraseLevelScores);
  const [globalStats, setGlobalStats] = useState(getGlobalStats);

  const isWord = view === "word" || view === "word-done";
  const isTranslation = view === "translation" || view === "translation-done";
  const isPhrase = view === "phrase" || view === "phrase-done";
  const quizActive = isWord ? quiz : isTranslation ? translationQuiz : phraseQuiz;
  const q = quizActive[current];

  function handleSelect(opt) {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    const roman = q.roman !== undefined ? q.roman : "";
    const translation = q.translation !== undefined ? q.translation : "";
    setResults((r) => [
      ...r,
      {
        hangul: q.hangul,
        roman,
        translation,
        answer: q.answer,
        chosen: opt,
        correct,
        type: q.type,
      },
    ]);
  }

  function handleNext() {
    const totalCorrect = score + (selected === q?.answer ? 1 : 0);
    if (current + 1 >= quizActive.length) {
      setDone(true);
      if (isTranslation && translationLevel != null) {
        saveLevelScore(translationLevel, totalCorrect, quizActive.length);
        saveGlobalStats(totalCorrect, quizActive.length);
        setLevelScores(getLevelScores());
        setGlobalStats(getGlobalStats());
      }
      if (isPhrase && phraseLevel != null) {
        savePhraseLevelScore(phraseLevel, totalCorrect, quizActive.length);
        saveGlobalStats(totalCorrect, quizActive.length);
        setPhraseLevelScores(getPhraseLevelScores());
        setGlobalStats(getGlobalStats());
      }
      if (isWord && wordLevel != null) {
        saveWordLevelScore(wordLevel, totalCorrect, quizActive.length);
        saveGlobalStats(totalCorrect, quizActive.length);
        setWordLevelScores(getWordLevelScores());
        setGlobalStats(getGlobalStats());
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShake(false);
      setBounce(false);
    }
  }

  function handleRestartWord() {
    if (wordLevel != null) {
      setQuiz(getWordQuizForLevel(wordLevel));
    }
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("word");
  }

  function handleRestartTranslation() {
    if (translationLevel != null) {
      setTranslationQuiz(getTranslationQuizForLevel(translationLevel));
    }
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("translation");
  }

  function startWordLevel(level) {
    setWordLevel(level);
    setQuiz(getWordQuizForLevel(level));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("word");
  }

  function backToWordLevels() {
    setWordLevel(null);
    setView("word-levels");
    setWordLevelScores(getWordLevelScores());
  }

  function startTranslationLevel(level) {
    setTranslationLevel(level);
    setTranslationQuiz(getTranslationQuizForLevel(level));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("translation");
  }

  function backToTranslationLevels() {
    setTranslationLevel(null);
    setView("translation-levels");
    setLevelScores(getLevelScores());
  }

  function startPhraseLevel(level) {
    setPhraseLevel(level);
    setPhraseQuiz(getPhraseQuizForLevel(level));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("phrase");
  }

  function backToPhraseLevels() {
    setPhraseLevel(null);
    setView("phrase-levels");
    setPhraseLevelScores(getPhraseLevelScores());
  }

  function handleRestartPhrase() {
    if (phraseLevel != null) {
      setPhraseQuiz(getPhraseQuizForLevel(phraseLevel));
    }
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("phrase");
  }

  function finishTranslationAndSave() {
    if (translationLevel != null) {
      saveLevelScore(translationLevel, score, translationQuiz.length);
      saveGlobalStats(score, translationQuiz.length);
    }
    setLevelScores(getLevelScores());
    setGlobalStats(getGlobalStats());
    setView("translation-done");
  }

  const progress = quizActive.length ? (current / quizActive.length) * 100 : 0;

  const rootStyle = {
    minHeight: "100dvh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Serif KR', 'Noto Serif', Georgia, serif",
    padding: "16px",
    boxSizing: "border-box",
  };
  const headerStyle = { color: "#a78bfa", fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 16, textTransform: "uppercase", opacity: 0.8, textAlign: "center" };
  const menuGridStyle = { display: "flex", flexDirection: "column", gap: 12, maxWidth: 400, width: "100%" };
  const sectionBtnStyle = { padding: 20, borderRadius: 16, border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#e0d8ff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" };
  const sectionTitleStyle = { display: "block", fontSize: 17, fontWeight: 700, marginBottom: 4 };
  const sectionDescStyle = { display: "block", fontSize: 12, opacity: 0.7 };
  const levelGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 520, width: "100%" };
  const levelBtnStyle = { padding: "10px 6px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#e0d8ff", cursor: "pointer", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center" };

  const injectedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Rajdhani:wght@500;700&display=swap');
    * { box-sizing: border-box; }
    .root-wrap { width: 100%; max-width: 100%; overflow-x: hidden; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; backdrop-filter: blur(20px); padding: 48px 40px; max-width: 520px; width: 100%; }
    .hangul-char { font-size: 96px; color: #fff; text-align: center; line-height: 1; margin: 16px 0 40px; text-shadow: 0 0 60px rgba(160,120,255,0.7); transition: transform 0.3s; word-break: break-all; }
    .hangul-char.hangul-char-small { font-size: 42px; }
    .hangul-char.bounce { animation: bounceAnim 0.5s ease; }
    .hangul-char.shake { animation: shakeAnim 0.4s ease; }
    @keyframes bounceAnim { 0%,100%{transform:scale(1)} 40%{transform:scale(1.25)} 70%{transform:scale(0.95)} }
    @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 60%{transform:translateX(10px)} }
    .option-btn { width: 100%; padding: 14px 20px; margin: 8px 0; border-radius: 12px; border: 2px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.07); color: #e0d8ff; font-size: 20px; font-family: 'Rajdhani', sans-serif; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; text-align: center; min-height: 48px; }
    .option-btn:hover:not(:disabled) { background: rgba(160,120,255,0.25); border-color: rgba(160,120,255,0.6); transform: translateY(-2px); }
    .option-btn.correct { background: rgba(52,211,153,0.25); border-color: #34d399; color: #6ee7b7; }
    .option-btn.wrong { background: rgba(248,113,113,0.2); border-color: #f87171; color: #fca5a5; }
    .next-btn { width: 100%; margin-top: 8px; padding: 16px; border-radius: 14px; border: none; background: linear-gradient(135deg, #a78bfa, #7c3aed); color: white; font-size: 18px; font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(124,58,237,0.4); min-height: 48px; }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(124,58,237,0.6); }
    .progress-bar { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 99px; margin-bottom: 32px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #a78bfa, #34d399); border-radius: 99px; transition: width 0.5s ease; }
    .result-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 10px; margin: 4px 0; background: rgba(255,255,255,0.04); flex-wrap: wrap; gap: 4px; }
    .tag { font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; padding: 3px 10px; border-radius: 99px; letter-spacing: 1px; }
    .tag.ok { background: rgba(52,211,153,0.2); color: #34d399; }
    .tag.ko { background: rgba(248,113,113,0.2); color: #f87171; }
    .score-circle { width: 110px; height: 110px; border-radius: 50%; border: 4px solid #a78bfa; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 0 40px rgba(167,139,250,0.4); }
    .section-btn:hover { background: rgba(160,120,255,0.15); border-color: rgba(160,120,255,0.5); }
    .level-btn:hover { background: rgba(160,120,255,0.2); border-color: rgba(160,120,255,0.5); }
    .level-grid { display: grid; gap: 8px; max-width: 520px; width: 100%; grid-template-columns: repeat(5, 1fr); }
    .nav-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 520px; margin-bottom: 24px; padding: 14px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
    .nav-actions .next-btn { margin-top: 0; }
    .nav-actions .next-btn:last-child { margin-bottom: 0; }
    .prompt-translation { background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.3); border-radius: 16px; padding: 20px 24px; margin: 16px 0 24px; text-align: center; font-size: 22px; font-family: 'Noto Serif', Georgia, serif; color: #e0d8ff; line-height: 1.4; }
    .result-row-translation { flex-direction: column; align-items: stretch; gap: 6px; }
    .result-row-translation .result-hangul-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .result-row-translation .result-translation-line { color: rgba(255,255,255,0.75); font-size: 14px; padding-left: 0; }
    .result-row-translation .result-answer-line { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
    @media (max-width: 768px) {
      .card { padding: 28px 20px; border-radius: 20px; }
      .hangul-char { font-size: 64px; margin: 12px 0 28px; }
      .hangul-char.hangul-char-small { font-size: 32px; }
      .prompt-translation { font-size: 18px; padding: 16px 20px; margin: 12px 0 20px; }
      .option-btn { padding: 14px 16px; font-size: 17px; min-height: 52px; }
      .next-btn { padding: 14px; font-size: 16px; min-height: 52px; }
      .progress-bar { margin-bottom: 24px; }
      .score-circle { width: 90px; height: 90px; border-width: 3px; margin-bottom: 16px; }
      .level-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .result-row { padding: 8px 10px; font-size: 14px; }
    }
    @media (max-width: 480px) {
      .nav-actions { padding: 12px 14px; gap: 8px; margin-bottom: 20px; border-radius: 14px; }
      .card { padding: 20px 16px; border-radius: 16px; }
      .hangul-char { font-size: 48px; margin: 8px 0 20px; }
      .hangul-char.hangul-char-small { font-size: 26px; }
      .prompt-translation { font-size: 16px; padding: 14px 16px; margin: 10px 0 16px; }
      .option-btn { padding: 12px 14px; font-size: 15px; min-height: 48px; margin: 6px 0; }
      .next-btn { padding: 12px; font-size: 15px; min-height: 48px; }
      .score-circle { width: 80px; height: 80px; font-size: 28px; margin-bottom: 12px; }
      .level-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .result-row { flex-direction: column; align-items: flex-start; font-size: 13px; }
      .quiz-header span { font-size: 11px; }
      .quiz-header .next-btn { padding: 6px 12px; font-size: 14px; }
    }
    .course-section { margin-bottom: 28px; }
    .course-section-title { color: #a78bfa; font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; opacity: 0.95; }
    .course-subtitle { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 12px; }
    .letter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 8px; }
    .letter-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px; text-align: center; }
    .letter-card .letter-char { font-size: 28px; color: #fff; margin-bottom: 4px; }
    .letter-card .letter-roman { font-family: 'Rajdhani', sans-serif; font-size: 12px; color: rgba(255,255,255,0.7); }
    .letter-card .letter-name { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 2px; }
    .tip-item { background: rgba(255,255,255,0.04); border-left: 3px solid #a78bfa; padding: 10px 14px; margin-bottom: 8px; border-radius: 0 8px 8px 0; color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.5; }
    .syllable-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; margin-bottom: 6px; background: rgba(255,255,255,0.04); border-radius: 10px; flex-wrap: wrap; }
    .syllable-row .syllable-pattern { font-family: 'Rajdhani', sans-serif; font-weight: 700; color: #a78bfa; min-width: 90px; }
    .syllable-row .syllable-example { font-size: 22px; color: #fff; min-width: 36px; text-align: center; }
    .syllable-row .syllable-roman { color: rgba(255,255,255,0.7); font-size: 14px; }
    .syllable-row .syllable-note { color: rgba(255,255,255,0.5); font-size: 13px; margin-left: auto; }
    .particle-row { padding: 10px 14px; margin-bottom: 8px; background: rgba(255,255,255,0.04); border-radius: 10px; border-left: 3px solid rgba(167,139,250,0.5); }
    .particle-row .particle-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; color: #a78bfa; margin-bottom: 4px; }
    .particle-row .particle-usage { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
    .particle-row .particle-ex { font-size: 14px; color: rgba(255,255,255,0.85); }
    @media (max-width: 480px) {
      .letter-grid { grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); gap: 6px; }
      .letter-card { padding: 8px; }
      .letter-card .letter-char { font-size: 22px; }
      .letter-card .letter-roman { font-size: 11px; }
      .tip-item { font-size: 13px; padding: 8px 12px; }
      .syllable-row { padding: 8px 12px; gap: 8px; font-size: 13px; }
      .syllable-row .syllable-pattern { min-width: 70px; font-size: 12px; }
      .syllable-row .syllable-example { font-size: 18px; }
      .particle-row { padding: 8px 12px; font-size: 13px; }
    }
  `;

  if (view === "menu") {
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "flex-end", padding: "12px 16px", paddingTop: "max(12px, env(safe-area-inset-top))" }}>
          <button
            className="next-btn"
            onClick={() => setView("course")}
            style={{ width: "auto", padding: "8px 16px", marginBottom: 0, fontSize: 14 }}
          >
            Cours
          </button>
        </div>
        <div style={{ paddingTop: 52 }}>
          <div style={headerStyle}>✦ Quiz Hangul ✦</div>
          <div style={menuGridStyle}>
            <button className="section-btn" onClick={() => setView("word-levels")} style={sectionBtnStyle}>
              <span style={sectionTitleStyle}>Guess the word</span>
              <span style={sectionDescStyle}>Lecture · Hangul ↔ romanisation · des mots en korean</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("translation-levels")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Guess the translation</span>
              <span style={sectionDescStyle}>Traduction · des mots en français</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("phrase-levels")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Guess the phrase</span>
              <span style={sectionDescStyle}>Phrases · coréen ↔ français · 50 niveaux</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("word-order-info")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Ordre des mots</span>
              <span style={sectionDescStyle}>Remettre la phrase coréenne dans le bon ordre</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("politeness-info")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Niveaux de politesse</span>
              <span style={sectionDescStyle}>Choisir le bon registre (반말, -요, formel…)</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("particles-info")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Particules & grammaire</span>
              <span style={sectionDescStyle}>Trouver la bonne particule (은/는, 이/가, 을/를…)</span>
            </button>
            <button
              className="section-btn"
              onClick={() => setView("dictation-info")}
              style={sectionBtnStyle}
            >
              <span style={sectionTitleStyle}>Dictée → Hangul</span>
              <span style={sectionDescStyle}>À partir du français · écrire la bonne phrase en Hangul</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "word-order-info") {
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Quiz · Ordre des mots</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <p>
            Ce mode proposera des phrases en français et plusieurs versions en coréen avec des ordres de mots différents.
            Le but sera de choisir la phrase coréenne avec l&apos;ordre correct (Sujet · Compléments · Verbe).
          </p>
        </div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (view === "politeness-info") {
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Quiz · Niveaux de politesse</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <p>
            Ce mode proposera un contexte (ami, professeur, personne plus âgée…) et plusieurs versions d&apos;une même phrase
            en coréen. Il faudra choisir le niveau de politesse / registre approprié (반말, forme -요, formel, etc.).
          </p>
        </div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (view === "particles-info") {
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Quiz · Particules & grammaire</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <p>
            Ce mode se concentrera sur les particules coréennes (은/는, 이/가, 을/를, 에, 에서, 와/과, etc.). Les phrases auront un
            trou à remplir, et il faudra choisir la particule correcte en fonction du rôle du mot.
          </p>
        </div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (view === "dictation-info") {
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Quiz · Dictée vers Hangul</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <p>
            Ce mode partira d&apos;une phrase ou d&apos;un mot en français. Le but sera de retrouver la bonne écriture en Hangul
            parmi plusieurs propositions (comme une dictée à choix multiples).
          </p>
        </div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour au menu
          </button>
        </div>
      </div>
    );
  }

  if (view === "course") {
    return (
      <div className="root-wrap" style={{ ...rootStyle, justifyContent: "flex-start", paddingTop: 20, paddingBottom: 32 }}>
        <style>{injectedStyles}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 520, marginBottom: 16 }}>
          <button className="next-btn" onClick={() => setView("menu")} style={{ width: "auto", padding: "8px 16px", marginBottom: 0 }}>
            ← Retour
          </button>
          <div style={{ ...headerStyle, marginBottom: 0 }}>Cours</div>
          <div style={{ width: 80 }} />
        </div>
        <div style={{ maxWidth: 520, width: "100%", overflowY: "auto", flex: 1 }}>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="course-section">
              <div className="course-section-title">Lettres du Hangul</div>
              <div className="course-subtitle">Consonnes (자음) — lecture et nom</div>
              <div className="letter-grid">
                {COURSE_CONSONANTS.map((c, i) => (
                  <div key={i} className="letter-card">
                    <div className="letter-char">{c.char}</div>
                    <div className="letter-roman">{c.roman}</div>
                    {c.name && <div className="letter-name">{c.name}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="course-section">
              <div className="course-subtitle">Voyelles (모음) — lecture</div>
              <div className="letter-grid">
                {COURSE_VOWELS.map((v, i) => (
                  <div key={i} className="letter-card">
                    <div className="letter-char">{v.char}</div>
                    <div className="letter-roman">{v.roman}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="course-section">
              <div className="course-section-title">Structure des syllabes</div>
              <div className="course-subtitle">Formes de base (C = consonne, V = voyelle)</div>
              {COURSE_SYLLABLE_STRUCTURE.map((s, i) => (
                <div key={i} className="syllable-row">
                  <span className="syllable-pattern">{s.pattern}</span>
                  <span className="syllable-example">{s.example}</span>
                  <span className="syllable-roman">{s.roman}</span>
                  <span className="syllable-note">{s.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="course-section">
              <div className="course-section-title">Conseils pour mieux lire</div>
              {COURSE_READING_TIPS.map((tip, i) => (
                <div key={i} className="tip-item">{tip}</div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="course-section">
              <div className="course-section-title">Conseils pour la traduction</div>
              {COURSE_TRANSLATION_TIPS.map((tip, i) => (
                <div key={i} className="tip-item">{tip}</div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="course-section">
              <div className="course-section-title">Particules courantes</div>
              <div className="course-subtitle">Rôle et exemples</div>
              {COURSE_PARTICLES.map((p, i) => (
                <div key={i} className="particle-row">
                  <div className="particle-name">{p.particle}</div>
                  <div className="particle-usage">{p.usage}</div>
                  <div className="particle-ex">{p.ex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "word-levels") {
    const scores = getWordLevelScores();
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Guess the word · Choisir un niveau</div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour
          </button>
        </div>
        <div className="level-grid" style={levelGridStyle}>
          {WORD_LEVELS.map((level) => {
            const s = scores[level];
            const total = s?.totalQuestions ?? 0;
            return (
              <button
                key={level}
                className="level-btn"
                onClick={() => startWordLevel(level)}
                style={levelBtnStyle}
              >
                <span>Niveau {level}</span>
                {total > 0 && (
                  <span style={{ fontSize: 11, opacity: 0.8 }}>Dernier: {s?.last ?? "-"}/{s?.lastTotal ?? WORD_QUIZ_SIZE}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "translation-levels") {
    const scores = getLevelScores();
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Guess the translation · Choisir un niveau</div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour
          </button>
          <button className="next-btn" onClick={() => setView("all-results")}>
            Voir tous les résultats & global
          </button>
        </div>
        <div className="level-grid" style={levelGridStyle}>
          {LEVELS.map((level) => {
            const s = scores[level];
            const last = s?.last ?? "-";
            const total = s?.totalQuestions ?? 0;
            return (
              <button
                key={level}
                className="level-btn"
                onClick={() => startTranslationLevel(level)}
                style={levelBtnStyle}
              >
                <span>Niveau {level}</span>
                {total > 0 && (
                  <span style={{ fontSize: 11, opacity: 0.8 }}>Dernier: {s?.last}/{s?.lastTotal ?? PER_LEVEL_QUIZ_SIZE}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "phrase-levels") {
    const scores = getPhraseLevelScores();
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Guess the phrase · Choisir un niveau</div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Retour
          </button>
          <button className="next-btn" onClick={() => setView("all-results-phrase")}>
            Voir tous les résultats & global
          </button>
        </div>
        <div className="level-grid" style={levelGridStyle}>
          {PHRASE_LEVELS.map((level) => {
            const s = scores[level];
            const total = s?.totalQuestions ?? 0;
            return (
              <button
                key={level}
                className="level-btn"
                onClick={() => startPhraseLevel(level)}
                style={levelBtnStyle}
              >
                <span>Niveau {level}</span>
                {total > 0 && (
                  <span style={{ fontSize: 11, opacity: 0.8 }}>Dernier: {s?.last ?? "-"}/{s?.lastTotal ?? PHRASE_QUIZ_SIZE}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "all-results-phrase") {
    const scores = getPhraseLevelScores();
    const g = getGlobalStats();
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Résultats phrase · par niveau & global</div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Menu
          </button>
          <button className="next-btn" onClick={() => setView("phrase-levels")}>
            ← Retour aux niveaux phrase
          </button>
        </div>
        <div className="card" style={{ marginBottom: 16, padding: 20 }}>
          <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 8 }}>Global</div>
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            Total: {g.totalCorrect ?? 0} / {g.totalQuestions ?? 0}
            {g.totalQuestions ? ` (${Math.round(((g.totalCorrect ?? 0) / g.totalQuestions) * 100)}%)` : ""}
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: "auto", width: "100%", maxWidth: 520 }}>
          {PHRASE_LEVELS.map((level) => {
            const s = scores[level];
            if (!s || s.totalQuestions === 0) return null;
            return (
              <div key={level} className="result-row" style={{ marginBottom: 4 }}>
                <span>Niveau {level}</span>
                <span>Meilleur: {s.best} · Dernier: {s.last}/{s.lastTotal ?? "-"} · Total: {s.totalCorrect}/{s.totalQuestions}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "all-results") {
    const scores = getLevelScores();
    const g = getGlobalStats();
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Résultats traduction · par niveau & global</div>
        <div className="nav-actions">
          <button className="next-btn" onClick={() => setView("menu")}>
            ← Menu
          </button>
        </div>
        <div className="card" style={{ marginBottom: 16, padding: 20 }}>
          <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 8 }}>Global</div>
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            Total: {g.totalCorrect ?? 0} / {g.totalQuestions ?? 0}
            {g.totalQuestions ? ` (${Math.round(((g.totalCorrect ?? 0) / g.totalQuestions) * 100)}%)` : ""}
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: "auto", width: "100%", maxWidth: 520 }}>
          {LEVELS.map((level) => {
            const s = scores[level];
            if (!s || s.totalQuestions === 0) return null;
            return (
              <div key={level} className="result-row" style={{ marginBottom: 4 }}>
                <span>Niveau {level}</span>
                <span>Meilleur: {s.best} · Dernier: {s.last}/{s.lastTotal ?? "-"} · Total: {s.totalCorrect}/{s.totalQuestions}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "translation-done") {
    const s = getLevelScores()[translationLevel] || {};
    const lastScore = s.last ?? 0;
    const lastTotal = s.lastTotal ?? translationQuiz.length;
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Résultat · Niveau {translationLevel}</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="score-circle">
            <div style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>{lastScore}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>/ {lastTotal}</div>
          </div>
          <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            {lastScore === lastTotal ? "Parfait ! 🎉" : lastScore >= lastTotal * 0.7 ? "Très bien ! 👏" : "Continue ! 💪"}
          </div>
          <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.6)" }}>
            Meilleur score ce niveau: {s.best ?? lastScore}
          </div>
          <div className="nav-actions" style={{ marginBottom: 0 }}>
            <button className="next-btn" onClick={backToTranslationLevels}>
              ← Retour aux niveaux
            </button>
            <button className="next-btn" onClick={() => setView("all-results")}>
              Voir tous les résultats & global
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "phrase-done") {
    const s = getPhraseLevelScores()[phraseLevel] || {};
    const lastScore = s.last ?? 0;
    const lastTotal = s.lastTotal ?? phraseQuiz.length;
    return (
      <div className="root-wrap" style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Résultat · Phrase · Niveau {phraseLevel}</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="score-circle">
            <div style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>{lastScore}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>/ {lastTotal}</div>
          </div>
          <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            {lastScore === lastTotal ? "Parfait ! 🎉" : lastScore >= lastTotal * 0.7 ? "Très bien ! 👏" : "Continue ! 💪"}
          </div>
          <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.6)" }}>
            Meilleur score ce niveau: {s.best ?? lastScore}
          </div>
          <div className="nav-actions" style={{ marginBottom: 0 }}>
            <button className="next-btn" onClick={backToPhraseLevels}>
              ← Retour aux niveaux
            </button>
            <button className="next-btn" onClick={() => setView("all-results-phrase")}>
              Voir tous les résultats & global
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionSubtitle = isTranslation || isPhrase
    ? (q?.type === "translation-to-hangul" ? "Quel est le hangul ?" : "Quelle est la traduction ?")
    : (q?.type === "roman-to-hangul" ? "Quel est le hangul ?" : "Quelle est la lecture ?");
  const promptFontSize = (isTranslation || isPhrase) && q?.type === "translation-to-hangul" ? 42 : q?.type === "roman-to-hangul" ? 42 : 96;
  const promptFontFamily = ((isTranslation || isPhrase) && q?.type === "translation-to-hangul") || q?.type === "roman-to-hangul" ? "'Rajdhani', sans-serif" : undefined;

  return (
    <div className="root-wrap" style={rootStyle}>
      <style>{injectedStyles}</style>

      <div className="quiz-header" style={{ ...headerStyle, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
        <button
          className="next-btn"
          onClick={() => isWord ? backToWordLevels() : isTranslation ? backToTranslationLevels() : backToPhraseLevels()}
          style={{ width: "auto", padding: "8px 16px", marginBottom: 0 }}
        >
          ← Retour
        </button>
        <span>✦ {isWord ? `Guess the word · Niveau ${wordLevel}` : isTranslation ? `Traduction · Niveau ${translationLevel}` : `Phrase · Niveau ${phraseLevel}`} ✦</span>
      </div>

      <div className="card">
        {!done ? (
          <>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: 14, letterSpacing: 2 }}>
                {current + 1} / {quizActive.length}
              </span>
              <span style={{ color: "#a78bfa", fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
                Score: {score}
              </span>
            </div>

            {(isTranslation || isPhrase) && q?.type === "translation-to-hangul" ? (
              <div className={`prompt-translation${bounce ? " bounce" : ""}${shake ? " shake" : ""}`}>
                {q.prompt}
              </div>
            ) : (
              <div
                className={`hangul-char${promptFontSize === 42 ? " hangul-char-small" : ""}${bounce ? " bounce" : ""}${shake ? " shake" : ""}`}
                style={{
                  fontFamily: promptFontFamily,
                  letterSpacing: promptFontFamily ? 2 : undefined,
                }}
              >
                {(isTranslation || isPhrase) && q?.type === "hangul-to-translation" && q.roman
                  ? `${q.prompt} (${q.roman})`
                  : q.prompt}
              </div>
            )}

            <div style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, letterSpacing: 3, marginBottom: 24, textTransform: "uppercase" }}>
              {questionSubtitle}
            </div>

            <div key={current}>
              {q.options.map(opt => {
                let cls = "option-btn";
                if (selected !== null) {
                  if (opt === q.answer) cls += " correct";
                  else if (opt === selected && selected !== q.answer) cls += " wrong";
                }
                const showReveal = selected !== null;
                const showTranslation = (isTranslation || isPhrase) && showReveal;
                const optHangul = showTranslation && q?.type === "hangul-to-translation" ? (isPhrase ? phraseTranslationToHangul[opt] : translationToHangul[opt]) : showTranslation && q?.type === "translation-to-hangul" ? opt : null;
                const optRoman = optHangul && (isPhrase ? (hangulToRomanPhrase[optHangul] ?? "") : (hangulToRomanTranslation[optHangul] ?? hangulToRoman[optHangul] ?? ""));
                const optTranslation = showTranslation && (q?.type === "hangul-to-translation" ? opt : (isPhrase ? (hangulToTranslationPhrase[optHangul] ?? "") : (hangulToTranslation[optHangul] ?? "")));
                const hangulLine = showTranslation && optHangul ? (q?.type === "hangul-to-translation" ? optHangul : null) : null;
                const wordLecture = showReveal && isWord ? (q?.type === "roman-to-hangul" ? (hangulToRoman[opt] ?? "") : opt) : null;
                return (
                  <button key={opt} className={cls} onClick={() => handleSelect(opt)} disabled={selected !== null}>
                    <span style={{ display: "block" }}>{opt}</span>
                    {showReveal && (
                      <span style={{ display: "block", fontSize: "0.8em", opacity: 0.9, marginTop: 6, textAlign: "left" }}>
                        {hangulLine != null && <span style={{ display: "block", marginBottom: 2, fontSize: "1.05em" }}>{hangulLine}</span>}
                        {(optRoman || wordLecture) && (
                          <span style={{ display: "block", color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>Lecture : {(optRoman || wordLecture)}</span>
                        )}
                        {optTranslation && optTranslation !== "" && (
                          <span style={{ display: "block", color: "rgba(255,255,255,0.75)" }}>Traduction : {optTranslation}{optRoman ? ` (${optRoman})` : ""}</span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <button className="next-btn" onClick={handleNext}>
                {current + 1 >= quizActive.length ? "Voir les résultats →" : "Suivant →"}
              </button>
            )}
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div className="score-circle">
                <div style={{ color: "#fff", fontSize: 36, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{score}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2 }}>/ {quizActive.length}</div>
              </div>
              <div style={{ color: "#a78bfa", fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
                {score === quizActive.length ? "Parfait ! 완벽해요 🎉" : score >= quizActive.length * 0.7 ? "Très bien ! 잘했어요 👏" : "Continue ! 화이팅 💪"}
              </div>
            </div>

            <div style={{ maxHeight: 280, overflowY: "auto", paddingRight: 4, marginBottom: 20 }}>
              {results.map((r, i) => {
                const isTranslationResult = r.translation !== undefined && r.translation !== "";
                if (isTranslationResult) {
                  return (
                    <div key={i} className="result-row result-row-translation">
                      <div className="result-hangul-line">
                        <span style={{ fontSize: 24, marginRight: 12, minWidth: 40, textAlign: "center" }}>{r.hangul}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: 14 }}>{r.roman}</span>
                      </div>
                      <div className="result-translation-line">
                        Traduction : <strong>{r.translation}</strong>{r.roman ? ` (${r.roman})` : ""}
                      </div>
                      <div className="result-answer-line">
                        <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Rajdhani',sans-serif", fontSize: 14 }}>
                          {r.correct ? r.answer : <><span style={{ color: "#f87171", textDecoration: "line-through" }}>{r.chosen}</span> → <span style={{ color: "#34d399" }}>{r.answer}</span></>}
                        </span>
                        <span className={`tag ${r.correct ? "ok" : "ko"}`}>{r.correct ? "✓ OK" : "✗ NON"}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} className="result-row">
                    <span style={{ fontSize: 24, marginRight: 12, minWidth: 40, textAlign: "center" }}>{r.hangul}</span>
                    <span style={{ marginRight: 8, color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: 14 }}>{r.roman}</span>
                    <span style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontFamily: "'Rajdhani',sans-serif", fontSize: 15 }}>
                      {r.correct ? r.answer : <><span style={{ color: "#f87171", textDecoration: "line-through" }}>{r.chosen}</span> → <span style={{ color: "#34d399" }}>{r.answer}</span></>}
                    </span>
                    <span className={`tag ${r.correct ? "ok" : "ko"}`}>{r.correct ? "✓ OK" : "✗ NON"}</span>
                  </div>
                );
              })}
            </div>

            <div className="nav-actions" style={{ marginBottom: 0, marginTop: 8 }}>
              {isWord ? (
                <>
                  <button className="next-btn" onClick={handleRestartWord}>
                    🔄 Recommencer (même niveau)
                  </button>
                  {wordLevel != null && (
                    <button className="next-btn" onClick={backToWordLevels}>
                      ← Retour aux niveaux
                    </button>
                  )}
                </>
              ) : isTranslation ? (
                <>
                  <button className="next-btn" onClick={handleRestartTranslation}>
                    🔄 Recommencer (même niveau)
                  </button>
                  <button className="next-btn" onClick={backToTranslationLevels}>
                    ← Retour aux niveaux
                  </button>
                </>
              ) : (
                <>
                  <button className="next-btn" onClick={handleRestartPhrase}>
                    🔄 Recommencer (même niveau)
                  </button>
                  <button className="next-btn" onClick={backToPhraseLevels}>
                    ← Retour aux niveaux
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
