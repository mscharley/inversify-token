import type { interfaces as inversify } from 'inversify';
import {
  AsyncContainerModule,
  ContainerModule,
  inject,
  multiInject,
} from 'inversify';

/**
 * A token to use with InversifyJS injection.
 */
export class Token<T> {
  /**
   * This property will always be null - the value is not important, it is a dummy value for compiler use.
   *
   * @internal
   */
  public _witness!: T;

  constructor(public readonly identifier: string | symbol) {}
}

/**
 * Extract the type of a token for use with injection.
 */
export type TokenType<T extends Token<any>> = T['_witness'];

/**
 * Get an item represented by a token from a container.
 */
export const getToken = <T>(
  container: inversify.Container,
  token: Token<T>,
): T => container.get<T>(token.identifier);

/**
 * Get all items represented by a token from a container.
 */
export const getAllToken = <T>(
  container: inversify.Container,
  token: Token<T>,
): T[] => container.getAll<T>(token.identifier);

/**
 * Get an item represented by a token with a given name.
 */
export const getNamed = <T>(
  container: inversify.Container,
  token: Token<T>,
  named: string | number | symbol,
): T => container.getNamed<T>(token.identifier, named);

/**
 * Get an item represented by a token with a tag.
 */
export const getTagged = <T>(
  container: inversify.Container,
  token: Token<T>,
  key: string | number | symbol,
  value: any,
): T => container.getTagged<T>(token.identifier, key, value);

/**
 * Inject an item represented by a token.
 */
export const injectToken = <T extends Token<any>>(
  token: T,
): ReturnType<typeof inject> => inject(token.identifier);

/**
 * Inject multiple items represented by a token.
 */
export const multiInjectToken = <T extends Token<any>>(
  token: T,
): ReturnType<typeof multiInject> => multiInject(token.identifier);

/**
 * Wrap a bind function to allow binding tokens.
 */
export const tokenBinder =
  (bind: inversify.Bind) =>
  <T>(token: Token<T>) =>
    bind<T>(token.identifier);

/**
 * Wrap an unbind function to allow unbinding tokens.
 */
export const tokenUnbinder =
  (unbind: inversify.Unbind) =>
  <T>(token: Token<T>) =>
    unbind<T>(token.identifier);

/**
 * Wrap an isBound function to allow checking tokens.
 */
export const tokenIsBound =
  (isBound: inversify.IsBound) =>
  <T>(token: Token<T>) =>
    isBound<T>(token.identifier);

/**
 * Wrap a rebind function to allow checking tokens.
 */
export const tokenRebinder =
  (rebind: inversify.Rebind) =>
  <T>(token: Token<T>) =>
    rebind<T>(token.identifier);

export declare namespace interfaces {
  type TokenBinder = ReturnType<typeof tokenBinder>;
  type TokenUnbinder = ReturnType<typeof tokenUnbinder>;
  type TokenIsBound = ReturnType<typeof tokenIsBound>;
  type TokenRebinder = ReturnType<typeof tokenRebinder>;

  type TokenContainerModuleCallback = (
    bindToken: TokenBinder,
    unbindToken: TokenUnbinder,
    isBoundToken: TokenIsBound,
    rebindToken: TokenRebinder,
  ) => void;

  type AsyncTokenContainerModuleCallback = (
    bindToken: TokenBinder,
    unbindToken: TokenUnbinder,
    isBoundToken: TokenIsBound,
    rebindToken: TokenRebinder,
  ) => Promise<void>;
}

/**
 * A ContainerModule that uses tokens exclusively.
 *
 * If you need to mix and match tokens and regular symbols in the same module then use ContainerModule and manually wrap
 * functions you need.
 *
 * @see tokenBinder
 */
export class TokenContainerModule extends ContainerModule {
  public constructor(registry: interfaces.TokenContainerModuleCallback) {
    super((bind, unbind, isBound, rebind) => {
      registry(
        tokenBinder(bind),
        tokenUnbinder(unbind),
        tokenIsBound(isBound),
        tokenRebinder(rebind),
      );
    });
  }
}

/**
 * An AsyncContainerModule that uses tokens exclusively.
 *
 * If you need to mix and match tokens and regular symbols in the same module then use
 * AsyncContainerModule and manually wrap functions you need.
 * @see tokenBinder
 */
export class AsyncTokenContainerModule extends AsyncContainerModule {
  public constructor(registry: interfaces.AsyncTokenContainerModuleCallback) {
    super(async (bind, unbind, isBound, rebind) => {
      await registry(
        tokenBinder(bind),
        tokenUnbinder(unbind),
        tokenIsBound(isBound),
        tokenRebinder(rebind),
      );
    });
  }
}
