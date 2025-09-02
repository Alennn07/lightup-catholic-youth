// Internationalization (i18n) configuration and utilities
import React, { useState, useEffect, createContext, useContext } from 'react';

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
  
  // Homepage
  homepage: {
    hero: {
      title: string;
      subtitle: string;
      getStarted: string;
      exploreFeatures: string;
      joinCommunity: string;
    };
    features: {
      title: string;
      subtitle: string;
      prayerWall: string;
      prayerWallDesc: string;
      youthGroups: string;
      youthGroupsDesc: string;
      dailyBible: string;
      dailyBibleDesc: string;
      faithBot: string;
      faithBotDesc: string;
      faithJournal: string;
      faithJournalDesc: string;
      faithQuiz: string;
      faithQuizDesc: string;
      liturgicalCalendar: string;
      liturgicalCalendarDesc: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
      beFirst: string;
      beFirstDesc: string;
    };
    stats: {
      users: string;
      prayers: string;
      groups: string;
      countries: string;
    };
  };
  
  // About Page
  about: {
    title: string;
    subtitle: string;
    mission: {
      title: string;
      description: string;
    };
    values: {
      title: string;
      faithCentered: {
        title: string;
        description: string;
      };
      communityDriven: {
        title: string;
        description: string;
      };
      globallyConnected: {
        title: string;
        description: string;
      };
      safeSecure: {
        title: string;
        description: string;
      };
    };
    team: {
      title: string;
      subtitle: string;
    };
  };
  
  // Features Page
  features: {
    title: string;
    subtitle: string;
    comingSoon: string;
    beta: string;
  };
  
  // Community Page
  community: {
    title: string;
    subtitle: string;
    joinNow: string;
    createAccount: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    quickActions: string;
    recentActivity: string;
    noActivity: string;
  };
  
  // Prayer Wall
  prayerWall: {
    title: string;
    subtitle: string;
    addRequest: string;
    prayFor: string;
    recentRequests: string;
    noRequests: string;
    requestPlaceholder: string;
    submitRequest: string;
  };
  
  // Daily Bible Verse
  dailyBible: {
    title: string;
    subtitle: string;
    todaysVerse: string;
    reflection: string;
    shareVerse: string;
    previousVerse: string;
    nextVerse: string;
  };
  
  // Faith Journal
  faithJournal: {
    title: string;
    subtitle: string;
    newEntry: string;
    writeEntry: string;
    saveEntry: string;
    myEntries: string;
    noEntries: string;
  };
  
  // Faith Quiz
  faithQuiz: {
    title: string;
    subtitle: string;
    startQuiz: string;
    question: string;
    nextQuestion: string;
    finishQuiz: string;
    yourScore: string;
    retakeQuiz: string;
  };
  
  // Liturgical Calendar
  liturgicalCalendar: {
    title: string;
    subtitle: string;
    currentSeason: string;
    today: string;
    upcoming: string;
  };
  
  // Settings
  settings: {
    title: string;
    profile: string;
    account: string;
    preferences: string;
    privacy: string;
    notifications: string;
    language: string;
    theme: string;
    saveChanges: string;
    changesSaved: string;
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
  homepage: {
    hero: {
      title: "A place for Catholic youth to connect and grow",
      subtitle: "Share prayers, find community, explore your faith, and connect with other young Catholics around the world.",
      getStarted: "Get Started",
      exploreFeatures: "Explore Features",
      joinCommunity: "Join Community",
    },
    features: {
      title: "Features",
      subtitle: "Everything you need to grow in your Catholic faith",
      prayerWall: "Prayer Wall",
      prayerWallDesc: "Share prayer requests and pray for others in your Catholic youth community.",
      youthGroups: "Youth Group Finder",
      youthGroupsDesc: "Discover and connect with Catholic youth groups in your area.",
      dailyBible: "Daily Bible Verse",
      dailyBibleDesc: "Start each day with inspiring scripture and thoughtful reflections.",
      faithBot: "FaithBot AI",
      faithBotDesc: "Your Catholic ChatGPT! Get answers, prayers, and spiritual guidance.",
      faithJournal: "Faith Journal",
      faithJournalDesc: "Reflect on your spiritual journey with private journaling.",
      faithQuiz: "Faith Quiz",
      faithQuizDesc: "Test your knowledge and learn more about Catholic teachings.",
      liturgicalCalendar: "Liturgical Calendar",
      liturgicalCalendarDesc: "Stay connected to the Church's liturgical seasons and feasts.",
    },
    testimonials: {
      title: "What Our Community Says",
      subtitle: "Join thousands of young Catholics growing in faith together",
      beFirst: "Be the first!",
      beFirstDesc: "Share your experience and inspire others. Be the first to leave a testimonial!",
    },
    stats: {
      users: "Active Users",
      prayers: "Prayers Shared",
      groups: "Youth Groups",
      countries: "Countries",
    },
  },
  about: {
    title: "About LightUp",
    subtitle: "Empowering Catholic youth to grow in faith and community",
    mission: {
      title: "Our Mission",
      description: "To create a vibrant online community where Catholic youth can connect, grow in faith, and support each other on their spiritual journey.",
    },
    values: {
      title: "Our Values",
      faithCentered: {
        title: "Faith-Centered",
        description: "Everything we do is rooted in Catholic teachings and values, helping young people grow closer to God.",
      },
      communityDriven: {
        title: "Community-Driven",
        description: "We believe in the power of community and connection to strengthen faith and build lasting friendships.",
      },
      globallyConnected: {
        title: "Globally Connected",
        description: "Connecting Catholic youth from around the world, transcending geographical boundaries.",
      },
      safeSecure: {
        title: "Safe & Secure",
        description: "Providing a safe, moderated environment where young Catholics can share and grow together.",
      },
    },
    team: {
      title: "Our Team",
      subtitle: "Passionate Catholics dedicated to serving the youth community",
    },
  },
  features: {
    title: "Features",
    subtitle: "Everything you need to grow in your Catholic faith",
    comingSoon: "Coming Soon",
    beta: "Beta",
  },
  community: {
    title: "Community",
    subtitle: "Connect with Catholic youth from around the world",
    joinNow: "Join Now",
    createAccount: "Create Account",
  },
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    noActivity: "No recent activity",
  },
  prayerWall: {
    title: "Prayer Wall",
    subtitle: "Share your prayer requests and pray for others",
    addRequest: "Add Prayer Request",
    prayFor: "Pray for",
    recentRequests: "Recent Prayer Requests",
    noRequests: "No prayer requests yet",
    requestPlaceholder: "Share your prayer request...",
    submitRequest: "Submit Request",
  },
  dailyBible: {
    title: "Daily Bible Verse",
    subtitle: "Start your day with God's word",
    todaysVerse: "Today's Verse",
    reflection: "Reflection",
    shareVerse: "Share Verse",
    previousVerse: "Previous",
    nextVerse: "Next",
  },
  faithJournal: {
    title: "Faith Journal",
    subtitle: "Reflect on your spiritual journey",
    newEntry: "New Entry",
    writeEntry: "Write your thoughts...",
    saveEntry: "Save Entry",
    myEntries: "My Entries",
    noEntries: "No entries yet",
  },
  faithQuiz: {
    title: "Faith Quiz",
    subtitle: "Test your knowledge of Catholic teachings",
    startQuiz: "Start Quiz",
    question: "Question",
    nextQuestion: "Next Question",
    finishQuiz: "Finish Quiz",
    yourScore: "Your Score",
    retakeQuiz: "Retake Quiz",
  },
  liturgicalCalendar: {
    title: "Liturgical Calendar",
    subtitle: "Stay connected to the Church's seasons",
    currentSeason: "Current Season",
    today: "Today",
    upcoming: "Upcoming",
  },
  settings: {
    title: "Settings",
    profile: "Profile",
    account: "Account",
    preferences: "Preferences",
    privacy: "Privacy",
    notifications: "Notifications",
    language: "Language",
    theme: "Theme",
    saveChanges: "Save Changes",
    changesSaved: "Changes saved successfully",
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
  homepage: {
    hero: {
      title: "કેથોલિક યુવાઓ માટે જોડાણ અને વિકાસનું સ્થાન",
      subtitle: "પ્રાર્થના શેર કરો, સમુદાય શોધો, તમારા વિશ્વાસનું અન્વેષણ કરો, અને વિશ્વભરના અન્ય યુવા કેથોલિકો સાથે જોડાઓ.",
      getStarted: "શરૂ કરો",
      exploreFeatures: "વિશેષતાઓ અન્વેષો",
      joinCommunity: "સમુદાયમાં જોડાઓ",
    },
    features: {
      title: "વિશેષતાઓ",
      subtitle: "તમારા કેથોલિક વિશ્વાસમાં વિકાસ માટે જરૂરી બધું",
      prayerWall: "પ્રાર્થના દિવાલ",
      prayerWallDesc: "તમારા કેથોલિક યુવા સમુદાયમાં પ્રાર્થના વિનંતીઓ શેર કરો અને અન્યો માટે પ્રાર્થના કરો.",
      youthGroups: "યુવા જૂથ શોધક",
      youthGroupsDesc: "તમારા વિસ્તારમાં કેથોલિક યુવા જૂથો શોધો અને જોડાઓ.",
      dailyBible: "દૈનિક બાઇબલ શ્લોક",
      dailyBibleDesc: "પ્રેરણાદાયક શાસ્ત્ર અને વિચારશીલ પ્રતિબિંબો સાથે દરેક દિવસ શરૂ કરો.",
      faithBot: "ફેઇથબોટ AI",
      faithBotDesc: "તમારો કેથોલિક ChatGPT! જવાબો, પ્રાર્થના અને આધ્યાત્મિક માર્ગદર્શન મેળવો.",
      faithJournal: "વિશ્વાસ જર્નલ",
      faithJournalDesc: "ખાનગી જર્નલિંગ સાથે તમારી આધ્યાત્મિક યાત્રા પર પ્રતિબિંબિત કરો.",
      faithQuiz: "વિશ્વાસ ક્વિઝ",
      faithQuizDesc: "કેથોલિક શિક્ષણો વિશે તમારું જ્ઞાન ચકાસો અને વધુ શીખો.",
      liturgicalCalendar: "લિટર્જિકલ કેલેન્ડર",
      liturgicalCalendarDesc: "ચર્ચના લિટર્જિકલ સીઝન અને તહેવારો સાથે જોડાયેલા રહો.",
    },
    testimonials: {
      title: "અમારો સમુદાય શું કહે છે",
      subtitle: "હજારો યુવા કેથોલિકો સાથે વિશ્વાસમાં વિકાસ કરવા જોડાઓ",
      beFirst: "પહેલા બનો!",
      beFirstDesc: "તમારો અનુભવ શેર કરો અને અન્યોને પ્રેરિત કરો. પહેલા પ્રશંસાપત્ર આપવા બનો!",
    },
    stats: {
      users: "સક્રિય વપરાશકર્તાઓ",
      prayers: "શેર કરેલી પ્રાર્થના",
      groups: "યુવા જૂથો",
      countries: "દેશો",
    },
  },
  about: {
    title: "લાઇટઅપ વિશે",
    subtitle: "કેથોલિક યુવાઓને વિશ્વાસ અને સમુદાયમાં વિકાસ કરવા માટે સશક્ત બનાવવું",
    mission: {
      title: "અમારું મિશન",
      description: "એક જીવંત ઓનલાઇન સમુદાય બનાવવું જ્યાં કેથોલિક યુવાઓ જોડાઈ શકે, વિશ્વાસમાં વિકાસ કરી શકે, અને તેમની આધ્યાત્મિક યાત્રામાં એકબીજાને સહાય કરી શકે.",
    },
    values: {
      title: "અમારા મૂલ્યો",
      faithCentered: {
        title: "વિશ્વાસ-કેન્દ્રિત",
        description: "અમે જે કરીએ છીએ તે બધું કેથોલિક શિક્ષણો અને મૂલ્યોમાં મૂળ ધરાવે છે, યુવાઓને ભગવાનની નજીક વિકાસ કરવામાં મદદ કરે છે.",
      },
      communityDriven: {
        title: "સમુદાય-ચાલિત",
        description: "અમે વિશ્વાસને મજબૂત બનાવવા અને ટકાઉ મિત્રતા બનાવવા માટે સમુદાય અને જોડાણની શક્તિમાં વિશ્વાસ કરીએ છીએ.",
      },
      globallyConnected: {
        title: "વૈશ્વિક રીતે જોડાયેલા",
        description: "વિશ્વભરના કેથોલિક યુવાઓને જોડવા, ભૌગોલિક સીમાઓને પાર કરીને.",
      },
      safeSecure: {
        title: "સુરક્ષિત અને સુરક્ષિત",
        description: "યુવા કેથોલિકો શેર કરી શકે અને એકસાથે વિકાસ કરી શકે તેવું સુરક્ષિત, મધ્યસ્થ વાતાવરણ પ્રદાન કરવું.",
      },
    },
    team: {
      title: "અમારી ટીમ",
      subtitle: "યુવા સમુદાયની સેવા કરવા માટે ઉત્સાહી કેથોલિકો",
    },
  },
  features: {
    title: "વિશેષતાઓ",
    subtitle: "તમારા કેથોલિક વિશ્વાસમાં વિકાસ માટે જરૂરી બધું",
    comingSoon: "ટૂંક સમયમાં આવી રહ્યું છે",
    beta: "બીટા",
  },
  community: {
    title: "સમુદાય",
    subtitle: "વિશ્વભરના કેથોલિક યુવાઓ સાથે જોડાઓ",
    joinNow: "હવે જોડાઓ",
    createAccount: "એકાઉન્ટ બનાવો",
  },
  dashboard: {
    title: "ડેશબોર્ડ",
    welcome: "પાછા આવ્યા છો",
    quickActions: "ઝડપી ક્રિયાઓ",
    recentActivity: "તાજેતરની પ્રવૃત્તિ",
    noActivity: "તાજેતરની કોઈ પ્રવૃત્તિ નથી",
  },
  prayerWall: {
    title: "પ્રાર્થના દિવાલ",
    subtitle: "તમારી પ્રાર્થના વિનંતીઓ શેર કરો અને અન્યો માટે પ્રાર્થના કરો",
    addRequest: "પ્રાર્થના વિનંતી ઉમેરો",
    prayFor: "માટે પ્રાર્થના કરો",
    recentRequests: "તાજેતરની પ્રાર્થના વિનંતીઓ",
    noRequests: "હજુ સુધી કોઈ પ્રાર્થના વિનંતીઓ નથી",
    requestPlaceholder: "તમારી પ્રાર્થના વિનંતી શેર કરો...",
    submitRequest: "વિનંતી સબમિટ કરો",
  },
  dailyBible: {
    title: "દૈનિક બાઇબલ શ્લોક",
    subtitle: "ભગવાનના શબ્દ સાથે તમારો દિવસ શરૂ કરો",
    todaysVerse: "આજનો શ્લોક",
    reflection: "પ્રતિબિંબ",
    shareVerse: "શ્લોક શેર કરો",
    previousVerse: "પહેલાં",
    nextVerse: "આગળ",
  },
  faithJournal: {
    title: "વિશ્વાસ જર્નલ",
    subtitle: "તમારી આધ્યાત્મિક યાત્રા પર પ્રતિબિંબિત કરો",
    newEntry: "નવી એન્ટ્રી",
    writeEntry: "તમારા વિચારો લખો...",
    saveEntry: "એન્ટ્રી સેવ કરો",
    myEntries: "મારી એન્ટ્રીઓ",
    noEntries: "હજુ સુધી કોઈ એન્ટ્રીઓ નથી",
  },
  faithQuiz: {
    title: "વિશ્વાસ ક્વિઝ",
    subtitle: "કેથોલિક શિક્ષણો વિશે તમારું જ્ઞાન ચકાસો",
    startQuiz: "ક્વિઝ શરૂ કરો",
    question: "પ્રશ્ન",
    nextQuestion: "આગળનો પ્રશ્ન",
    finishQuiz: "ક્વિઝ પૂરી કરો",
    yourScore: "તમારો સ્કોર",
    retakeQuiz: "ક્વિઝ ફરી લો",
  },
  liturgicalCalendar: {
    title: "લિટર્જિકલ કેલેન્ડર",
    subtitle: "ચર્ચના સીઝન સાથે જોડાયેલા રહો",
    currentSeason: "વર્તમાન સીઝન",
    today: "આજે",
    upcoming: "આગામી",
  },
  settings: {
    title: "સેટિંગ્સ",
    profile: "પ્રોફાઇલ",
    account: "એકાઉન્ટ",
    preferences: "પસંદગીઓ",
    privacy: "ગોપનીયતા",
    notifications: "સૂચનાઓ",
    language: "ભાષા",
    theme: "થીમ",
    saveChanges: "ફેરફારો સેવ કરો",
    changesSaved: "ફેરફારો સફળતાપૂર્વક સેવ થયા",
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
  homepage: {
    hero: {
      title: "कैथोलिक युवाओं के लिए जुड़ने और बढ़ने का स्थान",
      subtitle: "प्रार्थना साझा करें, समुदाय खोजें, अपने विश्वास का अन्वेषण करें, और दुनिया भर के अन्य युवा कैथोलिकों से जुड़ें।",
      getStarted: "शुरू करें",
      exploreFeatures: "विशेषताएं अन्वेषण करें",
      joinCommunity: "समुदाय में शामिल हों",
    },
    features: {
      title: "विशेषताएं",
      subtitle: "अपने कैथोलिक विश्वास में बढ़ने के लिए आवश्यक सब कुछ",
      prayerWall: "प्रार्थना दीवार",
      prayerWallDesc: "अपने कैथोलिक युवा समुदाय में प्रार्थना अनुरोध साझा करें और दूसरों के लिए प्रार्थना करें।",
      youthGroups: "युवा समूह खोजक",
      youthGroupsDesc: "अपने क्षेत्र में कैथोलिक युवा समूहों की खोज करें और जुड़ें।",
      dailyBible: "दैनिक बाइबल छंद",
      dailyBibleDesc: "प्रेरणादायक शास्त्र और विचारशील प्रतिबिंबों के साथ हर दिन शुरू करें।",
      faithBot: "फेथबॉट AI",
      faithBotDesc: "आपका कैथोलिक ChatGPT! जवाब, प्रार्थना और आध्यात्मिक मार्गदर्शन प्राप्त करें।",
      faithJournal: "विश्वास जर्नल",
      faithJournalDesc: "निजी जर्नलिंग के साथ अपनी आध्यात्मिक यात्रा पर प्रतिबिंबित करें।",
      faithQuiz: "विश्वास क्विज",
      faithQuizDesc: "कैथोलिक शिक्षाओं के बारे में अपना ज्ञान परखें और अधिक सीखें।",
      liturgicalCalendar: "लीटर्जिकल कैलेंडर",
      liturgicalCalendarDesc: "चर्च के लीटर्जिकल सीज़न और पर्वों से जुड़े रहें।",
    },
    testimonials: {
      title: "हमारा समुदाय क्या कहता है",
      subtitle: "हजारों युवा कैथोलिकों के साथ विश्वास में बढ़ने के लिए जुड़ें",
      beFirst: "पहले बनें!",
      beFirstDesc: "अपना अनुभव साझा करें और दूसरों को प्रेरित करें। पहले प्रशंसापत्र देने वाले बनें!",
    },
    stats: {
      users: "सक्रिय उपयोगकर्ता",
      prayers: "साझा की गई प्रार्थनाएं",
      groups: "युवा समूह",
      countries: "देश",
    },
  },
  about: {
    title: "लाइटअप के बारे में",
    subtitle: "कैथोलिक युवाओं को विश्वास और समुदाय में बढ़ने के लिए सशक्त बनाना",
    mission: {
      title: "हमारा मिशन",
      description: "एक जीवंत ऑनलाइन समुदाय बनाना जहां कैथोलिक युवा जुड़ सकें, विश्वास में बढ़ सकें, और अपनी आध्यात्मिक यात्रा में एक-दूसरे की मदद कर सकें।",
    },
    values: {
      title: "हमारे मूल्य",
      faithCentered: {
        title: "विश्वास-केंद्रित",
        description: "हम जो कुछ भी करते हैं वह कैथोलिक शिक्षाओं और मूल्यों में निहित है, युवाओं को भगवान के करीब बढ़ने में मदद करता है।",
      },
      communityDriven: {
        title: "समुदाय-चालित",
        description: "हम विश्वास को मजबूत बनाने और स्थायी मित्रता बनाने के लिए समुदाय और जुड़ाव की शक्ति में विश्वास करते हैं।",
      },
      globallyConnected: {
        title: "वैश्विक रूप से जुड़े",
        description: "दुनिया भर के कैथोलिक युवाओं को जोड़ना, भौगोलिक सीमाओं को पार करके।",
      },
      safeSecure: {
        title: "सुरक्षित और सुरक्षित",
        description: "एक सुरक्षित, मध्यस्थ वातावरण प्रदान करना जहां युवा कैथोलिक साझा कर सकें और एक साथ बढ़ सकें।",
      },
    },
    team: {
      title: "हमारी टीम",
      subtitle: "युवा समुदाय की सेवा के लिए समर्पित उत्साही कैथोलिक",
    },
  },
  features: {
    title: "विशेषताएं",
    subtitle: "अपने कैथोलिक विश्वास में बढ़ने के लिए आवश्यक सब कुछ",
    comingSoon: "जल्द आ रहा है",
    beta: "बीटा",
  },
  community: {
    title: "समुदाय",
    subtitle: "दुनिया भर के कैथोलिक युवाओं से जुड़ें",
    joinNow: "अभी जुड़ें",
    createAccount: "खाता बनाएं",
  },
  dashboard: {
    title: "डैशबोर्ड",
    welcome: "वापस स्वागत है",
    quickActions: "त्वरित क्रियाएं",
    recentActivity: "हाल की गतिविधि",
    noActivity: "कोई हाल की गतिविधि नहीं",
  },
  prayerWall: {
    title: "प्रार्थना दीवार",
    subtitle: "अपने प्रार्थना अनुरोध साझा करें और दूसरों के लिए प्रार्थना करें",
    addRequest: "प्रार्थना अनुरोध जोड़ें",
    prayFor: "के लिए प्रार्थना करें",
    recentRequests: "हाल के प्रार्थना अनुरोध",
    noRequests: "अभी तक कोई प्रार्थना अनुरोध नहीं",
    requestPlaceholder: "अपना प्रार्थना अनुरोध साझा करें...",
    submitRequest: "अनुरोध सबमिट करें",
  },
  dailyBible: {
    title: "दैनिक बाइबल छंद",
    subtitle: "भगवान के वचन के साथ अपना दिन शुरू करें",
    todaysVerse: "आज का छंद",
    reflection: "प्रतिबिंब",
    shareVerse: "छंद साझा करें",
    previousVerse: "पिछला",
    nextVerse: "अगला",
  },
  faithJournal: {
    title: "विश्वास जर्नल",
    subtitle: "अपनी आध्यात्मिक यात्रा पर प्रतिबिंबित करें",
    newEntry: "नई प्रविष्टि",
    writeEntry: "अपने विचार लिखें...",
    saveEntry: "प्रविष्टि सहेजें",
    myEntries: "मेरी प्रविष्टियां",
    noEntries: "अभी तक कोई प्रविष्टि नहीं",
  },
  faithQuiz: {
    title: "विश्वास क्विज",
    subtitle: "कैथोलिक शिक्षाओं के बारे में अपना ज्ञान परखें",
    startQuiz: "क्विज शुरू करें",
    question: "प्रश्न",
    nextQuestion: "अगला प्रश्न",
    finishQuiz: "क्विज समाप्त करें",
    yourScore: "आपका स्कोर",
    retakeQuiz: "क्विज फिर से लें",
  },
  liturgicalCalendar: {
    title: "लीटर्जिकल कैलेंडर",
    subtitle: "चर्च के सीज़न से जुड़े रहें",
    currentSeason: "वर्तमान सीज़न",
    today: "आज",
    upcoming: "आगामी",
  },
  settings: {
    title: "सेटिंग्स",
    profile: "प्रोफाइल",
    account: "खाता",
    preferences: "प्राथमिकताएं",
    privacy: "गोपनीयता",
    notifications: "सूचनाएं",
    language: "भाषा",
    theme: "थीम",
    saveChanges: "परिवर्तन सहेजें",
    changesSaved: "परिवर्तन सफलतापूर्वक सहेजे गए",
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



// Create I18n Context
interface I18nContextType {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// I18n Provider Component
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('language') as SupportedLanguage;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'gu' || browserLang === 'hi') {
        setLanguage(browserLang);
      }
    }
  }, []);

  const changeLanguage = (lang: SupportedLanguage) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, vars?: Record<string, string>): string => {
    const keys = key.split('.');
    let text: any = translations[language];
    for (const k of keys) {
      if (text && typeof text === 'object' && k in text) {
        text = text[k];
      } else {
        // Fallback to English if key not found in current language
        text = translations.en;
        for (const k_en of keys) {
          if (text && typeof text === 'object' && k_en in text) {
            text = text[k_en];
          } else {
            return `MISSING_TRANSLATION: ${key}`;
          }
        }
        break;
      }
    }

    if (typeof text === 'string') {
      if (vars) {
        for (const [varKey, varValue] of Object.entries(vars)) {
          text = text.replace(`{{${varKey}}}`, varValue);
        }
      }
      return text;
    }
    return `MISSING_TRANSLATION: ${key}`;
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    I18nContext.Provider,
    { value: { language, changeLanguage, t } },
    children
  );
};

// Hook for React components
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
