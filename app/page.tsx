"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Mic, Send, Plus, Search, MessageSquare, Settings, HelpCircle } from "lucide-react"

export default function ChatGPTClone() {
  const [selectedModel, setSelectedModel] = useState("Auto")
  const [showLegacyModels, setShowLegacyModels] = useState(false)
  const [showMoreModels, setShowMoreModels] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const models = [
    { name: "GPT-5", description: "" },
    { name: "Auto", description: "Decides how long to think", selected: true },
    { name: "Fast", description: "Instant answers" },
    { name: "Thinking mini", description: "Thinks quickly" },
    { name: "Thinking", description: "Thinks longer for better answers" },
    { name: "Pro", description: "Research-grade intelligence" },
  ]

  const legacyModels = ["GPT-4o", "GPT-4.1", "o3", "o4-mini"]
  const moreModels = ["GPT-3.5-turbo", "Claude-2", "PaLM-2", "Llama-2", "Gemini-Pro"]

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#171717] border-r border-[#2f2f2f] flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-[#2f2f2f]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm"></div>
            </div>
            <span className="font-semibold">ChatGPT</span>
            <ChevronDown className="w-4 h-4 ml-auto" />
          </div>

          {/* Model Selection - Always Open */}
          <div className="bg-[#2f2f2f] rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-400 mb-2">GPT-5</div>

            <div className="space-y-1">
              {models.map((model) => (
                <div
                  key={model.name}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#404040] ${
                    model.selected ? "bg-[#404040]" : ""
                  }`}
                  onClick={() => setSelectedModel(model.name)}
                >
                  <div>
                    <div className="font-medium">{model.name}</div>
                    {model.description && <div className="text-xs text-gray-400">{model.description}</div>}
                  </div>
                  {model.selected && <div className="text-green-400">✓</div>}
                </div>
              ))}

              {/* Pro Upgrade Button */}
              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="font-medium">Pro</div>
                  <div className="text-xs text-gray-400">Research-grade intelligence</div>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs">
                  Upgrade
                </Button>
              </div>

              <div className="relative">
                <div
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#404040]"
                  onMouseEnter={() => setShowLegacyModels(true)}
                  onMouseLeave={() => setShowLegacyModels(false)}
                >
                  <span className="font-medium">Legacy models</span>
                  <ChevronRight className="w-4 h-4" />
                </div>

                {showLegacyModels && (
                  <div
                    className="absolute left-full top-0 ml-2 bg-[#2f2f2f] rounded-lg border border-[#404040] shadow-lg z-50 min-w-[160px]"
                    onMouseEnter={() => setShowLegacyModels(true)}
                    onMouseLeave={() => setShowLegacyModels(false)}
                  >
                    <div className="p-2 space-y-1">
                      {legacyModels.map((model) => (
                        <div
                          key={model}
                          className="p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                          onClick={() => {
                            setSelectedModel(model)
                            setShowLegacyModels(false)
                          }}
                        >
                          {model}
                        </div>
                      ))}

                      {/* More models option with nested submenu */}
                      <div className="relative">
                        <div
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                          onMouseEnter={() => setShowMoreModels(true)}
                          onMouseLeave={() => setShowMoreModels(false)}
                        >
                          <span>More models</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>

                        {showMoreModels && (
                          <div
                            className="absolute left-full top-0 ml-2 bg-[#2f2f2f] rounded-lg border border-[#404040] shadow-lg z-50 min-w-[140px]"
                            onMouseEnter={() => setShowMoreModels(true)}
                            onMouseLeave={() => setShowMoreModels(false)}
                          >
                            <div className="p-2 space-y-1">
                              {moreModels.map((model) => (
                                <div
                                  key={model}
                                  className="p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                                  onClick={() => {
                                    setSelectedModel(model)
                                    setShowLegacyModels(false)
                                    setShowMoreModels(false)
                                  }}
                                >
                                  {model}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4">
          <Button className="w-full justify-start mb-4 bg-transparent hover:bg-[#2f2f2f] border border-[#404040]">
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#2f2f2f] cursor-pointer">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#2f2f2f] cursor-pointer">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Recent chats</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-[#2f2f2f]">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#2f2f2f] cursor-pointer">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#2f2f2f] cursor-pointer">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2f2f2f]">
          <div className="flex items-center gap-2">
            <span className="font-semibold">ChatGPT</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
            <span className="mr-2">✨</span>
            Upgrade your plan
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium mb-2">Ready when you are.</h1>
          </div>

          {/* Input Area */}
          <div className="w-full max-w-3xl">
            <div className="relative">
              <div className="flex items-center bg-[#2f2f2f] rounded-full border border-[#404040] p-4">
                <Plus className="w-5 h-5 text-gray-400 mr-3 cursor-pointer hover:text-white" />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                />
                <div className="flex items-center gap-2 ml-3">
                  <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                  <Button
                    size="sm"
                    className="bg-transparent hover:bg-[#404040] p-2 rounded-full"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
