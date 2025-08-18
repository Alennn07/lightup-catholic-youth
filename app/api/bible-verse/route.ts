import { NextResponse } from "next/server"

// Youth-focused Bible verses with daily rotation
const YOUTH_VERSES = [
  // Monday - Identity & Self-Worth
  {
    verse: "For you created my inmost being; you knit me together in my mother's womb. I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    reference: "Psalm 139:13-14",
    reflection: "You are not an accident or a mistake. God carefully designed every part of you - your personality, talents, and even your struggles. Today, remember that you are God's masterpiece, created for a purpose. What makes you uniquely you?",
    category: "identity",
    dayOfWeek: 1
  },
  // Tuesday - Peer Pressure & Standing Strong
  {
    verse: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
    reference: "Romans 12:2",
    reflection: "It's hard to be different when everyone around you is doing the same thing. But God calls you to stand out, not blend in. Your faith is your superpower. What situation today will test your courage to be different?",
    category: "peer-pressure",
    dayOfWeek: 2
  },
  // Wednesday - Anxiety & Worry
  {
    verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7",
    reflection: "Anxiety is like carrying a backpack full of rocks - it weighs you down and makes everything harder. God wants to carry that burden for you. What's worrying you today? Write it down and give it to God in prayer.",
    category: "anxiety",
    dayOfWeek: 3
  },
  // Thursday - Friendship & Relationships
  {
    verse: "A friend loves at all times, and a brother is born for a time of adversity.",
    reference: "Proverbs 17:17",
    reflection: "True friends stick with you through the good times and the bad. They're the ones who celebrate your victories and pick you up when you fall. Are you being that kind of friend to others? And do you have friends like that?",
    category: "friendship",
    dayOfWeek: 4
  },
  // Friday - Future & Dreams
  {
    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    reflection: "Your future isn't written in stone - it's written in God's heart. He has amazing plans for you that are bigger than your biggest dreams. What's your biggest dream? Have you talked to God about it lately?",
    category: "future",
    dayOfWeek: 5
  },
  // Saturday - Courage & Overcoming Fear
  {
    verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    reflection: "Courage isn't the absence of fear - it's feeling afraid and doing it anyway. God promises to be with you in every scary situation. What's something you're afraid of that you need to face? Remember, you're not alone.",
    category: "courage",
    dayOfWeek: 6
  },
  // Sunday - Faith & Trust
  {
    verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    reflection: "Sometimes life feels like a maze with no way out. But God sees the whole picture and knows the best path for you. Trust Him even when you can't see the next step. What decision are you struggling with today?",
    category: "trust",
    dayOfWeek: 0
  }
]

// Additional verses for variety (used when day-specific verse is already shown)
const EXTRA_VERSES = [
  {
    verse: "Let no one despise you for your youth, but set the believers an example in speech, in conduct, in love, in faith, in purity.",
    reference: "1 Timothy 4:12",
    reflection: "Being young doesn't mean you can't make a difference. In fact, your youth is your advantage - you have energy, passion, and fresh perspectives that the world needs. How can you be an example to others today?",
    category: "leadership"
  },
  {
    verse: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    reflection: "You don't have to face your challenges alone. God gives you the strength you need for whatever comes your way. What challenge are you facing that feels too big for you? Remember, with God, nothing is impossible.",
    category: "strength"
  },
  {
    verse: "Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.",
    reference: "Psalm 55:22",
    reflection: "Life can feel overwhelming sometimes - school stress, relationship drama, family issues. But you don't have to carry it all. God wants to carry your burdens. What's weighing you down today? Give it to Him.",
    category: "burdens"
  },
  {
    verse: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3",
    reflection: "In our busy, noisy world, it's easy to forget to rest. But God knows you need quiet moments to refresh your soul. Take time today to be still, breathe, and remember that God is taking care of you.",
    category: "rest"
  },
  {
    verse: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
    reference: "1 Corinthians 13:4-5",
    reflection: "Real love isn't just a feeling - it's a choice to be patient, kind, and forgiving. Think about your relationships today. Are you showing this kind of love to your friends, family, and even people who are hard to love?",
    category: "love"
  }
]

export async function GET() {
  try {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const dateString = today.toISOString().split("T")[0]
    
    // Get the verse for today's day of the week
    let todaysVerse = YOUTH_VERSES.find(v => v.dayOfWeek === dayOfWeek)
    
    // If no specific day verse, use a random one from the main collection
    if (!todaysVerse) {
      todaysVerse = YOUTH_VERSES[Math.floor(Math.random() * YOUTH_VERSES.length)]
    }
    
    // Add some variety by occasionally mixing in extra verses
    const shouldUseExtraVerse = Math.random() < 0.3 // 30% chance
    if (shouldUseExtraVerse) {
      const extraVerse = EXTRA_VERSES[Math.floor(Math.random() * EXTRA_VERSES.length)]
      todaysVerse = { ...extraVerse, dayOfWeek: dayOfWeek }
    }
    
    // Add daily timestamp for tracking
    const verseWithDate = {
      ...todaysVerse,
      date: dateString,
      dayOfWeek: dayOfWeek,
      timestamp: today.toISOString()
    }
    
    return NextResponse.json(verseWithDate)
  } catch (error: any) {
    console.error("Error fetching bible verse:", error)
    
    // Fallback verse if something goes wrong
    const fallbackVerse = {
      verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16",
      reflection: "No matter what you're going through today, remember this: God loves you more than you can imagine. His love is constant, unconditional, and never-ending. You are never alone.",
      category: "love",
      date: new Date().toISOString().split("T")[0],
      dayOfWeek: new Date().getDay(),
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(fallbackVerse)
  }
}
