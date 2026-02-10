import 'server-only';

declare global {
  // eslint-disable-next-line no-var
  var __budgeifyDidWarnClerkTestKey: boolean | undefined;
}

export function warnIfClerkTestKeyInProduction(): void {
  if (globalThis.__budgeifyDidWarnClerkTestKey) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

  if (publishableKey.startsWith('pk_test_')) {
    globalThis.__budgeifyDidWarnClerkTestKey = true;
    console.warn(
      '[Clerk] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY uses a test key (pk_test_) in production. Use pk_live_ for live deployments.',
    );
  }
}
