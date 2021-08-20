import React, { Component } from "react";
import Web3 from "web3";
import Color from "../abis/Color.json";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      colors: [],
    };

    this.colorRef = React.createRef();

    this.mint = this.mint.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.blockChainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async blockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });

    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      const totalSupply = await contract.methods.totalSupply().call();
      let color,
        result = [];
      for (var i = 1; i <= totalSupply; i++) {
        color = await contract.methods.colors(i - 1).call();
        result.push(color);
      }
      this.setState({
        contract,
        totalSupply,
        colors: result,
      });
    } else {
      window.alert("Smart contract not deployed to detected network!");
    }
  }

  async mint(event) {
    event.preventDefault();
    const color = this.colorRef.current.value;

    if (color !== "") {
      try {
        await this.state.contract.methods
          .mint("#" + color)
          .send({ from: this.state.account });
        this.setState({
          colors: [...this.state.colors, "#" + color],
        });
      } catch {
        console.log("Error");
      }
    }
    this.colorRef.current.value = "";
  }

  render() {
    return (
      <>
        <nav
          style={{
            display: "flex",
            padding: "20px 15px",
            backgroundColor: "indigo",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "20px",
              letterSpacing: "-1px",
            }}
          >
            Color Tokens
          </div>
          <div style={{ color: "#fff", marginLeft: "auto" }}>
            Account: {this.state?.account}
          </div>
        </nav>
        <div style={{ margin: "0 auto", width: "800px", padding: "50px 0" }}>
          <h1>Issue Token</h1>
          <form onSubmit={this.mint} style={{ display: "flex" }}>
            <input
              type="text"
              style={{ padding: "10px 6px", marginRight: "10px" }}
              ref={this.colorRef}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "indigo",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              MINT
            </button>
          </form>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {this.state.colors.map((color, i) => {
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: color,
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {color}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default App;
