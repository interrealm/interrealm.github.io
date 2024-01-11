Game.registerMod("Golden Eye", {
  init: function () {
    Game.registerHook("logic", () => {
      Game.shimmers.forEach((element) => {
        if (element.ident === undefined) {
          element.ident = nextID++;
          if (element.type === "golden") {
            Game.attachTooltip(
              element.l,
              (function (element) {
                return function () {
                  return getForecastHTML(popPredict(element));
                };
              })(element)
            );
          } else if (element.type === "reindeer") {
            Game.attachTooltip(
              element.l,
              (function (element) {
                return function () {
                  return getForecastHTML(popPredictReindeer(element));
                };
              })(element)
            );
          }
        }
      });
    });
  },
});

class Foresight {
  achievs = [];
  unlocks = [];
  notes = [];
  duration = null;
  power = null;
  effect = null;
  amount = null;
  obj = null;
  blah = null;

  fill(effect, time, power, obj, blah) {
    this.effect = effect;
    this.duration = time;
    this.power = power;
    this.obj = obj;
    this.blah = blah;
  }
}

let nextID = 0;

function getForecastHTML(foresight) {
  /*
  Possible things:
  building buff
  building debuff
  free sugar lump
  frenzy
  dragon harvest
  everything must go
  multiply cookies
  ruin cookies
  blood frenzy
  clot
  cursed finger
  click frenzy
  dragonflight
  chain cookie
  cookie storm
  cookie storm drop
  blab
  */
  const goodies = [
    "building buff",
    "free sugar lump",
    "frenzy",
    "dragon harvest",
    "everything must go",
    "multiply cookies",
    "blood frenzy",
    "click frenzy",
    "dragonflight",
    "chain cookie",
    "cookie storm",
    "cookie storm drop",
    "hohoho",
  ];
  const outcasts = [
    "building debuff",
    "ruin cookies",
    "clot",
    "cursed finger",
    "blab",
  ];
  let formalName = Game.buffTypesByName[foresight.effect]?.func(
    foresight.duration,
    foresight.power,
    foresight.obj
  )?.name;
  let description = Game.buffTypesByName[foresight.effect]?.func(
    foresight.duration,
    foresight.power,
    foresight.obj
  )?.desc;

  if (foresight.effect === "free sugar lump") {
    description = "Sweet!";
    formalName = "Free Sugar Lump";
  } else if (foresight.effect === "cookie storm drop") {
    description = `Will earn you ${LBeautify(foresight.amount).b} cookies.`;
    formalName = "Cookie Storm Drop";
  } else if (foresight.effect === "blab") {
    description = foresight.blab;
    formalName = "Blab!";
  } else if (foresight.effect === "ruin cookies") {
    description = `Will lose you ${LBeautify(foresight.amount).b} cookies.`;
    formalName = "Ruin";
  } else if (foresight.effect === "multiply cookies") {
    description = `Will earn you ${LBeautify(foresight.amount).b} cookies.`;
    formalName = "Lucky";
  } else if (foresight.effect === "hohoho") {
    description = `Will earn you ${LBeautify(foresight.amount).b} cookies.`;
    formalName = foresight.obj;
  }

  let notesHTML = "",
    upgradesHTML = "",
    achievsHTML = "";
  for (let i = 0; i < foresight.achievs.length; i++) {
    const achiev = foresight.achievs[i];
    achievsHTML = achievsHTML.concat(
      `<span class="green">Clicking this will win the <b>${achiev}</b> achievement. </span>. `
    );
  }
  for (let i = 0; i < foresight.unlocks.length; i++) {
    const unlock = foresight.unlocks[i];
    upgradesHTML = upgradesHTML.concat(
      `<span class="green">Clicking this will unlock the <b>${unlock}</b> upgrade. </span>. `
    );
  }
  for (let i = 0; i < foresight.notes.length; i++) {
    const note = foresight.notes[i];
    notesHTML = notesHTML.concat(`<span>${note}</span> `);
  }

  return `<div style="padding: 8px 4px; min-width: 350px" id="tooltipGod">
  <div class="icon" style="
      float: left;
      margin-left: -8px;
      margin-top: -8px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAnxJREFUaEPtmU9EREEcx3dbkU4RRYdEHVq2jSKiunQqSyzZQ6e6dFoiSkkp6RCx7CmiOq5YYhWRqIgo2pbtEukQdaljZBW/7Rvv500z7+0+NWO7jDfz3jPf7+f3Z97m92n+59d8/76KgL8mWCFgHIGZVt+niqj1+/LkX9lDSDsBfMPxtSABaIr02ILYG9+n+eurN8u6WyIlE9BWADYOxxvDLeRooLmBxsLjiy0BrGORE3FKwjUBbQXwjSPWueNwuqp2x0Li427Yco37njKXNJ+cz9OoSsIxAW0FYONd3XXk0Oj2CI25RIbG0FTE4qwsB0AGRNySUCZgjIDVzBA5nU8XYxbOw3HM528KtlUo2Bmg+WC02Ceq2w9o5CTmwrtKueCYgHYCREmL2IeT6aULcmzzPU5jf6jPlsBZ7pzmJ2uSv+aSalWSEtBWgKhRIcZFzp8kVsjZxa0jC4HB8C1dH2c7aOQkYqlX21xAbi1EDm1zQkjAGAFI2ufsAzmAMw+PeZnzA7Fpev40teGIBKrUbFvRa96hpQS0F4DTJgLaKQE8x3MA8zwXosu9tMT7jKgvSAloLwBnH5EzOM+j/otygTcF1X4g+16QEtBWABzjhzhOQtYP8B70BVnM4314TlT/sa7ciUUk/r0ATmJsot4SzqWeRvEdwM9WMueVCRgnAKGEcz0EIpS4o7z68C837jw6vuq3sTQHRMmsnQDVqoT7uNOYh+OcnFPnHeeAMQJkIYVcwFmG5wCv826dd03AGAFcCK5RpX5i/PtXCB7zqPOYV/0ljhNVrkL8QWMEcGHa/YPDOAGiUPNqvuQc8Gpjqu+tCFB1yqv7KgS8clb1vV+k8GRPg8OCFwAAAABJRU5ErkJggg==');
      background-size: 48px;
    "></div>
  <div class="name" ${
    goodies.includes(foresight.effect)
      ? 'class="green"'
      : outcasts.includes(foresight.effect)
      ? 'class="red"'
      : ""
  }>Effect: ${formalName}</div>
  <div class="line"></div>
  <div class="description">
      <div style="margin: 6px 0px; font-weight: bold">${description}</div>
      <div class="templeEffect templeEffect1">
          ${achievsHTML}
      </div>
      <div class="templeEffect templeEffect2">
          ${upgradesHTML}
      </div>
      <div class="templeEffect templeEffect3">
          ${notesHTML}
      </div>
      </div>
  </div>
</div>`;
}

