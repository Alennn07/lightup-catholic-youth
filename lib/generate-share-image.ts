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

    // Set canvas dimensions (Instagram story size)
    canvas.width = 1080
    canvas.height = 1920

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1e3a8a') // Dark blue
    gradient.addColorStop(0.5, '#3b82f6') // Blue
    gradient.addColorStop(1, '#8b5cf6') // Purple
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.fillRect(i, j, 2, 2)
      }
    }

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 150, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(canvas.width * 0.2, canvas.height * 0.8, 100, 0, Math.PI * 2)
    ctx.fill()

    // Add branch-like decorative element (simplified)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3)
    ctx.quadraticCurveTo(canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.4)
    ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.6, canvas.width * 0.6, canvas.height * 0.5)
    ctx.stroke()

    // Add small leaves
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.35, canvas.height * 0.25, 8, 15, Math.PI / 4, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.55, canvas.height * 0.45, 6, 12, -Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()

    // Add logo/brand
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LightUp', canvas.width / 2, 120)

    // Add theme badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(canvas.width / 2 - 80, 140, 160, 40)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText(data.theme, canvas.width / 2, 165)

    // Add bible verse
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.textAlign = 'center'
    
    // Word wrap for verse
    const maxWidth = canvas.width * 0.8
    const words = data.verse.split(' ')
    let line = ''
    let y = 400
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, canvas.width / 2, y)
        line = words[i] + ' '
        y += 70
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, canvas.width / 2, y)

    // Add reference
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = 'bold 36px Arial, sans-serif'
    ctx.fillText(`— ${data.reference}`, canvas.width / 2, y + 80)

    // Add reflection section
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 32px Arial, sans-serif'
    ctx.fillText('Reflection', canvas.width / 2, y + 160)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '28px Arial, sans-serif'
    
    // Word wrap for reflection
    const reflectionWords = data.reflection.split(' ')
    let reflectionLine = ''
    let reflectionY = y + 200
    
    for (let i = 0; i < reflectionWords.length; i++) {
      const testLine = reflectionLine + reflectionWords[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(reflectionLine, canvas.width / 2, reflectionY)
        reflectionLine = reflectionWords[i] + ' '
        reflectionY += 50
      } else {
        reflectionLine = testLine
      }
    }
    ctx.fillText(reflectionLine, canvas.width / 2, reflectionY)

    // Add footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Generated with LightUp', canvas.width / 2, canvas.height - 80)
    ctx.fillText('Share your faith journey', canvas.width / 2, canvas.height - 50)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to generate image'))
      }
    }, 'image/png', 0.9)
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
