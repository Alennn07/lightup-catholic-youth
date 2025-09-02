// Internationalization (i18n) configuration and utilities
export type SupportedLanguage = 'en' | 'gu' | 'hi';

export interface Translations {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    submit: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    retry: string;
    confirm: string;
    yes: string;
    no: string;
  };
  
  // Navigation
  navigation: {
    home: string;
    features: string;
    community: string;
    about: string;
    support: string;
    dashboard: string;
    profile: string;
    settings: string;
    signIn: string;
    signUp: string;
    signOut: string;
  };
  
  // FaithBot specific
  faithbot: {
    title: string;
    subtitle: string;
    placeholder: string;
    quickQuestions: string;
    quickModes: string;
    advancedSettings: string;
    showAdvanced: string;
    hideAdvanced: string;
    mode: string;
    context: string;
    tone: string;
    length: string;
    chat: string;
    prayerWriter: string;
    bibleStudy: string;
    sermonWriter: string;
    youthContent: string;
    general: string;
    sacramental: string;
    pastoral: string;
    educational: string;
    casual: string;
    formal: string;
    encouraging: string;
    reflective: string;
    short: string;
    medium: string;
    long: string;
    features: {
      biblicalKnowledge: string;
      biblicalKnowledgeDesc: string;
      prayerGuidance: string;
      prayerGuidanceDesc: string;
      creativeContent: string;
      creativeContentDesc: string;
    };
    errors: {
      failedToGetResponse: string;
      tryAgain: string;
      gotDistracted: string;
      havingMoment: string;
      technicalDifficulties: string;
      needsReset: string;
      onlyPostRequests: string;
      needMessage: string;
      stillGettingSetup: string;
    };
  };
  
  // Auth
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
    enterEmail: string;
    enterPassword: string;
    signInFailed: string;
    accountNotFound: string;
    emailNotVerified: string;
    tooManyAttempts: string;
    userNotFound: string;
    invalidCredentials: string;
    emailNotConfirmed: string;
    tooManyRequests: string;
  };
  
  // Youth Groups
  youthGroups: {
    title: string;
    joinGroup: string;
    leaveGroup: string;
    createGroup: string;
    manageGroup: string;
    groupDetails: string;
    createEvent: string;
    createPost: string;
    deleteEvent: string;
    deletePost: string;
    addMember: string;
    removeMember: string;
    memberAdded: string;
    memberRemoved: string;
    pleaseSignIn: string;
    pleaseLogInAgain: string;
    failedToFetch: string;
    failedToJoin: string;
    failedToLeave: string;
    failedToCreate: string;
    failedToDelete: string;
    failedToAdd: string;
    failedToRemove: string;
    authenticationError: string;
  };
}

