import React from "react";
import { get } from "./utils";
import "./App.css";

class App extends React.PureComponent {
  componentDidMount() {
    this.PokemonList();
  }

  constructor(props) {
    super(props);
    this.state = { page: 0 };
  }

  PokemonList = async props => {
    let list;
    list = (
      await get(
        `https://pokeapi.co/api/v2/pokemon?offset=${this.state.page *
          20}&limit=20`
      )
    ).body.results; //TODO: error check, try/catch

    this.setState({
      PokemonList: list.map(profile => <Pokemon {...profile} />)
    });
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
    this.PokemonList();
  };

  prevPage = () => {
    if (this.state.page > 0) {
      this.setState({ page: this.state.page - 1 });
      this.PokemonList();
    }
  };

  render() {
    return (
      <div>
        {this.state.PokemonList}
        <button onClick={this.prevPage}>Prev</button>
        <button onClick={this.nextPage}>Next</button>
      </div>
    );
  }
}

class Pokemon extends React.Component {
  render() {
    const profile = this.props;

    return (
      <div class='pokemon-list'>
        <a class='pokemon' href={profile.url}>{profile.name}</a>
      </div>
    );
  }
}

export default App;