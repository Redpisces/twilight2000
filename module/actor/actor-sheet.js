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
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
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
    
    html.find('.toggleeditmode').click(this._toggleEditMode.bind(this));

    html.find('.deleteskill').click(this._deleteSkill.bind(this));
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
      this.actor.update({['data.attributes.'+dataset.group+'.skills.'+randomid+'.name']:null});
      this.actor.update({['data.attributes.'+dataset.group+'.skills.'+randomid+'.value']:null});

    }
    
    
  }
  _deleteSkill(event){
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    
    if (dataset.group){
      let group=this.actor.data.data.attributes[dataset.group];

      let prop=`data.attributes.${dataset.group}.skills.`;
      this.actor.update({[prop+(`${dataset.skill_id}.-=name`)]:null});
      this.actor.update({[prop+(`${dataset.skill_id}.-=value`)]:null});
      this.actor.update({[prop+(`-=${dataset.skill_id}`)]:null});
      console.log(`${this.actor.id} deleted skill ${dataset.skill_id}`);
      //console.log(prop);
      //console.log(this.actor.data.data.attributes[dataset.group].skills);
      this.render();
    }  
  }
  _toggleEditMode(event){
    if (this.options.editmode){
      setProperty(this.options,'editmode',null);
    } else {
      setProperty(this.options,'editmode',true);
    }
    this.render();
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
      let d = new Dialog({
        title:"Skill Check",
        content:"<p>Choose Difficulty</p>",
        buttons:{
          easy:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Easy",
            callback: ()=> _skillroll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Easy", value:4}}))
          },
          average:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Average",
            callback: ()=> _skillroll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Average", value:2}}))
          },
          difficult:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Difficult",
            callback: ()=> _skillroll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Difficult", value:1}}))
          },
          formidable:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Formidable",
            callback: ()=> _skillroll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Formidable", value:0.5}}))
          },
          impossible:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Impossible",
            callback: ()=> _skillroll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Impossible", value:0.25}}))
          }
        },
        default:"difficult"
        //render: html => console.log("Register interactivity in the rendered dialog"),
        //close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);

    }
    
    else if (dataset.type==="attack-fire"){
      let d = new Dialog({
        title:"Attack check",
        content:"<p>Choose Difficulty</p>",
        buttons:{
          easy:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Easy",
            callback: ()=> _attackFireRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Easy", value:4}}))
          },
          average:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Average",
            callback: ()=> _attackFireRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Average", value:2}}))
          },
          difficult:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Difficult",
            callback: ()=> _attackFireRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Difficult", value:1}}))
          },
          formidable:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Formidable",
            callback: ()=> _attackFireRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Formidable", value:0.5}}))
          },
          impossible:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Impossible",
            callback: ()=> _attackFireRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Impossible", value:0.25}}))
          }
        },
        default:"difficult"
        //render: html => console.log("Register interactivity in the rendered dialog"),
        //close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);

    }
    
    else if (dataset.type==="attack-melee"){
      let d = new Dialog({
        title:"Attack check",
        content:"<p>Choose Difficulty</p>",
        buttons:{
          easy:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Easy",
            callback: ()=> _attackMeleeRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Easy", value:4}}))
          },
          average:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Average",
            callback: ()=> _attackMeleeRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Average", value:2}}))
          },
          difficult:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Difficult",
            callback: ()=> _attackMeleeRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Difficult", value:1}}))
          },
          formidable:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Formidable",
            callback: ()=> _attackMeleeRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Formidable", value:0.5}}))
          },
          impossible:{
            icon:'<i class= :fas fa-check"></i>',
            label:"Impossible",
            callback: ()=> _attackMeleeRoll(this.actor.id,Object.assign({},dataset,{difficulty:{name:"Impossible", value:0.25}}))
          }
        },
        default:"difficult"
        //render: html => console.log("Register interactivity in the rendered dialog"),
        //close: html => console.log("This always is logged no matter which option is chosen")
       });
       d.render(true);

    }
  }

}

