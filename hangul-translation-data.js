// Korean–French pairs for translation quiz. 50 levels × 20 = 1000 questions.
// Levels 1–10: first 200 pairs. Levels 11–50: repeat with same pairs (different play).
const TRANSLATION_SEED = [
  ["한국", "Corée"], ["사랑", "amour"], ["안녕", "salut"], ["감사", "merci"], ["물", "eau"],
  ["밥", "riz"], ["집", "maison"], ["책", "livre"], ["학교", "école"], ["친구", "ami"],
  ["사람", "personne"], ["이름", "nom"], ["오늘", "aujourd'hui"], ["내일", "demain"], ["어제", "hier"],
  ["시간", "temps"], ["음식", "nourriture"], ["커피", "café"], ["차", "thé"], ["우유", "lait"],
  ["빵", "pain"], ["고기", "viande"], ["과일", "fruit"], ["사과", "pomme"], ["바나나", "banane"],
  ["물고기", "poisson"], ["강", "rivière"], ["산", "montagne"], ["바다", "mer"], ["하늘", "ciel"],
  ["땅", "terre"], ["나무", "arbre"], ["꽃", "fleur"], ["동물", "animal"], ["고양이", "chat"],
  ["개", "chien"], ["새", "oiseau"], ["가족", "famille"], ["엄마", "maman"], ["아빠", "papa"],
  ["형", "frère aîné"], ["누나", "sœur aînée"], ["오빠", "grand frère"], ["동생", "cadet(te)"],
  ["선생님", "professeur"], ["학생", "élève"], ["직업", "métier"], ["의사", "médecin"], ["간호사", "infirmière"],
  ["버스", "bus"], ["지하철", "métro"], ["택시", "taxi"], ["비행기", "avion"], ["여행", "voyage"],
  ["호텔", "hôtel"], ["병원", "hôpital"], ["은행", "banque"], ["우체국", "poste"], ["편의점", "supérette"],
  ["백화점", "grand magasin"], ["화장실", "toilettes"], ["문", "porte"], ["창문", "fenêtre"],
  ["의자", "chaise"], ["탁자", "table"], ["침대", "lit"], ["전화", "téléphone"], ["컴퓨터", "ordinateur"],
  ["텔레비전", "télévision"], ["영화", "film"], ["음악", "musique"], ["노래", "chanson"], ["춤", "danse"],
  ["운동", "sport"], ["축구", "football"], ["야구", "baseball"], ["수영", "natation"],
  ["날씨", "temps (météo)"], ["비", "pluie"], ["눈", "neige"], ["맑다", "clair"], ["춥다", "froid"],
  ["덥다", "chaud"], ["크다", "grand"], ["작다", "petit"], ["예쁘다", "joli"], ["맛있다", "délicieux"],
  ["재미있다", "amusant"], ["좋다", "bon"], ["싫다", "détester"], ["먹다", "manger"], ["마시다", "boire"],
  ["자다", "dormir"], ["가다", "aller"], ["오다", "venir"], ["보다", "voir"], ["듣다", "écouter"],
  ["말하다", "parler"], ["읽다", "lire"], ["쓰다", "écrire"], ["만나다", "rencontrer"], ["사다", "acheter"],
  ["주다", "donner"], ["받다", "recevoir"], ["열다", "ouvrir"], ["닫다", "fermer"],
  ["여기", "ici"], ["저기", "là-bas"], ["어디", "où"], ["언제", "quand"], ["왜", "pourquoi"],
  ["뭐", "quoi"], ["누구", "qui"], ["몇", "combien"], ["얼마", "combien (prix)"], ["네", "oui"],
  ["아니요", "non"], ["처음", "première fois"], ["다시", "encore"], ["항상", "toujours"],
  ["가끔", "parfois"], ["매우", "très"], ["조금", "un peu"], ["인사", "salutation"],
  ["미안", "désolé"], ["고마워", "merci"], ["열쇠", "clé"], ["문자", "message"], ["인터넷", "Internet"],
  ["일어나다", "se lever"], ["천천히", "lentement"], ["빨리", "vite"], ["알겠어요", "compris"],
  ["몰라요", "je ne sais pas"], ["괜찮다", "ça va"], ["전혀", "pas du tout"],
  // Extra to reach 200
  ["아침", "matin"], ["점심", "déjeuner"], ["저녁", "dîner"], ["밤", "nuit"], ["주말", "week-end"],
  ["월요일", "lundi"], ["화요일", "mardi"], ["수요일", "mercredi"], ["목요일", "jeudi"], ["금요일", "vendredi"],
  ["토요일", "samedi"], ["일요일", "dimanche"], ["생일", "anniversaire"], ["휴일", "jour férié"],
  ["방", "pièce"], ["주방", "cuisine"], ["거실", "salon"], ["화장실", "toilettes"], ["침실", "chambre à coucher"],
  ["도시", "ville"], ["나라", "pays"], ["세계", "monde"], ["지도", "carte"], ["길", "rue"],
  ["차", "voiture"], ["기차", "train"], ["비행기", "avion"], ["배", "bateau"],
  ["돈", "argent"], ["가격", "prix"], ["할인", "réduction"], ["영수증", "reçu"],
  ["옷", "vêtement"], ["신발", "chaussure"], ["모자", "chapeau"], ["가방", "sac"],
  ["숙제", "devoirs"], ["시험", "examen"], ["공부", "études"], ["질문", "question"],
  ["대답", "réponse"], ["이야기", "histoire"], ["뉴스", "actualités"], ["날짜", "date"],
  ["나이", "âge"], ["주소", "adresse"], ["전화번호", "numéro"], ["이메일", "e-mail"],
  ["사진", "photo"], ["카메라", "appareil photo"], ["음료", "boisson"], ["아이스크림", "glace"],
  ["과자", "bonbon"], ["채소", "légume"], ["고추", "piment"], ["마늘", "ail"],
  ["양파", "oignon"], ["당근", "carotte"], ["감자", "pomme de terre"], ["토마토", "tomate"],
  ["바지", "pantalon"], ["치마", "jupe"], ["셔츠", "chemise"], ["코트", "manteau"],
  ["눈물", "larme"], ["미소", "sourire"], ["행복", "bonheur"], ["사랑", "amour"],
  ["꿈", "rêve"], ["희망", "espoir"], ["걱정", "inquiétude"], ["두려움", "peur"],
  ["건강", "santé"], ["병", "maladie"], ["약", "médicament"], ["휴식", "repos"],
  ["일", "travail"], ["회사", "entreprise"], ["회의", "réunion"], ["프로젝트", "projet"],
  ["계획", "plan"], ["결과", "résultat"], ["이유", "raison"], ["방법", "méthode"],
  ["문제", "problème"], ["해결", "solution"], ["변화", "changement"], ["기회", "opportunité"],
  ["경험", "expérience"], ["지식", "connaissance"], ["기억", "souvenir"], ["선물", "cadeau"],
  ["파티", "fête"], ["초대", "invitation"], ["축하", "félicitations"], ["성공", "succès"],
  ["실패", "échec"], ["노력", "effort"], ["연습", "pratique"], ["시작", "début"],
  ["끝", "fin"], ["중간", "milieu"], ["앞", "devant"], ["뒤", "derrière"],
  ["위", "au-dessus"], ["아래", "en dessous"], ["안", "intérieur"], ["밖", "extérieur"],
  ["왼쪽", "gauche"], ["오른쪽", "droite"], ["가까이", "près"], ["멀리", "loin"],
  ["빨간색", "rouge"], ["파란색", "bleu"], ["초록색", "vert"], ["노란색", "jaune"],
  ["검은색", "noir"], ["흰색", "blanc"], ["커피숍", "café"], ["레스토랑", "restaurant"],
  ["공항", "aéroport"], ["역", "gare"], ["주차", "parking"], ["엘리베이터", "ascenseur"],
  ["계단", "escalier"], ["출구", "sortie"], ["입구", "entrée"], ["안내", "information"],
];

const QUESTIONS_PER_LEVEL = 20;
const TOTAL_LEVELS = 50;

function buildTranslationBank() {
  const bank = [];
  for (let i = 0; i < TOTAL_LEVELS * QUESTIONS_PER_LEVEL; i++) {
    const level = Math.floor(i / QUESTIONS_PER_LEVEL) + 1;
    const seedIndex = i % TRANSLATION_SEED.length;
    const [hangul, translation] = TRANSLATION_SEED[seedIndex];
    bank.push({ hangul, translation, level });
  }
  return bank;
}

export const translationBank = buildTranslationBank();
export const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);
export { QUESTIONS_PER_LEVEL, TOTAL_LEVELS };
