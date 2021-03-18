
/*
    Parse program and convert it into machine code.
*/

const FS    = require("fs");
const Ops   = require("./Utils/Opcodes.json");
const Schem = require("./Schem");

const ToSignedBin = (Dec, Length) => (Dec >>> 0).toString(2).split("").reverse().slice(0, Length).reverse().join("").padStart(Length, "0");

FS.readdirSync("./Program").forEach(File => {

    // Should be an ASM file
    if (!/^.*\.(s)$/.test(File)) return;

    // Create an indexed instruction list
    const Program = FS.readFileSync(`./Program/${File}`, "utf8")
        .split("\n")
        .map(Instr => Instr.replace(/(;.*\n)/g, "").trim().split(" "))
        .filter(Char => !!Char)
        .map(Line => Line.replace("$", ""))
        .filter(Line => Line.length);

    console.log(Program);
    let Output = [];

    // Iterate through the program
    Program.forEach(Line => {
        let Opcode = Ops[Line[0]];
        if (!Opcode) return Output.push(ToSignedBin(parseInt(Line[0]), 8));
        Output.push(Opcode + ToSignedBin(parseInt(Line[1] || 0), ["DIM", "JMP", "MST", "MLD"].includes(Line[0]) ? 5 : 3));
    });

    return Schem(File, Output);

});
