// This is component has be ripped out from the remix-utils package by Sergiodxa
// https://github.com/sergiodxa/remix-utils

import * as React from 'react';
import { useLocation, useMatches, Location, Params } from '@remix-run/react';
import { useHydrated } from '~/hooks';

type RouterState = {
  loaderData: unknown[];
};

export type HandleConventionArguments<Data = unknown> = {
  id: string;
  data: Data;
  params: Params;
  matches: ReturnType<typeof useMatches>;
  location: Location;
  parentsData: RouterState['loaderData'];
};

export type ReferrerPolicy =
  | 'no-referrer-when-downgrade'
  | 'no-referrer'
  | 'origin-when-cross-origin'
  | 'origin'
  | 'same-origin'
  | 'strict-origin-when-cross-origin'
  | 'strict-origin'
  | 'unsafe-url';

export type CrossOrigin = 'anonymous' | 'use-credentials';

export type ScriptType = 'module' | 'text/javascript';

export type ScriptDescriptor = {
  /** Enable preloading of this script on SSR */
  preload?: boolean;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#async
   */
  async?: boolean;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-crossorigin
   */
  crossOrigin?: CrossOrigin;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer
   */
  defer?: boolean;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-integrity
   */
  integrity?: string;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-nomodule
   */
  noModule?: boolean;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-nonce
   */
  nonce?: string;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-referrerpolicy
   */
  referrerPolicy?: ReferrerPolicy;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-src
   */
  src: string;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-type
   */
  type?: ScriptType;
  /**
   * Optional element ID. Use only if the script element needs to be explicitly referenced later.
   */
  id?: string;
};

export type ExternalScriptsFunction<Loader = unknown> = (args: HandleConventionArguments<Loader>) => ScriptDescriptor[];

/**
 * Define the shape of the `handle` export if you want to use `scripts`. Combine
 * it with your own `handle` type to add `scripts` to your route.
 * @description Add a scripts function that access the route's loader data
 * @example
 * export const handle: ExternalScriptsHandle<SerializeFrom<typeof loader>> = {
 *   scripts(loaderData) { ... }
 * }
 * @description Add a static scripts array
 * @example
 * export const handle: ExternalScriptsHandle = {
 *   scripts: [...]
 * }
 * @description Extend it with your own handle type
 * @example
 * interface Handle<Data = unknown> extends ExternalScriptsHandle<Data> {
 *   // extra things here
 * }
 * export const handle: Handle = {
 *   scripts, // define scripts here
 *   // and any other handle properties here
 * }
 */
export interface ExternalScriptsHandle<Data = unknown> {
  scripts?: ExternalScriptsFunction<Data> | ScriptDescriptor[];
}

/**
 * Load scripts defined by each route in a single place, often in `root`.
 * @example
 * // Defines a `scripts` function in a route `handle`
 * export const handle: ExternalScriptsHandle<SerializeFrom<typeof loader>> = {
 *   scripts(loaderData) { ... }
 * }
 * // Or define a scripts array directly
 * export const handle: ExternalScriptsHandle = {
 *   scripts: [...]
 * }
 * // Then render ExternalScripts in your root
 * return <ExternalScripts />
 */
export function ExternalScripts() {
  const scripts = useExternalScripts();

  return (
    <>
      {scripts.map((props: ScriptDescriptor) => {
        if (!props.src) return null;
        return <ExternalScript key={props.src} {...props} />;
      })}
    </>
  );
}

export function useExternalScripts() {
  const location = useLocation();

  const matches = useMatches();

  return React.useMemo(() => {
    const scripts = matches.flatMap((match, index, matches) => {
      if (!match.handle) return []; // ignore no-handle routes
      if (match.handle === null) return []; // ignore null handles
      if (typeof match.handle !== 'object') return []; // and non error handles
      if (!('scripts' in match.handle)) return []; // and without scripts

      const scripts = match.handle.scripts as ExternalScriptsFunction | ScriptDescriptor[];

      // if scripts is an array, suppose it's an array of script descriptors
      // and return it
      if (Array.isArray(scripts)) return scripts;

      // if it's not a function (and not an array), ignore it
      if (typeof scripts !== 'function') return [];

      const result = scripts({
        id: match.id,
        data: match.data,
        params: match.params,
        location,
        parentsData: matches.slice(0, index).map(match => match.data),
        matches,
      });

      if (Array.isArray(result)) return result;
      return [];
    });

    const uniqueScripts = new Map();
    for (const script of scripts) uniqueScripts.set(script.src, script);
    return [...uniqueScripts.values()];
  }, [matches, location]);
}

export function ExternalScript({
  src,
  preload = false,
  async = true,
  defer = true,
  crossOrigin,
  integrity,
  type,
  referrerPolicy,
  noModule,
  nonce,
  id,
}: ScriptDescriptor & { src: string }) {
  const isHydrated = useHydrated();
  const startsHydrated = React.useRef(isHydrated);

  React.useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;

    const $script = document.createElement('script');
    $script.src = src;

    const attributes = {
      async,
      defer,
      crossOrigin,
      integrity,
      type,
      referrerPolicy,
      noModule,
      nonce,
      id,
    };

    for (const [key, value] of Object.entries(attributes)) {
      if (value) $script.setAttribute(key, value.toString());
    }

    document.body.appendChild($script);

    return () => {
      $script.remove();
    };
  }, [async, crossOrigin, defer, integrity, isHydrated, noModule, nonce, referrerPolicy, src, type, id]);

  if (startsHydrated.current && isHydrated) return null;

  const rel = noModule ? 'modulepreload' : 'preload';
  const as = noModule ? undefined : 'script';

  return (
    <>
      {preload && (
        <link
          rel={rel}
          href={src}
          as={as}
          crossOrigin={crossOrigin}
          integrity={integrity}
          referrerPolicy={referrerPolicy}
        />
      )}
      <script
        id={id}
        src={src}
        defer={defer}
        async={async}
        type={type}
        noModule={noModule}
        nonce={nonce}
        crossOrigin={crossOrigin}
        integrity={integrity}
        referrerPolicy={referrerPolicy}
      />
    </>
  );
}
