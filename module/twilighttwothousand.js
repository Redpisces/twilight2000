// Import Modules
import { TwilightTwoThousandActor } from "./actor/actor.js";
import { TwilightTwoThousandActorSheet } from "./actor/actor-sheet.js";
import { TwilightTwoThousandItem } from "./item/item.js";
import { TwilightTwoThousandItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.twilighttwothousand = {
    TwilightTwoThousandActor,
    TwilightTwoThousandItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = TwilightTwoThousandActor;
  CONFIG.Item.entityClass = TwilightTwoThousandItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("twilighttwothousand", TwilightTwoThousandActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("twilighttwothousand", TwilightTwoThousandItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});