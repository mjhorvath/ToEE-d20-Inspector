// This is free and unencumbered software released into the public domain.
// 
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
// 
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// For more information, please refer to <http://unlicense.org/>

var load_count = 0
var not_applicable = "n/a"
var to_do = "to do"
var suppress_alerts = true

function ParseHitDie(in_die_text)
{
	var temp_array_1 = in_die_text.split('+')
	var temp_array_2 = temp_array_1[0].split('d')
	return [parseInt(temp_array_2[0]), parseInt(temp_array_2[1]), isNaN(parseInt(temp_array_1[1])) ? 0 : parseInt(temp_array_1[1])]
}
function BlankToNull(in_value)
{
	return in_value == '' ? null : in_value
}
function NullToBlank(in_value)
{
	return in_value == null ? '' : in_value
}
function TextToBoolean(in_value)
{
	return in_value != false ? 1 : 0
}
function NullToNumber(in_value)
{
	return in_value == null ? 0 : parseInt(in_value)
}
function UndefinedToNull(in_value)
{
	return in_value == undefined ? null : parseInt(in_value)
}

function calc_stuff(proto_number)
{
	var char_pro = {}
	var char_raw = {}
	var char_dsc = {}
	var err_pro = {}
	var err_raw = {}
	var err_total = 0
	var char_inp = characters_table[proto_number].char_inp
	var char_out = null		// null for now


	//----------------------------------------------------------------------
	// SECTION #2: BASIC CHARACTER INFO

	char_pro.section2 = "tool_section",	char_dsc.section2 = "BASIC CHARACTER INFO"

	char_pro.char_name = descriptions_table[char_inp['DESCRIPTION_ID']]
	char_dsc.char_name = "The character's name."			// does not actually exist in protos.tab
	char_raw.char_name = descriptions_table[char_inp['DESCRIPTION_ID']]
	char_pro.char_proto_num = proto_number
	char_dsc.char_proto_num = "The character's proto ID number."
	char_raw.char_proto_num = proto_number
	char_pro.char_total_level = null				// filled in later
	char_dsc.char_total_level = "Total character levels."
	char_pro.char_effective_level = null				// filled in later
	char_dsc.char_effective_level = "Effective character level (ECL). Not used for anything. Ignore."
	char_pro.char_bab_total = not_applicable
	char_dsc.char_bab_total = "Total BAB for all attacks. Used for monster attack bonuses."
	char_pro.char_hit_points = char_inp["HP"]
	char_dsc.char_hit_points = "Hit points for characters with class levels. (I.e. non-monsters.)"


	//----------------------------------------------------------------------
	// SECTION #9: ABILITY SCORES (OLD)

	char_pro.section9 = "tool_section",	char_dsc.section9 = "ABILITY SCORES"

	char_raw.abil_since_start = Math.floor(char_pro.char_total_level/4), 	char_dsc.abil_since_start = "Number of additional ability points earned since character creation per RAW."

	// get and store original char stats in appropriate data types and formats
	char_pro.abil_str = NullToNumber(char_inp.STRENGTH),		char_dsc.abil_str = "Strength base ability."
	char_pro.abil_dex = NullToNumber(char_inp.DEXTERITY),		char_dsc.abil_dex = "Dexterity base ability."
	char_pro.abil_con = NullToNumber(char_inp.CONSTITUTION),	char_dsc.abil_con = "Constitution base ability."
	char_pro.abil_int = NullToNumber(char_inp.INTELLIGENCE),	char_dsc.abil_int = "Intelligence base ability."
	char_pro.abil_wis = NullToNumber(char_inp.WISDOM),		char_dsc.abil_wis = "Wisdom base ability."
	char_pro.abil_cha = NullToNumber(char_inp.CHARISMA),		char_dsc.abil_cha = "Charisma base ability."

	// ability score modifiers
	char_pro.abil_str_mod = ability_score_modifiers[char_pro.abil_str],	char_dsc.abil_str_mod = "Strength ability modifier."
	char_pro.abil_dex_mod = ability_score_modifiers[char_pro.abil_dex],	char_dsc.abil_dex_mod = "Dexterity ability modifier."
	char_pro.abil_con_mod = ability_score_modifiers[char_pro.abil_con],	char_dsc.abil_con_mod = "Constitution ability modifier."
	char_pro.abil_int_mod = ability_score_modifiers[char_pro.abil_int],	char_dsc.abil_int_mod = "Intelligence ability modifier."
	char_pro.abil_wis_mod = ability_score_modifiers[char_pro.abil_wis],	char_dsc.abil_wis_mod = "Wisdom ability modifier."
	char_pro.abil_cha_mod = ability_score_modifiers[char_pro.abil_cha],	char_dsc.abil_cha_mod = "Charisma ability modifier."

	// used to determine ability prerequisites for feats
	var this_abil_score_table =
	[
		char_pro.abil_str,
		char_pro.abil_dex,
		char_pro.abil_con,
		char_pro.abil_int,
		char_pro.abil_wis,
		char_pro.abil_cha
	]


	//----------------------------------------------------------------------
	// SECTION #3: MONSTER LEVELS (OLD)

	char_pro.section3 = "tool_section",		char_dsc.section3 = "MONSTER LEVELS"

	char_pro.mons_hit_txt = null,			char_dsc.mons_hit_txt = "Full monster hit die info in string format."
	char_pro.mons_hit_level = null,			char_dsc.mons_hit_level = "Monster levels."
	char_pro.mons_hit_die = null,			char_dsc.mons_hit_die = "Monster hit die. Tweaked by game devs to make hit point distribution more fun."
	char_pro.mons_hit_bonus = null,			char_dsc.mons_hit_bonus = "Monster hit point bonus for the purpose of tweaking boss fights, not for adding constitution bonuses."
	char_pro.mons_type = null,			char_dsc.mons_type = "Monster (i.e. creature) type. Elementals are treated specially."
	char_pro.mons_subtype = null,			char_dsc.mons_subtype = "Monster (i.e. creature) subtype."

	// get monster BAB and saves
	char_pro.mons_skill_points_perlvl = null,	char_dsc.mons_skill_points_perlvl = "Monster skill points per level."
	char_pro.mons_skill_points_atfirst = null,	char_dsc.mons_skill_points_atfirst = "Monster skill points at first level."
	char_pro.mons_skill_points_total = null,	char_dsc.mons_skill_points_total = "Total number of monster skill points."
	char_pro.mons_bab_class = null,			char_dsc.mons_bab_class = "Character class used for determining monster BAB."
	char_pro.mons_sav_class = null,			char_dsc.mons_sav_class = "Character class used for determining monster fort/refx/will saves. Humanoids are more complicated than what is calculated here."
	char_pro.mons_bab = null,			char_dsc.mons_bab = "Monster base attack bonus."
	char_pro.mons_fort = null,			char_dsc.mons_fort = "Monster fortitude save."
	char_pro.mons_refx = null,			char_dsc.mons_refx = "Monster reflex save."
	char_pro.mons_will = null,			char_dsc.mons_will = "Monster will save."

	// monster-only strength and dexterity attack bonuses
	char_pro.mons_str_attack_bonus = null,	char_dsc.mons_str_attack_bonus = "Monster strength attack bonus."			// filled in later
	char_pro.mons_dex_attack_bonus = null,	char_dsc.mons_dex_attack_bonus = "Monster dexterity attack bonus."			// filled in later

	// if the character has any monster levels
	if (char_inp.HP_DICE)
	{
		// get and store original char stats in appropriate data types and formats
		var temp_hit = char_inp.HP_DICE == null ? "" : ParseHitDie(char_inp.HP_DICE)
		char_pro.mons_hit_txt = char_inp.HP_DICE
		char_pro.mons_hit_level = char_inp.HP_DICE == null ? 0 : temp_hit[0]
		char_pro.mons_hit_die = char_inp.HP_DICE == null ? 0 : temp_hit[1]
		char_pro.mons_hit_bonus = char_inp.HP_DICE == null ? 0 : temp_hit[2]

		var this_monster_types = []
		var this_monster_subtypes = []
		if (char_inp.CREATURE_TYPE)
		{
			this_monster_types = char_inp.CREATURE_TYPE.split(' ')
			for (var i = 0, n = this_monster_types.length; i < n; i++)
			{
				this_monster_types[i] = this_monster_types[i].substring(8, this_monster_types[i].length)
			}
		}
		if (char_inp.CREATURE_SUBTYPE)
		{
			this_monster_subtypes = char_inp.CREATURE_SUBTYPE.split(' ')
			for (var i = 0, n = this_monster_subtypes.length; i < n; i++)
			{
				this_monster_subtypes[i] = this_monster_subtypes[i].substring(11, this_monster_subtypes[i].length)
			}
		}
		char_pro.mons_type = this_monster_types.join(', ')		// if there's more than one, then it's a problem
		char_pro.mons_subtype = this_monster_subtypes.join(', ')

		if (this_monster_types.length > 1)
		{
			alert_two('Character ' + proto_number + ' has multiple creature types: ' + char_pro.mons_type)
		}

		// monster BAB class, save class, skill points, etc.
		var this_monster = creature_types[char_pro.mons_type]
		if (!this_monster)
		{
			alert_two('Character ' + proto_number + ' creature type ' + char_pro.mons_type + ' not recognized.')
		}
		else
		{
			char_pro.mons_bab_class = this_monster[1]
			char_pro.mons_sav_class = this_monster[2]
			char_pro.mons_skill_points_perlvl = not_applicable
			char_pro.mons_skill_points_atfirst = not_applicable

			// elemental creature type is a special case
			if (char_pro.mons_sav_class == 'elemental')
			{
				for (var i = 0, n = this_monster_subtypes.length; i < n; i++)
				{
					var this_subtype = this_monster_subtypes[i]
					if ((this_subtype == 'air') || (this_subtype == 'fire'))
					{
						char_pro.mons_sav_class = 'rogue'
						break
					}
					else if ((this_subtype == 'earth') || (this_subtype == 'water'))
					{
						char_pro.mons_sav_class = 'barbarian'
						break
					}
				}
			}

			if (char_pro.mons_hit_level <= 20)
			{
				var this_bab_class_and_level = classes_normal[char_pro.mons_bab_class][char_pro.mons_hit_level]
				var this_sav_class_and_level = classes_normal[char_pro.mons_sav_class][char_pro.mons_hit_level]
			}
			else
			{
				var this_bab_class_and_level = classes_epic[char_pro.mons_bab_class][char_pro.mons_hit_level]
				var this_sav_class_and_level = classes_epic[char_pro.mons_sav_class][char_pro.mons_hit_level]
			}

			// too many levels!
			if (char_pro.mons_hit_level > 70)
			{
				alert_two('Character ' + proto_number + ' monster level ' + char_pro.mons_hit_level + ' out of range.')
			}
			else
			{
				// get monster BAB (but aren't there multiple BABs?)
				char_pro.mons_bab = this_bab_class_and_level[0]

				// get monster saves
				char_pro.mons_fort = this_sav_class_and_level[4]
				char_pro.mons_refx = this_sav_class_and_level[5]
				char_pro.mons_will = this_sav_class_and_level[6]

			}

			char_pro.mons_skill_points_total = not_applicable
		}
	}


	//----------------------------------------------------------------------
	// SECTION #4: CLASSES (OLD)

	char_pro.section4 = "tool_section",	char_dsc.section4 = "CLASSES (MAX = 5)"

	// a little confused about BAB, add first?
	char_pro.class_number = null,			char_dsc.class_number = "How many classes does this character have?"
	char_pro.class_bab_1_total = null,		char_dsc.class_bab_1_total = "Total class BAB for attack #1. Can't remember why there are four."
	char_pro.class_bab_2_total = null,		char_dsc.class_bab_2_total = "Total class BAB for attack #2. Can't remember why there are four."
	char_pro.class_bab_3_total = null,		char_dsc.class_bab_3_total = "Total class BAB for attack #3. Can't remember why there are four."
	char_pro.class_bab_4_total = null,		char_dsc.class_bab_4_total = "Total class BAB for attack #4. Can't remember why there are four."
	char_pro.class_sav_fort_total = null,		char_dsc.class_sav_fort_total = "Total class fortitude save."
	char_pro.class_sav_refx_total = null,		char_dsc.class_sav_refx_total = "Total class reflex save."
	char_pro.class_sav_will_total = null,		char_dsc.class_sav_will_total = "Total class will save."
	char_pro.class_feats_normal_total = null,	char_dsc.class_feats_normal_total = "Total number of normal class feats."
	char_pro.class_feats_epic_total = null,		char_dsc.class_feats_epic_total = "Total number of epic class feats."
	char_pro.class_skill_total = null,		char_dsc.class_skill_total = "Total class skill points."

	// used for determining normal and epic class feats
	var this_classes_table = []

	// for every class (MAX = 5)
	for (var i = 1; i < 6; i++)
	{
		char_pro["divider_class_" + i] = "tool_divider",		char_dsc["divider_class_" + i] = "CLASS #" + i

		var this_class_name = char_inp["CLASS_" + i]
		var this_class_level = UndefinedToNull(char_inp["CLASS_LVL_" + i])
		char_pro["class_" + i + "_name"] = this_class_name,		char_dsc["class_" + i + "_name"] = "Class #" + i + " name."
		char_pro["class_" + i + "_level"] = this_class_level,		char_dsc["class_" + i + "_level"] = "Class #" + i + " level."
		char_pro["class_" + i + "_bab_1"] = null,			char_dsc["class_" + i + "_bab_1"] = "Class #" + i + " base attack bonus #1."
		char_pro["class_" + i + "_bab_2"] = null,			char_dsc["class_" + i + "_bab_2"] = "Class #" + i + " base attack bonus #2."
		char_pro["class_" + i + "_bab_3"] = null,			char_dsc["class_" + i + "_bab_3"] = "Class #" + i + " base attack bonus #3."
		char_pro["class_" + i + "_bab_4"] = null,			char_dsc["class_" + i + "_bab_4"] = "Class #" + i + " base attack bonus #4."
		char_pro["class_" + i + "_sav_fort"] = null,			char_dsc["class_" + i + "_sav_fort"] = "Class #" + i + " fortitude save."
		char_pro["class_" + i + "_sav_refx"] = null,			char_dsc["class_" + i + "_sav_refx"] = "Class #" + i + " reflex save."
		char_pro["class_" + i + "_sav_will"] = null,			char_dsc["class_" + i + "_sav_will"] = "Class #" + i + " will save."
		char_pro["class_" + i + "_is_favored"] = null,			char_dsc["class_" + i + "_is_favored"] = "Is class #" + i + " favored by the character's race?"
		char_pro["class_" + i + "_skill_points_perlevel"] = null,	char_dsc["class_" + i + "_skill_points_perlevel"] = "Class #" + i + " skill points per level."
		char_pro["class_" + i + "_skill_points_atfirst"] = null,	char_dsc["class_" + i + "_skill_points_atfirst"] = "Class #" + i + " skill points at first level."
		char_pro["class_" + i + "_feats_normal"] = null,		char_dsc["class_" + i + "_feats_normal"] = "Number of class #" + i + " normal class feats."
		char_pro["class_" + i + "_feats_epic"] = null,			char_dsc["class_" + i + "_feats_epic"] = "Number of class #" + i + " epic class feats."

		if (this_class_name)
		{
			this_classes_table.push(this_class_name)

			// some monsters have classes but don't belong to a race
			if (char_inp.RACE)
			{
				var this_race_name = char_inp.RACE.substring(5, char_inp.RACE.length)
				char_pro["class_" + i + "_is_favored"] = is_class_favored_race(this_race_name, this_class_name)
			}
			else
			{
				char_pro["class_" + i + "_is_favored"] = false
			}

			var this_class = classes_stuff[this_class_name]
			char_pro["class_" + i + "_skill_points_perlevel"] = not_applicable
			char_pro["class_" + i + "_skill_points_atfirst"] = not_applicable
			var this_class_and_level_normal = classes_normal[this_class_name][this_class_level]
			var this_class_and_level_epic = classes_epic[this_class_name][this_class_level]
			if (this_class_and_level_normal)
			{
				char_pro["class_" + i + "_bab_1"] = this_class_and_level_normal[0]
				char_pro["class_" + i + "_bab_2"] = this_class_and_level_normal[1]
				char_pro["class_" + i + "_bab_3"] = this_class_and_level_normal[2]
				char_pro["class_" + i + "_bab_4"] = this_class_and_level_normal[3]
				char_pro["class_" + i + "_sav_fort"] = this_class_and_level_normal[4]
				char_pro["class_" + i + "_sav_refx"] = this_class_and_level_normal[5]
				char_pro["class_" + i + "_sav_will"] = this_class_and_level_normal[6]
				char_pro["class_" + i + "_feats_normal"] = this_class_and_level_normal[17]
				char_pro["class_" + i + "_feats_epic"] = 0
			}
			else if (this_class_and_level_epic)
			{
				char_pro["class_" + i + "_bab_1"] = this_class_and_level_epic[0]
				char_pro["class_" + i + "_bab_2"] = this_class_and_level_epic[1]
				char_pro["class_" + i + "_bab_3"] = this_class_and_level_epic[2]
				char_pro["class_" + i + "_bab_4"] = this_class_and_level_epic[3]
				char_pro["class_" + i + "_sav_fort"] = this_class_and_level_epic[4]
				char_pro["class_" + i + "_sav_refx"] = this_class_and_level_epic[5]
				char_pro["class_" + i + "_sav_will"] = this_class_and_level_epic[6]
				char_pro["class_" + i + "_feats_normal"] = classes_normal[this_class_name][20]			// doesn't carry over into the epic table
				char_pro["class_" + i + "_feats_epic"] = this_class_and_level_epic[17]
			}

			char_pro.class_bab_1_total += char_pro["class_" + i + "_bab_1"]
			char_pro.class_bab_2_total += char_pro["class_" + i + "_bab_2"]
			char_pro.class_bab_3_total += char_pro["class_" + i + "_bab_3"]
			char_pro.class_bab_4_total += char_pro["class_" + i + "_bab_4"]
			char_pro.class_sav_fort_total += char_pro["class_" + i + "_sav_fort"]
			char_pro.class_sav_refx_total += char_pro["class_" + i + "_sav_refx"]
			char_pro.class_sav_will_total += char_pro["class_" + i + "_sav_will"]
			char_pro.class_feats_normal_total += char_pro["class_" + i + "_feats_normal"]
			char_pro.class_feats_epic_total += char_pro["class_" + i + "_feats_epic"]
			char_pro.class_skill_total = not_applicable
			char_pro.class_number += 1
		}
	}


	//----------------------------------------------------------------------
	// SECTION #5: CHARACTER LEVELS (OLD) - at top of table

	// character level
	char_pro.char_total_level = char_pro.mons_hit_level + char_pro.class_1_level + char_pro.class_2_level + char_pro.class_3_level + char_pro.class_4_level + char_pro.class_5_level


	//----------------------------------------------------------------------
	// SECTION #6: RACES (OLD)

	char_pro.section6 = "tool_section",	char_dsc.section6 = "RACE (HUMANOIDS ONLY)"

	char_pro.race_type = null,			char_dsc.race_type = "Character race."
	char_pro.race_str_mod = null,			char_dsc.race_str_mod = "Race strength modifier."
	char_pro.race_dex_mod = null,			char_dsc.race_dex_mod = "Race dexterity modifier."
	char_pro.race_con_mod = null,			char_dsc.race_con_mod = "Race constitution modifier."
	char_pro.race_int_mod = null,			char_dsc.race_int_mod = "Race intelligence modifier."
	char_pro.race_wis_mod = null,			char_dsc.race_wis_mod = "Race wisdom modifier."
	char_pro.race_cha_mod = null,			char_dsc.race_cha_mod = "Race charisma modifier."
	char_pro.race_level_adj = null,			char_dsc.race_level_adj = "Race level adjustment."
	char_pro.race_feat_first = null,		char_dsc.race_feat_first = "Race feats at first level."
	char_pro.race_skill_atfirst = null,		char_dsc.race_skill_atfirst = "Race skill points at first level"
	char_pro.race_skill_perlevel = null,		char_dsc.race_skill_perlevel = "Race skill points per level."
	char_pro.race_skill_total = null,		char_dsc.race_skill_total = "Total racial skill points."

	if (char_inp.RACE)
	{
		// get and store original char stats in appropriate data types and formats
		char_pro.race_type = char_inp.RACE.substring(5, char_inp.RACE.length)

		// get race ability score modifiers, level adjustment, etc.
		var this_race_abilmods = race_ability_score_modifiers[char_pro.race_type]
		char_pro.race_str_mod = this_race_abilmods[0]
		char_pro.race_dex_mod = this_race_abilmods[1]
		char_pro.race_con_mod = this_race_abilmods[2]
		char_pro.race_int_mod = this_race_abilmods[3]
		char_pro.race_wis_mod = this_race_abilmods[4]
		char_pro.race_cha_mod = this_race_abilmods[5]

		var this_race_stuff = race_stuff[char_pro.race_type]
		char_pro.race_level_adj = this_race_stuff[3]
		char_pro.race_feat_first = this_race_stuff[4]
		char_pro.race_skill_atfirst = this_race_stuff[5]
		char_pro.race_skill_perlevel = this_race_stuff[6]
		char_pro.race_skill_total = not_applicable
	}


	//----------------------------------------------------------------------
	// SECTION #7: DOMAINS (OLD)

	char_pro.section7 = "tool_section",	char_dsc.section7 = "DOMAINS"

	char_pro.domain_1_type = char_inp["DOMAIN_1"],	char_dsc.domain_1_type = "Domain #1."
	char_pro.domain_2_type = char_inp["DOMAIN_2"],	char_dsc.domain_2_type = "Domain #2."

	var this_domains_table = []
	if (char_pro.domain_1_type)
		this_domains_table.push(char_pro.domain_1_type)
	if (char_pro.domain_2_type)
		this_domains_table.push(char_pro.domain_2_type)


	//----------------------------------------------------------------------
	// SECTION #8: EFFECTIVE CHARACTER LEVELS (OLD) - at top of table

	// effective character level
	char_pro.char_effective_level = char_pro.char_total_level + char_pro.race_level_adj


	//----------------------------------------------------------------------
	// SECTION #10: SIZE (OLD)

	char_pro.section10 = "tool_section",	char_dsc.section10 = "SIZE"

	char_pro.size_type = null,		char_dsc.size_type = "Character size."
	char_pro.size_mod = null,		char_dsc.size_mod = "Size modifier."
	char_pro.size_num = null,		char_dsc.size_num = "Numerical value for size (1 to 9)."

	if (char_inp.OBJECTTYPE == 'obj_t_npc')
	{
		// get and store original char stats in appropriate data types and formats
		char_pro.size_type = char_inp.SIZE.substring(5, char_inp.SIZE.length)
		char_pro.size_mod = sizes[char_pro.size_type][0]
		char_pro.size_num = sizes[char_pro.size_type][1]
	}

	//----------------------------------------------------------------------
	// SECTION #12: SKILLS (OLD)

	char_pro.section12 = "tool_section",				char_dsc.section12 = "SKILLS (MAX = 10)"

	char_pro.skill_num_total_pro = null,				char_dsc.skill_num_total_pro = "How many total skills does the character have in PROTOS? (MAX = 10)"
	char_pro.mons_skill_points_total_again = not_applicable,	char_dsc.mons_skill_points_total_again = "Total number of monster skill points."
	char_pro.class_skill_total_again = not_applicable,		char_dsc.class_skill_total_again = "Total class skill points."
	char_pro.race_skill_total_again = not_applicable,		char_dsc.race_skill_total_again = "Total racial skill points."
	char_pro.skill_points_total = null,				char_dsc.skill_points_total = "How many total skill points has the character accumulated per PROTOS and RAW? Non-class skills are worth 1/2 skill rank per point."
	char_pro.skill_max_rank_pro = null,				char_dsc.skill_max_rank_pro = "What is the maximum rank the character has in a single skill per PROTOS?"
	char_pro.skill_max_rank_raw_class = not_applicable,	 	char_dsc.skill_max_rank_raw_class = "What is the maximum rank the character may have in a single class skill per RAW?"
	char_pro.skill_max_rank_raw_noclass = not_applicable,	 	char_dsc.skill_max_rank_raw_noclass = "What is the maximum rank the character may have in a single non-class skill per RAW?"
	char_pro.skill_points_unspent = not_applicable,			char_dsc.skill_points_unspent = "Remaining unspent skill points. Should usually equal zero. Negative values mean you have overspent and need to free up some points. Positive values can only be applied to new skills (if possible)."

	// used for determining feat prerequisites
	var this_skills_table = []

	// for every skill (MAX = 10)
	var temp_max_rank = 0
	for (var i = 1; i < 11; i++)
	{
		char_pro["divider_skill_" + i] = "tool_divider",		char_dsc["divider_skill_" + i] = "SKILL #" + i

		var this_skill_name = char_inp["SKILL_" + i]
		var this_skill_level = NullToNumber(char_inp["SKILL_LVL_" + i])
		temp_max_rank = Math.max(temp_max_rank, this_skill_level)

		// what skills does the character have already?
		char_pro["skill_" + i + "_name"] = null,			char_dsc["skill_" + i + "_name"] = "Skill #" + i + " name."
		char_pro["skill_" + i + "_level"] = null,			char_dsc["skill_" + i + "_level"] = "Skill #" + i + " level."
		char_pro["skill_" + i + "_is_class_skill"] = null,		char_dsc["skill_" + i + "_is_class_skill"] = "Is Skill #" + i + " a class skill?"
		char_pro["skill_" + i + "_is_domain_class_skill"] = null,	char_dsc["skill_" + i + "_is_domain_class_skill"] = "Is Skill #" + i + " a domain class skill?"
		char_pro["skill_" + i + "_is_domain_bonus_skill"] = null,	char_dsc["skill_" + i + "_is_domain_bonus_skill"] = "Is Skill #" + i + " a domain bonus skill?"
		char_pro["skill_" + i + "_is_race_bonus_skill"] = null,		char_dsc["skill_" + i + "_is_race_bonus_skill"] = "Is Skill #" + i + " a race bonus skill?"

		if (this_skill_name)
		{
			this_skills_table.push([this_skill_name, this_skill_level])

			var this_skill = skills[this_skill_name]
			if (!this_skill)
			{
				alert_two('Character ' + proto_number + ' skill error: ' + this_skill_name)
			}
			else
			{
				var this_class_skill = is_class_skill(this_skill_name, this_classes_table)
				var this_domain_class_skill = is_domain_class_skill(this_skill_name, this_domains_table)
				var this_domain_bonus_skill = is_domain_bonus_skill(this_skill_name, this_domains_table)
				var this_race_bonus_skill = is_race_bonus_skill(this_skill_name, char_pro.race_type)

				char_pro["skill_" + i + "_name"] = this_skill_name
				char_pro["skill_" + i + "_level"] = this_skill_level
				char_pro["skill_" + i + "_is_class_skill"] = this_class_skill
				char_pro["skill_" + i + "_is_domain_class_skill"] = this_domain_class_skill
				char_pro["skill_" + i + "_is_domain_bonus_skill"] = this_domain_bonus_skill
				char_pro["skill_" + i + "_is_race_bonus_skill"] = this_race_bonus_skill

				char_pro.skill_num_total_pro += 1
				char_pro.skill_points_total += this_skill_level
			}
		}
	}

	char_pro.skill_max_rank_pro = temp_max_rank


	//----------------------------------------------------------------------
	// SECTION #11: FEATS (OLD)

	char_pro.section11 = "tool_section",	char_dsc.section11 = "FEATS (MAX = 10)"

	// how many feats does the character have already?
	char_pro.feat_all_creatures_total = not_applicable,	char_dsc.feat_all_creatures_total = "Bonus feats given to all creatures every three levels, plus one at first level."
	char_pro.feat_class_normal_total = 0,			char_dsc.feat_class_normal_total = "Total number of normal class bonus feats for fighters and some other classes."
	char_pro.feat_class_epic_total = 0,			char_dsc.feat_class_epic_total = "Total number of epic class bonus feats. These must be selected from the epic feat list for each class. Not sure if ToEE fully supports epic class levels."
	char_pro.feat_like_ability_total = 0,			char_dsc.feat_like_ability_total = "Total number of feat-like special abilities. ToEE treats these differently somehow."
	char_pro.feat_race_at_first = not_applicable,		char_dsc.feat_race_at_first = "Number of racial bonus feats given at first level. Only awarded to humans AFAIK."
	char_pro.feat_other_total = 0,				char_dsc.feat_other_total = "Total number of other types of feats not already listed elsewhere."
	char_pro.feat_total = 0,				char_dsc.feat_total = "How many feats does/should the character have per PROTOS and RAW? If RAW is less than PROTOS, then the last feat will be omitted from the list below. Note that ToEE supports no more than 10 feats."

	// used to determine feat prerequisites for obtaining feats
	var this_feats_table = []
	// for every feat (MAX = 10)
	for (var i = 1; i <= 10; i++)
	{
		var this_feat_name = char_inp["FEAT_" + i]
		if (this_feat_name)
		{
			this_feats_table.push(this_feat_name)
		}
	}

	// for every feat (MAX = 10)
	for (var i = 1; i < 11; i++)
	{
		char_pro["divider_feat_" + i] = "tool_divider",			char_dsc["divider_feat_" + i] = "FEAT #" + i

		char_pro["feat_" + i + "_name"] = null,				char_dsc["feat_" + i + "_name"] = "Feat #" + i + " name."
		char_pro["feat_" + i + "_is_class_normal_feat"] = null,		char_dsc["feat_" + i + "_is_class_normal_feat"] = "Is feat #" + i + " a normal class feat?"
		char_pro["feat_" + i + "_is_class_epic_feat"] = null,		char_dsc["feat_" + i + "_is_class_epic_feat"] = "Is feat #" + i + " an epic class feat?"
		char_pro["feat_" + i + "_is_feat_like_ability"] = null,		char_dsc["feat_" + i + "_is_feat_like_ability"] = "Is feat #" + i + " a feat-like ability?"
		char_pro["feat_" + i + "_is_racial_proficiency"] = null,	char_dsc["feat_" + i + "_is_racial_proficiency"] = "Is feat #" + i + " automatically granted to members of the character's race?"
		char_pro["feat_" + i + "_prereq_feats"] = null,			char_dsc["feat_" + i + "_prereq_feats"] = "What other feats are prerequisites for feat #" + i + "? [Are these prerequisites met?]"
		char_pro["feat_" + i + "_prereq_abil_scores"] = null,		char_dsc["feat_" + i + "_prereq_abil_scores"] = "Does feat #" + i + " have any prerequisite ability scores? [Are these prerequisites met?]"
		char_pro["feat_" + i + "_prereq_skills"] = null,		char_dsc["feat_" + i + "_prereq_skills"] = "Does feat #" + i + " have any prerequisite skills? [Are these prerequisites met?]"

		var this_feat_name = char_inp["FEAT_" + i]
		if (this_feat_name)
		{
			var this_class_feat = is_normal_class_feat(this_feat_name, this_classes_table, proto_number)
			var this_epic_feat = is_epic_class_feat(this_feat_name, this_classes_table, proto_number)
			var this_feat_like = is_featlike_ability(this_feat_name, proto_number)
			var this_racial_proficiency = is_racial_proficiency(this_feat_name, char_pro.race_type, proto_number)

			char_pro["feat_" + i + "_name"] = this_feat_name
			char_pro["feat_" + i + "_is_class_normal_feat"] = this_class_feat
			char_pro["feat_" + i + "_is_class_epic_feat"] = this_epic_feat
			char_pro["feat_" + i + "_is_feat_like_ability"] = this_feat_like
			char_pro["feat_" + i + "_is_racial_proficiency"] = this_racial_proficiency
			char_pro["feat_" + i + "_prereq_feats"] = get_prerequisite_feats(this_feat_name, this_feats_table, proto_number)
			char_pro["feat_" + i + "_prereq_abil_scores"] = get_prerequisite_ability_scores(this_feat_name, this_abil_score_table, proto_number)
			char_pro["feat_" + i + "_prereq_skills"] = get_prerequisite_skills(this_feat_name, this_skills_table, proto_number)

			var this_regxp = /false/
			err_pro["feat_" + i + "_prereq_feats"] = this_regxp.test(char_pro["feat_" + i + "_prereq_feats"])
			err_pro["feat_" + i + "_prereq_abil_scores"] = this_regxp.test(char_pro["feat_" + i + "_prereq_abil_scores"])
			err_pro["feat_" + i + "_prereq_skills"] = this_regxp.test(char_pro["feat_" + i + "_prereq_skills"])

			char_pro.feat_class_normal_total += this_class_feat
			char_pro.feat_class_epic_total += this_epic_feat
			char_pro.feat_like_ability_total += this_feat_like
			char_pro.feat_other_total += 1 - Math.max(this_class_feat, this_epic_feat, this_feat_like)
			char_pro.feat_total += 1
		}
	}


	//----------------------------------------------------------------------
	// SECTION #13: SPELLS (OLD)

	char_pro.section13 = "tool_section",	char_dsc.section13 = "SPELLS (MAX = 20)"

	// for every spell (MAX = 20)
	for (var i = 1; i < 21; i++)
	{
		var this_spell_name = char_inp["SPELL_" + i]
		char_pro["spell_" + i + "_name"] = null,			char_dsc["spell_" + i + "_name"] = "Spell #" + i + " name."

		if (this_spell_name)
		{
			char_pro["spell_" + i + "_name"] = this_spell_name
		}
	}


	//----------------------------------------------------------------------
	// SECTION #14: SPECIAL ABILITIES (OLD) - seem to be handled internally by the game

//	char_pro.section14 = "tool_section",	char_dsc.section14 = "SPECIAL ABILITIES"
//	char_pro.to_do = to_do,	char_dsc.to_do = to_do


	//----------------------------------------------------------------------
	// SECTION #15: TOWARDS THE END STUFF, TOTALS, ETC. (OLD)

	// total BAB
	char_pro.char_bab_total = char_pro.mons_bab + char_pro.class_bab_1_total + char_pro.class_bab_2_total + char_pro.class_bab_3_total + char_pro.class_bab_4_total

	// monster-only strength and dexterity attack bonuses
	if (char_pro.mons_hit_level > 0)
	{
		char_pro.mons_str_attack_bonus = char_pro.char_bab_total + char_pro.race_str_mod + char_pro.size_mod
		char_pro.mons_dex_attack_bonus = char_pro.char_bab_total + char_pro.race_dex_mod + char_pro.size_mod
	}


	//----------------------------------------------------------------------
	// SECTION #23: ABILITY SCORES (NEW)

	char_raw.abil_since_start = Math.floor(char_raw.char_total_level/4)

	// ability scores
	char_raw.abil_str = char_pro.abil_str
	char_raw.abil_dex = char_pro.abil_dex
	char_raw.abil_con = char_pro.abil_con
	char_raw.abil_int = char_pro.abil_int
	char_raw.abil_wis = char_pro.abil_wis
	char_raw.abil_cha = char_pro.abil_cha

	// ability score modifiers
	char_raw.abil_str_mod = ability_score_modifiers[char_raw.abil_str]
	char_raw.abil_dex_mod = ability_score_modifiers[char_raw.abil_dex]
	char_raw.abil_con_mod = ability_score_modifiers[char_raw.abil_con]
	char_raw.abil_int_mod = ability_score_modifiers[char_raw.abil_int]
	char_raw.abil_wis_mod = ability_score_modifiers[char_raw.abil_wis]
	char_raw.abil_cha_mod = ability_score_modifiers[char_raw.abil_cha]

	// used to determine ability prerequisites for feats
	this_abil_score_table =
	[
		char_raw.abil_str,
		char_raw.abil_dex,
		char_raw.abil_con,
		char_raw.abil_int,
		char_raw.abil_wis,
		char_raw.abil_cha
	]


	//----------------------------------------------------------------------
	// SECTION #17: MONSTER LEVELS (NEW) - hidden section

	char_raw.mons_type = null
	char_raw.mons_subtype = null
	char_raw.mons_hit_die = null
	char_raw.mons_hit_bonus = null
	char_raw.mons_hit_txt = null
	char_raw.mons_hit_level = null

	// get monster BAB (should I be totaling them all up?)
	char_raw.mons_bab = null

	// get monster saves
	char_raw.mons_fort = null
	char_raw.mons_refx = null
	char_raw.mons_will = null

	char_raw.mons_skill_points_perlvl = null
	char_raw.mons_skill_points_atfirst = null
	char_raw.mons_skill_points_total = null
	char_raw.mons_bab_class = null
	char_raw.mons_sav_class = null

	// if the character has any monster levels
	if (char_inp.HP_DICE)
	{
		char_raw.mons_type = char_pro.mons_type
		char_raw.mons_subtype = char_pro.mons_subtype
		char_raw.mons_hit_level = char_pro.mons_hit_level
		var this_monster = creature_types[char_raw.mons_type]

		if (!this_monster)
		{
			alert_two('Character ' + proto_number + ' creature type ' + char_pro.mons_type + ' not recognized.')
		}
		else
		{
			char_raw.mons_hit_die = this_monster[3]
			char_raw.mons_hit_bonus = 0
			char_raw.mons_hit_txt = char_raw.mons_hit_level + 'd' + char_raw.mons_hit_die

			char_raw.mons_skill_points_perlvl = (this_monster[4] + char_raw.abil_int_mod) * (char_raw.mons_hit_level - 1)
			char_raw.mons_skill_points_atfirst = (this_monster[4] + char_raw.abil_int_mod) * this_monster[5]
			char_raw.mons_skill_points_total = char_raw.mons_skill_points_atfirst + char_raw.mons_hit_level * char_raw.mons_skill_points_perlvl
			char_raw.mons_bab_class = char_pro.mons_bab_class
			char_raw.mons_sav_class = char_pro.mons_sav_class

			if (char_pro.mons_hit_bonus > 0)
			{
				var this_multi = char_pro.mons_hit_bonus/char_pro.mons_hit_level
				char_raw.mons_hit_bonus = Math.ceil(char_raw.mons_hit_level*this_multi)
				char_raw.mons_hit_txt += '+' + char_raw.mons_hit_bonus
			}

			if (char_raw.mons_hit_level <= 20)
			{
				var this_bab_class_and_level = classes_normal[char_raw.mons_bab_class][char_raw.mons_hit_level]
				var this_save_class_and_level = classes_normal[char_raw.mons_sav_class][char_raw.mons_hit_level]
			}
			else
			{
				var this_bab_class_and_level = classes_epic[char_raw.mons_bab_class][char_raw.mons_hit_level]
				var this_save_class_and_level = classes_epic[char_raw.mons_sav_class][char_raw.mons_hit_level]
			}

			// too many levels!
			if (char_raw.mons_hit_level > 70)
			{
				alert_two('Character ' + proto_number + ' monster level ' + char_raw.mons_hit_level + ' out of range.')
			}
			else
			{
				// get monster BAB (but aren't there multiple BABs?)
				char_raw.mons_bab = this_bab_class_and_level[0]

				// get monster saves
				char_raw.mons_fort = this_sav_class_and_level[4]
				char_raw.mons_refx = this_sav_class_and_level[5]
				char_raw.mons_will = this_sav_class_and_level[6]
			}
		}
	}


	//----------------------------------------------------------------------
	// SECTION #18: CLASSES (NEW)

	// need to decide whether to allow epic levels, and what to do if not
	// i.e. what to do if adding new levels causes a class/character to go beyond level 20
	// also, double-check to make sure that class 1/2/3 is really the chronological order in which the classes were acquired

	// a little confused about how BAB works: add first?
	char_raw.class_bab_1_total = null
	char_raw.class_bab_2_total = null
	char_raw.class_bab_3_total = null
	char_raw.class_bab_4_total = null
	char_raw.class_sav_fort_total = null
	char_raw.class_sav_refx_total = null
	char_raw.class_sav_will_total = null
	char_raw.class_feats_normal_total = null
	char_raw.class_feats_epic_total = null
	char_raw.class_skill_total = null
	char_raw.class_number = char_pro.class_number

	// used for determining normal and epic class feats
	var this_classes_table = []

	// for every class (MAX = 5)
	for (var i = 1; i < 6; i++)
	{
		var this_class_name = char_pro["class_" + i + "_name"]
		var this_class_level = char_pro["class_" + i + "_level"]
		char_raw["class_" + i + "_name"] = this_class_name
		char_raw["class_" + i + "_level"] = this_class_level
		char_raw["class_" + i + "_bab_1"] = null
		char_raw["class_" + i + "_bab_2"] = null
		char_raw["class_" + i + "_bab_3"] = null
		char_raw["class_" + i + "_bab_4"] = null
		char_raw["class_" + i + "_sav_fort"] = null
		char_raw["class_" + i + "_sav_refx"] = null
		char_raw["class_" + i + "_sav_will"] = null
		char_raw["class_" + i + "_is_favored"] = char_pro["class_" + i + "_is_favored"]
		char_raw["class_" + i + "_skill_points_perlevel"] = null
		char_raw["class_" + i + "_skill_points_atfirst"] = null
		char_raw["class_" + i + "_feats_normal"] = null
		char_raw["class_" + i + "_feats_epic"] = null

		if (this_class_name)
		{
			this_classes_table.push(this_class_name)

			var this_class = classes_stuff[this_class_name]
			char_raw["class_" + i + "_skill_points_perlevel"] = (this_class[2] + char_raw.abil_int_mod) * (this_class_level - 1)
			char_raw["class_" + i + "_skill_points_atfirst"] = (this_class[2] + char_raw.abil_int_mod) * this_class[3]
			var this_class_and_level_normal = classes_normal[this_class_name][this_class_level]
			var this_class_and_level_epic = classes_epic[this_class_name][this_class_level]
			if (this_class_and_level_normal)
			{
				char_raw["class_" + i + "_bab_1"] = this_class_and_level_normal[0]
				char_raw["class_" + i + "_bab_2"] = this_class_and_level_normal[1]
				char_raw["class_" + i + "_bab_3"] = this_class_and_level_normal[2]
				char_raw["class_" + i + "_bab_4"] = this_class_and_level_normal[3]
				char_raw["class_" + i + "_sav_fort"] = this_class_and_level_normal[4]
				char_raw["class_" + i + "_sav_refx"] = this_class_and_level_normal[5]
				char_raw["class_" + i + "_sav_will"] = this_class_and_level_normal[6]
				char_raw["class_" + i + "_feats_normal"] = this_class_and_level_normal[17]
				char_raw["class_" + i + "_feats_epic"] = 0
			}
			else if (this_class_and_level_epic)
			{
				char_raw["class_" + i + "_bab_1"] = this_class_and_level_epic[0]
				char_raw["class_" + i + "_bab_2"] = this_class_and_level_epic[1]
				char_raw["class_" + i + "_bab_3"] = this_class_and_level_epic[2]
				char_raw["class_" + i + "_bab_4"] = this_class_and_level_epic[3]
				char_raw["class_" + i + "_sav_fort"] = this_class_and_level_epic[4]
				char_raw["class_" + i + "_sav_refx"] = this_class_and_level_epic[5]
				char_raw["class_" + i + "_sav_will"] = this_class_and_level_epic[6]
				char_raw["class_" + i + "_feats_normal"] = classes_normal[this_class_name][20]			// doesn't carry over into the epic table
				char_raw["class_" + i + "_feats_epic"] = this_class_and_level_epic[17]
			}

			char_raw.class_bab_1_total += char_raw["class_" + i + "_bab_1"]
			char_raw.class_bab_2_total += char_raw["class_" + i + "_bab_2"]
			char_raw.class_bab_3_total += char_raw["class_" + i + "_bab_3"]
			char_raw.class_bab_4_total += char_raw["class_" + i + "_bab_4"]
			char_raw.class_sav_fort_total += char_raw["class_" + i + "_sav_fort"]
			char_raw.class_sav_refx_total += char_raw["class_" + i + "_sav_refx"]
			char_raw.class_sav_will_total += char_raw["class_" + i + "_sav_will"]
			char_raw.class_feats_normal_total += char_raw["class_" + i + "_feats_normal"]
			char_raw.class_feats_epic_total += char_raw["class_" + i + "_feats_epic"]
			char_raw.class_skill_total += char_raw["class_" + i + "_skill_points_atfirst"] + (char_raw["class_" + i + "_level"] - 1) * char_raw["class_" + i + "_skill_points_perlevel"]
		}
	}


	//----------------------------------------------------------------------
	// SECTION #19: CHARACTER LEVELS (NEW) - at top of table

	// character level
	char_raw.char_total_level = char_raw.mons_hit_level + char_raw.class_1_level + char_raw.class_2_level + char_raw.class_3_level + char_raw.class_4_level + char_raw.class_5_level


	//----------------------------------------------------------------------
	// SECTION #20: RACES (NEW)

	char_raw.race_type = char_pro.race_type

	// get race ability score modifiers, level adjustment, etc.
	char_raw.race_str_mod = char_pro.race_str_mod
	char_raw.race_dex_mod = char_pro.race_dex_mod
	char_raw.race_con_mod = char_pro.race_con_mod
	char_raw.race_int_mod = char_pro.race_int_mod
	char_raw.race_wis_mod = char_pro.race_wis_mod
	char_raw.race_cha_mod = char_pro.race_cha_mod
	char_raw.race_level_adj = char_pro.race_level_adj
	char_raw.race_feat_first = char_pro.race_feat_first
	char_raw.race_skill_atfirst = char_pro.race_skill_atfirst
	char_raw.race_skill_perlevel = char_pro.race_skill_perlevel
	char_raw.race_skill_total = null

	if (char_inp.RACE)
	{
		char_raw.race_skill_total = char_raw.race_skill_atfirst + (char_raw.char_total_level - 1) * char_raw.race_skill_perlevel
	}


	//----------------------------------------------------------------------
	// SECTION #21: DOMAINS (NEW)

	char_raw.domain_1_type = char_pro.domain_1_type
	char_raw.domain_2_type = char_pro.domain_2_type


	//----------------------------------------------------------------------
	// SECTION #22: EFFECTIVE CHARACTER LEVELS (NEW) - at top of table

	// effective character level
	char_raw.char_effective_level = char_raw.char_total_level + char_raw.race_level_adj


	//----------------------------------------------------------------------
	// SECTION #24: SIZES (NEW)

	char_raw.size_num = char_pro.size_num
	char_raw.size_type = char_pro.size_type
	char_raw.size_mod = char_pro.size_mod


	//----------------------------------------------------------------------
	// SECTION #26: SKILLS (NEW)

	char_raw.skill_num_total_pro = not_applicable
	char_raw.mons_skill_points_total_again = char_raw.mons_skill_points_total
	char_raw.class_skill_total_again = char_raw.class_skill_total
	char_raw.race_skill_total_again = char_raw.race_skill_total
	char_raw.skill_points_total = char_raw.mons_skill_points_total + char_raw.class_skill_total + char_raw.race_skill_total
	char_raw.skill_max_rank_pro = not_applicable
	char_raw.skill_max_rank_raw_class = char_raw.char_total_level + 3
	char_raw.skill_max_rank_raw_noclass = char_raw.skill_max_rank_raw_class/2


	// used for determining feat prerequisites
	this_skills_table = []

	// for every skill (MAX = 10)
	var tuples = []
	for (var i = 1; i < 11; i++)
	{
		var this_skill_name = char_pro["skill_" + i + "_name"]
		var this_skill_level = char_pro["skill_" + i + "_level"]
		var this_class_skill = char_pro["skill_" + i + "_is_class_skill"]
		var this_domain_skill = char_pro["skill_" + i + "_is_domain_class_skill"]
		char_raw["skill_" + i + "_name"] = this_skill_name
		char_raw["skill_" + i + "_is_class_skill"] = this_class_skill
		char_raw["skill_" + i + "_is_domain_class_skill"] = this_domain_skill
		char_raw["skill_" + i + "_is_domain_bonus_skill"] = char_pro["skill_" + i + "_is_domain_bonus_skill"]
		char_raw["skill_" + i + "_is_race_bonus_skill"] = char_pro["skill_" + i + "_is_race_bonus_skill"]
		if (this_skill_name)
		{
			this_skills_table.push([this_skill_name, this_skill_level])
			tuples.push([this_skill_name, this_skill_level, i, this_class_skill || this_domain_skill, 0])
			char_raw["skill_" + i + "_level"] = 0
		}
		else
		{
			char_raw["skill_" + i + "_level"] = null
		}
	}

	tuples.sort
	(
		function(a, b)
		{
			a = a[1]
			b = b[1]
			return a < b ? -1 : (a > b ? 1 : 0)
		}
	)

	if (char_pro.skill_num_total_pro > 0)
	{
		// spend skill points, taking into account the original ratios between the different skills
		var skill_count = 0
		var i = 0
		while (i < char_raw.skill_points_total)
		{
			var fail_count = 0
			var tuples_length = tuples.length
			for (var j = 0; j < tuples_length; j++)
			{
				if (tuples[j][4] == 1)
				{
					fail_count += 1
				}
			}
			if (fail_count == tuples_length)
			{
				break
			}

			var this_index = tuples[skill_count][2]
			var this_is_class_skill = tuples[skill_count][3]
			var this_rank_increment = 1
			var this_rank_max = char_raw.skill_max_rank_raw_class
			var this_rank_new = char_raw["skill_" + this_index + "_level"] + this_rank_increment
			var this_points_raw = char_raw["skill_" + this_index + "_level"]/this_rank_increment
			var this_points_pro = char_pro["skill_" + this_index + "_level"]/this_rank_increment
			var this_ratio_raw = this_points_raw/char_raw.skill_points_total
			var this_ratio_pro = this_points_pro/char_pro.skill_points_total

			if ((this_ratio_raw > this_ratio_pro) || (this_rank_new > this_rank_max))
			{
				tuples[skill_count][4] = 1
			}
			else
			{
				i += 1
				char_raw["skill_" + this_index + "_level"] = this_rank_new
			}
			skill_count += 1
			if (skill_count == tuples_length)
			{
				skill_count = 0
			}
		}
		var this_unspent_points = char_raw.skill_points_total - i

		// try to spend the remaining skill points here, one by one
		var skill_count = 0
		var i = 0
		while (i < this_unspent_points)
		{
			var fail_count = 0
			var tuples_length = tuples.length
			for (var j = 0; j < tuples_length; j++)
			{
				if (tuples[j][4] == 0)
				{
					fail_count += 1
				}
			}
			if (fail_count == tuples_length)
			{
				break
			}

			var this_index = tuples[skill_count][2]
			var this_is_class_skill = tuples[skill_count][3]
			var this_rank_increment = this_is_class_skill ? 1 : 1/2
			var this_rank_max = this_is_class_skill ? char_raw.skill_max_rank_raw_class : char_raw.skill_max_rank_raw_noclass
			var this_rank_new = char_raw["skill_" + this_index + "_level"] + this_rank_increment
			var this_points_raw = char_raw["skill_" + this_index + "_level"]/this_rank_increment
			var this_points_pro = char_pro["skill_" + this_index + "_level"]/this_rank_increment
			var this_ratio_raw = this_points_raw/char_raw.skill_points_total
			var this_ratio_pro = this_points_pro/char_pro.skill_points_total

			if (this_rank_new > this_rank_max)
			{
				tuples[skill_count][4] = 0
			}
			else
			{
				i += 1
				char_raw["skill_" + this_index + "_level"] = this_rank_new
			}
			skill_count += 1
			if (skill_count == tuples_length)
			{
				skill_count = 0
			}
		}

		char_raw.skill_points_unspent = this_unspent_points - i
	}


	//----------------------------------------------------------------------
	// SECTION #25: FEATS (NEW)

	// how many feats does the character have already?
	char_raw.feat_all_creatures_total = Math.floor(char_raw.char_total_level/3) + 1
	char_raw.feat_class_normal_total = NullToNumber(char_raw.class_feats_normal_total)
	char_raw.feat_class_epic_total = NullToNumber(char_raw.class_feats_epic_total)
	char_raw.feat_like_ability_total = not_applicable
	char_raw.feat_race_at_first = char_raw.race_feat_first
	char_raw.feat_other_total = not_applicable
	char_raw.feat_total = char_raw.class_feats_normal_total + char_raw.class_feats_epic_total + char_raw.feat_all_creatures_total + char_raw.race_feat_first

	err_raw.feat_all_creatures_total = false
//	err_raw.feat_class_normal_total = false
//	err_raw.feat_class_epic_total = false
	err_raw.feat_like_ability_total = false
	err_raw.feat_race_at_first = false
	err_raw.feat_other_total = false

	// used to determine feat prerequisites for obtaining feats
	this_feats_table = []
	// for every feat up to RAW total (MAX = 10)
	for (var i = 1, n = Math.min(char_raw.feat_total, 10); i <= n; i++)
	{
		var this_feat_name = char_pro["feat_" + i + "_name"]
		if (this_feat_name)
		{
			this_feats_table.push(this_feat_name)
		}
	}

	// for every feat (MAX = 10)
	for (var i = 1; i < 11; i++)
	{
		char_raw["feat_" + i + "_name"] = null
		char_raw["feat_" + i + "_is_class_normal_feat"] = null
		char_raw["feat_" + i + "_is_class_epic_feat"] = null
		char_raw["feat_" + i + "_is_feat_like_ability"] = null
		char_raw["feat_" + i + "_is_racial_proficiency"] = null
		char_raw["feat_" + i + "_prereq_feats"] = null
		char_raw["feat_" + i + "_prereq_abil_scores"] = null
		char_raw["feat_" + i + "_prereq_skills"] = null

		var this_feat_name = char_pro["feat_" + i + "_name"]
		if ((this_feat_name) && (i <= char_raw.feat_total))
		{
			char_raw["feat_" + i + "_name"] = this_feat_name
			char_raw["feat_" + i + "_is_class_normal_feat"] = is_normal_class_feat(this_feat_name, this_classes_table, proto_number)
			char_raw["feat_" + i + "_is_class_epic_feat"] = is_epic_class_feat(this_feat_name, this_classes_table, proto_number)
			char_raw["feat_" + i + "_is_feat_like_ability"] = is_featlike_ability(this_feat_name, proto_number)
			char_raw["feat_" + i + "_is_racial_proficiency"] = is_racial_proficiency(this_feat_name, char_raw.race_type, proto_number)
			char_raw["feat_" + i + "_prereq_feats"] = get_prerequisite_feats(this_feat_name, this_feats_table, proto_number)
			char_raw["feat_" + i + "_prereq_abil_scores"] = get_prerequisite_ability_scores(this_feat_name, this_abil_score_table, proto_number)
			char_raw["feat_" + i + "_prereq_skills"] = get_prerequisite_skills(this_feat_name, this_skills_table, proto_number)

			var this_regxp = /false/
			err_raw["feat_" + i + "_prereq_feats"] = this_regxp.test(char_raw["feat_" + i + "_prereq_feats"])
			err_raw["feat_" + i + "_prereq_abil_scores"] = this_regxp.test(char_raw["feat_" + i + "_prereq_abil_scores"])
			err_raw["feat_" + i + "_prereq_skills"] = this_regxp.test(char_raw["feat_" + i + "_prereq_skills"])
		}
	}


	//----------------------------------------------------------------------
	// SECTION #27: SPELLS (NEW)

	// for every spell (MAX = 20)
	for (var i = 1; i < 21; i++)
	{
		char_raw["spell_" + i + "_name"] = char_pro["spell_" + i + "_name"]
	}


	//----------------------------------------------------------------------
	// SECTION #28: TOWARDS THE END STUFF, TOTALS, ETC. (NEW)

	// total BAB
	char_raw.char_bab_total = char_raw.mons_bab + char_raw.class_bab_1_total + char_raw.class_bab_2_total + char_raw.class_bab_3_total + char_raw.class_bab_4_total

	// hit points
	char_raw.char_hit_points = to_do

	// monster-only strength and dexterity attack bonuses
	char_raw.mons_str_attack_bonus = null
	char_raw.mons_dex_attack_bonus = null
	if (char_inp.HP_DICE)
	{
		char_raw.mons_str_attack_bonus = char_raw.char_bab_total + char_raw.race_str_mod + char_raw.size_mod
		char_raw.mons_dex_attack_bonus = char_raw.char_bab_total + char_raw.race_dex_mod + char_raw.size_mod
	}


	//----------------------------------------------------------------------
	// SECTION #29: RECORD DATA

	for (var i in char_pro)
	{
		var this_value = char_pro[i]
		if ((this_value != "tool_section") && (this_value != "tool_divider"))
		{
			if (err_pro[i] == true)
				err_total += 1
			else if (err_raw[i] == true)
				err_total += 1
			else if ((this_value != not_applicable) && (char_raw[i] != not_applicable) && (this_value != to_do) && (char_raw[i] != to_do) && (this_value != char_raw[i]))
				err_total += 1
		}
	}

	characters_table[proto_number].char_pro = char_pro
	characters_table[proto_number].char_raw = char_raw
	characters_table[proto_number].char_dsc = char_dsc
	characters_table[proto_number].char_out = char_out
	characters_table[proto_number].err_pro = err_pro
	characters_table[proto_number].err_raw = err_raw
	characters_table[proto_number].err_total = err_total
}

