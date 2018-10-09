import "reflect-metadata";

import { Container, ContainerModule, injectable, interfaces } from "inversify";
import { getToken, injectToken, Token, tokenBinder, TokenType } from "./";

// tslint:disable:max-classes-per-file

export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  throw(): string;
}

const TOKENS = {
  ThrowableWeapon: new Token<ThrowableWeapon>(Symbol.for("ThrowableWeapon")),
  Warrior: new Token<Warrior>(Symbol.for("Warrior")),
  Weapon: new Token<Weapon>(Symbol.for("Weapon")),
};

@injectable()
class Katana implements Weapon {
  public hit() {
    return "cut!";
  }
}

@injectable()
class Shuriken implements ThrowableWeapon {
  public throw() {
    return "hit!";
  }
}

@injectable()
class Ninja implements Warrior {

  public constructor(
    @injectToken(TOKENS.Weapon) private _katana: TokenType<typeof TOKENS["Weapon"]>,
    @injectToken(TOKENS.ThrowableWeapon) private _shuriken: TokenType<typeof TOKENS["ThrowableWeapon"]>,
  ) {}

  public fight() {
    return this._katana.hit();
  }

  public sneak() {
    return this._shuriken.throw();
  }
}

const testContainer = (c: interfaces.Container) => {
  const ninja = getToken(c, TOKENS.Warrior);

  if (ninja.fight() !== "cut!") {
    throw new Error("Unexpected value for ninja fighting!");
  }
  if (ninja.sneak() !== "hit!") {
    throw new Error("Unexpected value for ninja sneaking!");
  }
};

const myContainer = new Container();
const bindToken = tokenBinder(myContainer.bind.bind(myContainer) as typeof myContainer["bind"]);
bindToken(TOKENS.ThrowableWeapon).to(Shuriken);
bindToken(TOKENS.Warrior).to(Ninja);
bindToken(TOKENS.Weapon).to(Katana);
testContainer(myContainer);

const moduleContainer = new Container();
const module = new ContainerModule((bind) => {
  // tslint:disable-next-line:no-shadowed-variable
  const bindToken = tokenBinder(bind);
  bindToken(TOKENS.ThrowableWeapon).to(Shuriken);
  bindToken(TOKENS.Warrior).to(Ninja);
  bindToken(TOKENS.Weapon).to(Katana);
});
moduleContainer.load(module);
testContainer(moduleContainer);

// tslint:disable-next-line:no-console
console.log("***TESTS SUCCESSFUL***");
