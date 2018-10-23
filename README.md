# inversify-token

[![npm](https://img.shields.io/npm/v/inversify-token.svg)](https://www.npmjs.com/package/inversify-token)
[![CircleCI](https://img.shields.io/circleci/project/github/mscharley/inversify-token.svg)](https://circleci.com/gh/mscharley/inversify-token)

**Source:** [https://github.com/mscharley/inversify-token](https://github.com/mscharley/inversify-token)  
**Author:** Matthew Scharley  
**Contributors:** [See contributors on GitHub][gh-contrib]  
**Bugs/Support:** [Github Issues][gh-issues]  
**Copyright:** 2018  
**License:** [MIT license][license]  
**Status:** Active

## Synopsis

This library provides simpler, more type-safe options for injecting values using Inversify.

## Installation

    $ npm i inversify-token

## Usage

This library is a bit of an experiment. While functional, I'm still on the fence about whether it's a good idea.

Modified from the [InversifyJS readme](inversify-readme).

```ts
// Declare your interfaces as normal.

// file types.ts
import { Token, TokenType } from "inversify-token";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces"

const WarriorToken = new Token<Warrior>(Symbol.for("Warrior"));
type WarriorToken = TokenType<typeof WarriorToken>;
const WeaponToken = new Token<Weapon>(Symbol.for("Weapon"));
type WeaponToken = TokenType<typeof WeaponToken>;
const ThrowableWeaponToken = new Token<ThrowableWeapon>(Symbol.for("ThrowableWeapon"));
type ThrowableWeaponToken = TokenType<typeof ThrowableWeaponToken>;

export {
    WarriorToken as Warrior,
    WeaponToken as Weapon,
    ThrowableWeaponToken as ThrowableWeapon,
}

// file entities.ts
import { injectable } from "inversify";
import { injectToken } from "inversify-token";
import * as TYPES from "./types";

@injectable()
class Ninja implements Warrior {

    public constructor(
        @injectToken(TYPES.Weapon) private _katana: TYPES.Weapon,
        @injectToken(TYPES.ThrowableWeapon) private _shuriken: TYPES.ThrowableWeapon,
    ) { }

    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }

}

// file inversify.config.ts
import { getToken, tokenBinder } from "inversify-token";

const myContainer = new Container();
const bindToken = tokenBinder(myContainer.bind.bind(myContainer));
bindToken(TYPES.Warrior).to(Ninja);
bindToken(TYPES.Weapon).to(Katana);
bindToken(TYPES.ThrowableWeapon).to(Shuriken);
const warrior = getToken(container, TYPES.Warrior);

// file inversify.module.ts
import { getToken, TokenContainerModule } from "inversify-token";

const myContainer = new Container();
const module = new TokenContainerModule((bindToken) => {
    bindToken(TYPES.Warrior).to(Ninja);
    bindToken(TYPES.Weapon).to(Katana);
    bindToken(TYPES.ThrowableWeapon).to(Shuriken);
});
myContainer.load(module);
const warrior = getToken(container, TYPES.Warrior);
```

  [gh-contrib]: https://github.com/mscharley/inversify-token/graphs/contributors
  [gh-issues]: https://github.com/mscharley/inversify-token/issues
  [license]: https://github.com/mscharley/inversify-token/blob/master/LICENSE
  [inversify-readme]: https://github.com/inversify/InversifyJS#the-basics
