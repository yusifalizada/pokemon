import React from "react";
import { get } from "./utils";
import "./App.css";

class App extends React.PureComponent {
  componentDidMount() {
    this.PokemonList();
  }

  constructor(props) {
    super(props);

    const page =
      props && props.match && props.match.params && props.match.params.id
        ? parseInt(props.match.params.id) // ts would be handy here
        : 0;

    this.state = { page };
    console.log(this.state);
  }

  PokemonList = async props => {
    let list;
    list = (
      await get(
        `https://pokeapi.co/api/v2/pokemon?offset=${this.state.page *
          20}&limit=20`
      )
    ).body.results; //TODO: error check, try/catch
    console.log(this.state);

    this.setState({
      PokemonList: list.map(profile => <Pokemon {...profile} />)
    });
  };

  nextPage = () => {
    this.setState({ page: parseInt(this.state.page) + 1 }); // ts would be handy here
    this.PokemonList();
  };

  prevPage = () => {
    if (this.state.page > 0) {
      this.setState({ page: parseInt(this.state.page) - 1 });
      this.PokemonList();
    }
  };

  render() {
    console.log(this.state);
    return (
      // TODO: next/prev could be greyed out if unavailable
      <div className="pokemon-list">
        {this.state.PokemonList}
        <a
          className="btn"
          href={`/page/${
            this.state.page > 0 ? this.state.page - 1 : this.state.page
          }`}
        >
          Prev
        </a>
        <a className="btn" href={`/page/${this.state.page + 1}`}>
          Next
        </a>
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
      id: profile.id,
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

  goBack = () => {
    this.setState({ page: this.state.id / 20 });
    window.location.href = '...';
  };

  //note: assuming id structure always starts from 1 and increments by 1 for the next pokemon for pagination
  render() {
    return (
      <div className="profile">
        {this.state.name}
        {this.state.frontDefaultStripe}
        <span>Abilities:</span>
        {this.state.abilities}
        <a href={`/page/${Math.floor(this.state.id/20)}`}>Back</a>
      </div>
    );
  }
}

export default { App, Profile };