const randoms = {};

function getRandom(ind, shimmer) {
  shimmerIdent = shimmer.ident;
  if (randoms[shimmerIdent] === undefined) randoms[shimmerIdent] = [];
  if (randoms[shimmerIdent][ind] === undefined)
    randoms[shimmerIdent][ind] = Math.random();
  return randoms[shimmerIdent][ind];
}

function chooseBetter(arr, ind, shimmer) {
  return arr[Math.floor(getRandom(ind, shimmer) * arr.length)];
}

Game.shimmerTypes.golden.popFunc = function (me) {
  if (me.l.matches(":hover")) Game.tooltip.shouldHide = 1;
  //get achievs and stats
  if (me.spawnLead) {
    Game.goldenClicks++;
    Game.goldenClicksLocal++;

    if (Game.goldenClicks >= 1) Game.Win("Golden cookie");
    if (Game.goldenClicks >= 7) Game.Win("Lucky cookie");
    if (Game.goldenClicks >= 27) Game.Win("A stroke of luck");
    if (Game.goldenClicks >= 77) Game.Win("Fortune");
    if (Game.goldenClicks >= 777) Game.Win("Leprechaun");
    if (Game.goldenClicks >= 7777) Game.Win("Black cat's paw");
    if (Game.goldenClicks >= 27777) Game.Win("Seven horseshoes");

    if (Game.goldenClicks >= 7) Game.Unlock("Lucky day");
    if (Game.goldenClicks >= 27) Game.Unlock("Serendipity");
    if (Game.goldenClicks >= 77) Game.Unlock("Get lucky");

    if (me.life / Game.fps > me.dur - 1) Game.Win("Early bird");
    if (me.life < Game.fps) Game.Win("Fading luck");

    if (me.wrath) Game.Win("Wrath cookie");
  }

  if (Game.forceUnslotGod) {
    if (Game.forceUnslotGod("asceticism")) Game.useSwap(1000000);
  }

  //select an effect
  var list = [];
  if (me.wrath > 0) list.push("clot", "multiply cookies", "ruin cookies");
  else list.push("frenzy", "multiply cookies");
  if (me.wrath > 0 && Game.hasGod && Game.hasGod("scorn"))
    list.push("clot", "ruin cookies", "clot", "ruin cookies");
  if (me.wrath > 0 && getRandom(0, me) < 0.3)
    list.push("blood frenzy", "chain cookie", "cookie storm");
  else if (getRandom(1, me) < 0.03 && Game.cookiesEarned >= 100000)
    list.push("chain cookie", "cookie storm");
  if (getRandom(2, me) < 0.05 && Game.season == "fools")
    list.push("everything must go");
  if (
    getRandom(3, me) < 0.1 &&
    (getRandom(4, me) < 0.05 || !Game.hasBuff("Dragonflight"))
  )
    list.push("click frenzy");
  if (me.wrath && getRandom(5, me) < 0.1) list.push("cursed finger");

  if (Game.BuildingsOwned >= 10 && getRandom(6, me) < 0.25)
    list.push("building special");

  if (Game.canLumps() && getRandom(7, me) < 0.0005)
    list.push("free sugar lump");

  if ((me.wrath == 0 && getRandom(8, me) < 0.15) || getRandom(9, me) < 0.05) {
    //if (Game.hasAura('Reaper of Fields')) list.push('dragon harvest');
    if (getRandom(10, me) < Game.auraMult("Reaper of Fields"))
      list.push("dragon harvest");
    //if (Game.hasAura('Dragonflight')) list.push('dragonflight');
    if (getRandom(11, me) < Game.auraMult("Dragonflight"))
      list.push("dragonflight");
  }

  if (
    this.last != "" &&
    getRandom(12, me) < 0.8 &&
    list.indexOf(this.last) != -1
  )
    list.splice(list.indexOf(this.last), 1); //80% chance to force a different one
  if (getRandom(13, me) < 0.0001) list.push("blab");
  var choice = chooseBetter(list, 50, me);

  if (this.chain > 0) choice = "chain cookie";
  if (me.force != "") {
    this.chain = 0;
    choice = me.force;
    me.force = "";
  }
  if (choice != "chain cookie") this.chain = 0;

  this.last = choice;

  //create buff for effect
  //buff duration multiplier
  var effectDurMod = 1;
  if (Game.Has("Get lucky")) effectDurMod *= 2;
  if (Game.Has("Lasting fortune")) effectDurMod *= 1.1;
  if (Game.Has("Lucky digit")) effectDurMod *= 1.01;
  if (Game.Has("Lucky number")) effectDurMod *= 1.01;
  if (Game.Has("Green yeast digestives")) effectDurMod *= 1.01;
  if (Game.Has("Lucky payout")) effectDurMod *= 1.01;
  //if (Game.hasAura('Epoch Manipulator')) effectDurMod*=1.05;
  effectDurMod *= 1 + Game.auraMult("Epoch Manipulator") * 0.05;
  if (!me.wrath) effectDurMod *= Game.eff("goldenCookieEffDur");
  else effectDurMod *= Game.eff("wrathCookieEffDur");

  if (Game.hasGod) {
    var godLvl = Game.hasGod("decadence");
    if (godLvl == 1) effectDurMod *= 1.07;
    else if (godLvl == 2) effectDurMod *= 1.05;
    else if (godLvl == 3) effectDurMod *= 1.02;
  }

  //effect multiplier (from lucky etc)
  var mult = 1;
  //if (me.wrath>0 && Game.hasAura('Unholy Dominion')) mult*=1.1;
  //else if (me.wrath==0 && Game.hasAura('Ancestral Metamorphosis')) mult*=1.1;
  if (me.wrath > 0) mult *= 1 + Game.auraMult("Unholy Dominion") * 0.1;
  else if (me.wrath == 0)
    mult *= 1 + Game.auraMult("Ancestral Metamorphosis") * 0.1;
  if (Game.Has("Green yeast digestives")) mult *= 1.01;
  if (Game.Has("Dragon fang")) mult *= 1.03;
  if (!me.wrath) mult *= Game.eff("goldenCookieGain");
  else mult *= Game.eff("wrathCookieGain");

  var popup = "";
  var buff = 0;

  if (choice == "building special") {
    var time = Math.ceil(30 * effectDurMod);
    var list = [];
    for (var i in Game.Objects) {
      if (Game.Objects[i].amount >= 10) list.push(Game.Objects[i].id);
    }
    if (list.length == 0) {
      choice = "frenzy";
    } //default to frenzy if no proper building
    else {
      var obj = chooseBetter(list, 51, me);
      var pow = Game.ObjectsById[obj].amount / 10 + 1;
      if (me.wrath && getRandom(14, me) < 0.3) {
        buff = Game.gainBuff("building debuff", time, pow, obj);
      } else {
        buff = Game.gainBuff("building buff", time, pow, obj);
      }
    }
  }

  if (choice == "free sugar lump") {
    Game.gainLumps(1);
    popup = loc("Sweet!<br><small>Found 1 sugar lump!</small>");
  } else if (choice == "frenzy") {
    buff = Game.gainBuff("frenzy", Math.ceil(77 * effectDurMod), 7);
  } else if (choice == "dragon harvest") {
    buff = Game.gainBuff("dragon harvest", Math.ceil(60 * effectDurMod), 15);
  } else if (choice == "everything must go") {
    buff = Game.gainBuff("everything must go", Math.ceil(8 * effectDurMod), 5);
  } else if (choice == "multiply cookies") {
    var moni =
      mult * Math.min(Game.cookies * 0.15, Game.cookiesPs * 60 * 15) + 13; //add 15% to cookies owned (+13), or 15 minutes of cookie production - whichever is lowest
    Game.Earn(moni);
    popup =
      loc("Lucky!") +
      "<br><small>" +
      loc("+%1!", loc("%1 cookie", LBeautify(moni))) +
      "</small>";
  } else if (choice == "ruin cookies") {
    var moni = Math.min(Game.cookies * 0.05, Game.cookiesPs * 60 * 10) + 13; //lose 5% of cookies owned (-13), or 10 minutes of cookie production - whichever is lowest
    moni = Math.min(Game.cookies, moni);
    Game.Spend(moni);
    popup =
      loc("Ruin!") +
      "<br><small>" +
      loc("Lost %1!", loc("%1 cookie", LBeautify(moni))) +
      "</small>";
  } else if (choice == "blood frenzy") {
    buff = Game.gainBuff("blood frenzy", Math.ceil(6 * effectDurMod), 666);
  } else if (choice == "clot") {
    buff = Game.gainBuff("clot", Math.ceil(66 * effectDurMod), 0.5);
  } else if (choice == "cursed finger") {
    buff = Game.gainBuff(
      "cursed finger",
      Math.ceil(10 * effectDurMod),
      Game.cookiesPs * Math.ceil(10 * effectDurMod)
    );
  } else if (choice == "click frenzy") {
    buff = Game.gainBuff("click frenzy", Math.ceil(13 * effectDurMod), 777);
  } else if (choice == "dragonflight") {
    buff = Game.gainBuff("dragonflight", Math.ceil(10 * effectDurMod), 1111);
    if (getRandom(15, me) < 0.8) Game.killBuff("Click frenzy");
  } else if (choice == "chain cookie") {
    //fix by Icehawk78
    if (this.chain == 0) this.totalFromChain = 0;
    this.chain++;
    var digit = me.wrath ? 6 : 7;
    if (this.chain == 1)
      this.chain += Math.max(
        0,
        Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10
      );

    var maxPayout =
      Math.min(Game.cookiesPs * 60 * 60 * 6, Game.cookies * 0.5) * mult;
    var moni = Math.max(
      digit,
      Math.min(
        Math.floor((1 / 9) * Math.pow(10, this.chain) * digit * mult),
        maxPayout
      )
    );
    var nextMoni = Math.max(
      digit,
      Math.min(
        Math.floor((1 / 9) * Math.pow(10, this.chain + 1) * digit * mult),
        maxPayout
      )
    );
    this.totalFromChain += moni;

    //break the chain if we're above 5 digits AND it's more than 50% of our bank, it grants more than 6 hours of our CpS, or just a 1% chance each digit (update : removed digit limit)
    if (getRandom(16, me) < 0.01 || nextMoni >= maxPayout) {
      this.chain = 0;
      popup =
        loc("Cookie chain") +
        "<br><small>" +
        loc("+%1!", loc("%1 cookie", LBeautify(moni))) +
        "<br>" +
        loc(
          "Cookie chain over. You made %1.",
          loc("%1 cookie", LBeautify(this.totalFromChain))
        ) +
        "</small>";
    } else {
      popup =
        loc("Cookie chain") +
        "<br><small>" +
        loc("+%1!", loc("%1 cookie", LBeautify(moni))) +
        "</small>";
    }
    Game.Earn(moni);
  } else if (choice == "cookie storm") {
    buff = Game.gainBuff("cookie storm", Math.ceil(7 * effectDurMod), 7);
  } else if (choice == "cookie storm drop") {
    var moni = Math.max(
      mult * (Game.cookiesPs * 60 * Math.floor(getRandom(17, me) * 7 + 1)),
      Math.floor(getRandom(18, me) * 7 + 1)
    ); //either 1-7 cookies or 1-7 minutes of cookie production, whichever is highest
    Game.Earn(moni);
    popup =
      '<div style="font-size:75%;">' +
      loc("+%1!", loc("%1 cookie", LBeautify(moni))) +
      "</div>";
  } else if (choice == "blab") {
    //sorry (it's really rare)
    var str = EN
      ? chooseBetter(
          [
            "Cookie crumbliness x3 for 60 seconds!",
            "Chocolatiness x7 for 77 seconds!",
            "Dough elasticity halved for 66 seconds!",
            "Golden cookie shininess doubled for 3 seconds!",
            "World economy halved for 30 seconds!",
            "Grandma kisses 23% stingier for 45 seconds!",
            "Thanks for clicking!",
            "Fooled you! This one was just a test.",
            "Golden cookies clicked +1!",
            "Your click has been registered. Thank you for your cooperation.",
            "Thanks! That hit the spot!",
            "Thank you. A team has been dispatched.",
            "They know.",
            "Oops. This was just a chocolate cookie with shiny aluminium foil.",
            "Eschaton immanentized!",
            "Oh, that tickled!",
            "Again.",
            "You've made a grave mistake.",
            "Chocolate chips reshuffled!",
            "Randomized chance card outcome!",
            "Mouse acceleration +0.03%!",
            "Ascension bonuses x5,000 for 0.1 seconds!",
            "Gained 1 extra!",
            "Sorry, better luck next time!",
            "I felt that.",
            "Nice try, but no.",
            "Wait, sorry, I wasn't ready yet.",
            "Yippee!",
            "Bones removed.",
            "Organs added.",
            "Did you just click that?",
            "Huh? Oh, there was nothing there.",
            "You saw nothing.",
            "It seems you hallucinated that golden cookie.",
            "This golden cookie was a complete fabrication.",
            "In theory there's no wrong way to click a golden cookie, but you just did that, somehow.",
            "All cookies multiplied by 999!<br>All cookies divided by 999!",
            "Why?",
          ],
          52,
          me
        )
      : chooseBetter(loc("Cookie blab"), 52, me);
    popup = str;
  }

  if (popup == "" && buff && buff.name && buff.desc)
    popup = buff.dname + '<div style="font-size:65%;">' + buff.desc + "</div>";
  if (popup != "") Game.Popup(popup, me.x + me.l.offsetWidth / 2, me.y);

  Game.DropEgg(0.9);

  //sparkle and kill the shimmer
  Game.SparkleAt(me.x + 48, me.y + 48);
  if (choice == "cookie storm drop") {
    if (Game.prefs.cookiesound)
      PlaySound(
        "snd/clickb" + Math.floor(Math.random() * 7 + 1) + ".mp3",
        0.75
      );
    else
      PlaySound("snd/click" + Math.floor(Math.random() * 7 + 1) + ".mp3", 0.75);
  } else PlaySound("snd/shimmerClick.mp3");
  me.die();
};

