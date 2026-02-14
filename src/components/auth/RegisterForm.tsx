"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchJson } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button, buttonVariants } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const STORAGE_KEY = "register_form_state_v1"
const TTL_MS = 5 * 60 * 1000

type PersistedState = {
  savedAt: number
  email: string
  formRegister: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    confirmationCode: string
  }
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedState

    if (!parsed?.savedAt || Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function savePersistedState(state: Omit<PersistedState, "savedAt">) {
  try {
    const payload: PersistedState = { savedAt: Date.now(), ...state }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

function clearPersistedState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [formRegister, setFormRegister] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    confirmationCode: "",
  })

  useEffect(() => {
    const persisted = loadPersistedState()
    if (!persisted) return
    setEmail(persisted.email ?? "")
    setFormRegister(
      persisted.formRegister ?? {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        confirmationCode: "",
      },
    )
  }, [])

  useEffect(() => {
    savePersistedState({ email, formRegister })
  }, [email, formRegister])

  const emailLocked = !!formRegister.email
  const preRegister = useMemo(() => {
    return (
      formRegister.name === "" &&
      formRegister.email === "" &&
      formRegister.password === "" &&
      formRegister.passwordConfirmation === "" &&
      formRegister.confirmationCode === ""
    )
  }, [formRegister])

  async function requestVerificationCode(targetEmail: string) {
    const normalized = targetEmail.trim().toLowerCase()

    if (!isValidEmail(normalized)) {
      toast.error("Enter a valid email address.")
      return
    }

    setIsLoading(true)
    try {
      await fetchJson("/api/auth/request/register", formRegister)

      setEmail(normalized)

      setFormRegister((prev) => ({
        ...prev,
        email: normalized,
        confirmationCode: "",
      }))

      toast.success(
        "If the email you provided is valid, you will receive a code to complete the registration.",
      )
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send code.")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRegister() {
    if (!formRegister.email) {
      toast.error("Request a verification code first.")
      return
    }
    if (!formRegister.confirmationCode.trim()) {
      toast.error("Enter the confirmation code.")
      return
    }

    setIsLoading(true)
    try {
      await fetchJson("/api/auth/register", formRegister)

      toast.success("Registered successfully.")

      clearPersistedState()
      setFormRegister({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        confirmationCode: "",
      })
      setEmail("")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registration failed.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePrimaryAction() {
    if (preRegister) await requestVerificationCode(email)
    else await submitRegister()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Enter your email below to get started</CardDescription>
        <CardAction>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Sign In
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="email">Email address</Label>
              {!preRegister ? (
                <Button
                  type="button"
                  className="ml-2"
                  variant="link"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => {
                    setFormRegister({
                      email: "",
                      confirmationCode: "",
                      name: "",
                      password: "",
                      passwordConfirmation: "",
                    })
                    setEmail("")
                    clearPersistedState()
                  }}
                >
                  Change email
                </Button>
              ) : null}
            </div>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailLocked || isLoading}
            />
          </div>

          {!preRegister && (
            <>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="email">Confirmation code</Label>
                </div>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="XXXXXX"
                  required
                  value={formRegister.confirmationCode}
                  onChange={(e) =>
                    setFormRegister((p) => ({
                      ...p,
                      confirmationCode: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="email">Name</Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formRegister.name}
                  onChange={(e) =>
                    setFormRegister((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="email">Password</Label>
                </div>
                <Input
                  id="password"
                  type="text"
                  placeholder="Your password"
                  required
                  value={formRegister.password}
                  onChange={(e) =>
                    setFormRegister((p) => ({ ...p, password: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="email">Confirm password</Label>
                </div>
                <Input
                  id="passwordConfirmation"
                  type="text"
                  placeholder="Confirm your password"
                  required
                  value={formRegister.passwordConfirmation}
                  onChange={(e) =>
                    setFormRegister((p) => ({
                      ...p,
                      passwordConfirmation: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex">
        <Button
          onClick={handlePrimaryAction}
          className="flex-1"
          disabled={
            isLoading ||
            (preRegister
              ? !isValidEmail(email)
              : !formRegister.confirmationCode.trim())
          }
        >
          {isLoading ? "Sending..." : preRegister ? "Continue" : "Register"}
        </Button>
      </CardFooter>
    </Card>
  )
}
