/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TwilightTKActor extends Actor {

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
    /*for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }*/
    if (data.health){
      for (let [key,part] of Object.entries(data.health.parts)){
          
          if (key === "head"){
              part.hit_capacity=data.attributes.con.value*2;
          } else if (key === "chest"){
              part.hit_capacity=(data.attributes.str.value+data.attributes.con.value)*3;
          } else {
              part.hit_capacity=(data.attributes.str.value+data.attributes.con.value)*2;
          }
          part.thr_1=`1-${Math.floor(part.hit_capacity/2)}`;
          part.thr_2=`${Math.floor(part.hit_capacity/2)+1}-${part.hit_capacity}`;
          part.thr_3=`${part.hit_capacity+1}-${part.hit_capacity*2}`;
          part.thr_4=`${part.hit_capacity*2+1}+`;
      }
    }
  }

}