// English translations
const en: Translations = {
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh",
    retry: "Retry",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
  },
  navigation: {
    home: "Home",
    features: "Features",
    community: "Community",
    about: "About",
    support: "Support",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
  },
  faithbot: {
    title: "FaithBot AI Assistant",
    subtitle: "Your Catholic ChatGPT! Understands slang, casual chat, and creates inspiring content. Ask anything about faith, get custom prayers, create videos, or just chat - I get you! 🙏✨",
    placeholder: "Ask me anything about Catholic faith...",
    quickQuestions: "Quick Questions",
    quickModes: "Quick Modes",
    advancedSettings: "Advanced Settings",
    showAdvanced: "Show Advanced",
    hideAdvanced: "Hide Advanced",
    mode: "Mode",
    context: "Context",
    tone: "Tone",
    length: "Length",
    chat: "Chat",
    prayerWriter: "Prayer Writer",
    bibleStudy: "Bible Study",
    sermonWriter: "Sermon Writer",
    youthContent: "Youth Content",
    general: "General",
    sacramental: "Sacramental",
    pastoral: "Pastoral",
    educational: "Educational",
    casual: "Casual",
    formal: "Formal",
    encouraging: "Encouraging",
    reflective: "Reflective",
    short: "Short",
    medium: "Medium",
    long: "Long",
    features: {
      biblicalKnowledge: "Biblical Knowledge",
      biblicalKnowledgeDesc: "Get answers about Bible stories, verses, and discover hidden treasures",
      prayerGuidance: "Prayer & Guidance",
      prayerGuidanceDesc: "Get custom prayers for any situation and spiritual guidance",
      creativeContent: "Creative Content",
      creativeContentDesc: "Create youth video scripts, sermons, and inspiring reflections",
    },
    errors: {
      failedToGetResponse: "Failed to get response from FaithBot",
      tryAgain: "Try asking again?",
      gotDistracted: "FaithBot got a bit distracted. Try asking again?",
      havingMoment: "FaithBot is having a moment! Give it another shot?",
      technicalDifficulties: "Technical difficulties! Try again in a sec?",
      needsReset: "FaithBot needs a quick reset! Ask me again?",
      onlyPostRequests: "FaithBot only accepts POST requests!",
      needMessage: "I need a message to chat with you! Please type something.",
      stillGettingSetup: "FaithBot is still getting set up! Check back soon!",
    },
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password",
    resetPassword: "Reset Password",
    verifyEmail: "Verify Email",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    signInFailed: "Sign in failed",
    accountNotFound: "Account not found",
    emailNotVerified: "Email not verified",
    tooManyAttempts: "Too many attempts",
    userNotFound: "User not found",
    invalidCredentials: "Invalid login credentials",
    emailNotConfirmed: "Email not confirmed",
    tooManyRequests: "Too many requests",
  },
  youthGroups: {
    title: "Youth Groups",
    joinGroup: "Join Group",
    leaveGroup: "Leave Group",
    createGroup: "Create Group",
    manageGroup: "Manage Group",
    groupDetails: "Group Details",
    createEvent: "Create Event",
    createPost: "Create Post",
    deleteEvent: "Delete Event",
    deletePost: "Delete Post",
    addMember: "Add Member",
    removeMember: "Remove Member",
    memberAdded: "Member added successfully",
    memberRemoved: "Member removed successfully",
    pleaseSignIn: "Please sign in",
    pleaseLogInAgain: "Please log in again",
    failedToFetch: "Failed to fetch",
    failedToJoin: "Failed to join group",
    failedToLeave: "Failed to leave group",
    failedToCreate: "Failed to create",
    failedToDelete: "Failed to delete",
    failedToAdd: "Failed to add member",
    failedToRemove: "Failed to remove member",
    authenticationError: "Authentication Error",
  },
};

