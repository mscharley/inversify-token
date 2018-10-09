import { inject, interfaces, multiInject } from "inversify";

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

  constructor(
    public readonly identifier: string | symbol,
  ) {}
}

/**
 * Extract the type of a token for use with injection.
 */
export type TokenType<T extends Token<any>> = T["_witness"];

/**
 * Get an item represented by a token from a container.
 */
export const getToken = <T extends Token<any>>(container: interfaces.Container, token: T): TokenType<T> =>
  container.get<TokenType<T>>(token.identifier);

/**
 * Inject an item represented by a token.
 */
export const injectToken = <T extends Token<any>>(token: T): ReturnType<typeof inject> =>
  inject(token.identifier);

/**
 * Inject multiple items represented by a token.
 */
export const multiInjectToken = <T extends Token<any>>(token: T): ReturnType<typeof multiInject> =>
  multiInject(token.identifier);

/**
 * Wrap a bind function to allow binding tokens.
 */
export const tokenBinder =
  (bind: interfaces.Bind) =>
  <T extends Token<any>>(token: T): interfaces.BindingToSyntax<TokenType<T>> =>
    bind<TokenType<T>>(token.identifier);
