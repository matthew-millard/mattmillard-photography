import { z } from 'zod';
import { useTheme } from '~/hooks';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui';
import { Moon, Sun } from 'lucide-react';

export type Theme = 'light' | 'dark';
export const fetcherKey = 'update-theme';
export const updateThemeActionIntent = 'update-theme';

export const ThemeSwitchSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export default function ThemeSwitch() {
  const fetcher = useFetcher({ key: fetcherKey });
  const userPreference = useTheme();
  const mode = userPreference ?? 'light';
  const nextMode = mode === 'light' ? 'dark' : 'light';

  const icon = mode === 'light' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />;
  return (
    <fetcher.Form action="/" method="POST">
      <input type="hidden" name="theme" value={nextMode} />
      <Button type="submit" variant={'ghost'} size={'icon'} name="intent" value={updateThemeActionIntent}>
        {icon}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </fetcher.Form>
  );
}
