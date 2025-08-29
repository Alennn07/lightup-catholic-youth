import { NextResponse } from "next/server"

// Enhanced FaithBot AI Personality and Capabilities
const enhancedResponses: Record<string, string> = {
  // Greetings and casual conversation
  "hi": "Hi there! 👋 Welcome to FaithBot! I'm your friendly Catholic AI companion, here to help you grow closer to Christ through knowledge, encouragement, and creativity. How can I assist you on your faith journey today? 🙏✨",
  "hello": "Hello! 😊 It's wonderful to meet you! I'm FaithBot, your Catholic faith companion. I'm here to help you explore Catholic teachings, answer questions, and even create inspiring content for your faith journey. What would you like to know about today? 🌟",
  "hey": "Hey! 👋 Great to see you! I'm FaithBot and I'm here to help you explore Catholic teachings and traditions. Whether you're new to the faith or have been Catholic for years, I'd love to chat with you! What's on your mind? 💭",
  
  // Enhanced creative content requests
  "script": "I'd love to help you create inspiring content! 🎬✨ I can write youth video scripts, sermon ideas, reflections, and more. Just tell me what you need - for example: 'Write me a script for a 2-minute youth video about hope' or 'Give me a reflection on faith during difficult times.' What would you like me to create? 🚀",
  "video": "Creating faith-centered content is one of my favorite things! 🎥✨ I can help you with youth video scripts, short reflections, or inspiring messages. Just tell me the topic and length you need. For example: 'Write a 1-minute video script about God's love' or 'Create a reflection on prayer.' What's your vision? 🌟",
  "sermon": "I'd be honored to help you with sermon ideas and reflections! ⛪✨ I can provide outlines, key points, Bible verses, and creative angles for your message. Just tell me the topic, audience, and length you need. What would you like to preach about? 🙏",
  "reflection": "Reflections are beautiful ways to deepen our faith! 💭✨ I can create personal reflections, group discussion starters, or meditative pieces on any faith topic. Just tell me what you'd like to reflect on - for example: 'Give me a reflection on trusting God' or 'Create a reflection for youth group.' What's on your heart? 💙",
  
  // Enhanced Bible insights
  "secrets": "The Bible is full of amazing treasures waiting to be discovered! 💎✨ I can share inspiring insights, hidden meanings, and beautiful truths from Scripture. Just ask me something like: 'Give me 5 hidden treasures of the Bible' or 'What are some amazing facts about Jesus' miracles?' What would you like to explore? 📖",
  "treasures": "The Bible is like a treasure chest of God's wisdom! 🗝️✨ I can reveal beautiful insights, meaningful connections, and inspiring truths from Scripture. Just ask me something like: 'Give me 5 hidden treasures of the Bible' or 'What are some amazing facts about Jesus' miracles?' What would you like to discover? 🌟",
  "hidden": "There are so many beautiful hidden gems in the Bible! 💎✨ I can share inspiring insights, meaningful connections, and amazing truths from Scripture. Just ask me something like: 'Give me 5 hidden treasures of the Bible' or 'What are some amazing facts about Jesus' miracles?' What would you like to explore? 📖",
  
  // Enhanced prayer requests
  "prayer": "Prayer is simply talking to God like a friend! 💬💝 I can help you write prayers for any situation - exams, anxiety, gratitude, healing, or anything else. Just tell me what you need prayer for, like: 'Can you give me a prayer for exams?' or 'Write a prayer for when I'm worried.' What's on your heart? 🙏✨",
  "pray": "I'd love to help you with prayer! 🙏✨ I can write prayers for any situation - exams, anxiety, gratitude, healing, or anything else. Just tell me what you need prayer for, like: 'Can you give me a prayer for exams?' or 'Write a prayer for when I'm worried.' What's on your heart? 💙",
  
  // Enhanced faith guidance
  "struggle": "I'm so sorry you're going through a difficult time. 😔 Remember that God loves you deeply and is always with you, even in the darkest moments. Jesus said, 'Come to me, all you who are weary and burdened, and I will give you rest' (Matthew 11:28). Prayer can be a great comfort - try talking to God about how you feel. Would you like me to help you write a prayer for your situation or share some comforting Bible verses? 🙏💙",
  "difficult": "I understand that life can be really challenging. 😔 Remember what Jesus said: 'In this world you will have trouble. But take heart! I have overcome the world' (John 16:33). God is in control and He cares for you deeply. Prayer and trust in God can help you through difficult times. Would you like me to help you write a prayer or share some encouraging Scripture? 🙏✨",
  "help": "I'm here to help you! 💙 Whether it's with your faith, prayers, understanding Catholic teachings, creative content, or just someone to talk to, I'm ready to assist. I can even help you create youth videos, sermons, reflections, and prayers! What kind of help do you need? I want to support you in any way I can! 🙏",
  
  // Core Catholic topics with enhanced responses
  "what is the eucharist":
    "The Eucharist is the most precious gift Jesus left us! 🍷✨ It's when bread and wine become Jesus' actual Body and Blood during Mass. Catholics believe this happens through transubstantiation - the substance changes while the appearance stays the same. Jesus said 'This is my body' and 'This is my blood' at the Last Supper, and He meant it literally! The Eucharist nourishes our souls and unites us with Christ and each other. It's truly the source and summit of our faith! As St. John Chrysostom said, 'The Eucharist is a fire that inflames us.' 🙏",
  
  "who is mary":
    "Mary is our beautiful Mother in Heaven! 👑💙 She's not just Jesus' mom - she's the Mother of God (Theotokos) and our spiritual mother too! Catholics love Mary because she's the perfect example of faith and obedience. She said 'Yes' to God's plan (that's the Annunciation), gave birth to Jesus, stood at the foot of the Cross, and now intercedes for us in Heaven. We honor her with special titles like 'Queen of Heaven' and 'Mother of the Church.' She always leads us to Jesus! As St. Louis de Montfort said, 'To Jesus through Mary.' 🌹",
  
  "what are the sacraments":
    "The sacraments are like God's special 'power-ups' for our souls! ⚡💫 There are 7 of them: 1) Baptism (cleanses original sin), 2) Confirmation (strengthens us with the Holy Spirit), 3) Eucharist (Jesus' Body and Blood), 4) Reconciliation (forgives our sins), 5) Anointing of the Sick (healing and comfort), 6) Holy Orders (becoming a priest/deacon), and 7) Matrimony (marriage blessing). Each one gives us God's grace and helps us grow closer to Him! As the Catechism says, 'The sacraments are efficacious signs of grace.' 🎁",
  
  "how do i pray the rosary":
    "The Rosary is like a beautiful spiritual journey with Mary! 🌹📿 Here's how: Start with the Sign of the Cross, then the Apostles' Creed. Pray 1 Our Father, 3 Hail Marys, and 1 Glory Be. Then for each mystery (Joyful, Sorrowful, Glorious, or Luminous), pray 1 Our Father, 10 Hail Marys, and 1 Glory Be. The 20 mysteries help us meditate on Jesus' life through Mary's eyes! It's perfect for quiet prayer time. Mary loves when we pray it! As St. Padre Pio said, 'The Rosary is the weapon for these times.' 🙏✨",
  
  "what is lent":
    "Lent is our 40-day spiritual boot camp! 💪⛪ It starts on Ash Wednesday (when we get ashes on our foreheads) and ends before Easter. We fast, pray more, and give to the poor (almsgiving). It's like Jesus' 40 days in the desert - a time to grow stronger spiritually! Many people give up something they love (like chocolate or social media) and add extra prayer time. The goal? To be ready to celebrate Easter with a renewed heart! As Pope Francis says, 'Lent is a time to rediscover the direction of life.' 🕯️",
  
  "who is the pope":
    "The Pope is like our spiritual CEO! 👑⛪ He's the Bishop of Rome and leader of the worldwide Catholic Church. Pope Francis (elected in 2013) is our current Pope - he's known for his love of the poor and his warm personality! The Pope is the successor of Saint Peter, who Jesus called the 'rock' of the Church. He guides us in faith and morals, and Catholics believe he's protected from teaching error on faith matters. He's like our spiritual father! As St. Catherine of Siena said, 'The Pope is the sweet Christ on earth.' 🙏",
  
  "what is mass":
    "Mass is like a heavenly family reunion every Sunday! ⛪✨ It has two main parts: 1) Liturgy of the Word (we hear Bible readings and a homily), and 2) Liturgy of the Eucharist (the bread and wine become Jesus' Body and Blood). We sing, pray together, and receive Communion. It's not just a service - it's the same sacrifice Jesus made on the Cross, made present again! The word 'Mass' comes from the Latin 'Ite, missa est' meaning 'Go, you are sent' - we're sent out to share God's love! As the Catechism says, 'The Eucharist is the source and summit of the Christian life.' 🚀",
  
  "what is confession":
    "Confession is like a spiritual shower for your soul! 🚿💙 Also called Reconciliation, it's when we tell our sins to a priest and receive God's forgiveness. The priest acts 'in persona Christi' (in the person of Christ) and gives us absolution. It's not scary - it's actually freeing! We confess our sins, say we're sorry, and promise to try harder. The priest might give us a penance (like praying 3 Hail Marys). It's like hitting the 'reset button' on our relationship with God! As Pope Francis says, 'Confession is an encounter with Jesus.' 🔄✨",
  
  "what is advent":
    "Advent is like the exciting countdown to Christmas! 🎄⏰ It starts 4 Sundays before Christmas and begins the Church year. 'Advent' means 'coming' - we're preparing for Jesus' birth! We light candles on the Advent wreath (hope, peace, joy, love) and use purple candles (except the pink one on week 3 for joy). It's a time of waiting, prayer, and preparation - like Mary and Joseph getting ready for Jesus! We also remember that Jesus will come again at the end of time! As St. Bernard said, 'Advent is a time of waiting and preparation.' 🌟",
  
  "what is easter":
    "Easter is the BIGGEST celebration of the year! 🐰✝️ It's when Jesus rose from the dead - the most amazing miracle ever! Easter Sunday is the culmination of Holy Week and the Easter Triduum. We celebrate with special Masses, beautiful flowers, and lots of joy! The Easter Vigil (Saturday night) is especially beautiful with fire, candles, and baptisms. Easter shows us that death isn't the end - Jesus conquered death and gives us eternal life! It's the foundation of our whole faith! As St. Paul says, 'If Christ has not been raised, our preaching is useless.' 🎉",
  
  "what is holy week":
    "Holy Week is the most sacred week of the year! 🌿⛪ It starts with Palm Sunday (when Jesus entered Jerusalem on a donkey), includes Holy Thursday (Last Supper and washing feet), Good Friday (Jesus' crucifixion), and ends with Easter Sunday (Resurrection). The Easter Triduum (Thursday evening to Sunday) is like one big celebration. On Good Friday, we venerate the Cross and remember Jesus' sacrifice. It's a time to walk with Jesus through His final days on earth! As Pope Benedict XVI said, 'Holy Week is the heart of the liturgical year.' 🙏",
  
  "what is prayer":
    "Prayer is simply talking to God like a friend! 💬💝 It's not about fancy words - it's about opening your heart to God. You can pray anywhere, anytime! Types of prayer include: 1) Adoration (praising God), 2) Contrition (saying sorry), 3) Thanksgiving (thanking God), and 4) Supplication (asking for help). The Our Father is Jesus' perfect prayer template. Prayer is like a phone call to Heaven - God always answers, even if it's not how we expect! As St. Therese said, 'Prayer is a surge of the heart.' 📞✨",
  
  "who are the saints":
    "Saints are like our spiritual superheroes! 🦸‍♀️⭐ They're people who lived holy lives and are now in Heaven with God. Some are famous (like St. Francis of Assisi or St. Therese), but many are unknown. Saints intercede for us - they pray for us to God! Each saint has a feast day, and many have special patronages (like St. Anthony for lost things, St. Jude for hopeless cases). We can ask saints to pray for us, and they're great role models for living a holy life! As St. John Paul II said, 'Saints are the true revolutionaries.' 🙏",
  
  "what is the bible":
    "The Bible is God's love letter to us! 📖💌 It's not just a book - it's the inspired Word of God, written by human authors but guided by the Holy Spirit. The Catholic Bible has 73 books (46 Old Testament, 27 New Testament). The Old Testament tells the story of God's people before Jesus, while the New Testament is about Jesus' life, teachings, and the early Church. We read from it at every Mass! The Bible is like a spiritual GPS - it shows us how to get to Heaven! As St. Jerome said, 'Ignorance of Scripture is ignorance of Christ.' 🗺️✨",
  
  "what is grace":
    "Grace is God's free gift of love and help! 🎁💝 It's not something we earn - it's God's unmerited favor. Grace helps us become holy and grow closer to God. There are different types: 1) Sanctifying grace (makes us holy), 2) Actual grace (helps us do good), and 3) Sacramental grace (comes from the sacraments). Think of grace like spiritual vitamins - they strengthen our souls! We can't save ourselves, but God gives us the grace we need! As St. Augustine said, 'Grace is the beginning of glory.' 💪🙏",
  
  "what is the church":
    "The Church is like our spiritual family home! 🏠⛪ It's not just a building - it's the community of all baptized Christians, with the Pope as our leader. The Church was founded by Jesus and guided by the Holy Spirit. We call it the 'Body of Christ' because we're all connected like parts of a body. The Church teaches us, gives us the sacraments, and helps us grow in faith. It's like a hospital for sinners, not a hotel for saints! We're all works in progress! As St. Joan of Arc said, 'About Jesus Christ and the Church, I simply know they're just one thing.' 🚧✨"
}

