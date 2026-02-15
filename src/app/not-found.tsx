import { Page } from "@/components/layout/Page"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <Page centered>
      <div className="max-w-sm flex flex-col items-center justify-center border p-6 rounded-md bg-neutral-800 space-y-3">
        <h2 className="text-lg font-semibold">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className={buttonVariants()}>
          Return Home
        </Link>
      </div>
    </Page>
  )
}
