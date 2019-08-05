# ToEE d20 Inspector

Several years ago I set out to create a tool to automatically level up or level down characters in the video game _The Temple of Elemental Evil_ by Troika Games. As a first step, and in order to ensure all my math was correct, I create _this_ tool to check whether _existing_ characters were developed correctly according to d20 RAW (Rules as Written).

I got pretty far into development, but quit when I encountered a roadblock I was unable to overcome. The problem had to do with determining the correct number of skill points a character should have. Since, according to d20 RAW, a character can gain points in INT (intelligence) over time, and the number of skill points a character receives upon level-up is determined by its INT score, it follows that the number of skill points a character receives upon level-up can _also_ change over time. I was unable to determine with any degree of certainty how many skill points an already-formed character was _supposed_ to have without also knowing _when_ the character leveled up and gained points in INT, if any. And the missing information about _when_ a character levels up and gains points in INT is listed nowhere in PROTOS.TAB!

Hence the impass.

# Running the program

The program utlilizes the Windows Scripting Host. It's basically just an HTML document with some JavaScript and some basic file I/O, such as the ability to read and write text files. It only works on Windows.

The program has an ".hta" extension. Just click on it like you would any HTML document or batch file. I have received some reports that virus/anti-malware software do not like this type of program, and will complain. I should really re-program the tool in some other language.

# Spreadsheet

Before I started developing this program, I tried to work things out in a spreadsheet. I have included that here as well.
