import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    const { supabase, response } = createClient(request)

    const session = await supabase.auth.getSession()

    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message)
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }

    // 🔹 Explicitly Set Headers for Every Response
    const modifiedResponse = NextResponse.next()
    modifiedResponse.headers.set("X-Frame-Options", "ALLOWALL")
    modifiedResponse.headers.set("Content-Security-Policy", "frame-ancestors 'self' https://psiprototype.carrd.co;")

    return modifiedResponse
  } catch (e) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}