async function _attackMeleeRoll(actorId,dataset={}){
  let roll= new Roll("1d20");
  
  let actor=game.actors.get(actorId);
  let gun=actor.data.data.melee_weapons[dataset.weapon];
  let target=gun.asset*dataset.difficulty.value;
  let damageRoll=new Roll(gun.damage);
  target= Math.min(Math.max(target,1),19);
  await roll.evaluate();
  
  let data={
    actor: game.actors.get(actorId),
    gun:gun,
    difficulty:dataset.difficulty,
    target:target,
    roll:roll.total,
    location:new Roll("1d10").evaluate().result
  }
  await damageRoll.evaluate();
  
  
  data.details=damageRoll.terms[0].results;
  data.formula=damageRoll.formula;
  if (roll.result <= target-10) {data.result=damageRoll.total*2+" damage";}
  else if (roll.total == 1) {data.result=damageRoll.total+" damage";}
  else if (roll.total > target+10) {data.result="Catastrophic Failure";}
  else if (roll.total <= target) {data.result=damageRoll.total+" damage";}
  else if (roll.total > target) {data.result="Miss";}
  else {data.result="ERROR"};
  
  
  var content= await renderTemplate("systems/twilight2000/templates/chat/attack-fire-roll.html",data);
  
  ChatMessage.create({content:content});
  
}

async function _attackFireRoll(actorId,dataset={}){
  let roll= new Roll("1d20");
  
  let actor=game.actors.get(actorId);
  let gun=actor.data.data.missile_weapons[dataset.weapon];
  let target=gun.asset*dataset.difficulty.value;
  let damageRoll=(gun.damage>=0) ? new Roll(gun.damage+"d6") : new Roll("1d6-1");
  target= Math.min(Math.max(target,1),17);
  console.log(target);
  await roll.evaluate();
  
  let data={
    actor: game.actors.get(actorId),
    gun:gun,
    difficulty:dataset.difficulty,
    target:target,
    roll:roll.total,
    location:new Roll("1d10").evaluate().result
  }
  await damageRoll.evaluate();
  let pen = (gun.pen) ? gun.pen : "nil";
  
  data.details=damageRoll.terms[0].results;
  data.formula=damageRoll.formula;
  if (roll.total <= target-10) {data.result=damageRoll.total*2+" damage "+"(pen:"+pen+")";}
  else if (roll.total == 1) {data.result=damageRoll.total+" damage "+"("+"(pen:"+pen+")";}
  else if (roll.total > target+10) {data.result="Catastrophic Failure";}
  else if (roll.total <= target) {data.result=damageRoll.total+" damage "+"(pen:"+pen+")";}
  else if (roll.total > target) {data.result="Miss";}
  else {data.result="ERROR"};
  
  
  var content= await renderTemplate("systems/twilight2000/templates/chat/attack-fire-roll.html",data);
  
  ChatMessage.create({content:content});
  
}

async function _skillroll(actorId,dataset={}){
  let roll= new Roll("1d20");
  roll = await roll.evaluate();

  let skill={};
  if (dataset.skill_value){
    skill={name:dataset.skill_name,value:parseInt(dataset.skill_value),untrained:false};
  }else{
    skill={name:dataset.skill_name,value:0,untrained:true};
  }
  let attribute={name:dataset.attribute_name,value:dataset.attribute_value}

  if (skill.untrained) {dataset.difficulty.value=dataset.difficulty.value/2;}

  /**let target=-1;
  if (dataset.max_asset){
    target=Math.min(Math.max((skill.value+attribute.value)*dataset.difficulty.value,1),dataset.max_asset);
  } else {
    target=Math.min(Math.max((skill.value+attribute.value)*dataset.difficulty.value,1),19);
  }
  console.log(skill.value+"+"+attribute.value+"*"+dataset.difficulty.value,target);*/
  let target=(parseInt(skill.value)+parseInt(attribute.value))*parseInt(dataset.difficulty.value);
  console.log(skill.value,attribute.value,dataset.difficulty.value);
  console.log(target);
  
  let data={
    actor: game.actors.get(actorId),
    skill:skill,
    attribute:attribute,
    difficulty:dataset.difficulty,
    target:target,
    roll:roll.result
  }
  
  if (roll.result <= target-10) {data.result="Outstanding Success";}
  else if (roll.result == 1) {result="Success";}
  else if (roll.result > target+10) {data.result="Catastrophic Failure";}
  else if (roll.result <= target) {data.result="Success";}
  else if (roll.result > target) {data.result="Failure";}
  else {data.result="ERROR"};
  
  
  var content= await renderTemplate("systems/twilight2000/templates/chat/skill-roll.html",data);
  
  ChatMessage.create({content:content});
      
}