Game.shimmerTypes.reindeer.popFunc = function (me) {
  //get achievs and stats
  if (me.spawnLead) {
    Game.reindeerClicked++;
  }

  var val = Game.cookiesPs * 60;
  if (Game.hasBuff("Elder frenzy")) val *= 0.5; //very sorry
  if (Game.hasBuff("Frenzy")) val *= 0.75; //I sincerely apologize
  var moni = Math.max(25, val); //1 minute of cookie production, or 25 cookies - whichever is highest
  if (Game.Has("Ho ho ho-flavored frosting")) moni *= 2;
  moni *= Game.eff("reindeerGain");
  Game.Earn(moni);
  if (Game.hasBuff("Elder frenzy")) Game.Win("Eldeer");

  var cookie = "";
  var failRate = 0.8;
  if (Game.HasAchiev("Let it snow")) failRate = 0.6;
  failRate *= 1 / Game.dropRateMult();
  if (Game.Has("Starsnow")) failRate *= 0.95;
  if (Game.hasGod) {
    var godLvl = Game.hasGod("seasons");
    if (godLvl == 1) failRate *= 0.9;
    else if (godLvl == 2) failRate *= 0.95;
    else if (godLvl == 3) failRate *= 0.97;
  }
  if (getRandom(0, me) > failRate) {
    //christmas cookie drops
    cookie = chooseBetter(
      [
        "Christmas tree biscuits",
        "Snowflake biscuits",
        "Snowman biscuits",
        "Holly biscuits",
        "Candy cane biscuits",
        "Bell biscuits",
        "Present biscuits",
      ],
      50,
      me
    );
    if (!Game.HasUnlocked(cookie) && !Game.Has(cookie)) {
      Game.Unlock(cookie);
    } else cookie = "";
  }

  var popup = "";

  Game.Notify(
    loc("You found %1!", chooseBetter(loc("Reindeer names"), 51, me)),
    loc("The reindeer gives you %1.", loc("%1 cookie", LBeautify(moni))) +
      (cookie == ""
        ? ""
        : "<br>" +
          loc("You are also rewarded with %1!", Game.Upgrades[cookie].dname)),
    [12, 9],
    6
  );
  popup =
    '<div style="font-size:80%;">' +
    loc("+%1!", loc("%1 cookie", LBeautify(moni))) +
    "</div>";

  if (popup != "") Game.Popup(popup, Game.mouseX, Game.mouseY);

  //sparkle and kill the shimmer
  Game.SparkleAt(Game.mouseX, Game.mouseY);
  PlaySound("snd/jingleClick.mp3");
  me.die();
};

