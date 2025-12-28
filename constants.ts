import { FastingType, Hadith, Language, AudioTrack } from "./types";

export const HIJRI_MONTHS_EN = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

export const HIJRI_MONTHS_AR = [
  "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
  "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
  "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

export const UI_TEXT = {
  [Language.ENGLISH]: {
    appName: "Rayyan",
    nextFast: "Next Fasting Opportunity",
    gregorian: "Gregorian",
    hijri: "Hijri",
    settings: "Settings",
    language: "Language",
    notifications: "Notifications",
    mondayThursday: "Mondays & Thursdays",
    whiteDays: "White Days (13, 14, 15)",
    specialDays: "Special Days (Ashura, Arafah, etc.)",
    hijriAdjust: "Hijri Date Correction",
    hijriAdjustDesc: "Adjust date to match your country's sighting (e.g. Egypt, KSA)",
    autoDetect: "Auto-Detect",
    autoDetecting: "Detecting...",
    adjustmentSynced: "Date synced with online calendar",
    adjustmentFailed: "Could not sync. Check internet.",
    askAiTitle: "Ask Scholar AI",
    askAiPlaceholder: "Ask about fasting rules, intentions, or virtues...",
    home: "Home",
    calendar: "Calendar",
    learn: "Learn",
    audio: "Audio",
    ask: "Ask AI",
    today: "Today",
    reminderTime: "Reminder Time (Before Fajr)",
    save: "Save",
    virtues: "Virtues of Fasting",
    source: "Source",
    loading: "Thinking...",
    error: "An error occurred. Please try again.",
    enableNotifs: "Enable Notifications",
    testNotif: "Test Notification",
    days: "Day(s)",
    fastingDay: "Fasting Day",
    noFasting: "No specific Sunnah fast for this day.",
    close: "Close",
    tasua: "Tasu'a (9th Muharram)",
    ashura: "Ashura (10th Muharram)",
    arafah: "Day of Arafah",
    dhulHijjah: "First 10 Days of Dhul-Hijjah",
    shaban: "Month of Shaban",
    forbidden: "Fasting Prohibited (Eid/Tashreeq)",
    nowPlaying: "Now Playing",
    quran: "Quran Verses",
    dua: "Dua & Adhkar",
    intention: "Intention (Niyyah)",
    readMore: "Read More",
    externalResource: "External Resource"
  },
  [Language.ARABIC]: {
    appName: "الريان",
    nextFast: "فرصة الصيام القادمة",
    gregorian: "ميلادي",
    hijri: "هجري",
    settings: "الإعدادات",
    language: "اللغة",
    notifications: "التنبيهات",
    mondayThursday: "الاثنين والخميس",
    whiteDays: "الأيام البيض (١٣، ١٤، ١٥)",
    specialDays: "الأيام الخاصة (عاشوراء، عرفة، إلخ)",
    hijriAdjust: "تصحيح التاريخ الهجري",
    hijriAdjustDesc: "تعديل التاريخ ليوافق رؤية بلدك (مثل مصر، السعودية)",
    autoDetect: "كشف تلقائي",
    autoDetecting: "جاري الكشف...",
    adjustmentSynced: "تمت موازنة التاريخ مع التقويم الإلكتروني",
    adjustmentFailed: "تعذر الموازنة. تحقق من الإنترنت.",
    askAiTitle: "اسأل الذكاء الاصطناعي",
    askAiPlaceholder: "اسأل عن أحكام الصيام، النية، أو الفضائل...",
    home: "الرئيسية",
    calendar: "التقويم",
    learn: "تعلم",
    audio: "صوتيات",
    ask: "اسأل",
    today: "اليوم",
    reminderTime: "وقت التنبيه (قبل الفجر)",
    save: "حفظ",
    virtues: "فضائل الصيام",
    source: "المصدر",
    loading: "جاري التفكير...",
    error: "حدث خطأ. حاول مرة أخرى.",
    enableNotifs: "تفعيل التنبيهات",
    testNotif: "تجدربة التنبيه",
    days: "أيام",
    fastingDay: "يوم صيام",
    noFasting: "لا يوجد صيام سنة محدد لهذا اليوم.",
    close: "إغلاق",
    tasua: "تاسوعاء (٩ محرم)",
    ashura: "عاشوراء (١٠ محرم)",
    arafah: "يوم عرفة",
    dhulHijjah: "العشر الأوائل من ذي الحجة",
    shaban: "شهر شعبان",
    forbidden: "يحرم الصيام (عيد/تشريق)",
    nowPlaying: "تشغيل الآن",
    quran: "آيات الصيام",
    dua: "أدعية وأذكار",
    intention: "النية",
    readMore: "اقرأ المزيد",
    externalResource: "رابط خارجي"
  }
};

export const FASTING_DETAILS: Partial<Record<FastingType, { niyyahEn: string, niyyahAr: string, resourceLink?: string }>> = {
  [FastingType.MONDAY_THURSDAY]: {
    niyyahEn: "I intend to fast this day as a Sunnah of the Prophet Muhammad (peace be upon him).",
    niyyahAr: "نويت صيام هذا اليوم سنة عن النبي محمد صلى الله عليه وسلم.",
    resourceLink: "https://islamqa.info/en/answers/69781/virtue-of-fasting-on-mondays-and-thursdays"
  },
  [FastingType.WHITE_DAYS]: {
    niyyahEn: "I intend to fast the White Days (Ayyam al-Beed) following the Sunnah of the Prophet (peace be upon him).",
    niyyahAr: "نويت صيام الأيام البيض اتباعاً لسنة النبي صلى الله عليه وسلم.",
    resourceLink: "https://islamqa.info/en/answers/49867/the-virtue-of-fasting-three-days-of-each-month"
  },
  [FastingType.ASHURA]: {
    niyyahEn: "I intend to fast the day of Ashura, seeking Allah's forgiveness for the sins of the previous year.",
    niyyahAr: "نويت صيام يوم عاشوراء، محتسباً على الله أن يكفر السنة التي قبله.",
    resourceLink: "https://islamqa.info/en/answers/21775/virtues-of-fasting-ashura"
  },
  [FastingType.TASUA]: {
    niyyahEn: "I intend to fast the 9th of Muharram (Tasu'a) to differ from the Jews as the Prophet (peace be upon him) intended.",
    niyyahAr: "نويت صيام يوم تاسوعاء مخالفة لليهود كما أراد النبي صلى الله عليه وسلم.",
    resourceLink: "https://islamqa.info/en/answers/21785/it-is-mustahabb-to-fast-tasua-with-ashura"
  },
  [FastingType.ARAFAH]: {
    niyyahEn: "I intend to fast the Day of Arafah, hoping for the expiation of sins for the year before and the year after.",
    niyyahAr: "نويت صيام يوم عرفة، طمعاً في مغفرة ذنوب السنة الماضية والسنة الباقية.",
    resourceLink: "https://islamqa.info/en/answers/986/virtues-of-fasting-on-the-day-of-arafah"
  },
  [FastingType.SHAWWAL]: {
    niyyahEn: "I intend to fast one of the six days of Shawwal.",
    niyyahAr: "نويت صيام يوم من الست من شوال.",
    resourceLink: "https://islamqa.info/en/answers/7859/virtues-of-fasting-six-days-of-shawwal"
  },
  [FastingType.SHABAN]: {
    niyyahEn: "I intend to fast in Shaban as a preparation for Ramadan.",
    niyyahAr: "نويت الصيام في شعبان استعداداً لرمضان واتباعاً للسنة.",
    resourceLink: "https://islamqa.info/en/answers/13729/fasting-in-shaban"
  }
};

export const HADITHS: Hadith[] = [
  // --- General Virtues ---
  {
    id: 'rayyan_gate',
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "صحيح البخاري ومسلم",
    textEn: "In Paradise there is a gate called Ar-Rayyan, through which only the fasting people will enter on the Day of Resurrection. No one else will enter through it.",
    textAr: "إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ، لاَ يَدْخُلُ مِنْهُ أَحَدٌ غَيْرُهُمْ",
    tags: [FastingType.GENERAL]
  },
  {
    id: 'shield',
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "صحيح البخاري ومسلم",
    textEn: "Fasting is a shield (or a screen) from the Hellfire.",
    textAr: "الصِّيَامُ جُنَّةٌ",
    tags: [FastingType.GENERAL]
  },
  
  // --- Specific Days ---
  {
    id: 'monday_thursday',
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    textEn: "The deeds are presented on every Monday and Thursday, so I love that my deeds be presented while I am fasting.",
    textAr: "تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ",
    tags: [FastingType.MONDAY_THURSDAY]
  },
  {
    id: 'white_days',
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    textEn: "Fasting three days of each month is fasting for a lifetime.",
    textAr: "صِيَامُ ثَلاَثَةِ أَيَّامٍ مِنْ كُلِّ شَهْرٍ صِيَامُ الدَّهْرِ",
    tags: [FastingType.WHITE_DAYS]
  },
  {
    id: 'arafah',
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    textEn: "Fasting on the day of Arafah, I hope from Allah that it expiates the sins for the year before it and the year after it.",
    textAr: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالسَّنَةَ الَّتِي بَعْدَهُ",
    tags: [FastingType.ARAFAH]
  },
  {
    id: 'ashura_tasua',
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    textEn: "Fasting the day of 'Ashura', I hope will expiate the sins of the year that came before it... And if I live to next year, I will surely fast the ninth (Tasu'a).",
    textAr: "صِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ... وَلَئِنْ بَقِيتُ إِلَى قَابِلٍ لأَصُومَنَّ التَّاسِعَ",
    tags: [FastingType.ASHURA, FastingType.TASUA]
  },
  {
    id: 'dhul_hijjah',
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    textEn: "There are no days during which the righteous action is so pleasing to Allah than these days (i.e., the first ten days of Dhul-Hijjah).",
    textAr: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الأَيَّامِ يَعْنِي أَيَّامَ الْعَشْرِ",
    tags: [FastingType.DHUL_HIJJAH]
  },
  {
    id: 'shaban',
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    textEn: "I never saw the Prophet (ﷺ) fasting for a whole month except the month of Ramadan, and I did not see him fasting in any month more than in the month of Sha'ban.",
    textAr: "وَمَا رَأَيْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم اسْتَكْمَلَ صِيَامَ شَهْرٍ قَطُّ إِلاَّ رَمَضَانَ، وَمَا رَأَيْتُهُ فِي شَهْرٍ أَكْثَرَ مِنْهُ صِيَامًا فِي شَعْبَانَ",
    tags: [FastingType.SHABAN]
  },
  {
    id: 'shawwal',
    sourceEn: "Sahih Muslim",
    sourceAr: "صحيح مسلم",
    textEn: "Whoever fasts Ramadan then follows it with six days of Shawwal, it is as if he fasted for a lifetime.",
    textAr: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
    tags: [FastingType.SHAWWAL]
  },

  // --- Manners & Etiquette ---
  {
    id: 'suhoor',
    sourceEn: "Sahih al-Bukhari & Muslim",
    sourceAr: "صحيح البخاري ومسلم",
    textEn: "Take Suhoor as there is a blessing in it.",
    textAr: "تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً",
    tags: [FastingType.GENERAL, FastingType.RAMADAN]
  },
  {
    id: 'false_speech',
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    textEn: "Whoever does not give up forged speech and evil actions, Allah is not in need of his leaving his food and drink.",
    textAr: "مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ",
    tags: [FastingType.GENERAL]
  },
  {
    id: 'hasten_break',
    sourceEn: "Sahih al-Bukhari",
    sourceAr: "صحيح البخاري",
    textEn: "The people will remain on the right path as long as they hasten the breaking of the fast.",
    textAr: "لاَ يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ",
    tags: [FastingType.GENERAL, FastingType.RAMADAN]
  }
];

export const AUDIO_TRACKS: AudioTrack[] = [
  // --- Quran ---
  {
    id: 'baqarah_183',
    titleEn: 'Ayat of Fasting (2:183)',
    titleAr: 'آية الصيام (١٨٣ البقرة)',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'quran',
    url: 'https://everyayah.com/data/Alafasy_128kbps/002183.mp3',
    duration: '0:35'
  },
  {
    id: 'baqarah_185',
    titleEn: 'Ayat of Ramadan (2:185)',
    titleAr: 'آية شهر رمضان (١٨٥ البقرة)',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'quran',
    url: 'https://everyayah.com/data/Alafasy_128kbps/002185.mp3',
    duration: '1:12'
  },
  {
    id: 'fatiha',
    titleEn: 'Surah Al-Fatiha',
    titleAr: 'سورة الفاتحة',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'quran',
    url: 'https://server8.mp3quran.net/afs/001.mp3',
    duration: '0:45'
  },
  {
    id: 'qadr',
    titleEn: 'Surah Al-Qadr',
    titleAr: 'سورة القدر',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'quran',
    url: 'https://server8.mp3quran.net/afs/097.mp3',
    duration: '0:35'
  },
  {
    id: 'inshirah',
    titleEn: 'Surah Al-Inshirah',
    titleAr: 'سورة الشرح',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'quran',
    url: 'https://server8.mp3quran.net/afs/094.mp3',
    duration: '0:30'
  },
  // --- Dua ---
  {
    id: 'ayat_kursi',
    titleEn: 'Ayatul Kursi (Protection)',
    titleAr: 'آية الكرسي',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'dua',
    url: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
    duration: '1:05'
  },
  {
    id: 'rabbana_atina',
    titleEn: 'Rabbana Atina (Dua)',
    titleAr: 'ربنا آتنا في الدنيا حسنة',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'dua',
    url: 'https://everyayah.com/data/Alafasy_128kbps/002201.mp3',
    duration: '0:15'
  },
  {
    id: 'rabbana_la_tuzigh',
    titleEn: 'Rabbana La Tuzigh (Steadfastness)',
    titleAr: 'ربنا لا تزغ قلوبنا',
    artistEn: 'Mishary Alafasy',
    artistAr: 'مشاري العفاسي',
    category: 'dua',
    url: 'https://everyayah.com/data/Alafasy_128kbps/003008.mp3',
    duration: '0:15'
  }
];