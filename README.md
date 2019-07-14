# ToEE d20 Inspector

This was intended to become a tool to automatically level up or level down enemies in the video game _The Temple of Elemental Evil_ by Troika Games. I got pretty far into development, but quit when I encountered a roadblock WRT backtracking through a  character's upgrade "history" and determining the correct number of skill points based on the character's ability score modifier. Since a character can gain points in intelligence, a character's ability score modifier also changes over time. I could not figure out how to resolve this.

# Running the program

The program utlilizes the Windows Scripting Host. It's basically just an HTML document with some JavaScript and some basic File I/O, such as the ability to read text files. It only works on Windows.

The "program" has an ".hta" extension. Just click on it like you would any executable. I have received some reports that virus/anti-malware scanners do not like this format. I should really reprogram it in some other language.
