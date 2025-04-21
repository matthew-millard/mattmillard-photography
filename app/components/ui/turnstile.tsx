interface TurnstileProps {
  siteKey: string;
  theme?: 'auto' | 'light' | 'dark';
}

export function Turnstile({ siteKey, theme }: TurnstileProps) {
  return (
    <div
      className="cf-turnstile h-16 w-full"
      data-sitekey={siteKey}
      data-theme={theme}
      data-size="flexible"
      //   data-callback="javascriptCallback"
      data-callback="thisIsYourToken"
    ></div>
  );
}

export function TurnstileFallback() {
  return (
    <div className="cf-turnstile h-16 w-full bg-muted border border-[#eee]/50 text-muted-foreground p-4 font-medium">
      <small>Loading Cloudflare Turnstile...</small>
    </div>
  );
}