function is_class_skill(this_skill_name, this_classes_table)
{
	var this_skill = skills[this_skill_name]
	if (this_skill)
	{
		// for every class (MAX = 5)
		for (var j = 0, o = this_classes_table.length; j < o; j++)
		{
			var this_class_name = this_classes_table[j]
			if (this_class_name)
			{
				var start_index = 3
				var class_index = classes_stuff[this_class_name][4]
				if (this_skill[start_index + class_index] != 0)
				{
					return true
				}
			}
		}
	}
	else
	{
		alert_two('Character ' + proto_number + ' skill error: ' + this_skill_name)		
	}
	return false
}

function is_domain_class_skill(this_skill_name, this_domains_table)
{
	var this_skill = skills[this_skill_name]
	if (this_skill)
	{
		// for every domain (MAX = 2)
		for (var j = 0, o = this_domains_table.length; j < o; j++)
		{
			var this_domain_name = this_domains_table[j]
			if (this_domain_name)
			{
				// domain class skill
				var start_index = 21
				var domain_index = domains[this_domain_name][1]
				if  (this_skill[start_index + domain_index] != 0)
				{
					return true
				}
			}
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' skill error: ' + this_skill_name)		
//	}
	return false
}

function is_domain_bonus_skill(this_skill_name, this_domains_table)
{
	var this_skill = skills[this_skill_name]
	if (this_skill)
	{
		// for every domain (MAX = 2)
		for (var j = 0, o = this_domains_table.length; j < o; j++)
		{
			var this_domain_name = this_domains_table[j]
			if (this_domain_name)
			{
				// domain bonus skill
				start_index = 57
				domain_index = domains[this_domain_name][1]
				if (this_skill[start_index + domain_index] != 0)
				{
					return true
				}
			}
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' skill error: ' + this_skill_name)		
//	}
	return false
}

function is_race_bonus_skill(this_skill_name, this_race_name)
{
	var this_skill = skills[this_skill_name]
	if (this_skill)
	{
		if (this_race_name)
		{
			var start_index = 14
			var race_index = race_stuff[this_race_name][7]
			if (this_skill[start_index + race_index] != 0)
			{
				return true
			}
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' skill error: ' + this_skill_name)		
//	}
	return false
}

function is_class_favored_race(this_race_name, this_class_name)
{
	if ((this_race_name == 'human') || (race_stuff[this_race_name][0] == this_class_name))
	{
		return true
	}
	return false
}

function is_normal_class_feat(this_feat_name, this_classes_table, proto_number)
{
	var this_feat = feats[this_feat_name]
	if (this_feat)
	{
		// for every class (MAX = 5)
		for (var j = 0, o = this_classes_table.length; j < o; j++)
		{
			var this_class_name = this_classes_table[j]
			if (this_class_name)
			{
				var start_index = 12
				var class_index = classes_stuff[this_class_name][4]
				if (this_feat[start_index + class_index] > 0)
				{
					return true
				}
			}
		}
	}
	else
	{
		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
	}
	return false
}

function is_epic_class_feat(this_feat_name, this_classes_table, proto_number)
{
	var this_feat = feats[this_feat_name]
	if (this_feat)
	{
		// for every class (MAX = 5)
		for (var j = 0, o = this_classes_table.length; j < o; j++)
		{
			var this_class_name = this_classes_table[j]
			if (this_class_name)
			{
				var start_index = 23
				var class_index = classes_stuff[this_class_name][4]
				if (this_feat[start_index + class_index] > 0)
				{
					return true
				}
			}
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return false
}

function is_featlike_ability(this_feat_name, proto_number)
{
	var this_feat = feat_like_abilities[this_feat_name]
	if (this_feat)
	{
		return true
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return false
}

function is_racial_proficiency(this_feat_name, this_race_name, proto_number)
{
	var this_feat = feats[this_feat_name]
	if ((this_feat) && (this_race_name))
	{
		var start_index = 39
		var race_index = race_stuff[this_race_name][7]
		// seems to only happen with elves
		if (this_feat[start_index + race_index] == -1)
		{
			return true
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return false
}

function get_prerequisite_feats(this_feat_name, this_feats_table, proto_number)
{
	var return_string = ''
	var this_feat = feats[this_feat_name]
	if (this_feat)
	{
		var prereq_feats = this_feat[74]
		for (var i = 0, n = prereq_feats.length; i < n; i++)
		{
			var check_feat_i = prereq_feats[i]
			var is_match = false
			return_string += check_feat_i + ' ['
			// for every feat (MAX = 10)
			for (var j = 0, o = this_feats_table.length; j < o; j++)
			{
				var check_feat_j = this_feats_table[j]
				if (check_feat_i == check_feat_j)
				{
					is_match = true
					break
				}
			}
			return_string += is_match == true ? 'true]' : 'false]'
			return_string += i < (n - 1) ? ', ' : ''
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return return_string == '' ? 'none' : return_string
}

function get_prerequisite_ability_scores(this_feat_name, this_abil_score_table, proto_number)
{
	var return_string = ''
	var this_feat = feats[this_feat_name]
	if (this_feat)
	{
		var start_index = 67
		var scores_table = []
		// for every ability score (MAX = 6)
		for (var j = 0; j < 6; j++)
		{
			var this_ability_score_prereq = this_feat[start_index + j]
			if (this_ability_score_prereq > 0)
			{
				var this_ability_score_text = ability_scores[j]
				var this_ability_score_pass = this_abil_score_table[j] >= this_ability_score_prereq
				scores_table.push([this_ability_score_prereq, this_ability_score_text, this_ability_score_pass])
			}
		}
		// for every recorded score
		var scores_length = scores_table.length
		for (var j = 0; j < scores_length; j++)
		{
			var this_score = scores_table[j]
			return_string += this_score[1] + ': ' + this_score[0]
			return_string += ' [' + this_score[2] + ']'
			return_string += j < (scores_length - 1) ? ', ' : ''
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return return_string == '' ? 'none' : return_string
}

function get_prerequisite_skills(this_feat_name, this_skills_table, proto_number)
{
	var return_string = ''
	var this_feat = feats[this_feat_name]
	if (this_feat)
	{
		var this_prereq_skills_names = this_feat[77]
		var this_prereq_skills_levels = this_feat[78]
		var is_match = false
		// for every obtained skill (MAX = 10)
		for (var i = 0, n = this_skills_table.length; i < n; i++)
		{
			var this_learned_skill_name = this_skills_table[0]
			var this_learned_skill_level = this_skills_table[1]
			for (var j = 0, o = this_prereq_skills_names.length; j < o; j++)
			{
				var this_prereq_skill_name = this_prereq_skills_names[j]
				var this_prereq_skill_level = this_prereq_skills_levels[j]
				if (this_learned_skill_name == this_prereq_skill_name)
				{
					return_string += this_prereq_skill_name + ': ' + this_prereq_skill_level
					return_string += ' [' + (this_learned_skill_level >= this_prereq_skill_level ? 'true' : 'false') + ']'
					return_string += i < (n - 1) ? ', ' : ''
					// to do
					is_match = true
					break
				}
			}
		}
	}
//	else
//	{
//		alert_two('Character ' + proto_number + ' feat error: ' + this_feat_name)		
//	}
	return return_string == '' ? 'none' : return_string
}
