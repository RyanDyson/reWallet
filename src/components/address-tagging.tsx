"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Plus, Search, Tag, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AddressTagging({ addressTags, saveAddressTag, transactions }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newTagAddress, setNewTagAddress] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const [editingTag, setEditingTag] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Get unique addresses from transactions
  const getUniqueAddresses = () => {
    const addresses = new Set()

    transactions.forEach((tx) => {
      addresses.add(tx.from)
      addresses.add(tx.to)
    })

    return Array.from(addresses)
  }

  // Filter tags based on search query
  const filteredTags = Object.entries(addressTags)
    .filter(([address, tag]) => {
      const searchLower = searchQuery.toLowerCase()
      return address.toLowerCase().includes(searchLower) || tag.toLowerCase().includes(searchLower)
    })
    .sort((a, b) => a[1].localeCompare(b[1]))

  // Handle saving a new tag
  const handleSaveTag = () => {
    if (newTagAddress && newTagName) {
      saveAddressTag(newTagAddress, newTagName)
      setNewTagAddress("")
      setNewTagName("")
      setIsDialogOpen(false)
    }
  }

  // Handle editing a tag
  const handleEditTag = (address, currentTag) => {
    setEditingTag({ address, tag: currentTag })
    setNewTagAddress(address)
    setNewTagName(currentTag)
    setIsDialogOpen(true)
  }

  // Handle deleting a tag
  const handleDeleteTag = (address) => {
    saveAddressTag(address, "")
  }

  // Get untagged addresses
  const untaggedAddresses = getUniqueAddresses()
    .filter((address) => !addressTags[address])
    .slice(0, 5) // Limit to 5 suggestions

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Tags</CardTitle>
        <CardDescription>Tag addresses to make your transaction history more readable</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
                <DialogDescription>
                  {editingTag
                    ? "Update the tag for this address"
                    : "Create a new tag for an address to make it more recognizable"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={newTagAddress}
                    onChange={(e) => setNewTagAddress(e.target.value)}
                    disabled={!!editingTag}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tag">Tag Name</Label>
                  <Input
                    id="tag"
                    placeholder="Exchange, DeFi Protocol, Friend..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingTag(null)
                    setNewTagAddress("")
                    setNewTagName("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTag}>{editingTag ? "Update Tag" : "Save Tag"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                    No tags found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map(([address, tag]) => (
                  <TableRow key={address}>
                    <TableCell className="font-mono">
                      {address.slice(0, 10)}...{address.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTag(address, tag)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTag(address)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {untaggedAddresses.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Suggested Addresses to Tag</h3>
            <div className="grid gap-2">
              {untaggedAddresses.map((address) => (
                <div key={address} className="flex items-center justify-between p-2 border rounded-md">
                  <span className="font-mono text-sm">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewTagAddress(address)
                      setNewTagName("")
                      setEditingTag(null)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

