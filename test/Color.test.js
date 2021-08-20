const { assert } = require("chai");
const { contracts_build_directory } = require("../truffle-config");

const Color = artifacts.require("./Color.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Color", (accounts) => {
  let contract;

  before(async () => {
    contract = await Color.deployed();
  });

  describe("deployment", async () => {
    it("deployes successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "Color");
    });

    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "COLOR");
    });
  });

  describe("minting", async () => {
    it("creates a new token", async () => {
      const result = await contract.mint("#EC058E");
      const totalSupply = await contract.totalSupply();
      const event = result.logs[0].args;
      // Success
      assert.equal(totalSupply, 1);
      assert.equal(event.tokenId.toNumber(), 1, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );

      assert.equal(event.to, accounts[0], "to is correct");

      console.log(result);

      // Failure
      await contract.mint("#EC058E").should.be.rejected;
    });
  });

  describe("indexing", async () => {
    it("lists colors", async () => {
      const res1 = await contract.mint("#433333");
      const res2 = await contract.mint("#ffffff");
      const res3 = await contract.mint("#000000");
      const totalSupply = await contract.totalSupply();

      console.log(res1);
      console.log(res2);
      console.log(res3);

      let color,
        result = [];

      for (var i = 1; i <= totalSupply; i++) {
        color = await contract.colors(i - 1);
        result.push(color);
      }

      let expected = ["#EC058E", "#433333", "#ffffff", "#000000"];
      assert.equal(result.join(","), expected.join(","));
    });
  });
});
