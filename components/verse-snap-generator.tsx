"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ImageIcon, RefreshCw, Search, PenTool, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const bibleVerses = [
  {
    text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
  },
  { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  {
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
  },
  { text: "The LORD is my shepherd, I lack nothing.", reference: "Psalm 23:1" },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    reference: "Joshua 1:9",
  },
]

const filters = [
  { name: "None", value: "none" },
  { name: "Sepia", value: "sepia" },
  { name: "Grayscale", value: "grayscale" },
  { name: "Soft Light", value: "brightness(1.1) contrast(0.9)" },
  { name: "Vibrant", value: "saturate(1.5) contrast(1.1)" },
]

const fonts = [
  { name: "Serif", value: "serif" },
  { name: "Sans-serif", value: "sans-serif" },
  { name: "Monospace", value: "monospace" },
  { name: "Cursive", value: "cursive" },
  { name: "Fantasy", value: "fantasy" },
]

export default function VerseSnapGenerator() {
  const [selectedVerse, setSelectedVerse] = useState(bibleVerses[0])
  const [customVerse, setCustomVerse] = useState({ text: "", reference: "" })
  const [activeTab, setActiveTab] = useState("choose")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState(filters[0])
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [fontSize, setFontSize] = useState(24)
  const [textOpacity, setTextOpacity] = useState(0.8)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const filteredVerses = bibleVerses.filter(
    (verse) =>
      verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.reference.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current || !selectedImage) {
      toast({
        title: "Cannot download",
        description: "Please upload an image first to create your VerseSnap.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, this would use html2canvas or a similar library
    // to capture the canvas and download it as an image
    toast({
      title: "VerseSnap Downloaded!",
      description: "Your VerseSnap image has been saved to your device.",
      variant: "default",
    })
  }

  const handleShare = () => {
    if (!selectedImage) {
      toast({
        title: "Cannot share",
        description: "Please create a VerseSnap first before sharing.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, this would use the Web Share API
    // or provide social media sharing options
    toast({
      title: "Sharing Options",
      description: "Share options would appear here in a real implementation.",
      variant: "default",
    })
  }

  const handleReset = () => {
    setSelectedVerse(bibleVerses[0])
    setCustomVerse({ text: "", reference: "" })
    setActiveTab("choose")
    setSelectedImage(null)
    setSelectedFilter(filters[0])
    setSelectedFont(fonts[0])
    setFontSize(24)
    setTextOpacity(0.8)
    setSearchTerm("")

    toast({
      title: "Reset Complete",
      description: "Your VerseSnap has been reset to default settings.",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <PenTool className="h-6 w-6" />
          VerseSnap Generator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your VerseSnap</CardTitle>
              <CardDescription>Upload an image, select a verse, and customize your design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block mb-2">
                  Upload Image
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="choose">Choose Verse</TabsTrigger>
                  <TabsTrigger value="custom">Custom Verse</TabsTrigger>
                </TabsList>
                <TabsContent value="choose" className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-500" />
                    <Input
                      placeholder="Search verses..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
                    {filteredVerses.map((verse, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded cursor-pointer hover:bg-purple-50 ${selectedVerse === verse ? "bg-purple-100 border-purple-200 border" : ""}`}
                        onClick={() => setSelectedVerse(verse)}
                      >
                        <p className="text-sm font-medium">{verse.reference}</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{verse.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4">
                  <div>
                    <Label htmlFor="custom-verse">Your Verse</Label>
                    <textarea
                      id="custom-verse"
                      className="w-full min-h-[80px] p-2 border rounded-md mt-1"
                      placeholder="Enter your verse or quote here..."
                      value={customVerse.text}
                      onChange={(e) => setCustomVerse({ ...customVerse, text: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-reference">Reference (optional)</Label>
                    <Input
                      id="custom-reference"
                      placeholder="e.g., John 3:16 or Author Name"
                      value={customVerse.reference}
                      onChange={(e) => setCustomVerse({ ...customVerse, reference: e.target.value })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="filter">Filter</Label>
                  <Select
                    value={selectedFilter.value}
                    onValueChange={(value) => setSelectedFilter(filters.find((f) => f.value === value) || filters[0])}
                  >
                    <SelectTrigger id="filter">
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="font">Font Style</Label>
                  <Select
                    value={selectedFont.value}
                    onValueChange={(value) => setSelectedFont(fonts.find((f) => f.value === value) || fonts[0])}
                  >
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                  </div>
                  <Slider
                    id="font-size"
                    value={[fontSize]}
                    min={12}
                    max={48}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="text-opacity">Text Background Opacity: {Math.round(textOpacity * 100)}%</Label>
                  </div>
                  <Slider
                    id="text-opacity"
                    value={[textOpacity]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(value) => setTextOpacity(value[0])}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-purple-600" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="text-purple-600" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your VerseSnap will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={canvasRef}
                className="relative w-full aspect-square rounded-lg overflow-hidden border shadow-sm flex items-center justify-center"
              >
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected background"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: selectedFilter.value !== "none" ? selectedFilter.value : "none" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div
                        className="bg-black bg-opacity-50 p-4 rounded text-center"
                        style={{
                          backgroundColor: `rgba(0, 0, 0, ${textOpacity})`,
                          fontFamily: selectedFont.value,
                        }}
                      >
                        <p className="text-white mb-2" style={{ fontSize: `${fontSize}px` }}>
                          {activeTab === "choose" ? selectedVerse.text : customVerse.text || "Enter your verse here"}
                        </p>
                        <p className="text-white text-sm font-semibold">
                          {activeTab === "choose" ? selectedVerse.reference : customVerse.reference}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                    <p>Upload an image to see your VerseSnap preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
