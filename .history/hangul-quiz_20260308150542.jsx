import { useState, useEffect } from "react";
import { translationBank, LEVELS, QUESTIONS_PER_LEVEL } from "./hangul-translation-data.js";

const STORAGE_LEVELS = "hangul-quiz-level-scores";
const STORAGE_WORD_LEVELS = "hangul-quiz-word-level-scores";
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

function saveGlobalStats(correct, total) {
  const g = getGlobalStats();
  const next = {
    totalCorrect: (g.totalCorrect || 0) + correct,
    totalQuestions: (g.totalQuestions || 0) + total,
  };
  localStorage.setItem(STORAGE_GLOBAL, JSON.stringify(next));
}

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
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const allHangul = [...new Set(questions.map(q => q.hangul))];

// Romanisation (intonation) pour l’affichage du quiz traduction
const hangulToRoman = Object.fromEntries(questions.map((q) => [q.hangul, q.answer]));
const translationToHangul = Object.fromEntries(translationBank.map((x) => [x.translation, x.hangul]));

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
        roman: hangulToRoman[q.hangul] ?? "",
        type: "translation-to-hangul",
      };
    }
    return {
      prompt: q.hangul,
      options,
      answer: q.translation,
      hangul: q.hangul,
      translation: q.translation,
      roman: hangulToRoman[q.hangul] ?? "",
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
  const [wordLevelScores, setWordLevelScores] = useState(getWordLevelScores);
  const [levelScores, setLevelScores] = useState(getLevelScores);
  const [globalStats, setGlobalStats] = useState(getGlobalStats);

  const isWord = view === "word" || view === "word-done";
  const isTranslation = view === "translation" || view === "translation-done";
  const quizActive = isWord ? quiz : translationQuiz;
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
        setView("translation-done");
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
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Serif KR', 'Noto Serif', Georgia, serif",
    padding: "20px",
  };
  const headerStyle = { color: "#a78bfa", fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 4, marginBottom: 20, textTransform: "uppercase", opacity: 0.8 };
  const menuGridStyle = { display: "flex", flexDirection: "column", gap: 16, maxWidth: 400, width: "100%" };
  const sectionBtnStyle = { padding: 24, borderRadius: 20, border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#e0d8ff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" };
  const sectionTitleStyle = { display: "block", fontSize: 18, fontWeight: 700, marginBottom: 6 };
  const sectionDescStyle = { display: "block", fontSize: 13, opacity: 0.7 };
  const levelGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 520, width: "100%" };
  const levelBtnStyle = { padding: "12px 8px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#e0d8ff", cursor: "pointer", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center" };

  const injectedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Rajdhani:wght@500;700&display=swap');
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; backdrop-filter: blur(20px); padding: 48px 40px; max-width: 520px; width: 100%; }
    .hangul-char { font-size: 96px; color: #fff; text-align: center; line-height: 1; margin: 16px 0 40px; text-shadow: 0 0 60px rgba(160,120,255,0.7); transition: transform 0.3s; }
    .hangul-char.bounce { animation: bounceAnim 0.5s ease; }
    .hangul-char.shake { animation: shakeAnim 0.4s ease; }
    @keyframes bounceAnim { 0%,100%{transform:scale(1)} 40%{transform:scale(1.25)} 70%{transform:scale(0.95)} }
    @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 60%{transform:translateX(10px)} }
    .option-btn { width: 100%; padding: 14px 20px; margin: 8px 0; border-radius: 12px; border: 2px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.07); color: #e0d8ff; font-size: 20px; font-family: 'Rajdhani', sans-serif; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; text-align: center; }
    .option-btn:hover:not(:disabled) { background: rgba(160,120,255,0.25); border-color: rgba(160,120,255,0.6); transform: translateY(-2px); }
    .option-btn.correct { background: rgba(52,211,153,0.25); border-color: #34d399; color: #6ee7b7; }
    .option-btn.wrong { background: rgba(248,113,113,0.2); border-color: #f87171; color: #fca5a5; }
    .next-btn { width: 100%; margin-top: 8px; padding: 16px; border-radius: 14px; border: none; background: linear-gradient(135deg, #a78bfa, #7c3aed); color: white; font-size: 18px; font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(124,58,237,0.4); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(124,58,237,0.6); }
    .progress-bar { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 99px; margin-bottom: 32px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #a78bfa, #34d399); border-radius: 99px; transition: width 0.5s ease; }
    .result-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 10px; margin: 4px 0; background: rgba(255,255,255,0.04); }
    .tag { font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; padding: 3px 10px; border-radius: 99px; letter-spacing: 1px; }
    .tag.ok { background: rgba(52,211,153,0.2); color: #34d399; }
    .tag.ko { background: rgba(248,113,113,0.2); color: #f87171; }
    .score-circle { width: 110px; height: 110px; border-radius: 50%; border: 4px solid #a78bfa; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 0 40px rgba(167,139,250,0.4); }
    .section-btn:hover { background: rgba(160,120,255,0.15); border-color: rgba(160,120,255,0.5); }
    .level-btn:hover { background: rgba(160,120,255,0.2); border-color: rgba(160,120,255,0.5); }
  `;

  if (view === "menu") {
    return (
      <div style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>✦ Quiz Hangul ✦</div>
        <div style={menuGridStyle}>
          <button className="section-btn" onClick={() => setView("word-levels")} style={sectionBtnStyle}>
            <span style={sectionTitleStyle}>Guess the word</span>
            <span style={sectionDescStyle}>Lecture · Hangul ↔ romanisation · 50 questions par niveau, 15 par partie</span>
          </button>
          <button
            className="section-btn"
            onClick={() => setView("translation-levels")}
            style={sectionBtnStyle}
          >
            <span style={sectionTitleStyle}>Guess the translation</span>
            <span style={sectionDescStyle}>Traduction · 1000 questions par niveau</span>
          </button>
        </div>
      </div>
    );
  }

  if (view === "word-levels") {
    const scores = getWordLevelScores();
    return (
      <div style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Guess the word · Choisir un niveau</div>
        <button className="next-btn" onClick={() => setView("menu")} style={{ marginBottom: 16 }}>
          ← Retour
        </button>
        <div style={levelGridStyle}>
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
      <div style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Guess the translation · Choisir un niveau</div>
        <button className="next-btn" onClick={() => setView("menu")} style={{ marginBottom: 16 }}>
          ← Retour
        </button>
        <button className="next-btn" onClick={() => setView("all-results")} style={{ marginBottom: 24 }}>
          Voir tous les résultats & global
        </button>
        <div style={levelGridStyle}>
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

  if (view === "all-results") {
    const scores = getLevelScores();
    const g = getGlobalStats();
    return (
      <div style={rootStyle}>
        <style>{injectedStyles}</style>
        <div style={headerStyle}>Résultats par niveau & global</div>
        <button className="next-btn" onClick={() => setView("menu")} style={{ marginBottom: 16 }}>
          ← Menu
        </button>
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
      <div style={rootStyle}>
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
          <button className="next-btn" onClick={backToTranslationLevels} style={{ marginBottom: 8 }}>
            ← Retour aux niveaux
          </button>
          <button className="next-btn" onClick={() => setView("all-results")}>
            Voir tous les résultats & global
          </button>
        </div>
      </div>
    );
  }

  const questionSubtitle = isTranslation
    ? (q?.type === "translation-to-hangul" ? "Quel est le hangul ?" : "Quelle est la traduction ?")
    : (q?.type === "roman-to-hangul" ? "Quel est le hangul ?" : "Quelle est la lecture ?");
  const promptFontSize = (isTranslation && q?.type === "translation-to-hangul") || q?.type === "roman-to-hangul" ? 42 : 96;
  const promptFontFamily = (isTranslation && q?.type === "translation-to-hangul") || q?.type === "roman-to-hangul" ? "'Rajdhani', sans-serif" : undefined;

  return (
    <div style={rootStyle}>
      <style>{injectedStyles}</style>

      <div style={{ ...headerStyle, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="next-btn"
          onClick={() => isWord ? backToWordLevels() : backToTranslationLevels()}
          style={{ width: "auto", padding: "8px 16px", marginBottom: 0 }}
        >
          ← Retour
        </button>
        <span>✦ {isWord ? `Guess the word · Niveau ${wordLevel}` : `Traduction · Niveau ${translationLevel}`} ✦</span>
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

            <div
              className={`hangul-char${bounce ? " bounce" : ""}${shake ? " shake" : ""}`}
              style={{
                fontSize: promptFontSize,
                fontFamily: promptFontFamily,
                letterSpacing: promptFontFamily ? 2 : undefined,
              }}
            >
              {isTranslation && q?.type === "hangul-to-translation" && q.roman
                ? `${q.prompt} (${q.roman})`
                : q.prompt}
            </div>

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
                const showTranslation = isTranslation && selected !== null;
                const optHangul = showTranslation && q?.type === "hangul-to-translation" ? translationToHangul[opt] : showTranslation && q?.type === "translation-to-hangul" ? opt : null;
                const optRoman = optHangul ? (hangulToRoman[optHangul] ?? "") : "";
                const translationLine = showTranslation && optHangul
                  ? (q?.type === "hangul-to-translation" ? `${optHangul}${optRoman ? ` (${optRoman})` : ""}` : optRoman ? `(${optRoman})` : "")
                  : null;
                return (
                  <button key={opt} className={cls} onClick={() => handleSelect(opt)} disabled={selected !== null}>
                    <span style={{ display: "block" }}>{opt}</span>
                    {translationLine != null && translationLine !== "" && (
                      <span style={{ display: "block", fontSize: "0.75em", opacity: 0.85, marginTop: 4 }}>
                        {translationLine}
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
              {results.map((r, i) => (
                <div key={i} className="result-row">
                  <span style={{ fontSize: 24, marginRight: 12, minWidth: 40, textAlign: "center" }}>{r.hangul}</span>
                  <span style={{ marginRight: 8, color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: 14 }}>{r.roman}</span>
                  <span style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontFamily: "'Rajdhani',sans-serif", fontSize: 15 }}>
                    {r.correct ? r.answer : <><span style={{ color: "#f87171", textDecoration: "line-through" }}>{r.chosen}</span> → <span style={{ color: "#34d399" }}>{r.answer}</span></>}
                  </span>
                  <span className={`tag ${r.correct ? "ok" : "ko"}`}>{r.correct ? "✓ OK" : "✗ NON"}</span>
                </div>
              ))}
            </div>

            <button className="next-btn" onClick={handleRestartWord} style={{ marginBottom: 8 }}>
              🔄 Recommencer (même niveau)
            </button>
            {wordLevel != null && (
              <button className="next-btn" onClick={backToWordLevels}>
                ← Retour aux niveaux
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
