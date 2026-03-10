// Korean–French pairs for translation quiz. 50 levels × 20 = 1000 questions.
// Format: [hangul, translation, lecture (romanisation)].
// Levels 1–10: first 200 pairs. Levels 11–50: repeat with same pairs (different play).
const TRANSLATION_SEED = [
  ["한국", "Corée", "hanguk"], ["사랑", "amour", "sarang"], ["안녕", "salut", "annyeong"], ["감사", "merci", "gamsa"], ["물", "eau", "mul"],
  ["밥", "riz", "bap"], ["집", "maison", "jip"], ["책", "livre", "chaek"], ["학교", "école", "hakgyo"], ["친구", "ami", "chingu"],
  ["사람", "personne", "saram"], ["이름", "nom", "ireum"], ["오늘", "aujourd'hui", "oneul"], ["내일", "demain", "naeil"], ["어제", "hier", "eoje"],
  ["시간", "temps", "sigan"], ["음식", "nourriture", "eumsik"], ["커피", "café", "keopi"], ["차", "thé", "cha"], ["우유", "lait", "uyu"],
  ["빵", "pain", "ppang"], ["고기", "viande", "gogi"], ["과일", "fruit", "gwail"], ["사과", "pomme", "sagwa"], ["바나나", "banane", "banana"],
  ["물고기", "poisson", "mulgogi"], ["강", "rivière", "gang"], ["산", "montagne", "san"], ["바다", "mer", "bada"], ["하늘", "ciel", "haneul"],
  ["땅", "terre", "ttang"], ["나무", "arbre", "namu"], ["꽃", "fleur", "kkot"], ["동물", "animal", "dongmul"], ["고양이", "chat", "goyangi"],
  ["개", "chien", "gae"], ["새", "oiseau", "sae"], ["가족", "famille", "gajok"], ["엄마", "maman", "eomma"], ["아빠", "papa", "appa"],
  ["형", "frère aîné", "hyeong"], ["누나", "sœur aînée", "nuna"], ["오빠", "grand frère", "oppa"], ["동생", "cadet(te)", "dongsaeng"],
  ["선생님", "professeur", "seonsaengnim"], ["학생", "élève", "haksaeng"], ["직업", "métier", "jigeop"], ["의사", "médecin", "uisa"], ["간호사", "infirmière", "ganhosa"],
  ["버스", "bus", "beoseu"], ["지하철", "métro", "jihacheol"], ["택시", "taxi", "taeksi"], ["비행기", "avion", "bihaenggi"], ["여행", "voyage", "yeohaeng"],
  ["호텔", "hôtel", "hotel"], ["병원", "hôpital", "byeongwon"], ["은행", "banque", "eunhaeng"], ["우체국", "poste", "ucheguk"], ["편의점", "supérette", "pyeonuijeom"],
  ["백화점", "grand magasin", "baekhwajeom"], ["화장실", "toilettes", "hwajangsil"], ["문", "porte", "mun"], ["창문", "fenêtre", "changmun"],
  ["의자", "chaise", "uija"], ["탁자", "table", "takja"], ["침대", "lit", "chimdae"], ["전화", "téléphone", "jeonhwa"], ["컴퓨터", "ordinateur", "keompyuteo"],
  ["텔레비전", "télévision", "tellebijeon"], ["영화", "film", "yeonghwa"], ["음악", "musique", "eumak"], ["노래", "chanson", "norae"], ["춤", "danse", "chum"],
  ["운동", "sport", "undong"], ["축구", "football", "chukgu"], ["야구", "baseball", "yagu"], ["수영", "natation", "suyeong"],
  ["날씨", "temps (météo)", "nalssi"], ["비", "pluie", "bi"], ["눈", "neige", "nun"], ["맑다", "clair", "makda"], ["춥다", "froid", "chupda"],
  ["덥다", "chaud", "deopda"], ["크다", "grand", "keuda"], ["작다", "petit", "jakda"], ["예쁘다", "joli", "yeppeuda"], ["맛있다", "délicieux", "masitta"],
  ["재미있다", "amusant", "jaemiitta"], ["좋다", "bon", "jota"], ["싫다", "détester", "silta"], ["먹다", "manger", "meokda"], ["마시다", "boire", "masida"],
  ["자다", "dormir", "jada"], ["가다", "aller", "gada"], ["오다", "venir", "oda"], ["보다", "voir", "boda"], ["듣다", "écouter", "deutda"],
  ["말하다", "parler", "malhada"], ["읽다", "lire", "ikda"], ["쓰다", "écrire", "sseuda"], ["만나다", "rencontrer", "mannada"], ["사다", "acheter", "sada"],
  ["주다", "donner", "juda"], ["받다", "recevoir", "batda"], ["열다", "ouvrir", "yeolda"], ["닫다", "fermer", "datda"],
  ["여기", "ici", "yeogi"], ["저기", "là-bas", "jeogi"], ["어디", "où", "eodi"], ["언제", "quand", "eonje"], ["왜", "pourquoi", "wae"],
  ["뭐", "quoi", "mwo"], ["누구", "qui", "nugu"], ["몇", "combien", "myeot"], ["얼마", "combien (prix)", "eolma"], ["네", "oui", "ne"],
  ["아니요", "non", "aniyo"], ["처음", "première fois", "cheoeum"], ["다시", "encore", "dasi"], ["항상", "toujours", "hangsang"],
  ["가끔", "parfois", "gakkeum"], ["매우", "très", "maeu"], ["조금", "un peu", "jogeum"], ["인사", "salutation", "insa"],
  ["미안", "désolé", "mian"], ["고마워", "merci", "gomawo"], ["열쇠", "clé", "yeolsoe"], ["문자", "message", "munja"], ["인터넷", "Internet", "inteonet"],
  ["일어나다", "se lever", "ireonada"], ["천천히", "lentement", "cheoncheonhi"], ["빨리", "vite", "ppalli"], ["알겠어요", "compris", "algesseoyo"],
  ["몰라요", "je ne sais pas", "mollayo"], ["괜찮다", "ça va", "gwaenchanhta"], ["전혀", "pas du tout", "jeonhyeo"],
  // Extra to reach 200
  ["아침", "matin", "achim"], ["점심", "déjeuner", "jeomsim"], ["저녁", "dîner", "jeonyeok"], ["밤", "nuit", "bam"], ["주말", "week-end", "jumal"],
  ["월요일", "lundi", "wollyoil"], ["화요일", "mardi", "hwayoil"], ["수요일", "mercredi", "suyoil"], ["목요일", "jeudi", "mogyoil"], ["금요일", "vendredi", "geumyoil"],
  ["토요일", "samedi", "toyoil"], ["일요일", "dimanche", "iryoil"], ["생일", "anniversaire", "saengil"], ["휴일", "jour férié", "hyuil"],
  ["방", "pièce", "bang"], ["주방", "cuisine", "jubang"], ["거실", "salon", "geosil"], ["화장실", "toilettes", "hwajangsil"], ["침실", "chambre à coucher", "chimsil"],
  ["도시", "ville", "dosi"], ["나라", "pays", "nara"], ["세계", "monde", "segye"], ["지도", "carte", "jido"], ["길", "rue", "gil"],
  ["차", "voiture", "cha"], ["기차", "train", "gicha"], ["비행기", "avion", "bihaenggi"], ["배", "bateau", "bae"],
  ["돈", "argent", "don"], ["가격", "prix", "gageok"], ["할인", "réduction", "halin"], ["영수증", "reçu", "yeongsujeung"],
  ["옷", "vêtement", "ot"], ["신발", "chaussure", "sinbal"], ["모자", "chapeau", "moja"], ["가방", "sac", "gabang"],
  ["숙제", "devoirs", "sukje"], ["시험", "examen", "siheom"], ["공부", "études", "gongbu"], ["질문", "question", "jilmun"],
  ["대답", "réponse", "daedap"], ["이야기", "histoire", "iyagi"], ["뉴스", "actualités", "nyuseu"], ["날짜", "date", "naljja"],
  ["나이", "âge", "nai"], ["주소", "adresse", "juso"], ["전화번호", "numéro", "jeonhwabeonho"], ["이메일", "e-mail", "imeil"],
  ["사진", "photo", "sajin"], ["카메라", "appareil photo", "kameora"], ["음료", "boisson", "eumryo"], ["아이스크림", "glace", "aiseukeurim"],
  ["과자", "bonbon", "gwaja"], ["채소", "légume", "chaeso"], ["고추", "piment", "gochu"], ["마늘", "ail", "maneul"],
  ["양파", "oignon", "yangpa"], ["당근", "carotte", "danggeun"], ["감자", "pomme de terre", "gamja"], ["토마토", "tomate", "tomato"],
  ["바지", "pantalon", "baji"], ["치마", "jupe", "chima"], ["셔츠", "chemise", "syeocheu"], ["코트", "manteau", "koteu"],
  ["눈물", "larme", "nunmul"], ["미소", "sourire", "miso"], ["행복", "bonheur", "haengbok"], ["사랑", "amour", "sarang"],
  ["꿈", "rêve", "kkum"], ["희망", "espoir", "huimang"], ["걱정", "inquiétude", "geokjeong"], ["두려움", "peur", "duryeoum"],
  ["건강", "santé", "geongang"], ["병", "maladie", "byeong"], ["약", "médicament", "yak"], ["휴식", "repos", "hyusik"],
  ["일", "travail", "il"], ["회사", "entreprise", "hoesa"], ["회의", "réunion", "hoeui"], ["프로젝트", "projet", "peurojekteu"],
  ["계획", "plan", "gyehoek"], ["결과", "résultat", "gyeolgwa"], ["이유", "raison", "iyu"], ["방법", "méthode", "bangbeop"],
  ["문제", "problème", "munje"], ["해결", "solution", "haegyeol"], ["변화", "changement", "byeonhwa"], ["기회", "opportunité", "gioe"],
  ["경험", "expérience", "gyeongheom"], ["지식", "connaissance", "jisik"], ["기억", "souvenir", "gieok"], ["선물", "cadeau", "seonmul"],
  ["파티", "fête", "pati"], ["초대", "invitation", "chodae"], ["축하", "félicitations", "chukah"], ["성공", "succès", "seonggong"],
  ["실패", "échec", "silpae"], ["노력", "effort", "noryeok"], ["연습", "pratique", "yeonseup"], ["시작", "début", "sijak"],
  ["끝", "fin", "kkeut"], ["중간", "milieu", "junggan"], ["앞", "devant", "ap"], ["뒤", "derrière", "dwi"],
  ["위", "au-dessus", "wi"], ["아래", "en dessous", "arae"], ["안", "intérieur", "an"], ["밖", "extérieur", "bakk"],
  ["왼쪽", "gauche", "oenjjok"], ["오른쪽", "droite", "oreunjjok"], ["가까이", "près", "gakkai"], ["멀리", "loin", "meolli"],
  ["빨간색", "rouge", "ppalgansaek"], ["파란색", "bleu", "paransaek"], ["초록색", "vert", "choroksaek"], ["노란색", "jaune", "noransaek"],
  ["검은색", "noir", "geomeunsaek"], ["흰색", "blanc", "huinsaek"], ["커피숍", "café", "keopisyop"], ["레스토랑", "restaurant", "reseutorang"],
  ["공항", "aéroport", "gonghang"], ["역", "gare", "yeok"], ["주차", "parking", "jucha"], ["엘리베이터", "ascenseur", "ellibeiteo"],
  ["계단", "escalier", "gyedan"], ["출구", "sortie", "chulgu"], ["입구", "entrée", "ipgu"], ["안내", "information", "annae"],
];

const QUESTIONS_PER_LEVEL = 20;
const TOTAL_LEVELS = 50;

function buildTranslationBank() {
  const bank = [];
  for (let i = 0; i < TOTAL_LEVELS * QUESTIONS_PER_LEVEL; i++) {
    const level = Math.floor(i / QUESTIONS_PER_LEVEL) + 1;
    const seedIndex = i % TRANSLATION_SEED.length;
    const [hangul, translation, roman] = TRANSLATION_SEED[seedIndex];
    bank.push({ hangul, translation, roman: roman ?? "", level });
  }
  return bank;
}

export const translationBank = buildTranslationBank();
export const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);
export { QUESTIONS_PER_LEVEL, TOTAL_LEVELS };