// Gujarati translations
const gu: Translations = {
  common: {
    loading: "લોડ થઈ રહ્યું છે...",
    error: "ભૂલ",
    success: "સફળતા",
    cancel: "રદ કરો",
    save: "સેવ કરો",
    delete: "ડિલીટ કરો",
    edit: "એડિટ કરો",
    back: "પાછળ",
    next: "આગળ",
    previous: "પહેલાં",
    close: "બંધ કરો",
    submit: "સબમિટ કરો",
    search: "શોધો",
    filter: "ફિલ્ટર",
    sort: "સૉર્ટ",
    refresh: "રિફ્રેશ",
    retry: "ફરી પ્રયાસ કરો",
    confirm: "કન્ફર્મ",
    yes: "હા",
    no: "ના",
  },
  navigation: {
    home: "ઘર",
    features: "વિશેષતાઓ",
    community: "સમુદાય",
    about: "વિશે",
    support: "સહાય",
    dashboard: "ડેશબોર્ડ",
    profile: "પ્રોફાઇલ",
    settings: "સેટિંગ્સ",
    signIn: "સાઇન ઇન",
    signUp: "સાઇન અપ",
    signOut: "સાઇન આઉટ",
  },
  faithbot: {
    title: "ફેઇથબોટ AI સહાયક",
    subtitle: "તમારો કેથોલિક ChatGPT! સ્લેંગ, કેઝ્યુઅલ ચેટ સમજે છે અને પ્રેરણાદાયક કન્ટેન્ટ બનાવે છે. વિશ્વાસ વિશે કંઈપણ પૂછો, કસ્ટમ પ્રાર્થના મેળવો, વિડિયો બનાવો, અથવા ફક્ત ચેટ કરો - હું તમને સમજું છું! 🙏✨",
    placeholder: "કેથોલિક વિશ્વાસ વિશે કંઈપણ પૂછો...",
    quickQuestions: "ઝડપી પ્રશ્નો",
    quickModes: "ઝડપી મોડ્સ",
    advancedSettings: "અડવાન્સ સેટિંગ્સ",
    showAdvanced: "અડવાન્સ બતાવો",
    hideAdvanced: "અડવાન્સ છુપાવો",
    mode: "મોડ",
    context: "સંદર્ભ",
    tone: "ટોન",
    length: "લંબાઈ",
    chat: "ચેટ",
    prayerWriter: "પ્રાર્થના લેખક",
    bibleStudy: "બાઇબલ અભ્યાસ",
    sermonWriter: "ઉપદેશ લેખક",
    youthContent: "યુવા કન્ટેન્ટ",
    general: "સામાન્ય",
    sacramental: "સેક્રામેન્ટલ",
    pastoral: "પાસ્ટોરલ",
    educational: "શૈક્ષણિક",
    casual: "કેઝ્યુઅલ",
    formal: "ઔપચારિક",
    encouraging: "પ્રોત્સાહક",
    reflective: "પ્રતિબિંબિત",
    short: "ટૂંકું",
    medium: "મધ્યમ",
    long: "લાંબું",
    features: {
      biblicalKnowledge: "બાઇબલ જ્ઞાન",
      biblicalKnowledgeDesc: "બાઇબલ વાર્તાઓ, શ્લોકો વિશે જવાબો મેળવો અને છુપાયેલા ખજાના શોધો",
      prayerGuidance: "પ્રાર્થના અને માર્ગદર્શન",
      prayerGuidanceDesc: "કોઈપણ પરિસ્થિતિ માટે કસ્ટમ પ્રાર્થના મેળવો અને આધ્યાત્મિક માર્ગદર્શન",
      creativeContent: "સર્જનાત્મક કન્ટેન્ટ",
      creativeContentDesc: "યુવા વિડિયો સ્ક્રિપ્ટ, ઉપદેશ અને પ્રેરણાદાયક પ્રતિબિંબ બનાવો",
    },
    errors: {
      failedToGetResponse: "ફેઇથબોટ પાસેથી જવાબ મેળવવામાં નિષ્ફળ",
      tryAgain: "ફરી પૂછવાનો પ્રયાસ કરો?",
      gotDistracted: "ફેઇથબોટ થોડો વિચલિત થઈ ગયો. ફરી પૂછવાનો પ્રયાસ કરો?",
      havingMoment: "ફેઇથબોટને એક ક્ષણ લાગી! ફરી એક વાર પ્રયાસ કરો?",
      technicalDifficulties: "ટેક્નિકલ મુશ્કેલીઓ! એક સેકન્ડમાં ફરી પ્રયાસ કરો?",
      needsReset: "ફેઇથબોટને ઝડપી રીસેટની જરૂર છે! મને ફરી પૂછો?",
      onlyPostRequests: "ફેઇથબોટ ફક્ત POST રિક્વેસ્ટ સ્વીકારે છે!",
      needMessage: "તમારી સાથે ચેટ કરવા માટે મને એક સંદેશની જરૂર છે! કૃપા કરીને કંઈક લખો.",
      stillGettingSetup: "ફેઇથબોટ હજુ સેટઅપ થઈ રહ્યો છે! ટૂંક સમયમાં ફરી તપાસો!",
    },
  },
  auth: {
    signIn: "સાઇન ઇન",
    signUp: "સાઇન અપ",
    signOut: "સાઇન આઉટ",
    email: "ઇમેઇલ",
    password: "પાસવર્ડ",
    confirmPassword: "પાસવર્ડ કન્ફર્મ કરો",
    forgotPassword: "પાસવર્ડ ભૂલી ગયા",
    resetPassword: "પાસવર્ડ રીસેટ કરો",
    verifyEmail: "ઇમેઇલ વેરિફાય કરો",
    enterEmail: "તમારો ઇમેઇલ દાખલ કરો",
    enterPassword: "તમારો પાસવર્ડ દાખલ કરો",
    signInFailed: "સાઇન ઇન નિષ્ફળ",
    accountNotFound: "એકાઉન્ટ મળ્યું નથી",
    emailNotVerified: "ઇમેઇલ વેરિફાય થયું નથી",
    tooManyAttempts: "ઘણા પ્રયાસો",
    userNotFound: "વપરાશકર્તા મળ્યો નથી",
    invalidCredentials: "અમાન્ય લોગિન ક્રેડેન્શિયલ્સ",
    emailNotConfirmed: "ઇમેઇલ કન્ફર્મ થયું નથી",
    tooManyRequests: "ઘણી રિક્વેસ્ટ્સ",
  },
  youthGroups: {
    title: "યુવા જૂથો",
    joinGroup: "જૂથમાં જોડાઓ",
    leaveGroup: "જૂથ છોડો",
    createGroup: "જૂથ બનાવો",
    manageGroup: "જૂથ મેનેજ કરો",
    groupDetails: "જૂથ વિગતો",
    createEvent: "ઇવેન્ટ બનાવો",
    createPost: "પોસ્ટ બનાવો",
    deleteEvent: "ઇવેન્ટ ડિલીટ કરો",
    deletePost: "પોસ્ટ ડિલીટ કરો",
    addMember: "સભ્ય ઉમેરો",
    removeMember: "સભ્ય દૂર કરો",
    memberAdded: "સભ્ય સફળતાપૂર્વક ઉમેર્યો",
    memberRemoved: "સભ્ય સફળતાપૂર્વક દૂર કર્યો",
    pleaseSignIn: "કૃપા કરીને સાઇન ઇન કરો",
    pleaseLogInAgain: "કૃપા કરીને ફરી લોગ ઇન કરો",
    failedToFetch: "ફેચ કરવામાં નિષ્ફળ",
    failedToJoin: "જૂથમાં જોડાવામાં નિષ્ફળ",
    failedToLeave: "જૂથ છોડવામાં નિષ્ફળ",
    failedToCreate: "બનાવવામાં નિષ્ફળ",
    failedToDelete: "ડિલીટ કરવામાં નિષ્ફળ",
    failedToAdd: "સભ્ય ઉમેરવામાં નિષ્ફળ",
    failedToRemove: "સભ્ય દૂર કરવામાં નિષ્ફળ",
    authenticationError: "ઓથેન્ટિકેશન ભૂલ",
  },
};

