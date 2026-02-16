import { Loader } from "lucide-react"
import { Button } from "../ui/button"

interface FormSubmitButtonProps {
  disabled?: boolean
  isPending: boolean
  label: string
}

export function FormSubmitButton({
  disabled = false,
  isPending,
  label,
}: FormSubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || isPending}>
      {isPending && <Loader className="animate-spin" />}
      {label}
    </Button>
  )
}
