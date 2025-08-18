"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Mic, Send, Plus, Settings, HelpCircle } from "lucide-react"

export default function ChatGPTClone() {
  const [selectedModel, setSelectedModel] = useState("Auto")
  const [menuPath, setMenuPath] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const models = [
    { name: "GPT-5", description: "" },
    { name: "Auto", description: "Decides how long to think", selected: true },
    { name: "Fast", description: "Instant answers" },
    { name: "Thinking mini", description: "Thinks quickly" },
    { name: "Thinking", description: "Thinks longer for better answers" },
    { name: "Pro", description: "Research-grade intelligence" },
  ]

  const legacyModels = ["GPT-4o", "GPT-4.1", "o3", "o4-mini"]
  const nestedMenuData = {
    "more-models": ["GPT-3.5-turbo", "Claude-2", "PaLM-2", "Llama-2", "Advanced Models →"],
    "level-1": ["Falcon-7B", "Vicuna-13B", "Alpaca-7B", "Dolly-12B", "Experimental Models →"],
    "level-2": ["CodeT5-Base", "FLAN-T5", "UL2-20B", "GLM-130B", "Research Models →"],
    "level-3": ["OPT-175B", "BLOOM-176B", "Megatron-530B", "Switch-1.6T", "Beta Models →"],
    "level-4": ["InstructGPT", "WebGPT", "CodeX-12B", "Codegen-16B", "Alpha Models →"],
    "level-5": ["T0pp-11B", "mT5-XXL", "BigScience-T0", "Anthropic-LM", "Prototype Models →"],
    "level-6": ["PaLM-540B", "Chinchilla-70B", "Gopher-280B", "LaMDA-137B", "Experimental V2 →"],
    "level-7": ["GPT-J-6B", "GPT-NeoX-20B", "RWKV-14B", "ChatGLM-6B", "Legacy Variants →"],
    "level-8": ["Jurassic-1", "Cohere-XL", "AI21-J1", "Anthropic-Claude", "Archive Models →"],
    "level-9": ["GPT-1", "GPT-2", "BERT-Large", "RoBERTa", "Final Archive →"],
    "level-10": ["Transformer-Base", "LSTM-Classic", "RNN-Original", "Perceptron-V1", "Historical Models"],
  }

  const openMenu = (path: string[]) => {
    const pathKey = path.join("-")
    const existingTimeout = timeoutRefs.current.get(pathKey)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      timeoutRefs.current.delete(pathKey)
    }
    setMenuPath(path)
  }

  const closeMenuWithDelay = (menuPath?: string[], delay = 300) => {
    const pathKey = menuPath ? menuPath.join("-") : "root"

    const existingTimeout = timeoutRefs.current.get(pathKey)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    const timeoutId = setTimeout(() => {
      if (menuPath) {
        setMenuPath((current) => {
          const pathIndex = current.findIndex((_, index) => current.slice(0, index + 1).join("-") === pathKey)
          return pathIndex >= 0 ? current.slice(0, pathIndex) : current
        })
      } else {
        setMenuPath([])
      }
      timeoutRefs.current.delete(pathKey)
    }, delay)

    timeoutRefs.current.set(pathKey, timeoutId)
  }

  const cancelClose = (menuPath?: string[]) => {
    const pathKey = menuPath ? menuPath.join("-") : "root"
    const timeout = timeoutRefs.current.get(pathKey)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(pathKey)
    }
  }

  const isMenuOpen = (menuKey: string) => {
    return menuPath.includes(menuKey)
  }

  const useSmartPosition = (isOpen: boolean) => {
    const [position, setPosition] = useState({ horizontal: "right", vertical: "top" })
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (isOpen && menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const spaceRight = viewportWidth - rect.right
        const spaceLeft = rect.left
        const horizontal = spaceRight < 200 && spaceLeft > 200 ? "left" : "right"

        const spaceBelow = viewportHeight - rect.top
        const spaceAbove = rect.top
        const vertical = spaceBelow < 300 && spaceAbove > 300 ? "bottom" : "top"

        setPosition({ horizontal, vertical })
      }
    }, [isOpen])

    return { position, menuRef }
  }

  const NestedSubmenu = ({
    level,
    menuKey,
    items,
    parentPath = [],
  }: { level: number; menuKey: string; items: string[]; parentPath?: string[] }) => {
    const nextMenuKey = `level-${level}`
    const hasNextLevel = level < 10
    const nextLevelItems = hasNextLevel ? nestedMenuData[nextMenuKey] : []
    const { position, menuRef } = useSmartPosition(isMenuOpen(menuKey))
    const currentPath = [...parentPath, menuKey]

    const getPositionClasses = () => {
      const horizontal = position.horizontal === "left" ? "right-full mr-2" : "left-full ml-2"
      const vertical = position.vertical === "bottom" ? "bottom-0" : "top-0"
      return `${horizontal} ${vertical}`
    }

    if (!isMenuOpen(menuKey)) return null

    return (
      <div
        ref={menuRef}
        className={`absolute ${getPositionClasses()} bg-[#2f2f2f] rounded-lg border border-[#404040] shadow-lg z-50 min-w-[160px]`}
        onMouseEnter={() => cancelClose(currentPath)}
        onMouseLeave={() => closeMenuWithDelay(currentPath)}
      >
        <div className="p-2 space-y-1">
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1
            const isNextLevelTrigger = isLastItem && hasNextLevel

            return (
              <div key={item} className="relative">
                <div
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                  onMouseEnter={() => {
                    cancelClose(currentPath)
                    if (isNextLevelTrigger) {
                      openMenu([...currentPath, nextMenuKey])
                    }
                  }}
                  onClick={() => {
                    if (!isNextLevelTrigger) {
                      setSelectedModel(item)
                      setMenuPath([])
                    }
                  }}
                >
                  <span>{item}</span>
                  {isNextLevelTrigger && <ChevronRight className="w-3 h-3" />}
                </div>

                {isNextLevelTrigger && (
                  <NestedSubmenu
                    level={level + 1}
                    menuKey={nextMenuKey}
                    items={nextLevelItems}
                    parentPath={currentPath}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const { position: legacyPosition, menuRef: legacyMenuRef } = useSmartPosition(isMenuOpen("legacy"))

  const getLegacyPositionClasses = () => {
    const horizontal = legacyPosition.horizontal === "left" ? "right-full mr-2" : "left-full ml-2"
    const vertical = legacyPosition.vertical === "bottom" ? "bottom-0" : "top-0"
    return `${horizontal} ${vertical}`
  }

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
                  onMouseEnter={() => {
                    cancelClose(["legacy"])
                    openMenu(["legacy"])
                  }}
                  onMouseLeave={() => closeMenuWithDelay(["legacy"])}
                >
                  <span className="font-medium">Legacy models</span>
                  <ChevronRight className="w-4 h-4" />
                </div>

                {isMenuOpen("legacy") && (
                  <div
                    ref={legacyMenuRef}
                    className={`absolute ${getLegacyPositionClasses()} bg-[#2f2f2f] rounded-lg border border-[#404040] shadow-lg z-50 min-w-[160px]`}
                    onMouseEnter={() => cancelClose(["legacy"])}
                    onMouseLeave={() => closeMenuWithDelay(["legacy"])}
                  >
                    <div className="p-2 space-y-1">
                      {legacyModels.map((model) => (
                        <div
                          key={model}
                          className="p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                          onMouseEnter={() => cancelClose(["legacy"])}
                          onClick={() => {
                            setSelectedModel(model)
                            setMenuPath([])
                          }}
                        >
                          {model}
                        </div>
                      ))}

                      {/* More models option with nested submenu */}
                      <div className="relative">
                        <div
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#404040] text-sm font-medium"
                          onMouseEnter={() => {
                            cancelClose(["legacy", "more-models"])
                            openMenu(["legacy", "more-models"])
                          }}
                        >
                          <span>More models</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>

                        <NestedSubmenu
                          level={1}
                          menuKey="more-models"
                          items={nestedMenuData["more-models"]}
                          parentPath={["legacy"]}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4"></div>

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
