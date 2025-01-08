import posthog from 'posthog-js'

// Only initialize in production & if we have an API key
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
    capture_pageview: false // Disable automatic pageview capture, as we'll handle this manually
  })
}

// Safely export posthog
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, properties)
  }
}

export const capturePageview = (currentUrl: string) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture('$pageview', {
      $current_url: currentUrl
    })
  }
}
