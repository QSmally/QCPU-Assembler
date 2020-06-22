
# QCPU Assembler

A very simple assembler made in JavaScript for the QCPU processor. I will probably rewrite it in Swift or Java sometime in the future, but for now, this will continue to be a simple project.

### Use it
Clone the repository, run `npm install` to install libraries, and input your `ProgramName.s` file in `Program/`. Run `node .` in the main folder to assemble all the Assembly files.
There are already some `ExamplePrograms/` you could try out - Copy the `ProgramName.schem` file and paste it into your schematics folder or upload it to a server.

### Structure
Each program in `Program/`, when assembled, has three files;
* ProgramName.s - Your inputted program, saw Assembly
* ProgramName.schem - The schematic this assembler created for you to paste into your world
* ProgramName.txt - The converted binary which is used in the schematic

Check out `Utils/Opcodes.json` for a list of OPCodes, or see [the instruction set](https://docs.google.com/spreadsheets/d/1-tPUTmeeIqXrqHCRS3xfTa6rvlclP2WCtQUhcKbS9gk/edit?usp=sharing).
