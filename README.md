# ToEE d20 Inspector

Several years ago I set out to create a tool to automatically level up or level down characters in the video game _The Temple of Elemental Evil_ by Troika Games. As a first step, and in order to ensure all my math was correct, I create _this_ tool to check whether _existing_ characters were developed correctly according to d20 RAW (Rules as Written). I got pretty far into development, but quit when I encountered a roadblock I was unable to overcome.

The problem had to do with determining the correct number of skill points a character should have. Since, according to d20 RAW, a character can gain points in INT (intelligence) over time, and the number of skill points a character receives upon level-up is determined by his or her INT score, it follows that the number of skill points a character receives upon level-up can _also_ change over time. I was unable to determine with any degree of certainty how many skill points an already-formed character was supposed to have without also knowing _when_ the character leveled up and gained points in INT, if any. And the missing information about when a character leveled up and gained points in INT is listed nowhere in PROTOS.TAB! Hence the impass.

See more info about the issue on Stack Exchange, [here](https://rpg.stackexchange.com/questions/153093/how-do-i-know-whether-a-9th-level-character-has-the-correct-number-of-skill-poin).

If PROTOS.TAB contained a record of major character development events, such as when a character experienced a rise in INT or when a decision to multi-class was made, then I think my tool could work.

# Running the program

This program only works in Windows. It is an HTML Application that utlilizes the Windows Scripting Host. It's basically just an HTML document with some JavaScript and some basic file I/O, such as the ability to read and write text files. Just click on the file with the "hta" extension like you would an executable. I have received reports that some virus/anti-malware software do not like this type of software, and will complain. I should really re-program the tool in some other language.

# Spreadsheet

Before I started developing this program, I tried to work things out using a spreadsheet. I have included it here as well. It is also incomplete.
