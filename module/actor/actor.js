/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TwilightTwoThousandActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Make modifications to data here. For example:

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
    
    for (let [key, part] of Object.entries(data.health)){
    var hitCapacity;
        if (key === 'chest'){
            hitCapacity = data.abilities.con.value*3;
            
        } else if (key==='head'){
            hitCapacity = data.abilities.con.value*2;
        }
        else {
            hitCapacity = data.abilities.con.value+data.abilities.str.value;
        }
        part.th_scratch = "1"+"-"+Math.floor(hitCapacity/2);
        part.th_slight = Math.floor(hitCapacity/2)+"-"+hitCapacity;
        part.th_serious = hitCapacity+"-"+hitCapacity*2;
        part.th_critical = hitCapacity*2+1+"+";
    }
  }

}