// Hindi translations
const hi: Translations = {
  common: {
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    back: "वापस",
    next: "आगे",
    previous: "पिछला",
    close: "बंद करें",
    submit: "जमा करें",
    search: "खोजें",
    filter: "फिल्टर",
    sort: "क्रमबद्ध करें",
    refresh: "रिफ्रेश करें",
    retry: "पुनः प्रयास करें",
    confirm: "पुष्टि करें",
    yes: "हाँ",
    no: "नहीं",
  },
  navigation: {
    home: "होम",
    features: "विशेषताएं",
    community: "समुदाय",
    about: "के बारे में",
    support: "सहायता",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    signIn: "साइन इन",
    signUp: "साइन अप",
    signOut: "साइन आउट",
  },
  faithbot: {
    title: "फेथबॉट AI सहायक",
    subtitle: "आपका कैथोलिक ChatGPT! स्लैंग, कैजुअल चैट समझता है और प्रेरणादायक कंटेंट बनाता है। विश्वास के बारे में कुछ भी पूछें, कस्टम प्रार्थना प्राप्त करें, वीडियो बनाएं, या बस चैट करें - मैं आपको समझता हूं! 🙏✨",
    placeholder: "कैथोलिक विश्वास के बारे में कुछ भी पूछें...",
    quickQuestions: "त्वरित प्रश्न",
    quickModes: "त्वरित मोड",
    advancedSettings: "उन्नत सेटिंग्स",
    showAdvanced: "उन्नत दिखाएं",
    hideAdvanced: "उन्नत छुपाएं",
    mode: "मोड",
    context: "संदर्भ",
    tone: "टोन",
    length: "लंबाई",
    chat: "चैट",
    prayerWriter: "प्रार्थना लेखक",
    bibleStudy: "बाइबल अध्ययन",
    sermonWriter: "उपदेश लेखक",
    youthContent: "युवा कंटेंट",
    general: "सामान्य",
    sacramental: "संस्कारिक",
    pastoral: "पादरी",
    educational: "शैक्षिक",
    casual: "कैजुअल",
    formal: "औपचारिक",
    encouraging: "प्रोत्साहक",
    reflective: "चिंतनशील",
    short: "छोटा",
    medium: "मध्यम",
    long: "लंबा",
    features: {
      biblicalKnowledge: "बाइबल ज्ञान",
      biblicalKnowledgeDesc: "बाइबल कहानियों, छंदों के बारे में जवाब प्राप्त करें और छुपे हुए खजाने खोजें",
      prayerGuidance: "प्रार्थना और मार्गदर्शन",
      prayerGuidanceDesc: "किसी भी स्थिति के लिए कस्टम प्रार्थना प्राप्त करें और आध्यात्मिक मार्गदर्शन",
      creativeContent: "रचनात्मक कंटेंट",
      creativeContentDesc: "युवा वीडियो स्क्रिप्ट, उपदेश और प्रेरणादायक चिंतन बनाएं",
    },
    errors: {
      failedToGetResponse: "फेथबॉट से प्रतिक्रिया प्राप्त करने में विफल",
      tryAgain: "फिर से पूछने का प्रयास करें?",
      gotDistracted: "फेथबॉट थोड़ा विचलित हो गया। फिर से पूछने का प्रयास करें?",
      havingMoment: "फेथबॉट को एक क्षण लगा! फिर से एक बार प्रयास करें?",
      technicalDifficulties: "तकनीकी कठिनाइयां! एक सेकंड में फिर से प्रयास करें?",
      needsReset: "फेथबॉट को त्वरित रीसेट की आवश्यकता है! मुझसे फिर से पूछें?",
      onlyPostRequests: "फेथबॉट केवल POST अनुरोध स्वीकार करता है!",
      needMessage: "आपके साथ चैट करने के लिए मुझे एक संदेश की आवश्यकता है! कृपया कुछ टाइप करें।",
      stillGettingSetup: "फेथबॉट अभी भी सेटअप हो रहा है! जल्द ही वापस जांचें!",
    },
  },
  auth: {
    signIn: "साइन इन",
    signUp: "साइन अप",
    signOut: "साइन आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    forgotPassword: "पासवर्ड भूल गए",
    resetPassword: "पासवर्ड रीसेट करें",
    verifyEmail: "ईमेल सत्यापित करें",
    enterEmail: "अपना ईमेल दर्ज करें",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    signInFailed: "साइन इन विफल",
    accountNotFound: "खाता नहीं मिला",
    emailNotVerified: "ईमेल सत्यापित नहीं हुआ",
    tooManyAttempts: "बहुत सारे प्रयास",
    userNotFound: "उपयोगकर्ता नहीं मिला",
    invalidCredentials: "अमान्य लॉगिन क्रेडेंशियल्स",
    emailNotConfirmed: "ईमेल पुष्टि नहीं हुई",
    tooManyRequests: "बहुत सारे अनुरोध",
  },
  youthGroups: {
    title: "युवा समूह",
    joinGroup: "समूह में शामिल हों",
    leaveGroup: "समूह छोड़ें",
    createGroup: "समूह बनाएं",
    manageGroup: "समूह प्रबंधित करें",
    groupDetails: "समूह विवरण",
    createEvent: "इवेंट बनाएं",
    createPost: "पोस्ट बनाएं",
    deleteEvent: "इवेंट हटाएं",
    deletePost: "पोस्ट हटाएं",
    addMember: "सदस्य जोड़ें",
    removeMember: "सदस्य हटाएं",
    memberAdded: "सदस्य सफलतापूर्वक जोड़ा गया",
    memberRemoved: "सदस्य सफलतापूर्वक हटाया गया",
    pleaseSignIn: "कृपया साइन इन करें",
    pleaseLogInAgain: "कृपया फिर से लॉग इन करें",
    failedToFetch: "फ़ेच करने में विफल",
    failedToJoin: "समूह में शामिल होने में विफल",
    failedToLeave: "समूह छोड़ने में विफल",
    failedToCreate: "बनाने में विफल",
    failedToDelete: "हटाने में विफल",
    failedToAdd: "सदस्य जोड़ने में विफल",
    failedToRemove: "सदस्य हटाने में विफल",
    authenticationError: "प्रमाणीकरण त्रुटि",
  },
};

// Translation dictionary
const translations: Record<SupportedLanguage, Translations> = {
  en,
  gu,
  hi,
};

// Get current language from localStorage or default to English
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('language');
  if (stored && ['en', 'gu', 'hi'].includes(stored)) {
    return stored as SupportedLanguage;
  }
  
  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'gu') return 'gu';
  if (browserLang === 'hi') return 'hi';
  
  return 'en';
}

// Set current language
export function setCurrentLanguage(language: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', language);
}

// Get translation function
export function t(key: string, language?: SupportedLanguage): string {
  const lang = language || getCurrentLanguage();
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

// Hook for React components
export function useTranslation() {
  const [language, setLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
  
  const changeLanguage = (newLanguage: SupportedLanguage) => {
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage);
  };
  
  const translate = (key: string) => t(key, language);
  
  return {
    t: translate,
    language,
    changeLanguage,
    supportedLanguages: ['en', 'gu', 'hi'] as SupportedLanguage[],
  };
}

// Import useState for the hook
import { useState } from 'react';
