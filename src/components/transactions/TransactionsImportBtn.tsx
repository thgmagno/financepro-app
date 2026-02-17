"use client"

import * as React from "react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { uploadTransactionsFile } from "@/actions/transaction"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { FieldDescription } from "../ui/field"

export function TransactionsImportBtn() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await uploadTransactionsFile(formData)

      if (!result.ok) {
        toast.error("Upload failed", { description: result.error })
        return
      }

      toast.success("Upload completed", {
        description: "File imported successfully.",
      })

      form.reset()
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Upload />
          Import transactions
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Import transactions from file</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".csv,application/pdf,text/csv"
              required
              disabled={isPending}
            />
            <FieldDescription className="text-important font-medium">
              Accepted types: CSV or PDF.
            </FieldDescription>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
