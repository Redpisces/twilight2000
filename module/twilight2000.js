// Import Modules
import { TwilightTwoThousandActor } from "./actor/actor.js";
import { TwilightTwoThousandActorSheet } from "./actor/actor-sheet.js";
import { TwilightTwoThousandItem } from "./item/item.js";
import { TwilightTwoThousandItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.twilight2000 = {
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
  Actors.registerSheet("twilight2000", TwilightTwoThousandActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("twilight2000", TwilightTwoThousandItemSheet, { makeDefault: true });

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
  
  Handlebars.registerHelper('ifEquals',function(arg1,arg2,options){
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
});
