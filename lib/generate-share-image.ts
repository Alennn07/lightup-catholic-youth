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

    // 🎨 GEN-Z AESTHETIC BACKGROUND - ZERO EMPTY SPACE
    const mainGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    mainGradient.addColorStop(0, '#1a0033') // Deep purple-black
    mainGradient.addColorStop(0.15, '#2d1b69') // Rich purple
    mainGradient.addColorStop(0.35, '#4a148c') // Deep violet
    mainGradient.addColorStop(0.55, '#6a1b9a') // Vibrant purple
    mainGradient.addColorStop(0.75, '#8e24aa') // Light purple
    mainGradient.addColorStop(0.9, '#ab47bc') // Pink-purple
    mainGradient.addColorStop(1, '#ce93d8') // Light pink
    
    ctx.fillStyle = mainGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 🌈 MULTIPLE RADIAL GRADIENTS FOR DEPTH AND FULLNESS
    const radialGradient1 = ctx.createRadialGradient(
      canvas.width * 0.3, canvas.height * 0.2, 0,
      canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.8
    )
    radialGradient1.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
    radialGradient1.addColorStop(0.5, 'rgba(138, 43, 226, 0.1)')
    radialGradient1.addColorStop(1, 'rgba(0, 0, 0, 0.2)')

    ctx.fillStyle = radialGradient1
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const radialGradient2 = ctx.createRadialGradient(
      canvas.width * 0.7, canvas.height * 0.8, 0,
      canvas.width * 0.7, canvas.height * 0.8, canvas.width * 0.6
    )
    radialGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
    radialGradient2.addColorStop(0.5, 'rgba(206, 147, 216, 0.12)')
    radialGradient2.addColorStop(1, 'rgba(0, 0, 0, 0.15)')

    ctx.fillStyle = radialGradient2
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const radialGradient3 = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 0,
      canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.4
    )
    radialGradient3.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
    radialGradient3.addColorStop(0.5, 'rgba(171, 71, 188, 0.08)')
    radialGradient3.addColorStop(1, 'rgba(0, 0, 0, 0.1)')

    ctx.fillStyle = radialGradient3
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ GEN-Z AESTHETIC PATTERNS - FILL EVERY SPACE
    // Create subtle dot matrix pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < canvas.width; i += 15) {
      for (let j = 0; j < canvas.height; j += 15) {
        if (Math.random() > 0.6) {
          ctx.beginPath()
          ctx.arc(i, j, Math.random() * 1 + 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // 🌟 FLOATING GLOW ORBS - Multiple sizes and colors
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 8 + 4
      const colors = [
        'rgba(255, 255, 255, 0.1)',
        'rgba(206, 147, 216, 0.08)',
        'rgba(171, 71, 188, 0.06)',
        'rgba(142, 36, 170, 0.05)'
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, '0.03)'))
      gradient.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'))
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // 💫 SMALL TWINKLING STARS - Dense coverage
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 1.5 + 0.5
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // 🌈 ABSTRACT GEOMETRIC SHAPES - Fill empty spaces
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 10
      const rotation = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      const shapeGradient = ctx.createLinearGradient(-size, -size, size, size)
      shapeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)')
      shapeGradient.addColorStop(0.5, 'rgba(206, 147, 216, 0.03)')
      shapeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      
      ctx.fillStyle = shapeGradient
      ctx.beginPath()
      ctx.moveTo(-size/2, -size/2)
      ctx.lineTo(size/2, -size/2)
      ctx.lineTo(size/2, size/2)
      ctx.lineTo(-size/2, size/2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // 🌈 AURORA-LIKE FLOWING LINES - Fill vertical spaces
    for (let i = 0; i < 12; i++) {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height
      const colors = [
        'rgba(138, 43, 226, 0.15)',
        'rgba(206, 147, 216, 0.12)',
        'rgba(171, 71, 188, 0.1)',
        'rgba(255, 255, 255, 0.08)'
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      ctx.strokeStyle = color
      ctx.lineWidth = Math.random() * 2 + 1
      ctx.shadowColor = color
      ctx.shadowBlur = 5
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      
      for (let j = 0; j < 25; j++) {
        const x = startX + (Math.random() - 0.5) * 200
        const y = startY + j * 15 + (Math.random() - 0.5) * 20
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // 🌀 SPIRAL PATTERNS - Fill corners and edges
    for (let i = 0; i < 8; i++) {
      const centerX = Math.random() * canvas.width
      const centerY = Math.random() * canvas.height
      const maxRadius = Math.random() * 60 + 30
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(255, 255, 255, 0.03)'
      ctx.shadowBlur = 3
      ctx.beginPath()
      
      for (let angle = 0; angle < Math.PI * 3; angle += 0.1) {
        const radius = (angle / (Math.PI * 3)) * maxRadius
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        if (angle === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
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

    // 📖 GEN-Z AESTHETIC BIBLE VERSE SECTION - CENTERED & ELEGANT
    const verseY = 400
    const maxWidth = canvas.width * 0.85
    
    // Add subtle background blur effect behind verse
    const blurGradient = ctx.createRadialGradient(
      canvas.width / 2, verseY, 0,
      canvas.width / 2, verseY, canvas.width * 0.6
    )
    blurGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
    blurGradient.addColorStop(0.5, 'rgba(206, 147, 216, 0.05)')
    blurGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
    
    ctx.fillStyle = blurGradient
    ctx.roundRect(
      canvas.width * 0.1, verseY - 100,
      canvas.width * 0.8, 400,
      30
    )
    ctx.fill()

    // Add subtle border glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.shadowColor = 'rgba(255, 255, 255, 0.2)'
    ctx.shadowBlur = 10
    ctx.roundRect(
      canvas.width * 0.1, verseY - 100,
      canvas.width * 0.8, 400,
      30
    )
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Verse text with Gen-Z aesthetic typography
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.font = 'bold 64px "Georgia", "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3
    
    // Word wrap for verse with elegant spacing
    const words = data.verse.split(' ')
    let line = ''
    let y = verseY
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), canvas.width / 2, y)
        line = words[i] + ' '
        y += 75
      } else {
        line = testLine
      }
    }
    ctx.fillText(line.trim(), canvas.width / 2, y)
    ctx.shadowBlur = 0

    // Gen-Z aesthetic reference styling
    const refY = y + 100
    const refText = `— ${data.reference}`
    
    // Subtle decorative line above reference
    const lineWidth = ctx.measureText(refText).width
    const lineX = (canvas.width - lineWidth) / 2
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(lineX - 30, refY - 20)
    ctx.lineTo(lineX + lineWidth + 30, refY - 20)
    ctx.stroke()
    
    // Reference text with Gen-Z styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'italic 36px "Georgia", "Times New Roman", serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText(refText, canvas.width / 2, refY)
    ctx.shadowBlur = 0

    // 💭 ULTRA-PREMIUM REFLECTION SECTION WITH CREATIVE LAYOUT
    const reflectionY = refY + 180
    
    // Create translucent reflection card
    const reflectionCardWidth = canvas.width * 0.85
    const reflectionCardHeight = 300
    const reflectionCardX = (canvas.width - reflectionCardWidth) / 2
    const reflectionCardY = reflectionY
    
    // Reflection card background with Gen-Z aesthetic
    const reflectionGradient = ctx.createLinearGradient(reflectionCardX, reflectionCardY, reflectionCardX, reflectionCardY + reflectionCardHeight)
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
    reflectionGradient.addColorStop(0.3, 'rgba(206, 147, 216, 0.08)')
    reflectionGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.06)')
    reflectionGradient.addColorStop(1, 'rgba(171, 71, 188, 0.05)')
    
    ctx.fillStyle = reflectionGradient
    ctx.roundRect(reflectionCardX, reflectionCardY, reflectionCardWidth, reflectionCardHeight, 20)
    ctx.fill()
    
    // Reflection card border with subtle glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.shadowColor = 'rgba(255, 255, 255, 0.1)'
    ctx.shadowBlur = 8
    ctx.roundRect(reflectionCardX, reflectionCardY, reflectionCardWidth, reflectionCardHeight, 20)
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Reflection header with Gen-Z styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText('💭 Reflection', canvas.width / 2, reflectionY + 40)
    ctx.shadowBlur = 0
    
    // Reflection text with Gen-Z styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = '26px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    
    // Word wrap for reflection
    const reflectionWords = data.reflection.split(' ')
    let reflectionLine = ''
    let reflectionYPos = reflectionY + 80
    
    for (let i = 0; i < reflectionWords.length; i++) {
      const testLine = reflectionLine + reflectionWords[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)
        reflectionLine = reflectionWords[i] + ' '
        reflectionYPos += 50
      } else {
        reflectionLine = testLine
      }
    }
    ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)
    ctx.shadowBlur = 0

    // 🎨 ELEGANT BACKGROUND ELEMENTS - READABLE & BEAUTIFUL
    
    // Add subtle floating geometric shapes (reduced opacity for readability)
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 30 + 15
      const rotation = Math.random() * Math.PI * 2
      
      // Create subtle gradient for each shape
      const shapeGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      shapeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
      shapeGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.03)')
      shapeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      
      ctx.fillStyle = shapeGradient
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
    
    // Add subtle floating circles (reduced opacity)
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 40 + 20
      
      const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
      circleGradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.05)')
      circleGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)')
      circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      
      ctx.fillStyle = circleGradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Add subtle floating triangles (reduced opacity)
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 35 + 20
      const rotation = Math.random() * Math.PI * 2
      
      const triangleGradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size)
      triangleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)')
      triangleGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.04)')
      triangleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)')
      
      ctx.fillStyle = triangleGradient
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(-size * 0.866, size * 0.5)
      ctx.lineTo(size * 0.866, size * 0.5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    
    // Add subtle flowing energy lines (reduced for readability)
    for (let i = 0; i < 4; i++) {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height
      
      // Create subtle gradient for each line
      const lineGradient = ctx.createLinearGradient(startX, startY, startX + 200, startY + 200)
      lineGradient.addColorStop(0, 'rgba(138, 43, 226, 0.15)')
      lineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      lineGradient.addColorStop(1, 'rgba(138, 43, 226, 0.08)')
      
      ctx.strokeStyle = lineGradient
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(138, 43, 226, 0.1)'
      ctx.shadowBlur = 3
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      
      for (let j = 0; j < 10; j++) {
        const x = startX + (Math.random() - 0.5) * 150
        const y = startY + j * 15 + (Math.random() - 0.5) * 20
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    
    // Add subtle spiral patterns (reduced for readability)
    for (let i = 0; i < 3; i++) {
      const centerX = Math.random() * canvas.width
      const centerY = Math.random() * canvas.height
      const maxRadius = Math.random() * 60 + 30
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(255, 255, 255, 0.05)'
      ctx.shadowBlur = 3
      ctx.beginPath()
      
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const radius = (angle / (Math.PI * 2)) * maxRadius
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        if (angle === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    
    // Add subtle hexagonal patterns (reduced for readability)
    for (let i = 0; i < 4; i++) {
      const centerX = Math.random() * canvas.width
      const centerY = Math.random() * canvas.height
      const size = Math.random() * 50 + 25
      
      const hexGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size)
      hexGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)')
      hexGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.02)')
      hexGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      
      ctx.fillStyle = hexGradient
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      
      for (let j = 0; j < 6; j++) {
        const angle = (j * Math.PI) / 3
        const x = centerX + Math.cos(angle) * size
        const y = centerY + Math.sin(angle) * size
        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    
    // Add subtle floating text elements (reduced for readability)
    const floatingTexts = ["FAITH", "HOPE", "LOVE"]
    for (let i = 0; i < 3; i++) {
      const text = floatingTexts[i]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 15
      const rotation = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.font = `bold ${size}px "Segoe UI", Arial, sans-serif`
      ctx.shadowColor = 'rgba(255, 255, 255, 0.05)'
      ctx.shadowBlur = 3
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
    
    // Add subtle decorative corner elements (reduced for readability)
    const cornerSize = 40
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.05)'
    ctx.shadowBlur = 3
    
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
    ctx.shadowBlur = 0
    
    // Add subtle floating cross patterns (reduced for readability)
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 30 + 20
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(255, 255, 255, 0.03)'
      ctx.shadowBlur = 2
      
      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(x - size, y)
      ctx.lineTo(x + size, y)
      ctx.stroke()
      
      // Vertical line
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x, y + size)
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    
    // Add subtle floating diamond patterns (reduced for readability)
    for (let i = 0; i < 4; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 25 + 15
      
      const diamondGradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size)
      diamondGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)')
      diamondGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.02)')
      diamondGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      
      ctx.fillStyle = diamondGradient
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    
    // Add subtle floating star patterns (reduced for readability)
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 10
      const points = 5
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(255, 255, 255, 0.02)'
      ctx.shadowBlur = 2
      ctx.beginPath()
      
      for (let j = 0; j < points * 2; j++) {
        const angle = (j * Math.PI) / points
        const radius = j % 2 === 0 ? size : size * 0.5
        const starX = x + Math.cos(angle) * radius
        const starY = y + Math.sin(angle) * radius
        if (j === 0) {
          ctx.moveTo(starX, starY)
        } else {
          ctx.lineTo(starX, starY)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    
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
    
    // Gen-Z stylish footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 8
    ctx.fillText('✨ Generated with LightUp', canvas.width / 2, footerY + 25)
    ctx.shadowBlur = 0
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '20px "Segoe UI", Arial, sans-serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fillText('Share your faith journey', canvas.width / 2, footerY + 50)
    ctx.shadowBlur = 0

    // 🌟 ADDITIONAL GEN-Z AESTHETIC ELEMENTS - FILL REMAINING SPACES
    
    // Add floating hearts and spiritual symbols
    const symbols = ['💜', '✨', '🌟', '💫', '🕊️', '🙏']
    for (let i = 0; i < 15; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 15
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.font = `${size}px Arial`
      ctx.shadowColor = 'rgba(255, 255, 255, 0.2)'
      ctx.shadowBlur = 5
      ctx.fillText(symbol, x, y)
      ctx.shadowBlur = 0
    }
    
    // Add subtle wave patterns
    for (let i = 0; i < 6; i++) {
      const startY = Math.random() * canvas.height
      const amplitude = Math.random() * 20 + 10
      const frequency = Math.random() * 0.02 + 0.01
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.shadowColor = 'rgba(255, 255, 255, 0.1)'
      ctx.shadowBlur = 3
      ctx.beginPath()
      
      for (let x = 0; x < canvas.width; x += 2) {
        const y = startY + Math.sin(x * frequency) * amplitude
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    
    // Add floating particles with different sizes
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 3 + 1
      const opacity = Math.random() * 0.3 + 0.1
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

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
