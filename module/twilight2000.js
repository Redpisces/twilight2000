// Import Modules
import { TwilightTKActor } from "./actor/actor.js";
import { TwilightTKActorSheet } from "./actor/actor-sheet.js";
import { TwilightTKItem } from "./item/item.js";
import { TwilightTKItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.twilight2000 = {
    TwilightTKActor,
    TwilightTKItem
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
  CONFIG.Actor.entityClass = TwilightTKActor;
  CONFIG.Item.entityClass = TwilightTKItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("twilight2000", TwilightTKActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("twilight2000", TwilightTKItemSheet, { makeDefault: true });

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
  
  Handlebars.registerHelper('checked',function (currentValue){
      return currentValue == true ? 'checked':'';
  });
});
