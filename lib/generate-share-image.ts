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

    // 🎨 PREMIUM GRADIENT BACKGROUND - Multiple layers for depth
    const mainGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    mainGradient.addColorStop(0, '#0F0C29') // Deep navy
    mainGradient.addColorStop(0.3, '#24243e') // Rich purple-navy
    mainGradient.addColorStop(0.7, '#302B63') // Royal purple
    mainGradient.addColorStop(1, '#0F0C29') // Back to deep navy
    
    ctx.fillStyle = mainGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ✨ ADD PREMIUM OVERLAY PATTERNS
    // Subtle geometric pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < canvas.width; i += 60) {
      for (let j = 0; j < canvas.height; j += 60) {
        ctx.beginPath()
        ctx.arc(i, j, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 🌟 FLOATING LIGHT PARTICLES
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 3 + 1
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
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

    // 🏷️ PREMIUM BRAND SECTION
    // LightUp logo with glow effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    ctx.shadowBlur = 20
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 56px "Segoe UI", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LightUp', canvas.width / 2, 140)
    ctx.shadowBlur = 0

    // Theme badge with premium styling
    const badgeWidth = 200
    const badgeHeight = 50
    const badgeX = (canvas.width - badgeWidth) / 2
    const badgeY = 170
    
    // Badge background with gradient
    const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight)
    badgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
    badgeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
    
    ctx.fillStyle = badgeGradient
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25)
    ctx.fill()
    
    // Badge border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25)
    ctx.stroke()
    
    // Badge text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif'
    ctx.fillText(data.theme, canvas.width / 2, badgeY + 32)

    // 📖 PREMIUM BIBLE VERSE SECTION
    const verseY = 300
    const maxWidth = canvas.width * 0.85
    
    // Verse text with premium typography
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.font = 'bold 52px "Georgia", "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.lineHeight = 1.4
    
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
        y += 75
      } else {
        line = testLine
      }
    }
    ctx.fillText(line.trim(), canvas.width / 2, y)

    // Elegant reference with decorative line
    const refY = y + 100
    const refText = `— ${data.reference}`
    
    // Decorative line before reference
    const lineWidth = ctx.measureText(refText).width
    const lineX = (canvas.width - lineWidth) / 2
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(lineX - 20, refY - 20)
    ctx.lineTo(lineX + lineWidth + 20, refY - 20)
    ctx.stroke()
    
    // Reference text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 36px "Georgia", "Times New Roman", serif'
    ctx.fillText(refText, canvas.width / 2, refY)

    // 💭 PREMIUM REFLECTION SECTION
    const reflectionY = refY + 120
    
    // Reflection header with icon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif'
    ctx.fillText('💭 Reflection', canvas.width / 2, reflectionY)
    
    // Reflection text with premium styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.font = '28px "Segoe UI", Arial, sans-serif'
    ctx.lineHeight = 1.5
    
    // Word wrap for reflection
    const reflectionWords = data.reflection.split(' ')
    let reflectionLine = ''
    let reflectionYPos = reflectionY + 60
    
    for (let i = 0; i < reflectionWords.length; i++) {
      const testLine = reflectionLine + reflectionWords[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)
        reflectionLine = reflectionWords[i] + ' '
        reflectionYPos += 55
      } else {
        reflectionLine = testLine
      }
    }
    ctx.fillText(reflectionLine.trim(), canvas.width / 2, reflectionYPos)

    // 🎨 PREMIUM FOOTER SECTION
    const footerY = canvas.height - 120
    
    // Decorative line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.2, footerY - 20)
    ctx.lineTo(canvas.width * 0.8, footerY - 20)
    ctx.stroke()
    
    // Footer text with gradient
    const footerGradient = ctx.createLinearGradient(0, footerY, 0, footerY + 40)
    footerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)')
    footerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)')
    
    ctx.fillStyle = footerGradient
    ctx.font = '24px "Segoe UI", Arial, sans-serif'
    ctx.fillText('✨ Generated with LightUp', canvas.width / 2, footerY + 20)
    ctx.fillText('Share your faith journey', canvas.width / 2, footerY + 50)

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
