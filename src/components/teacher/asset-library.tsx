"use client"

import { useState, useEffect } from "react"
import {
    FileText,
    Music,
    Mic,
    Video,
    MoreVertical,
    Pencil,
    Trash2,
    Play,
    Pause,
    Wind,
    Search,
    Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { useAssetStore } from "@/store/asset-store"
import { usePlayerStore } from "@/store/player-store"
import { BreathingTool } from "@/components/breathing/breathing-tool"

type AssetType = 'all' | 'audio' | 'pdf' | 'video' | 'breathing'

export function AssetLibrary() {
    const { assets, removeAsset, updateAsset, fetchAssets, isLoading } = useAssetStore()
    const { setTrack, isPlaying, currentTrackUrl, togglePlay: toggleGlobalPlay } = usePlayerStore()

    const [filter, setFilter] = useState<AssetType>('all')
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    // UI States
    const [previewAsset, setPreviewAsset] = useState<any>(null)
    const [editAsset, setEditAsset] = useState<{ id: string, title: string } | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const filteredAssets = assets.filter(asset => {
        const matchesType = filter === 'all' || asset.type === filter
        const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesType && matchesSearch
    })

    const handlePlay = (asset: any) => {
        if (currentTrackUrl === asset.url) {
            toggleGlobalPlay()
        } else {
            setTrack(
                asset.url!,
                asset.title,
                "https://placehold.co/400x400/6B705C/FFFFFF/png?text=Breathe",
                asset.duration,
                asset.indexedDbKey
            )
        }
    }

    const handleSaveEdit = () => {
        if (editAsset) {
            updateAsset(editAsset.id, { title: editAsset.title })
            setEditAsset(null)
        }
    }

    const handleDelete = () => {
        if (deleteId) {
            removeAsset(deleteId)
            setDeleteId(null)
        }
    }

    const types: { label: string, value: AssetType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Audio', value: 'audio' },
        { label: 'Breathing', value: 'breathing' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Video', value: 'video' },
    ]

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex bg-stone-100 p-1 rounded-xl">
                    {types.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setFilter(t.value)}
                            className={cn(
                                "px-4 py-1.5 text-sm rounded-lg transition-all",
                                filter === t.value
                                    ? "bg-white text-stone-900 shadow-sm font-medium"
                                    : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                        placeholder="Search assets..."
                        className="pl-9 h-10 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAssets.length > 0 ? (
                        filteredAssets.map((asset) => {
                            const isCurrentTrack = currentTrackUrl === asset.url && isPlaying

                            return (
                                <div
                                    key={asset.id}
                                    className={cn(
                                        "group relative border rounded-2xl p-4 transition-all hover:shadow-md bg-white",
                                        isCurrentTrack ? "border-primary bg-primary/5 shadow-sm" : "border-stone-100 shadow-sm"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="shrink-0">
                                            {asset.type === 'audio' && (
                                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100" title="Audio Guide">
                                                    <Mic className="w-5 h-5 text-amber-600" />
                                                </div>
                                            )}
                                            {asset.type === 'breathing' && (
                                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100" title="Breathing Exercise">
                                                    <Wind className="w-5 h-5 text-teal-600" />
                                                </div>
                                            )}
                                            {asset.type === 'pdf' && (
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100" title="Document">
                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                </div>
                                            )}
                                            {asset.type === 'video' && (
                                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200" title="Video">
                                                    <Video className="w-5 h-5 text-stone-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-medium text-stone-800 truncate">{asset.title}</h4>
                                            <p className="text-xs text-stone-400 capitalize">
                                                {asset.type === 'breathing' && asset.phases?.length ? (
                                                    <span>{asset.phases.length} Phases • {Math.ceil((asset.duration || 0) / 60)} min • {asset.date}</span>
                                                ) : (
                                                    <span>{asset.type} • {asset.date}</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {asset.type === 'audio' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => asset.url && handlePlay(asset)}
                                                >
                                                    {isCurrentTrack ? (
                                                        <Pause className="w-4 h-4 fill-current" />
                                                    ) : (
                                                        <Play className="w-4 h-4 fill-current" />
                                                    )}
                                                </Button>
                                            )}

                                            {asset.type === 'breathing' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => setPreviewAsset(asset)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32 rounded-xl">
                                                    <DropdownMenuItem
                                                        className="gap-2 cursor-pointer"
                                                        onClick={() => setEditAsset({ id: asset.id, title: asset.title })}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteId(asset.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="col-span-full h-40 flex flex-col items-center justify-center text-stone-400 bg-stone-50 border border-dashed rounded-3xl">
                            <Library className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No assets found</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Breathing Preview Dialog */}
            <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl">
                    {previewAsset && (
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-light">{previewAsset.title} Preview</DialogTitle>
                            </DialogHeader>
                            <div className="bg-stone-50 p-6 rounded-2xl">
                                <BreathingTool
                                    phases={previewAsset.phases}
                                    pattern={{ name: previewAsset.title, ...previewAsset.breathingPattern }}
                                />
                            </div>
                            <div className="text-center text-sm text-stone-500">
                                This is a simulation of the student's practice view.
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit (Rename) Dialog */}
            <Dialog open={!!editAsset} onOpenChange={(open) => !open && setEditAsset(null)}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Asset</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium text-stone-700 mb-1.5 block">Asset Title</label>
                        <Input
                            value={editAsset?.title || ""}
                            onChange={(e) => editAsset && setEditAsset({ ...editAsset, title: e.target.value })}
                            className="rounded-xl"
                            autoFocus
                        />
                        <p className="text-[10px] text-stone-400 mt-2">
                            {editAsset && assets.find(a => a.id === editAsset.id)?.type === 'audio'
                                ? "Audio file content cannot be changed, only its title."
                                : "Give this asset a descriptive name for your students."
                            }
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditAsset(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Asset?</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-stone-600">
                        This action cannot be undone. Any sessions using this asset will no longer be able to play or display it.
                    </div>
                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function Library({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m16 6 4 14" />
            <path d="M12 6v14" />
            <path d="M8 8v12" />
            <path d="M4 4v16" />
        </svg>
    )
}

