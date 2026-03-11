export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://pawpost.ca')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body
  if (!prompt || typeof prompt !== 'string' || prompt.length > 500) {
    return res.status(400).json({ error: 'Prompt is required (max 500 chars)' })
  }

  const fullPrompt = `High-quality professional photo for a pet business social media post. ${prompt}`

  // Try Gemini first, fall back to OpenAI DALL-E
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const parts = data.candidates?.[0]?.content?.parts || []
        const imagePart = parts.find(p => p.inlineData)
        if (imagePart) {
          return res.status(200).json({
            image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          })
        }
        console.error('Gemini returned no image data, falling back to OpenAI')
      } else {
        const errText = await response.text()
        console.error('Gemini failed, falling back to OpenAI:', response.status, errText)
      }
    } catch (err) {
      console.error('Gemini error, falling back to OpenAI:', err.message)
    }
  }

  // Fallback: OpenAI DALL-E
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return res.status(502).json({ error: 'Image generation is temporarily unavailable. Please try again later.' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenAI image error:', response.status, errText)
      return res.status(502).json({ error: 'Image generation failed. Please try again.' })
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json
    if (!b64) {
      return res.status(502).json({ error: 'No image was generated. Try a different prompt.' })
    }

    return res.status(200).json({
      image: `data:image/png;base64,${b64}`,
    })
  } catch (err) {
    console.error('OpenAI image error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
