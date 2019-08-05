# ToEE d20 Inspector

Several years ago I set out to create a tool to automatically level up or level down characters in the video game _The Temple of Elemental Evil_ by Troika Games. As a first step and in order to ensure all my math was correct, I create _this_ tool to check whether _existing_ characters were developed correctly according to RAW (Rules as Written).

I got pretty far into development, but quit when I encountered a roadblock I was unable to overcome. The problem had to do with determining the correct number of skill points a character should have. Since, according to RAW, characters can gain points in INT (intelligence) over time, and the number of skill points they receive upon level-up is determined by their INT scores, it follows that the number of skill points characters receive upon level-up can _also_ change over time. I could not figure out correctly how many skill points a character was supposed to have without also knowing _when_ the character leveled up and gained points in INT. And the missing information about _when_ a character levels up and gains points in INT is listed nowhere in PROTOS.TAB.

# Running the program

The program utlilizes the Windows Scripting Host. It's basically just an HTML document with some JavaScript and some basic File I/O, such as the ability to read and write text files. It only works on Windows.

The "program" has an ".hta" extension. Just click on it like you would an HTML document or batch file. I have received some reports that virus/anti-malware software do not like this format, and will complain. I should really reprogram the tool in some other language.
