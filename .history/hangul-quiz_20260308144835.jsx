import { useState, useEffect } from "react";
import { translationBank, LEVELS, QUESTIONS_PER_LEVEL } from "./hangul-translation-data.js";

const STORAGE_LEVELS = "hangul-quiz-level-scores";
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
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const allHangul = [...new Set(questions.map(q => q.hangul))];

function getRandomQuestions(n = 10) {
  const picked = shuffle(questions).slice(0, n);
  return picked.map(q => {
    const isReverse = Math.random() > 0.5;
    if (isReverse) {
      const wrongHangul = shuffle(allHangul.filter(h => h !== q.hangul)).slice(0, 3);
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
        type: "translation-to-hangul",
      };
    }
    return {
      prompt: q.hangul,
      options,
      answer: q.translation,
      hangul: q.hangul,
      translation: q.translation,
      type: "hangul-to-translation",
    };
  });
}

export default function HangulQuiz() {
  const [view, setView] = useState("menu");
  const [quiz, setQuiz] = useState(() => getRandomQuestions(10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);
  const [shake, setShake] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [translationLevel, setTranslationLevel] = useState(null);
  const [translationQuiz, setTranslationQuiz] = useState([]);
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
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function handleRestartWord() {
    setQuiz(getRandomQuestions(10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("word");
  }

  function startWordQuiz() {
    setQuiz(getRandomQuestions(10));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setResults([]);
    setView("word");
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
          <button className="section-btn" onClick={() => startWordQuiz()} style={sectionBtnStyle}>
            <span style={sectionTitleStyle}>Guess the word</span>
            <span style={sectionDescStyle}>Lecture · Hangul ↔ romanisation</span>
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
          onClick={() => isWord ? setView("menu") : backToTranslationLevels()}
          style={{ width: "auto", padding: "8px 16px", marginBottom: 0 }}
        >
          ← Retour
        </button>
        <span>✦ {isWord ? "Guess the word" : `Traduction · Niveau ${translationLevel}`} ✦</span>
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
              {q.prompt}
            </div>

            <div style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, letterSpacing: 3, marginBottom: 24, textTransform: "uppercase" }}>
              {questionSubtitle}
            </div>

            <div>
              {q.options.map(opt => {
                let cls = "option-btn";
                if (selected !== null) {
                  if (opt === q.answer) cls += " correct";
                  else if (opt === selected && selected !== q.answer) cls += " wrong";
                }
                return (
                  <button key={opt} className={cls} onClick={() => handleSelect(opt)} disabled={selected !== null}>
                    {opt}
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

            <button className="next-btn" onClick={handleRestartWord}>
              🔄 Recommencer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