function popPredict(me) {
  const foresight = new Foresight();
  //get achievs and stats
  if (me.spawnLead) {
    newGoldenClicks = Game.goldenClicks + 1;
    //Game.goldenClicksLocal+1;

    if (newGoldenClicks >= 1) foresight.achievs.push("Golden cookie");
    if (newGoldenClicks >= 7) foresight.achievs.push("Lucky cookie");
    if (newGoldenClicks >= 27) foresight.achievs.push("A stroke of luck");
    if (newGoldenClicks >= 77) foresight.achievs.push("Fortune");
    if (newGoldenClicks >= 777) foresight.achievs.push("Leprechaun");
    if (newGoldenClicks >= 7777) foresight.achievs.push("Black cat's paw");
    if (newGoldenClicks >= 27777) foresight.achievs.push("Seven horseshoes");

    if (newGoldenClicks >= 7) foresight.unlocks.push("Lucky day");
    if (newGoldenClicks >= 27) foresight.unlocks.push("Serendipity");
    if (newGoldenClicks >= 77) foresight.unlocks.push("Get lucky");

    if (me.life / Game.fps > me.dur - 1) foresight.achievs.push("Early bird");
    if (me.life < Game.fps) foresight.achievs.push("Fading luck");

    if (me.wrath) foresight.achievs.push("Wrath cookie");
    foresight.achievs = foresight.achievs.filter(
      (achiev) => !Game.Achievements[achiev].won
    );
    foresight.unlocks = foresight.unlocks.filter(
      (upgrade) => !Game.Upgrades[upgrade].unlocked
    );
  }

  if (Game.hasGod && Game.hasGod("asceticism"))
    foresight.notes.push("Holobore will be unslotted.");

  //select an effect
  var list = [];
  if (me.wrath > 0) list.push("clot", "multiply cookies", "ruin cookies");
  else list.push("frenzy", "multiply cookies");
  if (me.wrath > 0 && Game.hasGod && Game.hasGod("scorn"))
    list.push("clot", "ruin cookies", "clot", "ruin cookies");
  if (me.wrath > 0 && getRandom(0, me) < 0.3)
    list.push("blood frenzy", "chain cookie", "cookie storm");
  else if (getRandom(1, me) < 0.03 && Game.cookiesEarned >= 100000)
    list.push("chain cookie", "cookie storm");
  if (getRandom(2, me) < 0.05 && Game.season == "fools")
    list.push("everything must go");
  if (
    getRandom(3, me) < 0.1 &&
    (getRandom(4, me) < 0.05 || !Game.hasBuff("Dragonflight"))
  )
    list.push("click frenzy");
  if (me.wrath && getRandom(5, me) < 0.1) list.push("cursed finger");

  if (Game.BuildingsOwned >= 10 && getRandom(6, me) < 0.25)
    list.push("building special");

  if (Game.canLumps() && getRandom(7, me) < 0.0005)
    list.push("free sugar lump");

  if ((me.wrath == 0 && getRandom(8, me) < 0.15) || getRandom(9, me) < 0.05) {
    //if (Game.hasAura('Reaper of Fields')) list.push('dragon harvest');
    if (getRandom(10, me) < Game.auraMult("Reaper of Fields"))
      list.push("dragon harvest");
    //if (Game.hasAura('Dragonflight')) list.push('dragonflight');
    if (getRandom(11, me) < Game.auraMult("Dragonflight"))
      list.push("dragonflight");
  }

  if (
    Game.shimmerTypes.golden.last != "" &&
    getRandom(12, me) < 0.8 &&
    list.indexOf(Game.shimmerTypes.golden.last) != -1
  )
    list.splice(list.indexOf(Game.shimmerTypes.golden.last), 1); //80% chance to force a different one
  if (getRandom(13, me) < 0.0001) list.push("blab");
  var choice = chooseBetter(list, 50, me);

  if (Game.shimmerTypes.golden.chain > 0) choice = "chain cookie";
  if (me.force != "") {
    foresight.notes.push("This golden cookie has a forced effect.");
    Game.shimmerTypes.golden.chain = 0;
    choice = me.force;
  }
  //if (choice != "chain cookie") Game.shimmerTypes.golden.chain = 0;

  //Game.shimmerTypes.golden.last = choice;

  foresight.effect = choice;

  //create buff for effect
  //buff duration multiplier
  var effectDurMod = 1;
  if (Game.Has("Get lucky")) effectDurMod *= 2;
  if (Game.Has("Lasting fortune")) effectDurMod *= 1.1;
  if (Game.Has("Lucky digit")) effectDurMod *= 1.01;
  if (Game.Has("Lucky number")) effectDurMod *= 1.01;
  if (Game.Has("Green yeast digestives")) effectDurMod *= 1.01;
  if (Game.Has("Lucky payout")) effectDurMod *= 1.01;
  //if (Game.hasAura('Epoch Manipulator')) effectDurMod*=1.05;
  effectDurMod *= 1 + Game.auraMult("Epoch Manipulator") * 0.05;
  if (!me.wrath) effectDurMod *= Game.eff("goldenCookieEffDur");
  else effectDurMod *= Game.eff("wrathCookieEffDur");

  if (Game.hasGod) {
    var godLvl = Game.hasGod("decadence");
    if (godLvl == 1) effectDurMod *= 1.07;
    else if (godLvl == 2) effectDurMod *= 1.05;
    else if (godLvl == 3) effectDurMod *= 1.02;
  }

  //effect multiplier (from lucky etc)
  var mult = 1;
  //if (me.wrath>0 && Game.hasAura('Unholy Dominion')) mult*=1.1;
  //else if (me.wrath==0 && Game.hasAura('Ancestral Metamorphosis')) mult*=1.1;
  if (me.wrath > 0) mult *= 1 + Game.auraMult("Unholy Dominion") * 0.1;
  else if (me.wrath == 0)
    mult *= 1 + Game.auraMult("Ancestral Metamorphosis") * 0.1;
  if (Game.Has("Green yeast digestives")) mult *= 1.01;
  if (Game.Has("Dragon fang")) mult *= 1.03;
  if (!me.wrath) mult *= Game.eff("goldenCookieGain");
  else mult *= Game.eff("wrathCookieGain");

  var popup = "";
  var buff = 0;

  if (choice == "building special") {
    var time = Math.ceil(30 * effectDurMod);
    var list = [];
    for (var i in Game.Objects) {
      if (Game.Objects[i].amount >= 10) list.push(Game.Objects[i].id);
    }
    if (list.length == 0) {
      choice = "frenzy";
    } //default to frenzy if no proper building
    else {
      var obj = chooseBetter(list, 51, me);
      var pow = Game.ObjectsById[obj].amount / 10 + 1;
      if (me.wrath && getRandom(14, me) < 0.3) {
        buff = foresight.fill("building debuff", time, pow, obj);
      } else {
        buff = foresight.fill("building buff", time, pow, obj);
      }
    }
  }

  if (choice == "free sugar lump") {
    // lucky!
  } else if (choice == "frenzy") {
    buff = foresight.fill("frenzy", Math.ceil(77 * effectDurMod), 7);
  } else if (choice == "dragon harvest") {
    buff = foresight.fill("dragon harvest", Math.ceil(60 * effectDurMod), 15);
  } else if (choice == "everything must go") {
    buff = foresight.fill("everything must go", Math.ceil(8 * effectDurMod), 5);
  } else if (choice == "multiply cookies") {
    var moni =
      mult * Math.min(Game.cookies * 0.15, Game.cookiesPs * 60 * 15) + 13; //add 15% to cookies owned (+13), or 15 minutes of cookie production - whichever is lowest
    foresight.amount = moni;
  } else if (choice == "ruin cookies") {
    var moni = Math.min(Game.cookies * 0.05, Game.cookiesPs * 60 * 10) + 13; //lose 5% of cookies owned (-13), or 10 minutes of cookie production - whichever is lowest
    moni = Math.min(Game.cookies, moni);
    foresight.amount = moni;
  } else if (choice == "blood frenzy") {
    buff = foresight.fill("blood frenzy", Math.ceil(6 * effectDurMod), 666);
  } else if (choice == "clot") {
    buff = foresight.fill("clot", Math.ceil(66 * effectDurMod), 0.5);
  } else if (choice == "cursed finger") {
    buff = foresight.fill(
      "cursed finger",
      Math.ceil(10 * effectDurMod),
      Game.cookiesPs * Math.ceil(10 * effectDurMod)
    );
  } else if (choice == "click frenzy") {
    buff = foresight.fill("click frenzy", Math.ceil(13 * effectDurMod), 777);
  } else if (choice == "dragonflight") {
    buff = foresight.fill("dragonflight", Math.ceil(10 * effectDurMod), 1111);
    if (getRandom(15, me) < 0.8)
      foresight.notes.push("This buff will eliminate click frenzy.");
  } else if (choice == "chain cookie") {
    newChain = Game.shimmerTypes.golden.chain + 1;
    var digit = me.wrath ? 6 : 7;
    if (newChain == 1)
      newChain += Math.max(
        0,
        Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10
      );

    var maxPayout =
      Math.min(Game.cookiesPs * 60 * 60 * 6, Game.cookies * 0.5) * mult;
    var moni = Math.max(
      digit,
      Math.min(
        Math.floor((1 / 9) * Math.pow(10, newChain) * digit * mult),
        maxPayout
      )
    );
    var nextMoni = Math.max(
      digit,
      Math.min(
        Math.floor((1 / 9) * Math.pow(10, newChain + 1) * digit * mult),
        maxPayout
      )
    );

    //break the chain if we're above 5 digits AND it's more than 50% of our bank, it grants more than 6 hours of our CpS, or just a 1% chance each digit (update : removed digit limit)
    if (getRandom(16, me) < 0.01 || nextMoni >= maxPayout) {
      foresight.notes.push("This will be the last cookie in this chain.");
    }
    foresight.amount = moni;
  } else if (choice == "cookie storm") {
    buff = foresight.fill("cookie storm", Math.ceil(7 * effectDurMod), 7);
  } else if (choice == "cookie storm drop") {
    var moni = Math.max(
      mult * (Game.cookiesPs * 60 * Math.floor(getRandom(17, me) * 7 + 1)),
      Math.floor(getRandom(18, me) * 7 + 1)
    ); //either 1-7 cookies or 1-7 minutes of cookie production, whichever is highest
    foresight.amount = moni;
  } else if (choice == "blab") {
    //sorry (it's really rare)
    var str = EN
      ? chooseBetter(
          [
            "Cookie crumbliness x3 for 60 seconds!",
            "Chocolatiness x7 for 77 seconds!",
            "Dough elasticity halved for 66 seconds!",
            "Golden cookie shininess doubled for 3 seconds!",
            "World economy halved for 30 seconds!",
            "Grandma kisses 23% stingier for 45 seconds!",
            "Thanks for clicking!",
            "Fooled you! This one was just a test.",
            "Golden cookies clicked +1!",
            "Your click has been registered. Thank you for your cooperation.",
            "Thanks! That hit the spot!",
            "Thank you. A team has been dispatched.",
            "They know.",
            "Oops. This was just a chocolate cookie with shiny aluminium foil.",
            "Eschaton immanentized!",
            "Oh, that tickled!",
            "Again.",
            "You've made a grave mistake.",
            "Chocolate chips reshuffled!",
            "Randomized chance card outcome!",
            "Mouse acceleration +0.03%!",
            "Ascension bonuses x5,000 for 0.1 seconds!",
            "Gained 1 extra!",
            "Sorry, better luck next time!",
            "I felt that.",
            "Nice try, but no.",
            "Wait, sorry, I wasn't ready yet.",
            "Yippee!",
            "Bones removed.",
            "Organs added.",
            "Did you just click that?",
            "Huh? Oh, there was nothing there.",
            "You saw nothing.",
            "It seems you hallucinated that golden cookie.",
            "This golden cookie was a complete fabrication.",
            "In theory there's no wrong way to click a golden cookie, but you just did that, somehow.",
            "All cookies multiplied by 999!<br>All cookies divided by 999!",
            "Why?",
          ],
          52,
          me
        )
      : chooseBetter(loc("Cookie blab"), 52, me);
    foresight.blab = str;
  }

  Game.DropEgg(0.9);
  return foresight;
}

