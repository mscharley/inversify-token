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
import { Token } from "inversify-token";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces.ts"

const TYPES = {
    Warrior: new Token<Warrior>(Symbol.for("Warrior")),
    Weapon: new Token<Weapon>(Symbol.for("Weapon")),
    ThrowableWeapon: new Token<ThrowableWeapon>(Symbol.for("ThrowableWeapon")),
}

// file entities.ts
import { injectToken, TokenType } from "inversify-token";

@injectable()
class Ninja implements Warrior {

    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(
        @injectToken(TYPES.Weapon) katana: TokenType<typeof TYPES["Weapon"]>,
        @injectToken(TYPES.ThrowableWeapon) shuriken: TokenType<typeof TYPES["ThrowableWeapon"]>,
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }

}

// file inversify.config.ts
import { tokenBinder } from "inversify-token";

const myContainer = new Container();
const bindToken = tokenBinder(myContainer.bind.bind(myContainer));
// or bindToken = tokenBinder(bind) in a ModuleContainer.
bindToken(TYPES.Warrior).to(Ninja);
bindToken(TYPES.Weapon).to(Katana);
bindToken(TYPES.ThrowableWeapon).to(Shuriken);
```

  [gh-contrib]: https://github.com/mscharley/inversify-token/graphs/contributors
  [gh-issues]: https://github.com/mscharley/inversify-token/issues
  [license]: https://github.com/mscharley/inversify-token/blob/master/LICENSE
  [inversify-readme]: https://github.com/inversify/InversifyJS#the-basics
