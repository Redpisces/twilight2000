/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TwilightTKActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["twilight2000", "sheet", "actor"],
      //template: "systems/twilight2000/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get template(){
   const path = "systems/twilight2000/templates/actor";
   return `${path}/${this.actor.data.type}-sheet.html`;
  }
  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    if (data.data.attributes){
      for (let attr of Object.values(data.data.attributes)) {
        attr.isCheckbox = attr.dtype === "Boolean";
      }
    }
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
    
    html.find('.addskill').click(this._addSkill.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }
  _addSkill(event){
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    
    if (dataset.group){
      let group=this.actor.data.data.attributes[dataset.group];
      let randomid='_' + Math.random().toString(36).substr(2, 9);

      //this.actor.data.data.attributes[dataset.group].custom_skills.set("ASDF",0);
      this.actor.update({['data.attributes.'+dataset.group+'.custom_skills.'+randomid+'.name']:null});
      this.actor.update({['data.attributes.'+dataset.group+'.custom_skills.'+randomid+'.value']:null})

    }
    
    
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    /*if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        template: "systems/twilight2000/templates/chat/skill-roll.html",
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }*/
    if (dataset.type==="custom_skill"){
      let roll= new Roll("1d20");
      roll = await roll.evaluate();
      const skill={name:dataset.skill_name,value:parseInt(dataset.skill_value)};
      const attribute={name:dataset.attribute_name,value:parseInt(dataset.attribute_value)};
      let asset=-1;
      if (dataset.max_asset){
        asset=Math.min(skill.value+attribute.value,dataset.max_asset);
      } else {
        asset=Math.min(skill.value+attribute.value,19);
      }
      let data={
        actor:this.actor,
        skill:skill,
        attribute:attribute,
        difficulty:{value:1},
        target:(asset)*1,
        roll:roll.result
      }
      if (roll.result <= data.target-10) {data.result="Outstanding Success";}
      else if (roll.result == 1) {data.result="Success";}
      else if (roll.result > data.target+10) {data.result="Catastrophic Failure";}
      else if (roll.result <= data.target) {data.result="Success";}
      else if (roll.result > data.target) {data.result="Failure";}
      else {data.result="ERROR"};
      
      
      var content= await renderTemplate("systems/twilight2000/templates/chat/skill-roll.html",data);
      
      ChatMessage.create({content:content});
    }
  }

}
