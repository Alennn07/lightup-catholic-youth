export interface ShareImageData {
  verse: string
  reference: string
  reflection: string
  theme: string
}

export async function generateShareImage(data: ShareImageData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    // Set canvas dimensions (Instagram story size - optimized for mobile)
    canvas.width = 1080
    canvas.height = 1920

    // Add roundRect polyfill for older browsers
    if (!ctx.roundRect) {
      ctx.roundRect = function(x: number, y: number, width: number, height: number, radius: number) {
        this.beginPath()
        this.moveTo(x + radius, y)
        this.lineTo(x + width - radius, y)
        this.quadraticCurveTo(x + width, y, x + width, y + radius)
        this.lineTo(x + width, y + height - radius)
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        this.lineTo(x + radius, y + height)
        this.quadraticCurveTo(x, y + height, x, y + height - radius)
        this.lineTo(x, y + radius)
        this.quadraticCurveTo(x, y, x + radius, y)
        this.closePath()
      }
    }

    // 🎨 ULTRA-PREMIUM GRADIENT BACKGROUND - Multiple complex layers
    const mainGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    mainGradient.addColorStop(0, '#0a0a0a') // Deepest black
    mainGradient.addColorStop(0.2, '#1a0b2e') // Deep purple-black
    mainGradient.addColorStop(0.4, '#16213e') // Navy blue
    mainGradient.addColorStop(0.6, '#0f3460') // Rich blue
    mainGradient.addColorStop(0.8, '#533483') // Royal purple
    mainGradient.addColorStop(1, '#0a0a0a') // Back to deepest black
    
    ctx.fillStyle = mainGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 🌌 ADD COSMIC BACKGROUND PATTERNS
    // Create a radial gradient for cosmic effect
    const cosmicGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width)
    cosmicGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
    cosmicGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.05)')
    cosmicGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
    
    ctx.fillStyle = cosmicGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ ULTRA-PREMIUM COSMIC PATTERNS
    // Create constellation-like patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        if (Math.random() > 0.7) {
          ctx.beginPath()
          ctx.arc(i, j, Math.random() * 2 + 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // 🌟 ADVANCED FLOATING LIGHT PARTICLES - Multiple layers
    // Large glowing particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 4 + 2
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Small twinkling stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 1.5 + 0.5
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // 🌈 ADD AURORA-LIKE EFFECTS
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)'
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height * 0.3
      ctx.moveTo(startX, startY)
      for (let j = 0; j < 20; j++) {
        const x = startX + (Math.random() - 0.5) * 100
        const y = startY + j * 20 + (Math.random() - 0.5) * 30
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // 🎭 PREMIUM DECORATIVE ELEMENTS
    // Large floating orbs with gradient
    const orbGradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 200)
    orbGradient1.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
    orbGradient1.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)')
    orbGradient1.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = orbGradient1
    ctx.beginPath()
    ctx.arc(canvas.width * 0.85, canvas.height * 0.15, 200, 0, Math.PI * 2)
    ctx.fill()

    const orbGradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 150)
    orbGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
    orbGradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)')
    orbGradient2.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = orbGradient2
    ctx.beginPath()
    ctx.arc(canvas.width * 0.15, canvas.height * 0.85, 150, 0, Math.PI * 2)
    ctx.fill()

    // 🌿 ELEGANT BRANCH DECORATION
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.05, canvas.height * 0.25)
    ctx.quadraticCurveTo(canvas.width * 0.25, canvas.height * 0.15, canvas.width * 0.35, canvas.height * 0.35)
    ctx.quadraticCurveTo(canvas.width * 0.45, canvas.height * 0.55, canvas.width * 0.55, canvas.height * 0.45)
    ctx.quadraticCurveTo(canvas.width * 0.65, canvas.height * 0.35, canvas.width * 0.75, canvas.height * 0.55)
    ctx.stroke()

    // Add delicate leaves
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    const leaves = [
      { x: canvas.width * 0.3, y: canvas.height * 0.2, size: 8, angle: Math.PI / 4 },
      { x: canvas.width * 0.5, y: canvas.height * 0.4, size: 6, angle: -Math.PI / 6 },
      { x: canvas.width * 0.7, y: canvas.height * 0.5, size: 7, angle: Math.PI / 3 }
    ]
    
    leaves.forEach(leaf => {
      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.angle)
      ctx.beginPath()
      ctx.ellipse(0, 0, leaf.size, leaf.size * 1.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // 🏷️ ULTRA-PREMIUM BRAND SECTION
    // LightUp logo with multiple glow effects
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
    ctx.shadowBlur = 30
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LightUp', canvas.width / 2, 160)
    
    // Add secondary glow
    ctx.shadowColor = 'rgba(138, 43, 226, 0.4)'
    ctx.shadowBlur = 40
    ctx.fillText('LightUp', canvas.width / 2, 160)
    ctx.shadowBlur = 0

    // Theme badge with ultra-premium styling
    const badgeWidth = 250
    const badgeHeight = 60
    const badgeX = (canvas.width - badgeWidth) / 2
    const badgeY = 190
    
    // Badge background with complex gradient
    const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight)
    badgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
    badgeGradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.2)')
    badgeGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)')
    badgeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
    
    ctx.fillStyle = badgeGradient
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 30)
    ctx.fill()
    
    // Badge border with glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 10
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 30)
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Badge text with glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 5
    ctx.fillText(data.theme, canvas.width / 2, badgeY + 38)
    ctx.shadowBlur = 0

    // 📖 ULTRA-PREMIUM BIBLE VERSE SECTION WITH CREATIVE LAYOUT
    const verseY = 320
    const maxWidth = canvas.width * 0.9
    
    // Add decorative frame around verse
    const framePadding = 40
    const frameX = (canvas.width - maxWidth - framePadding * 2) / 2
    const frameY = verseY - 60
    const frameWidth = maxWidth + framePadding * 2
    const frameHeight = 400
    
    // Frame background with gradient
    const frameGradient = ctx.createLinearGradient(frameX, frameY, frameX, frameY + frameHeight)
    frameGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
    frameGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.1)')
    frameGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)')
    
    ctx.fillStyle = frameGradient
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20)
    ctx.fill()
    
    // Frame border with glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 15
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20)
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Verse text with ultra-premium typography and glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.font = 'bold 58px "Georgia", "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 10
    
    // Word wrap for verse with better spacing
    const words = data.verse.split(' ')
    let line = ''
    let y = verseY
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), canvas.width / 2, y)
        line = words[i] + ' '
        y += 85
      } else {
        line = testLine
      }
    }
    ctx.fillText(line.trim(), canvas.width / 2, y)
    ctx.shadowBlur = 0

    // Elegant reference with ultra-premium styling
    const refY = y + 120
    const refText = `— ${data.reference}`
    
    // Decorative elements around reference
    const lineWidth = ctx.measureText(refText).width
    const lineX = (canvas.width - lineWidth) / 2
    
    // Multiple decorative lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(lineX - 40, refY - 30)
    ctx.lineTo(lineX + lineWidth + 40, refY - 30)
    ctx.stroke()
    
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(lineX - 30, refY - 25)
    ctx.lineTo(lineX + lineWidth + 30, refY - 25)
    ctx.stroke()
    
    // Reference text with glow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 42px "Georgia", "Times New Roman", serif'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)'
    ctx.shadowBlur = 8
    ctx.fillText(refText, canvas.width / 2, refY)
    ctx.shadowBlur = 0

    // 💭 ULTRA-PREMIUM REFLECTION SECTION WITH CREATIVE LAYOUT
    const reflectionY = refY + 180
    
    // Create reflection card with premium styling
    const reflectionCardWidth = canvas.width * 0.9
    const reflectionCardHeight = 280
    const reflectionCardX = (canvas.width - reflectionCardWidth) / 2
    const reflectionCardY = reflectionY - 20
    
    // Reflection card background with complex gradient
    const reflectionGradient = ctx.createLinearGradient(reflectionCardX, reflectionCardY, reflectionCardX, reflectionCardY + reflectionCardHeight)
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
    reflectionGradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.15)')
    reflectionGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)')
    reflectionGradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)')
    
    ctx.fillStyle = reflectionGradient
    ctx.roundRect(reflectionCardX, reflectionCardY, reflectionCardWidth, reflectionCardHeight, 25)
    ctx.fill()
    
    // Reflection card border with glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.2)'
    ctx.shadowBlur = 20
    ctx.roundRect(reflectionCardX, reflectionCardY, reflectionCardWidth, reflectionCardHeight, 25)
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Reflection header with ultra-premium styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)'
    ctx.shadowBlur = 8
    ctx.fillText('💭 Reflection', canvas.width / 2, reflectionY + 40)
    ctx.shadowBlur = 0
    
    // Reflection text with premium styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = '32px "Segoe UI", Arial, sans-serif'
    ctx.lineHeight = 1.6
    
    // Word wrap for reflection
    const reflectionWords = data.reflection.split(' ')
    let reflectionLine = ''
    let reflectionYPos = reflectionY + 90
    
    for (let i = 0; i < reflectionWords.length; i++) {
      const testLine = reflectionLine + reflectionWords[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)
        reflectionLine = reflectionWords[i] + ' '
        reflectionYPos += 65
      } else {
        reflectionLine = testLine
      }
    }
    ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)

    // 🎨 ULTRA-PREMIUM CREATIVE ELEMENTS TO FILL SPACE
    
    // Add floating geometric shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 10
      const rotation = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.moveTo(-size/2, -size/2)
      ctx.lineTo(size/2, -size/2)
      ctx.lineTo(size/2, size/2)
      ctx.lineTo(-size/2, size/2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    
    // Add flowing energy lines
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)'
    ctx.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height * 0.3 + canvas.height * 0.7
      ctx.moveTo(startX, startY)
      
      for (let j = 0; j < 15; j++) {
        const x = startX + (Math.random() - 0.5) * 200
        const y = startY + j * 15 + (Math.random() - 0.5) * 20
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    
    // Add inspirational quote section
    const quoteY = reflectionY + 350
    const inspirationalQuotes = [
      "Faith moves mountains",
      "With God, all things are possible",
      "Trust in the Lord with all your heart",
      "Be still and know that I am God"
    ]
    
    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
    
    // Quote background
    const quoteWidth = canvas.width * 0.8
    const quoteHeight = 80
    const quoteX = (canvas.width - quoteWidth) / 2
    
    const quoteGradient = ctx.createLinearGradient(quoteX, quoteY, quoteX, quoteY + quoteHeight)
    quoteGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
    quoteGradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)')
    
    ctx.fillStyle = quoteGradient
    ctx.roundRect(quoteX, quoteY, quoteWidth, quoteHeight, 15)
    ctx.fill()
    
    // Quote text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = 'italic 28px "Georgia", "Times New Roman", serif'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 5
    ctx.fillText(`"${randomQuote}"`, canvas.width / 2, quoteY + 50)
    ctx.shadowBlur = 0
    
    // Add decorative corner elements
    const cornerSize = 60
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 3
    
    // Top-left corner
    ctx.beginPath()
    ctx.moveTo(30, 30)
    ctx.lineTo(30 + cornerSize, 30)
    ctx.lineTo(30, 30 + cornerSize)
    ctx.stroke()
    
    // Top-right corner
    ctx.beginPath()
    ctx.moveTo(canvas.width - 30, 30)
    ctx.lineTo(canvas.width - 30 - cornerSize, 30)
    ctx.lineTo(canvas.width - 30, 30 + cornerSize)
    ctx.stroke()
    
    // Bottom-left corner
    ctx.beginPath()
    ctx.moveTo(30, canvas.height - 30)
    ctx.lineTo(30 + cornerSize, canvas.height - 30)
    ctx.lineTo(30, canvas.height - 30 - cornerSize)
    ctx.stroke()
    
    // Bottom-right corner
    ctx.beginPath()
    ctx.moveTo(canvas.width - 30, canvas.height - 30)
    ctx.lineTo(canvas.width - 30 - cornerSize, canvas.height - 30)
    ctx.lineTo(canvas.width - 30, canvas.height - 30 - cornerSize)
    ctx.stroke()
    
    // 🎨 ULTRA-PREMIUM FOOTER SECTION
    const footerY = canvas.height - 100
    
    // Footer background with gradient
    const footerGradient = ctx.createLinearGradient(0, footerY - 20, 0, canvas.height)
    footerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
    footerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
    
    ctx.fillStyle = footerGradient
    ctx.fillRect(0, footerY - 20, canvas.width, canvas.height - footerY + 20)
    
    // Decorative line with glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.2)'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.2, footerY - 10)
    ctx.lineTo(canvas.width * 0.8, footerY - 10)
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Footer text with ultra-premium styling
    const footerTextGradient = ctx.createLinearGradient(0, footerY, 0, footerY + 40)
    footerTextGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
    footerTextGradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)')
    
    ctx.fillStyle = footerTextGradient
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 8
    ctx.fillText('✨ Generated with LightUp', canvas.width / 2, footerY + 25)
    ctx.shadowBlur = 0
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '24px "Segoe UI", Arial, sans-serif'
    ctx.fillText('Share your faith journey', canvas.width / 2, footerY + 55)

    // Convert to blob with high quality
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to generate image'))
      }
    }, 'image/png', 1.0)
  })
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