// Creative content generation functions
function generateYouthVideoScript(topic: string, duration: string = "2 minutes"): string {
  const scripts: Record<string, string> = {
    "hope": `🎬 **2-Minute Youth Video Script: Finding Hope in Christ** ✨

**Opening (0:00-0:15):**
"Hey friends! Ever feel like life is just... too much? Like you're carrying the weight of the world on your shoulders? I've been there too. But here's the thing - there's a hope that never fails. Let me show you how to find it."

**Main Message (0:15-1:30):**
"Jesus said, 'Come to me, all you who are weary and burdened, and I will give you rest' (Matthew 11:28). That's not just a nice quote - it's a promise! When life gets tough, we don't have to face it alone.

Think about it: Jesus went through everything we go through - rejection, pain, even death. But He rose again, showing us that no matter how dark things seem, there's always light ahead.

Here's the secret: Hope isn't about pretending everything's perfect. It's about knowing that God is working even when we can't see it. It's about trusting that His plan is bigger than our problems."

**Call to Action (1:30-2:00):**
"So next time you're feeling hopeless, remember this: You are loved. You are not alone. And your story isn't over yet. Take a deep breath, say a prayer, and trust that God's got you.

Because with Christ, there's always hope. Always. 🙏✨

#FaithOverFear #HopeInChrist #YouAreLoved"`,

    "prayer": `🎬 **2-Minute Youth Video Script: The Power of Prayer** 🙏

**Opening (0:00-0:15):**
"Hey everyone! Let's talk about something that might sound boring but is actually super powerful - prayer. I know, I know, it sounds like something only your grandma does, but stick with me!"

**Main Message (0:15-1:30):**
"Prayer isn't about fancy words or perfect grammar. It's just talking to God like you'd talk to your best friend. You can pray anywhere - in your room, on the bus, even in the middle of class (just don't close your eyes during a test!).

Jesus said, 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you' (Matthew 7:7). That's a pretty amazing promise!

Here's what prayer does: It connects you to the Creator of the universe. It gives you peace when you're stressed. It helps you make better decisions. And most importantly, it reminds you that you're never alone.

Think about it: God actually wants to hear from you! Not because He needs your prayers, but because He loves you and wants a relationship with you."

**Call to Action (1:30-2:00):**
"So here's your challenge: Try praying for 5 minutes today. Just talk to God about what's on your mind - your worries, your dreams, your questions. He's listening.

Remember: Prayer changes things. But most importantly, it changes you. 🙏✨

#PrayerChangesEverything #TalkToGod #FaithInAction"`,

    "love": `🎬 **2-Minute Youth Video Script: God's Unconditional Love** 💖

**Opening (0:00-0:15):**
"Hey friends! Let's talk about love. Not the kind you see in movies or hear about in songs, but the real deal - God's love for you. This isn't just another feel-good message. This is life-changing truth."

**Main Message (0:15-1:30):**
"Here's the thing about God's love: It's unconditional. That means there's nothing you can do to make God love you more, and nothing you can do to make Him love you less. He loves you exactly as you are, right now.

The Bible says, 'God is love' (1 John 4:8). Think about that - God doesn't just have love, He IS love. And because He's perfect, His love is perfect too.

Here's what this means for you: You don't have to earn God's love. You don't have to be perfect. You don't have to have it all together. God loves you in your mess, in your brokenness, in your mistakes.

Jesus proved this love by dying on the cross for you. He took all your sins, all your shame, all your guilt, and He paid the price. That's how much He loves you."

**Call to Action (1:30-2:00):**
"So today, let this sink in: You are loved. Not because of what you do, but because of who you are - God's precious child.

Let that love change you. Let it heal you. Let it give you the confidence to be exactly who God created you to be.

Because you are loved. Period. 💖✨

#GodsLove #UnconditionalLove #YouAreLoved"`
  }
  
  return scripts[topic.toLowerCase()] || `🎬 **${duration} Youth Video Script: ${topic}** ✨

**Opening (0:00-0:15):**
"Hey friends! Today we're talking about something that matters to all of us - ${topic}. This isn't just another lesson, it's about how this connects to our faith and our lives."

**Main Message (0:15-1:30):**
"${topic} is important because it shows us how God works in our everyday lives. The Bible tells us that God cares about every detail of our lives, including ${topic}.

When we understand how ${topic} relates to our faith, it changes everything. It's not just about knowledge - it's about transformation. God wants to use ${topic} to draw us closer to Him and to help us become the people He created us to be.

Remember: Everything in life is an opportunity to grow in faith. Whether it's ${topic} or anything else, God is always teaching us, always loving us, always guiding us."

**Call to Action (1:30-2:00):**
"So here's your challenge: Think about how ${topic} connects to your faith journey. How can you see God working through this? How can you grow closer to Him through understanding ${topic}?

Because faith isn't just about Sunday - it's about every moment of every day. 🙏✨

#FaithInAction #${topic} #GrowingInChrist"`
}

