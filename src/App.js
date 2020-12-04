import React from "react";
import { get } from "./utils";
import "./App.css";

class App extends React.PureComponent {
  componentDidMount() {
    this.PokemonList();
  }

  constructor(props) {
    super(props);
    this.state = { page: 0 };
  }

  PokemonList = async props => {
    let list;
    list = (
      await get(
        `https://pokeapi.co/api/v2/pokemon?offset=${this.state.page *
          20}&limit=20`
      )
    ).body.results; //TODO: error check, try/catch

    this.setState({
      PokemonList: list.map(profile => <Pokemon {...profile} />)
    });
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
    this.PokemonList();
  };

  prevPage = () => {
    if (this.state.page > 0) {
      this.setState({ page: this.state.page - 1 });
      this.PokemonList();
    }
  };

  render() {
    return (
      <div className="pokemon-list">
        {this.state.PokemonList}
        <button onClick={this.prevPage}>Prev</button>
        <button onClick={this.nextPage}>Next</button>
      </div>
    );
  }
}

class Pokemon extends React.Component {
  render() {
    const profile = this.props;
    const profileUrl = profile.url;
    const splittedUrl = profileUrl.split("/");
    const profileId = splittedUrl[splittedUrl.length - 2];

    return (
      <div className="pokemon">
        <a href={"/profile/" + profileId}>{profile.name}</a>
      </div>
    );
  }
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
    this.Profile();
  }

  Profile = async props => {
    const profile = (
      await get(
        `https://pokeapi.co/api/v2/pokemon/${this.props.match.params.id}`
      )
    ).body; // error check
    console.log("prfile");
    console.log(profile);

    // note: could be done at 'render' stage as well - but since abilities were simpler to handle here,
    // added the rest as well
    this.setState({
      name: <span>Name: {profile.name}</span>,
      frontDefaultStripe: (
        <div className="stripe">
          <span> Front Default Stripe: </span>
          <img alt="pokemon" src={profile.sprites.front_default} />
        </div>
      ),
      abilities: profile.abilities.map(abilities => (
        <li>{abilities.ability.name}</li>
      )) //assuming at least 1 ability
    });
  };

  render() {
    return (
      <div className="profile">
        {this.state.name}
        {this.state.frontDefaultStripe}
        <span>Abilities:</span>
        {this.state.abilities}
      </div>
    );
  }
}

export default { App, Profile };
