import 'reflect-metadata';

import {
  AsyncTokenContainerModule,
  getToken,
  injectToken,
  multiInjectToken,
  Token,
  tokenBinder,
  TokenContainerModule,
  TokenType,
} from './';
import { Container, ContainerModule, injectable } from 'inversify';
import type { interfaces } from 'inversify';

export interface Warrior {
  fight: () => string;
  sneak: () => string;
}

export interface Weapon {
  hit: () => string;
}

export interface ThrowableWeapon {
  throw: () => string;
}

const TOKENS = {
  ThrowableWeapon: new Token<ThrowableWeapon>(Symbol.for('ThrowableWeapon')),
  Warrior: new Token<Warrior>(Symbol.for('Warrior')),
  Weapon: new Token<Weapon>(Symbol.for('Weapon')),
};

@injectable()
class Katana implements Weapon {
  public hit(): string {
    return 'cut!';
  }
}

@injectable()
class Shuriken implements ThrowableWeapon {
  public throw(): string {
    return 'hit!';
  }
}

@injectable()
class Ninja implements Warrior {
  public constructor(
    @multiInjectToken(TOKENS.Weapon)
    private readonly _katanas: Array<TokenType<typeof TOKENS['Weapon']>>,
    @injectToken(TOKENS.ThrowableWeapon)
    private readonly _shuriken: TokenType<typeof TOKENS['ThrowableWeapon']>,
  ) {}

  public fight(): string {
    return this._katanas.map((k) => k.hit()).join(' ');
  }

  public sneak(): string {
    return this._shuriken.throw();
  }
}

const testContainer = (c: interfaces.Container): void => {
  const ninja = getToken(c, TOKENS.Warrior);

  if (ninja.fight() !== 'cut! cut!') {
    throw new Error('Unexpected value for ninja fighting!');
  }
  if (ninja.sneak() !== 'hit!') {
    throw new Error('Unexpected value for ninja sneaking!');
  }
};

/* eslint-disable no-console */
const runTests = async (): Promise<void> => {
  console.log('*** TESTING CONTAINER ***');
  const myContainer = new Container();
  const containerBindToken = tokenBinder(myContainer.bind.bind(myContainer) as typeof myContainer['bind']);
  containerBindToken(TOKENS.ThrowableWeapon).to(Shuriken);
  containerBindToken(TOKENS.Warrior).to(Ninja);
  containerBindToken(TOKENS.Weapon).to(Katana);
  containerBindToken(TOKENS.Weapon).to(Katana);
  testContainer(myContainer);

  console.log('*** TESTING MODULE ***');
  const moduleContainer = new Container();
  const module = new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);
    bindToken(TOKENS.ThrowableWeapon).to(Shuriken);
    bindToken(TOKENS.Warrior).to(Ninja);
    bindToken(TOKENS.Weapon).to(Katana);
    bindToken(TOKENS.Weapon).to(Katana);
  });
  moduleContainer.load(module);
  testContainer(moduleContainer);

  console.log('*** TESTING TOKEN MODULE ***');
  const tokenModuleContainer = new Container();
  const tokenModule = new TokenContainerModule((bindToken) => {
    bindToken(TOKENS.ThrowableWeapon).to(Shuriken);
    bindToken(TOKENS.Warrior).to(Ninja);
    bindToken(TOKENS.Weapon).to(Katana);
    bindToken(TOKENS.Weapon).to(Katana);
  });
  tokenModuleContainer.load(tokenModule);
  testContainer(tokenModuleContainer);

  console.log('*** TESTING ASYNC TOKEN MODULE ***');
  const asyncTokenModuleContainer = new Container();
  const asyncTokenModule = new AsyncTokenContainerModule(async (bindToken) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    bindToken(TOKENS.ThrowableWeapon).to(Shuriken);
    bindToken(TOKENS.Warrior).to(Ninja);
    bindToken(TOKENS.Weapon).to(Katana);
    bindToken(TOKENS.Weapon).to(Katana);
  });
  await asyncTokenModuleContainer.loadAsync(asyncTokenModule);
  testContainer(asyncTokenModuleContainer);
};

runTests()
  .then(() => {
    console.log('*** TESTS SUCCESSFUL ***');
  })
  .catch((e) => {
    console.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
