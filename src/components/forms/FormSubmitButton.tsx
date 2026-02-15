import { Loader } from "lucide-react"
import { Button } from "../ui/button"

interface FormSubmitButtonProps {
  isPending: boolean
  label: string
}

export function FormSubmitButton({ isPending, label }: FormSubmitButtonProps) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending && <Loader className="animate-spin" />}
      {label}
    </Button>
  )
}
