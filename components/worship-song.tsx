"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Heart, ExternalLink, Share2, ListMusic } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Song = {
  id: number
  title: string
  artist: string
  album: string
  year: string
  genre: string
  youtubeId: string
  lyrics: string
  isFavorite: boolean
}

const songOfTheDay: Song = {
  id: 1,
  title: "What A Beautiful Name",
  artist: "Hillsong Worship",
  album: "Let There Be Light",
  year: "2016",
  genre: "Contemporary Worship",
  youtubeId: "nQWFzMvCfLE",
  lyrics:
    "You were the Word at the beginning\nOne with God the Lord Most High\nYour hidden glory in creation\nNow revealed in You our Christ\n\nWhat a beautiful Name it is\nWhat a beautiful Name it is\nThe Name of Jesus Christ my King\nWhat a beautiful Name it is\nNothing compares to this\nWhat a beautiful Name it is\nThe Name of Jesus",
  isFavorite: false,
}

const recentSongs: Song[] = [
  {
    id: 2,
    title: "10,000 Reasons (Bless the Lord)",
    artist: "Matt Redman",
    album: "10,000 Reasons",
    year: "2011",
    genre: "Contemporary Worship",
    youtubeId: "DXDGE_lRI0E",
    lyrics: "",
    isFavorite: false,
  },
  {
    id: 3,
    title: "Oceans (Where Feet May Fail)",
    artist: "Hillsong UNITED",
    album: "Zion",
    year: "2013",
    genre: "Contemporary Worship",
    youtubeId: "dy9nwe9_xzw",
    lyrics: "",
    isFavorite: false,
  },
  {
    id: 4,
    title: "How Great Is Our God",
    artist: "Chris Tomlin",
    album: "Arriving",
    year: "2004",
    genre: "Contemporary Worship",
    youtubeId: "cKLQ1td3MbE",
    lyrics: "",
    isFavorite: false,
  },
]

export default function WorshipSong() {
  const [currentSong, setCurrentSong] = useState<Song>(songOfTheDay)
  const [showLyrics, setShowLyrics] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <Music className="h-6 w-6" />
          Worship Song of the Day
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-purple-100 h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-purple-800">{currentSong.title}</CardTitle>
                  <CardDescription>{currentSong.artist}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {currentSong.genre}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentSong.youtubeId}`}
                  title={currentSong.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Album</p>
                  <p className="font-medium">{currentSong.album}</p>
                </div>
                <div>
                  <p className="text-gray-500">Year</p>
                  <p className="font-medium">{currentSong.year}</p>
                </div>
              </div>

              {showLyrics && (
                <div className="mt-4 p-4 bg-purple-50 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2">Lyrics</h3>
                  <p className="whitespace-pre-line text-gray-700">{currentSong.lyrics}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-purple-100 pt-4">
              <Button
                variant="ghost"
                className={favorites.includes(currentSong.id) ? "text-red-500" : "text-purple-600"}
                onClick={() => toggleFavorite(currentSong.id)}
              >
                <Heart className={`h-5 w-5 mr-1 ${favorites.includes(currentSong.id) ? "fill-red-500" : ""}`} />
                {favorites.includes(currentSong.id) ? "Favorited" : "Favorite"}
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowLyrics(!showLyrics)}>
                  {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
                </Button>
                <Button variant="outline" className="text-purple-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in YouTube
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="border-purple-100 h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListMusic className="h-5 w-5" />
                Recent Songs
              </CardTitle>
              <CardDescription>Previously featured worship songs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => setCurrentSong(song)}
                  >
                    <div className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Music className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-purple-800 truncate">{song.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{song.artist}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={favorites.includes(song.id) ? "text-red-500" : "text-purple-600"}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(song.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(song.id) ? "fill-red-500" : ""}`} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-100 pt-4">
              <Button variant="outline" className="w-full text-purple-600">
                View All Songs
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
