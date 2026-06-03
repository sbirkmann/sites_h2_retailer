const CAPI_ENDPOINT = "https://h2vitaldash.x900.3az.de/api/capi/purchase"

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}

function getFbclid(): string | null {
  if (typeof window === "undefined") return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("fbclid")
}

function getUserDataExtras(): Record<string, string> {
  const extras: Record<string, string> = {}
  const fbp = getCookie("_fbp")
  if (fbp) extras.fbp = fbp
  const fbclid = getFbclid()
  if (fbclid) extras.fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`
  return extras
}

export function sendCapiEvent(
  eventName: string,
  customData: Record<string, unknown> = {}
) {
  const userDataExtras = getUserDataExtras()
  const userData = (customData.user_data as Record<string, unknown>) || {}
  Object.assign(userData, userDataExtras)

  const payload = {
    event_name: eventName,
    custom_data: {
      ...customData,
      user_data: userData,
      url: window.location.href,
    },
  }

  fetch(CAPI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("FB CAPI Event sent:", eventName, data)
    })
    .catch((err) => {
      console.error("FB CAPI Error:", err)
    })
}

if (typeof window !== "undefined") {
  ;(window as unknown as Record<string, unknown>).sendCapiEvent = sendCapiEvent
}