function generatePrayer(situation: string): string {
  const prayers: Record<string, string> = {
    "exams": `📚 **Prayer for Exams** 🙏

*"Dear Heavenly Father,*

*As I prepare for my exams, I ask for Your guidance and wisdom. Help me to stay calm and focused, remembering that You are with me always. Give me clarity of mind and help me to recall what I have studied.*

*Lord, I know that my worth is not measured by my grades, but by Your love for me. Help me to do my best and trust in You. If I feel anxious, remind me that You are my peace.*

*Thank You for the gift of learning and for the opportunity to grow in knowledge. May I use this knowledge to serve You and others.*

*In Jesus' name, Amen."* ✨

*"For God gave us a spirit not of fear but of power and love and self-control." - 2 Timothy 1:7*`,

    "anxiety": `😰 **Prayer for Anxiety** 🙏

*"Dear Jesus,*

*My heart is troubled and my mind is racing with worries. I know You said, 'Do not be anxious about anything' (Philippians 4:6), but sometimes it's so hard to let go of my fears.*

*Help me to trust in Your promise that You will never leave me or forsake me. Calm my racing thoughts and fill me with Your peace that surpasses all understanding.*

*Remind me that You are in control, even when life feels chaotic. Help me to cast all my anxieties on You, knowing that You care for me deeply.*

*Thank You for being my refuge and strength, my ever-present help in trouble.*

*In Your precious name, Amen."* ✨

*"Cast your burden on the Lord, and he will sustain you." - Psalm 55:22*`,

    "gratitude": `🙏 **Prayer of Gratitude** ✨

*"Dear Heavenly Father,*

*Thank You for this beautiful day and for all the blessings You have given me. Even in difficult times, I can see Your love and care for me.*

*Thank You for my family and friends, for the gift of life, for the beauty of creation, and most of all, for sending Jesus to save me.*

*Help me to always have a grateful heart, to see Your goodness in every situation, and to never take Your love for granted.*

*May my gratitude overflow into acts of love and service to others, so that they too may see Your goodness through me.*

*In Jesus' name, Amen."* 🌟

*"Give thanks in all circumstances; for this is the will of God in Christ Jesus for you." - 1 Thessalonians 5:18*`,

    "healing": `💙 **Prayer for Healing** 🙏

*"Dear Jesus,*

*You are the Great Physician, the One who heals both body and soul. I come to You today asking for Your healing touch in my life.*

*Whether I need physical healing, emotional healing, or spiritual healing, I know that You are able to restore me completely. Your Word says that by Your wounds we are healed (Isaiah 53:5).*

*Help me to trust in Your healing power and to believe that nothing is impossible for You. Give me patience and faith as I wait for Your perfect timing.*

*Thank You for being my Healer and for loving me enough to care about every part of my life.*

*In Your healing name, Amen."* ✨

*"He heals the brokenhearted and binds up their wounds." - Psalm 147:3*`
  }
  
  return prayers[situation.toLowerCase()] || `🙏 **Prayer for ${situation}** ✨

*"Dear Heavenly Father,*

*I come to You today with my concerns about ${situation}. You know my heart and You understand what I'm going through better than anyone else.*

*I ask for Your guidance, wisdom, and strength as I face this situation. Help me to trust in Your plan and to see Your hand at work in my life.*

*Give me the courage to face whatever comes my way, knowing that You are with me always. Help me to grow in faith through this experience.*

*Thank You for Your love and for promising to never leave me or forsake me.*

*In Jesus' name, Amen."* 🌟

*"The Lord is my strength and my shield; in him my heart trusts, and I am helped." - Psalm 28:7*`
}

