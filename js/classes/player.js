// BalanceDruid.js
// Bas-simulator för Balance Druid. Anpassad för att vara enkel att bygga vidare på!

class BalanceDruid {
  static getConfig() {
    return {
      level: parseInt($('input[name="level"]').val()),
      race: $('select[name="race"]').val(),
      reactionmin: parseInt($('input[name="reactionmin"]').val()),
      reactionmax: parseInt($('input[name="reactionmax"]').val()),
      spellqueueing: $('select[name="spellqueueing"]').val() === "Yes",
      target: {
        level: parseInt($('input[name="targetlevel"]').val()),
        basearmor: parseInt($('select[name="targetbasearmor"]').val() || $('input[name="targetcustomarmor"]').val()),
        resistance: parseInt($('input[name="targetresistance"]').val()),
        speed: parseFloat($('input[name="targetspeed"]').val()) * 1000,
      },
    };
  }

  constructor(config) {
    if (!config) config = BalanceDruid.getConfig();
    this.level = config.level;
    this.race = config.race;
    this.reactionmin = config.reactionmin;
    this.reactionmax = config.reactionmax;
    this.spellqueueing = config.spellqueueing;
    this.target = config.target;

    // Grundstats för Balance Druid
    this.base = {
      intellect: 150,
      spirit: 120,
      spellcrit: 5,
      spelldmg: 300,
      haste: 1,
      dmgmod: 1,
      spellhit: 0,
      resist: {
        shadow: 0,
        arcane: 0,
        nature: 0,
        fire: 0,
        frost: 0,
      },
    };

    this.auras = {};
    this.spells = {};
    this.initSpells();
    this.initAuras();
    this.update();
  }

  initSpells() {
    this.spells = {
      moonfire: new Moonfire(this),
      wrath: new Wrath(this),
      starfire: new Starfire(this),
      insectswarm: new InsectSwarm(this),
    };
  }

  initAuras() {
    this.auras.moonkinform = new MoonkinForm(this);
    // Lägg till fler auras om du vill!
  }

  update() {
    this.stats = { ...this.base }; // Klona basen
    // Lägg till auras
    for (let aura in this.auras) {
      if (this.auras[aura].active) {
        for (let prop in this.auras[aura].stats)
          this.stats[prop] += this.auras[aura].stats[prop];
      }
    }
    this.updateSpellCrit();
  }

  updateSpellCrit() {
    this.stats.spellcrit += this.stats.intellect / 80; // Exempel: 1% spellcrit / 80 int
  }

  cast(spellName) {
    let spell = this.spells[spellName];
    if (!spell) return;

    let result = this.rollSpell(spell);
    let dmg = spell.dmg();

    if (result === 'crit') dmg *= 1.5;
    if (result === 'miss') dmg = 0;

    console.log(`Cast ${spellName} for ${~~dmg} (${result})`);
    return dmg;
  }

  rollSpell(spell) {
    if (Math.random() * 100 < this.stats.spellcrit) return 'crit';
    if (Math.random() * 100 < (this.target.resistance / 10)) return 'miss';
    return 'hit';
  }
}

// Spell-klasser
class Moonfire {
  constructor(player) {
    this.player = player;
  }
  dmg() {
    let baseDmg = 150;
    return baseDmg + this.player.stats.spelldmg * 0.2;
  }
}

class Wrath {
  constructor(player) {
    this.player = player;
  }
  dmg() {
    let baseDmg = 180;
    return baseDmg + this.player.stats.spelldmg * 0.3;
  }
}

class Starfire {
  constructor(player) {
    this.player = player;
  }
  dmg() {
    let baseDmg = 300;
    return baseDmg + this.player.stats.spelldmg * 0.4;
  }
}

class InsectSwarm {
  constructor(player) {
    this.player = player;
  }
  dmg() {
    let baseDmg = 100;
    return baseDmg + this.player.stats.spelldmg * 0.15;
  }
}

class MoonkinForm {
  constructor(player) {
    this.player = player;
    this.active = true;
    this.stats = {
      spellcrit: 5, // +5% spellcrit
    };
  }
}

// Export (om du kör Node.js / ES-moduler)
// export default BalanceDruid;