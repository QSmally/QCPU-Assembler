
/*
    Parse program and convert it into machine code.
*/

const FS    = require("fs");
const Ops   = require("./Utils/Opcodes.json");
const Schem = require("./Schem");

const ToBin = (Dec, Length) => Dec.toString(2).padStart(Length, "0");

FS.readdirSync("./Program").forEach(File => {

    // Should be an ASM file.
    if (!/^.*\.(s)$/.test(File)) return;

    // Create an indexed instruction list.
    const Program = FS.readFileSync(`./Program/${File}`, {encoding: "utf8"})
    .split("\n")
    .map(Instr => Instr.replace(/(;.*\n)/g, "").trim().split(" "))
    .filter(Char => !!Char)
    .map(Line => Line.replace("$", "")))
    .filter(Line => Line.length);

    console.log(Program);

    let Output = [];

    // Iterate through the program.
    Program.forEach(Line => {
        let Opcode = Ops[Line[0]];
        if (!Opcode) return Output.push(ToBin(parseInt(Line[0]), 8));

        Output.push(Opcode + ToBin(parseInt(Line[1] || 0), ["DIM", "JMP", "MST", "MLD"].includes(Line[0]) ? 5 : 3));
    });

    return Schem(File, Output);

});
