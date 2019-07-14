race_stuff =
{
//name		fav. class	size		speed	LA	Feats	Sk.Pts	Sk.Pts	Index
//								/1st	/1st	/LVL
"dwarf":	["fighter",	"medium",	20,	0,	0,	0,	0,	0],
"elf":		["wizard",	"medium",	30,	0,	0,	0,	0,	1],
"gnome":	["bard",	"small",	20,	0,	0,	0,	0,	2],
"halfelf":	["any",		"medium",	30,	0,	0,	0,	0,	3],
"halfling":	["rogue",	"small",	20,	0,	0,	0,	0,	4],
"halforc":	["barbarian",	"medium",	30,	0,	0,	0,	0,	5],
"human":	["any",		"medium",	30,	0,	1,	4,	1,	6]
}

race_ability_score_modifiers =
{
//name		Str	Dex	Con	Int	Wis	Cha
"dwarf":	[0,	0,	2,	0,	0,	-2],
"elf":		[0,	2,	-2,	0,	0,	0],
"gnome":	[-2,	0,	2,	0,	0,	0],
"halfelf":	[0,	0,	0,	0,	0,	0],
"halfling":	[-2,	2,	0,	0,	0,	0],
"halforc":	[2,	0,	0,	-2,	0,	-2],
"human":	[0,	0,	0,	0,	0,	0]
}

race_skills =
{
//name		Skill 1		Skill 2			Skill 3			Skill 4		Skill 5
"dwarf":	[null,		null,			null,			null,		null],
"elf":		["listen",	"search",		"spot",			null,		null],
"gnome":	["listen",	"craft (alchemy)",	null,			null,		null],
"halfelf":	["listen",	"search",		"spot",			"diplomacy",	"gather information"],
"halfling":	["climb",	"jump",			"move silently",	"listen",	null],
"halforc":	[null,		null,			null,			null,		null],
"human":	[null,		null,			null,			null,		null]
}


race_something_1 =
{
//name		Lvl 1	Lvl 2	Lvl 3	Lvl 4	Lvl 5
"dwarf":	[null,	null,	null,	null,	null],
"elf":		[2,	2,	2,	null,	null],
"gnome":	[2,	2,	null,	null,	null],
"halfelf":	[1,	1,	1,	2,	2],
"halfling":	[2,	2,	2,	2,	null],
"halforc":	[null,	null,	null,	null,	null],
"human":	[null,	null,	null,	null,	null]
}

race_something_2 =
{
//name		Abil 1			Abil 2						Abil 3			Abil 4		Abil 5
"dwarf":	[null,			null,						null,			null,		null],
"elf":		[null,			null,						null,			null,		null],
"gnome":	["low-light vision",	"speak with animals (burrowing mammals)",	"dancing lights",	"ghost sound",	"prestidigitation"],
"halfelf":	[null,			null,						null,			null,		null],
"halfling":	[null,			null,						null,			null,		null],
"halforc":	[null,			null,						null,			null,		null],
"human":	[null,			null,						null,			null,		null]
}

race_something_3 =
{
//name		Lvl 1	Lvl 2	Lvl 3	Lvl 4	Lvl 5
"dwarf":	[null,	null,	null,	null,	null],
"elf":		[null,	null,	null,	null,	null],
"gnome":	[-1,	1,	1,	1,	1],
"halfelf":	[null,	null,	null,	null,	null],
"halfling":	[null,	null,	null,	null,	null],
"halforc":	[null,	null,	null,	null,	null],
"human":	[null,	null,	null,	null,	null]
}

/*
dwarf
	May treat dwarven waraxes and dwarven urgroshes as martial weapons, rather than exotic weapons.
	+2 racial bonus on saving throws against poison.
	+2 racial bonus on saving throws against spells and spell-like effects.
	+1 racial bonus on attack rolls against orcs and goblinoids.
	+4 dodge bonus to Armor Class against monsters of the giant type. Any time a creature loses its Dexterity bonus (if any) to Armor Class, such as when it’s caught flat-footed, it loses its dodge bonus, too.
	+2 racial bonus on Appraise checks that are related to stone or metal items.
	+2 racial bonus on Craft checks that are related to stone or metal.
elf
	Immunity to magic sleep effects, and a +2 racial saving throw bonus against enchantment spells or effects.
	High elves receive the Martial Weapon Proficiency feats for the longsword, rapier, longbow (including composite longbow), and shortbow (including composite shortbow) as bonus feats.
	A high elf who merely passes within 5 feet of a secret or concealed door is entitled to a Search check to notice it as if she were actively looking for it.
gnome
	May treat gnome hooked hammers as martial weapons rather than exotic weapons.
	+2 racial bonus on saving throws against illusions.
	Add +1 to the Difficulty Class for all saving throws against illusion spells cast by rock gnomes. This adjustment stacks with those from similar effects.
	+1 racial bonus on attack rolls against kobolds and goblinoids.
halfelf
	Immunity to sleep spells and similar magical effects, and a +2 racial bonus on saving throws against enchantment spells or effects.
halfling
	+1 racial bonus on all saving throws.
	+2 morale bonus on saving throws against fear: This bonus stacks with the lightfoot halfling’s +1 bonus on saving throws in general.
	+1 racial bonus on attack rolls with thrown weapons and slings.
halforc
	A half-orc’s starting Intelligence score is always at least 3. If this adjustment would lower the character’s score to 1 or 2, his score is nevertheless 3.
*/