function popPredictReindeer(me) {
  const foresight = new Foresight();
  //get achievs and stats
  if (me.spawnLead) {
    const newClicked = Game.reindeerClicked + 1;
    foresight.achievs.push("Oh deer");
    if (newClicked >= 50) foresight.achievs.push("Sleigh of hand");
    if (newClicked >= 200) foresight.achievs.push("Reindeer sleigher");
  }

  var val = Game.cookiesPs * 60;
  if (Game.hasBuff("Elder frenzy")) val *= 0.5; //very sorry
  if (Game.hasBuff("Frenzy")) val *= 0.75; //I sincerely apologize
  var moni = Math.max(25, val); //1 minute of cookie production, or 25 cookies - whichever is highest
  if (Game.Has("Ho ho ho-flavored frosting")) moni *= 2;
  moni *= Game.eff("reindeerGain");
  foresight.amount = moni;
  if (Game.hasBuff("Elder frenzy")) foresight.achievs.push("Eldeer");

  foresight.achievs = foresight.achievs.filter(
    (achiev) => !Game.Achievements[achiev].won
  );

  var cookie = "";
  var failRate = 0.8;
  if (Game.HasAchiev("Let it snow")) failRate = 0.6;
  failRate *= 1 / Game.dropRateMult();
  if (Game.Has("Starsnow")) failRate *= 0.95;
  if (Game.hasGod) {
    var godLvl = Game.hasGod("seasons");
    if (godLvl == 1) failRate *= 0.9;
    else if (godLvl == 2) failRate *= 0.95;
    else if (godLvl == 3) failRate *= 0.97;
  }
  if (getRandom(0, me) > failRate) {
    //christmas cookie drops
    cookie = chooseBetter(
      [
        "Christmas tree biscuits",
        "Snowflake biscuits",
        "Snowman biscuits",
        "Holly biscuits",
        "Candy cane biscuits",
        "Bell biscuits",
        "Present biscuits",
      ],
      50,
      me
    );
    if (!Game.HasUnlocked(cookie) && !Game.Has(cookie)) {
      foresight.unlocks.push(cookie);
    } else cookie = "";
  }
  foresight.effect = "hohoho";
  foresight.obj = chooseBetter(loc("Reindeer names"), 51, me);
  return foresight;
}
