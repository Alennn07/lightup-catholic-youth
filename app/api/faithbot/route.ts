import { NextResponse } from "next/server"

const responses: Record<string, string> = {
  // Greetings and casual conversation
  "hi": "Hi there! 👋 Welcome to FaithBot! I'm so happy you're here to learn about Catholic faith. How can I help you today? Feel free to ask me anything about Catholicism, prayers, saints, or just say hello! 🙏✨",
  "hello": "Hello! 😊 It's wonderful to meet you! I'm FaithBot, your Catholic faith companion. I'm here to help you grow in your faith and answer any questions you might have. What would you like to know about today? 🌟",
  "hey": "Hey! 👋 Great to see you! I'm FaithBot and I'm here to help you explore Catholic teachings and traditions. Whether you're new to the faith or have been Catholic for years, I'd love to chat with you! What's on your mind? 💭",
  "good morning": "Good morning! 🌅 What a beautiful day to grow in faith! I'm FaithBot, ready to help you start your day with some spiritual wisdom. How can I assist you this morning? 🙏",
  "good afternoon": "Good afternoon! ☀️ I hope your day is going well! I'm FaithBot, your Catholic faith assistant. I'm here to help you learn and grow spiritually. What would you like to explore today? ✨",
  "good evening": "Good evening! 🌙 I hope you've had a blessed day! I'm FaithBot, here to help you end your day with some spiritual reflection. What questions do you have about your faith? 🕯️",
  "how are you": "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. How are you doing? I'd love to hear what brings you here or what you'd like to learn about! 🙏💙",
  "how r you": "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. How are you doing? I'd love to hear what brings you here or what you'd like to learn about! 🙏💙",
  "how are u": "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. How are you doing? I'd love to hear what brings you here or what you'd like to learn about! 🙏💙",
  "how r u": "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. How are you doing? I'd love to hear what brings you here or what you'd like to learn about! 🙏💙",
  "what's up": "Not much, just here to help you grow in faith! 😄 I'm FaithBot, your Catholic companion. I'm ready to answer questions, explain teachings, or just have a friendly chat about Catholicism. What's on your mind? 💭",
  "whats up": "Not much, just here to help you grow in faith! 😄 I'm FaithBot, your Catholic companion. I'm ready to answer questions, explain teachings, or just have a friendly chat about Catholicism. What's on your mind? 💭",
  "thanks": "You're very welcome! 🙏 I'm so glad I could help! If you have any other questions about Catholic faith, traditions, or prayers, I'm here for you. Feel free to ask anything! ✨",
  "thank you": "You're absolutely welcome! 💙 It's my joy to help you learn about Catholic faith. I'm here whenever you need guidance, explanations, or just want to chat about your spiritual journey. God bless you! 🙏",
  "bye": "Goodbye! 👋 It's been wonderful chatting with you! I hope you learned something helpful about Catholic faith today. Come back anytime - I'm always here to help you grow spiritually! God bless! 🙏✨",
  "goodbye": "Goodbye! 💙 Thank you for spending time with me today! I hope our conversation helped you in some way. Remember, I'm here whenever you want to learn more about Catholicism. Take care and God bless! 🙏",
  "see you": "See you later! 👋 I'll be here when you want to chat again! I'm always ready to help you explore Catholic faith, answer questions, or just have a friendly conversation. God bless you! 🙏✨",
  "nice to meet you": "Nice to meet you too! 😊 I'm FaithBot, and I'm so excited to be your Catholic faith companion! I'm here to help you learn, grow, and explore your faith journey. What would you like to know about today? 🌟",
  "pleasure": "The pleasure is all mine! 😊 I love helping people learn about Catholic faith and traditions. I'm here to answer your questions, explain teachings, and support you on your spiritual journey. How can I help you today? 🙏",
  
  // Encouragement and support
  "i'm sad": "I'm so sorry you're feeling sad. 😔 Remember that God loves you deeply and is always with you, even in difficult times. Prayer can be a great comfort - try talking to God about how you feel. Would you like me to tell you about some comforting prayers or Bible verses? 🙏💙",
  "im sad": "I'm so sorry you're feeling sad. 😔 Remember that God loves you deeply and is always with you, even in difficult times. Prayer can be a great comfort - try talking to God about how you feel. Would you like me to tell you about some comforting prayers or Bible verses? 🙏💙",
  "i'm worried": "I understand that worry can be really challenging. 😔 Remember what Jesus said: 'Do not worry about tomorrow' (Matthew 6:34). God is in control and He cares for you. Prayer and trust in God can help ease your worries. Would you like to learn about some prayers for peace? 🙏✨",
  "im worried": "I understand that worry can be really challenging. 😔 Remember what Jesus said: 'Do not worry about tomorrow' (Matthew 6:34). God is in control and He cares for you. Prayer and trust in God can help ease your worries. Would you like to learn about some prayers for peace? 🙏✨",
  "i need help": "I'm here to help you! 💙 Whether it's with your faith, prayers, understanding Catholic teachings, or just someone to talk to, I'm ready to assist. What kind of help do you need? I want to support you in any way I can! 🙏",
  "i'm confused": "It's totally okay to feel confused! 😊 Faith can be complex, and it's normal to have questions. I'm here to help clarify things and explain Catholic teachings in simple terms. What are you confused about? Let's figure it out together! 🤔💭",
  "im confused": "It's totally okay to feel confused! 😊 Faith can be complex, and it's normal to have questions. I'm here to help clarify things and explain Catholic teachings in simple terms. What are you confused about? Let's figure it out together! 🤔💭",
  
  // Fun and casual
  "cool": "Awesome! 😎 I'm glad you think so! I love sharing the beauty of Catholic faith with people. There's so much to discover and learn. What interests you most about Catholicism? I'd love to tell you more! ✨",
  "wow": "Right?! 😄 Catholic faith is pretty amazing when you think about it! There's so much depth, beauty, and wisdom in our traditions. What specifically wowed you? I'd love to explore that topic with you! 🌟",
  "amazing": "It really is amazing! ✨ God's love and the beauty of our faith traditions are truly incredible. I'm so happy you're discovering this! What would you like to learn more about? I'm here to help you explore the wonders of Catholicism! 🙏",
  "awesome": "Totally awesome! 😎 Catholic faith is full of amazing things to discover. I love helping people explore it! What would you like to know more about? Whether it's saints, sacraments, prayers, or traditions, I'm here to help! 🚀",
  
  "what is the eucharist":
    "The Eucharist is the most precious gift Jesus left us! 🍷✨ It's when bread and wine become Jesus' actual Body and Blood during Mass. Catholics believe this happens through transubstantiation - the substance changes while the appearance stays the same. Jesus said 'This is my body' and 'This is my blood' at the Last Supper, and He meant it literally! The Eucharist nourishes our souls and unites us with Christ and each other. It's truly the source and summit of our faith! 🙏",
  
  "who is mary":
    "Mary is our beautiful Mother in Heaven! 👑💙 She's not just Jesus' mom - she's the Mother of God (Theotokos) and our spiritual mother too! Catholics love Mary because she's the perfect example of faith and obedience. She said 'Yes' to God's plan (that's the Annunciation), gave birth to Jesus, stood at the foot of the Cross, and now intercedes for us in Heaven. We honor her with special titles like 'Queen of Heaven' and 'Mother of the Church.' She always leads us to Jesus! 🌹",
  
  "what are the sacraments":
    "The sacraments are like God's special 'power-ups' for our souls! ⚡💫 There are 7 of them: 1) Baptism (cleanses original sin), 2) Confirmation (strengthens us with the Holy Spirit), 3) Eucharist (Jesus' Body and Blood), 4) Reconciliation (forgives our sins), 5) Anointing of the Sick (healing and comfort), 6) Holy Orders (becoming a priest/deacon), and 7) Matrimony (marriage blessing). Each one gives us God's grace and helps us grow closer to Him! 🎁",
  
  "how do i pray the rosary":
    "The Rosary is like a beautiful spiritual journey with Mary! 🌹📿 Here's how: Start with the Sign of the Cross, then the Apostles' Creed. Pray 1 Our Father, 3 Hail Marys, and 1 Glory Be. Then for each mystery (Joyful, Sorrowful, Glorious, or Luminous), pray 1 Our Father, 10 Hail Marys, and 1 Glory Be. The 20 mysteries help us meditate on Jesus' life through Mary's eyes! It's perfect for quiet prayer time. Mary loves when we pray it! 🙏✨",
  
  "what is lent":
    "Lent is our 40-day spiritual boot camp! 💪⛪ It starts on Ash Wednesday (when we get ashes on our foreheads) and ends before Easter. We fast, pray more, and give to the poor (almsgiving). It's like Jesus' 40 days in the desert - a time to grow stronger spiritually! Many people give up something they love (like chocolate or social media) and add extra prayer time. The goal? To be ready to celebrate Easter with a renewed heart! 🕯️",
  
  "who is the pope":
    "The Pope is like our spiritual CEO! 👑⛪ He's the Bishop of Rome and leader of the worldwide Catholic Church. Pope Francis (elected in 2013) is our current Pope - he's known for his love of the poor and his warm personality! The Pope is the successor of Saint Peter, who Jesus called the 'rock' of the Church. He guides us in faith and morals, and Catholics believe he's protected from teaching error on faith matters. He's like our spiritual father! 🙏",
  
  "what is mass":
    "Mass is like a heavenly family reunion every Sunday! ⛪✨ It has two main parts: 1) Liturgy of the Word (we hear Bible readings and a homily), and 2) Liturgy of the Eucharist (the bread and wine become Jesus' Body and Blood). We sing, pray together, and receive Communion. It's not just a service - it's the same sacrifice Jesus made on the Cross, made present again! The word 'Mass' comes from the Latin 'Ite, missa est' meaning 'Go, you are sent' - we're sent out to share God's love! 🚀",
  
  "what is confession":
    "Confession is like a spiritual shower for your soul! 🚿💙 Also called Reconciliation, it's when we tell our sins to a priest and receive God's forgiveness. The priest acts 'in persona Christi' (in the person of Christ) and gives us absolution. It's not scary - it's actually freeing! We confess our sins, say we're sorry, and promise to try harder. The priest might give us a penance (like praying 3 Hail Marys). It's like hitting the 'reset button' on our relationship with God! 🔄✨",
  
  "what is advent":
    "Advent is like the exciting countdown to Christmas! 🎄⏰ It starts 4 Sundays before Christmas and begins the Church year. 'Advent' means 'coming' - we're preparing for Jesus' birth! We light candles on the Advent wreath (hope, peace, joy, love) and use purple candles (except the pink one on week 3 for joy). It's a time of waiting, prayer, and preparation - like Mary and Joseph getting ready for Jesus! We also remember that Jesus will come again at the end of time! 🌟",
  
  "what is easter":
    "Easter is the BIGGEST celebration of the year! 🐰✝️ It's when Jesus rose from the dead - the most amazing miracle ever! Easter Sunday is the culmination of Holy Week and the Easter Triduum. We celebrate with special Masses, beautiful flowers, and lots of joy! The Easter Vigil (Saturday night) is especially beautiful with fire, candles, and baptisms. Easter shows us that death isn't the end - Jesus conquered death and gives us eternal life! It's the foundation of our whole faith! 🎉",
  
  "what is holy week":
    "Holy Week is the most sacred week of the year! 🌿⛪ It starts with Palm Sunday (when Jesus entered Jerusalem on a donkey), includes Holy Thursday (Last Supper and washing feet), Good Friday (Jesus' crucifixion), and ends with Easter Sunday (Resurrection). The Easter Triduum (Thursday evening to Sunday) is like one big celebration. On Good Friday, we venerate the Cross and remember Jesus' sacrifice. It's a time to walk with Jesus through His final days on earth! 🙏",
  
  "what is prayer":
    "Prayer is simply talking to God like a friend! 💬💝 It's not about fancy words - it's about opening your heart to God. You can pray anywhere, anytime! Types of prayer include: 1) Adoration (praising God), 2) Contrition (saying sorry), 3) Thanksgiving (thanking God), and 4) Supplication (asking for help). The Our Father is Jesus' perfect prayer template. Prayer is like a phone call to Heaven - God always answers, even if it's not how we expect! 📞✨",
  
  "who are the saints":
    "Saints are like our spiritual superheroes! 🦸‍♀️⭐ They're people who lived holy lives and are now in Heaven with God. Some are famous (like St. Francis of Assisi or St. Therese), but many are unknown. Saints intercede for us - they pray for us to God! Each saint has a feast day, and many have special patronages (like St. Anthony for lost things, St. Jude for hopeless cases). We can ask saints to pray for us, and they're great role models for living a holy life! 🙏",
  
  "what is the bible":
    "The Bible is God's love letter to us! 📖💌 It's not just a book - it's the inspired Word of God, written by human authors but guided by the Holy Spirit. The Catholic Bible has 73 books (46 Old Testament, 27 New Testament). The Old Testament tells the story of God's people before Jesus, while the New Testament is about Jesus' life, teachings, and the early Church. We read from it at every Mass! The Bible is like a spiritual GPS - it shows us how to get to Heaven! 🗺️✨",
  
  "what is grace":
    "Grace is God's free gift of love and help! 🎁💝 It's not something we earn - it's God's unmerited favor. Grace helps us become holy and grow closer to God. There are different types: 1) Sanctifying grace (makes us holy), 2) Actual grace (helps us do good), and 3) Sacramental grace (comes from the sacraments). Think of grace like spiritual vitamins - they strengthen our souls! We can't save ourselves, but God gives us the grace we need! 💪🙏",
  
  "what is the church":
    "The Church is like our spiritual family home! 🏠⛪ It's not just a building - it's the community of all baptized Christians, with the Pope as our leader. The Church was founded by Jesus and guided by the Holy Spirit. We call it the 'Body of Christ' because we're all connected like parts of a body. The Church teaches us, gives us the sacraments, and helps us grow in faith. It's like a hospital for sinners, not a hotel for saints! We're all works in progress! 🚧✨"
}