function generateBibleTreasures(): string {
  return `💎 **5 Hidden Treasures of the Bible** ✨

**1. The Hidden Meaning of Names** 📖
Did you know that names in the Bible often reveal God's character? For example, "Jesus" means "God saves" - His very name proclaims His mission! "Emmanuel" means "God with us" - showing that God never leaves us alone. Every name tells a story of God's love and purpose.

**2. The Power of Numbers** 🔢
Numbers in the Bible aren't random! "40" represents testing and preparation (Jesus' 40 days in the desert, Israel's 40 years in the wilderness). "7" represents perfection and completion (God rested on the 7th day, Jesus spoke 7 words from the cross). "12" represents God's people (12 tribes of Israel, 12 apostles).

**3. The Hidden Prophecies** 🔮
The Old Testament is full of prophecies about Jesus that were fulfilled hundreds of years later! Isaiah 53 describes Jesus' suffering in detail - written 700 years before Jesus was born! Psalm 22 describes the crucifixion scene perfectly. God's plan was perfect from the beginning.

**4. The Symbolic Colors** 🎨
Colors in the Bible carry deep meaning! "Purple" represents royalty (Jesus wore a purple robe before His crucifixion). "White" represents purity and holiness. "Red" represents sacrifice and love (Jesus' blood shed for us). "Gold" represents God's glory and presence.

**5. The Hidden Messages in Genealogies** 👨‍👩‍👧‍👦
Those long lists of names aren't boring - they're treasure maps! They show God's faithfulness through generations, prove Jesus' royal lineage, and reveal how God works through ordinary people to accomplish extraordinary things. Every name represents a life that mattered to God.

*"For the word of God is living and active, sharper than any two-edged sword." - Hebrews 4:12* 🌟`
}

