const Blockcontract = artifacts.require("Blockcontract");

beforeEach(async () => {
    blockcontract = await Blockcontract.new();
    
})