// Intelligent response generator for any question
function generateIntelligentResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Check for greeting patterns
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return "Hello there! 👋 I'm FaithBot, your Catholic faith companion. I'm here to help you learn about Catholicism, answer questions, or just chat! What would you like to know about today? 🙏✨"
  }
  
  // Check for how are you variations
  if (lowerQuery.includes('how') && (lowerQuery.includes('are') || lowerQuery.includes('r')) && (lowerQuery.includes('you') || lowerQuery.includes('u'))) {
    return "I'm doing great, thank you for asking! 😊 I'm excited to help you learn about Catholic faith today. How are you doing? I'd love to hear what brings you here or what you'd like to learn about! 🙏💙"
  }
  
  // Check for what's up variations
  if (lowerQuery.includes('what') && (lowerQuery.includes('up') || lowerQuery.includes('s up'))) {
    return "Not much, just here to help you grow in faith! 😄 I'm FaithBot, your Catholic companion. I'm ready to answer questions, explain teachings, or just have a friendly chat about Catholicism. What's on your mind? 💭"
  }
  
  // Check for emotional states
  if (lowerQuery.includes('sad') || lowerQuery.includes('unhappy') || lowerQuery.includes('down')) {
    return "I'm so sorry you're feeling sad. 😔 Remember that God loves you deeply and is always with you, even in difficult times. Prayer can be a great comfort - try talking to God about how you feel. Would you like me to tell you about some comforting prayers or Bible verses? 🙏💙"
  }
  
  if (lowerQuery.includes('worried') || lowerQuery.includes('anxious') || lowerQuery.includes('stress')) {
    return "I understand that worry can be really challenging. 😔 Remember what Jesus said: 'Do not worry about tomorrow' (Matthew 6:34). God is in control and He cares for you. Prayer and trust in God can help ease your worries. Would you like to learn about some prayers for peace? 🙏✨"
  }
  
  if (lowerQuery.includes('confused') || lowerQuery.includes('unsure') || lowerQuery.includes('dont know')) {
    return "It's totally okay to feel confused! 😊 Faith can be complex, and it's normal to have questions. I'm here to help clarify things and explain Catholic teachings in simple terms. What are you confused about? Let's figure it out together! 🤔💭"
  }
  
  // Check for help requests
  if (lowerQuery.includes('help') || lowerQuery.includes('need') || lowerQuery.includes('assist')) {
    return "I'm here to help you! 💙 Whether it's with your faith, prayers, understanding Catholic teachings, or just someone to talk to, I'm ready to assist. What kind of help do you need? I want to support you in any way I can! 🙏"
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
    return "Prayer is simply talking to God like a friend! 💬💝 It's not about fancy words - it's about opening your heart to God. You can pray anywhere, anytime! Types of prayer include: 1) Adoration (praising God), 2) Contrition (saying sorry), 3) Thanksgiving (thanking God), and 4) Supplication (asking for help). The Our Father is Jesus' perfect prayer template. Prayer is like a phone call to Heaven - God always answers! 📞✨"
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
    return "That's a great question! 🤔 While I don't have a specific answer for that, I'd love to help you learn about Catholic faith! Here are some topics I know well:\n\n✨ **Sacraments & Worship**: Eucharist, Mass, Confession, Baptism\n🌹 **Mary & Saints**: Mary's role, praying the Rosary, patron saints\n📖 **Faith Basics**: Prayer, grace, the Church, the Bible\n⛪ **Seasons & Celebrations**: Lent, Advent, Easter, Holy Week\n\nWhat interests you most? I'm here to help you grow in your faith! 🙏💙"
  }
  
  // Default intelligent response
  return "That's interesting! 🤔 I'm FaithBot, your Catholic faith companion, and I'm here to help you learn and grow spiritually. While I might not have a specific answer for that question, I'd love to help you explore Catholic faith, answer questions about teachings and traditions, or just have a friendly chat! What would you like to know about Catholicism? 🙏✨"
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    const query = message.toLowerCase().trim()

    // First try to find an exact or close match
    for (const [keyword, response] of Object.entries(responses)) {
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