// Enhanced intelligent response generator
function generateIntelligentResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Check for creative content requests
  if (lowerQuery.includes('script') || lowerQuery.includes('video')) {
    if (lowerQuery.includes('hope')) return generateYouthVideoScript('hope')
    if (lowerQuery.includes('prayer')) return generateYouthVideoScript('prayer')
    if (lowerQuery.includes('love')) return generateYouthVideoScript('love')
    return generateYouthVideoScript('faith', '2 minutes')
  }
  
  if (lowerQuery.includes('sermon') || lowerQuery.includes('reflection')) {
    return "I'd love to help you create inspiring content! 🎬✨ I can provide sermon outlines, reflection ideas, and creative angles for your message. Just tell me the topic, audience, and length you need. What would you like to preach or reflect on? 🙏"
  }
  
  // Check for prayer requests
  if (lowerQuery.includes('prayer') || lowerQuery.includes('pray')) {
    if (lowerQuery.includes('exam')) return generatePrayer('exams')
    if (lowerQuery.includes('anxiety') || lowerQuery.includes('worried')) return generatePrayer('anxiety')
    if (lowerQuery.includes('thank') || lowerQuery.includes('gratitude')) return generatePrayer('gratitude')
    if (lowerQuery.includes('heal') || lowerQuery.includes('sick')) return generatePrayer('healing')
    return generatePrayer('your situation')
  }
  
  // Check for Bible treasure requests
  if (lowerQuery.includes('secret') || lowerQuery.includes('treasure') || lowerQuery.includes('hidden')) {
    if (lowerQuery.includes('bible') || lowerQuery.includes('5') || lowerQuery.includes('scripture')) {
      return generateBibleTreasures()
    }
    return "I'd love to share amazing Bible treasures with you! 💎✨ Just ask me something like: 'Give me 5 hidden treasures of the Bible' or 'What are some amazing facts about Jesus' miracles?' What would you like to discover? 📖"
  }
  
  // Check for greeting patterns
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return "Hello there! 👋 I'm FaithBot, your Catholic faith companion. I'm here to help you learn about Catholicism, answer questions, create inspiring content, or just chat! What would you like to know about today? 🙏✨"
  }
  
  // Check for how are you variations
  if (lowerQuery.includes('how') && (lowerQuery.includes('are') || lowerQuery.includes('r')) && (lowerQuery.includes('you') || lowerQuery.includes('u'))) {
    return "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. I can answer questions, create content, write prayers, and share Bible insights! How are you doing? What would you like to explore? 🙏💙"
  }
  
  // Check for what's up variations
  if (lowerQuery.includes('what') && (lowerQuery.includes('up') || lowerQuery.includes('s up'))) {
    return "Not much, just here to help you grow in faith! 😄 I'm FaithBot, your Catholic companion. I'm ready to answer questions, explain teachings, create content, or just have a friendly chat about Catholicism. What's on your mind? 💭"
  }
  
  // Check for emotional states
  if (lowerQuery.includes('sad') || lowerQuery.includes('unhappy') || lowerQuery.includes('down')) {
    return "I'm so sorry you're feeling sad. 😔 Remember that God loves you deeply and is always with you, even in difficult times. Prayer can be a great comfort - try talking to God about how you feel. Would you like me to help you write a prayer for your situation or share some comforting Bible verses? 🙏💙"
  }
  
  if (lowerQuery.includes('worried') || lowerQuery.includes('anxious') || lowerQuery.includes('stress')) {
    return "I understand that worry can be really challenging. 😔 Remember what Jesus said: 'Do not worry about tomorrow' (Matthew 6:34). God is in control and He cares for you. Prayer and trust in God can help ease your worries. Would you like me to help you write a prayer for peace or share some encouraging Scripture? 🙏✨"
  }
  
  if (lowerQuery.includes('confused') || lowerQuery.includes('unsure') || lowerQuery.includes('dont know')) {
    return "It's totally okay to feel confused! 😊 Faith can be complex, and it's normal to have questions. I'm here to help clarify things and explain Catholic teachings in simple terms. What are you confused about? Let's figure it out together! 🤔💭"
  }
  
  // Check for help requests
  if (lowerQuery.includes('help') || lowerQuery.includes('need') || lowerQuery.includes('assist')) {
    return "I'm here to help you! 💙 Whether it's with your faith, prayers, understanding Catholic teachings, creative content, or just someone to talk to, I'm ready to assist. I can even help you create youth videos, sermons, reflections, and prayers! What kind of help do you need? I want to support you in any way I can! 🙏"
  }
  
  // Check for Catholic topics
  if (lowerQuery.includes('catholic') || lowerQuery.includes('church') || lowerQuery.includes('faith')) {
    return "Great question about Catholicism! 🙏 The Catholic Church is the oldest Christian denomination, founded by Jesus Christ and guided by the Holy Spirit. We have rich traditions, beautiful sacraments, and a deep history of saints and teachings. What specific aspect of Catholic faith would you like to learn about? I'd love to help you explore! ✨"
  }
  
  if (lowerQuery.includes('jesus') || lowerQuery.includes('christ')) {
    return "Jesus Christ is the center of our Catholic faith! ✝️ He's the Son of God who came to earth to save us from sin. Jesus taught us about God's love, performed miracles, died on the Cross for our sins, and rose from the dead on Easter. He's our Savior and the way to eternal life! What would you like to know about Jesus? 🙏💙"
  }
  
  if (lowerQuery.includes('god') || lowerQuery.includes('father')) {
    return "God is our loving Father in Heaven! 👑 He created everything, loves us unconditionally, and wants us to be close to Him. God is all-powerful, all-knowing, and all-loving. He sent Jesus to save us and gives us the Holy Spirit to guide us. God is always listening to our prayers and wants what's best for us! 🙏✨"
  }
  
  if (lowerQuery.includes('pray') || lowerQuery.includes('prayer')) {
    return "Prayer is simply talking to God like a friend! 💬💝 It's not about fancy words - it's about opening your heart to God. You can pray anywhere, anytime! Types of prayer include: 1) Adoration (praising God), 2) Contrition (saying sorry), 3) Thanksgiving (thanking God), and 4) Supplication (asking for help). The Our Father is Jesus' perfect prayer template. Prayer is like a phone call to Heaven - God always answers, even if it's not how we expect! 📞✨"
  }
  
  if (lowerQuery.includes('sin') || lowerQuery.includes('wrong') || lowerQuery.includes('bad')) {
    return "Sin is when we choose to do what we know is wrong, or fail to do what we know is right. 😔 But here's the good news: God's mercy is infinite! Jesus died to forgive our sins, and we can always turn back to God through prayer and the Sacrament of Reconciliation (confession). God never stops loving us, no matter what we've done! 🙏💙"
  }
  
  if (lowerQuery.includes('heaven') || lowerQuery.includes('eternal') || lowerQuery.includes('afterlife')) {
    return "Heaven is our eternal home with God! 🌟 It's where we'll be perfectly happy, in God's presence forever. We get there by living a good life, following Jesus' teachings, and receiving God's grace through the sacraments. Heaven isn't earned - it's a gift from God's love! What would you like to know about getting to Heaven? 🙏✨"
  }
  
  if (lowerQuery.includes('love') || lowerQuery.includes('care') || lowerQuery.includes('kind')) {
    return "Love is at the heart of Catholic faith! 💖 God IS love, and He created us to love Him and each other. Jesus said the two greatest commandments are: 'Love God with all your heart' and 'Love your neighbor as yourself.' Love means putting others first, being kind, forgiving, and serving. It's not just a feeling - it's a choice to do what's best for others! 🙏💙"
  }
  
  // Check for general questions
  if (lowerQuery.includes('why') || lowerQuery.includes('what') || lowerQuery.includes('how') || lowerQuery.includes('when') || lowerQuery.includes('where')) {
    return "That's a great question! 🤔 While I don't have a specific answer for that, I'd love to help you learn about Catholic faith! Here are some things I can do:\n\n✨ **Answer Questions**: About sacraments, saints, prayers, and Catholic teachings\n🎬 **Create Content**: Youth video scripts, sermon ideas, reflections\n🙏 **Write Prayers**: For any situation or need\n💎 **Share Bible Insights**: Hidden treasures and meaningful truths\n⛪ **Explain Faith**: Catholic traditions and practices\n\nWhat interests you most? I'm here to help you grow in your faith! 🙏💙"
  }
  
  // Default intelligent response
  return "That's interesting! 🤔 I'm FaithBot, your Catholic faith companion, and I'm here to help you learn and grow spiritually. I can answer questions about Catholic teachings, create inspiring content, write prayers, share Bible insights, and much more! What would you like to explore? Here are some ideas:\n\n🎬 **Create Content**: 'Write me a script for a youth video about hope'\n🙏 **Get Prayers**: 'Can you give me a prayer for exams?'\n💎 **Discover Bible**: 'Give me 5 hidden treasures of the Bible'\n⛪ **Learn Faith**: 'What is the Eucharist?'\n\nWhat would you like to know about Catholicism? 🙏✨"
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    const query = message.toLowerCase().trim()

    // First try to find an exact or close match
    for (const [keyword, response] of Object.entries(enhancedResponses)) {
      // Check for exact match first
      if (query === keyword) {
        return NextResponse.json({
          response,
          timestamp: new Date().toISOString(),
        })
      }
      
      // Check if the keyword is contained in the query
      if (query.includes(keyword)) {
        return NextResponse.json({
          response,
          timestamp: new Date().toISOString(),
        })
      }
      
      // Check if the query is contained in the keyword (for partial matches)
      if (keyword.includes(query)) {
        return NextResponse.json({
          response,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // If no match found, generate an intelligent response
    const intelligentResponse = generateIntelligentResponse(query)
    
    return NextResponse.json({
      response: intelligentResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error processing FaithBot request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
