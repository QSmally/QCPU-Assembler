
/*
    Convert machine code into a schematic.
*/

const FS   = require("fs");
const NBT  = require("nbt-ts");
const zlib = require("zlib");

const {parse: Parse}    = require("prismarine-nbt");
const {execSync: Shell} = require("child_process");

const {Short, Int} = require("nbt-ts");


const Prepare = (File, Contents) => {
    // Manage output files
    let FileName = `./Program/${File.split(".")[0]}`;
    Shell(`cp ./Utils/BaseBoard.schem ${FileName}.schem`);
    Shell(`touch ${FileName}.txt`);

    FS.writeFileSync(`${FileName}.txt`, Contents.join("\n"), "utf8");
    return FileName;
}

const ConvertBool = Bin => Bin.split("").map(Bit => Bit === "1");


module.exports = (File, Input) => {

    const FileName = Prepare(File, Input);

    // Do the interesting schematic stuff
    Parse(FS.readFileSync("./Utils/BaseBoard.schem"), (Err, Schem) => {

        if (Err) throw Err;
        const BlockData = Schem.value.BlockData.value;
        const Serial    = process.argv.includes("-serial");

        for (let Line = 0; Line < Input.length; Line++) {
            
            const Instruction = ConvertBool(Input[Line]);
            const Reducer = Line > 23 ? 62 * 3 : Line > 15 ? 62 * 2 : Line > 7 ? 62 : 0;

            for (let bit = Instruction.length - 1; bit >= 0; --bit) {
                if (Instruction[bit] == true) {
                    if (Serial) BlockData[126 + ((7 - bit) * 126 * 2) + Line * 2] = 4; // Normal pipe
                    else BlockData[126 + ((7 - bit) * 126 * 2) + Line * 2 * 4 - Reducer] = 4; // Specialised pipe (for hex encoding)
                }
            }

        }

        console.log(BlockData);

        // Create a new schematic buffer
        const Schematic = NBT.encode("Schematic", {
            PaletteMax: new Int(5),
            Palette: {
                "minecraft:air": new Int(0),
                "minecraft:gray_concrete": new Int(1),
                "minecraft:glass": new Int(2),
                "minecraft:redstone_wire[east=none,north=none,power=0,south=none,west=none]": new Int(3),
                "minecraft:redstone_block": new Int(4)
            },

            DataVersion: new Int(2230),
            Version: new Int(Schem.value.Version.value),
            Length:  new Short(Schem.value.Length.value),
            Height:  new Short(Schem.value.Height.value),
            Width:   new Short(Schem.value.Width.value),
            
            Metadata: {
                WEOffsetX: new Int(1),
                WEOffsetY: new Int(-1),
                WEOffsetZ: new Int(0),
            },

            BlockData: Buffer.from(new Uint8Array(BlockData)),
            Offset: new Int32Array([3713, 117, -4003])
        });

        console.log(Input);
        console.log(Schematic);

        // Gzip the buffer and write
        zlib.gzip(Schematic, (Err, GZippedSchem) => {
            if (Err) throw Err;
            FS.writeFileSync(`${FileName}.schem`, GZippedSchem);
        });

    });
}
