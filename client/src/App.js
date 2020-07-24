import React, { Component, Fragment } from 'react';
import axios from 'axios';
import pokemon from './pokemon.png';

class App extends Component {
  state = {
    pokemons: [],
    name: '',
    image: null,
    description: '',
    id: 0,
    search: '',
    nameError: '',
    imageError: '',
    success: '',
    currentPage: 1,
    postsPerPage: 3,
  };
  componentDidMount() {
    axios.get('/api').then((res) => {
      this.setState({ ...this.state, pokemons: res.data });
    });
  }
  changeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  changeDescription = (e) => {
    this.setState({
      description: e.target.value,
    });
  };
  changeImage = (e) => {
    this.setState({
      image: e.target.files[0],
    });
  };
  changeSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };
  validationCheck() {
    const { name, image } = this.state;
    if (name === '' && image === null) {
      this.setState({
        nameError: 'Name of pokemon is required',
        imageError: 'Add image for better view',
      });

      clearTimeout(this.clearError);
      this.clearError = setTimeout(() => {
        this.setState({ nameError: '', imageError: null });
      }, 4000);
    } else if (name === '') {
      this.setState({ nameError: 'Name of pokemon is required' });

      clearTimeout(this.clearError);
      this.clearError = setTimeout(() => {
        this.setState({ nameError: '' });
      }, 4000);
    } else if (image === null) {
      this.setState({ imageError: 'Add image for better view' });

      clearTimeout(this.clearError);
      this.clearError = setTimeout(() => {
        this.setState({ imageError: null });
      }, 4000);
    } else return true;
  }

  updateData = (id) => {
    axios.get(`/api/${id}`).then((res) => {
      this.setState({
        id: res.data._id,
        name: res.data.name,
        image: res.data.image,
        description: res.data.description,
      });
    });
  };
  deleteData = (id) => {
    axios.delete(`/api/${id}`).then(() => this.componentDidMount());
  };
  dataSubmit = (e, id) => {
    e.preventDefault();
    if (this.validationCheck()) {
      if (id === 0) {
        const data = new FormData();
        data.append('name', this.state.name);
        data.append('description', this.state.description);
        data.append('image', this.state.image, this.state.image.name);
        axios.post('/api', data).then(() => {
          this.componentDidMount();
          this.setState({
            success: 'New Pokemon is added',
          });
          clearTimeout(this.clearError);
          this.clearError = setTimeout(() => {
            this.setState({ success: '' });
          }, 4000);
        });
      } else {
        const data = new FormData();
        data.append('name', this.state.name);
        data.append('description', this.state.description);
        data.append('image', this.state.image);
        axios.put(`/api/${id}`, data).then(() => {
          this.componentDidMount();
          this.setState({
            success: 'Pokemon data is updated',
          });
          clearTimeout(this.clearError);
          this.clearError = setTimeout(() => {
            this.setState({ success: '' });
          }, 4000);
        });
      }
    }
  };

  render() {
    const { pokemons, search, postsPerPage, currentPage } = this.state;

    // pagination (get current pages)
    const indexOfLastData = currentPage * postsPerPage;
    const indexOfFirstData = indexOfLastData - postsPerPage;
    const currentData = this.state.pokemons.slice(
      indexOfFirstData,
      indexOfLastData
    );
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(pokemons.length / postsPerPage); i++) {
      pageNumbers.push(i);
    }
    const paginate = (pageNumbers) =>
      this.setState({ currentPage: pageNumbers });
    // for search filter
    const filterPokemon = currentData.filter((data) => {
      return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });

    return (
      <Fragment>
        {/* navbar */}
        <nav className="navbar navbar-light bg-light">
          <p className="navbar-brand ml-4" style={{ margin: '0' }}>
            <img src={pokemon} height="50px" />
          </p>
          <form className="form-inline">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search pokemon"
              aria-label="Search"
              name="search"
              onChange={this.changeSearch}
            />
            <button
              className="btn btn-outline-success my-1 my-sm-0"
              type="submit"
              onClick={(e) => e.preventDefault()}
            >
              Search
            </button>
          </form>
        </nav>

        {/* modal for adding data */}
        <div className="container">
          <button
            type="button"
            className="btn btn-danger mt-4 ml-4"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={() =>
              this.setState({
                id: 0,
                name: '',
                image: '',
                description: '',
              })
            }
          >
            <i className="fa fa-plus" aria-hidden="true"></i> Add New Pokemon
          </button>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Pokemon
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="text-success text-center">{this.state.success}</p>
                <form onSubmit={(e) => this.dataSubmit(e, this.state.id)}>
                  <div className="form-group">
                    <label>Enter Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      onChange={this.changeName}
                      value={this.state.name}
                    />
                    <p className="text-danger">{this.state.nameError}</p>
                  </div>
                  <div className="form-group">
                    <label>Enter Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      onChange={this.changeDescription}
                      value={this.state.description}
                    />
                  </div>
                  <div className="form-group">
                    <label>Add Image for better view</label>
                    <input
                      type="file"
                      className="form-control-file"
                      name="image"
                      onChange={this.changeImage}
                    />
                    <p className="text-danger">{this.state.imageError}</p>
                  </div>

                  <button type="submit" className="btn btn-success">
                    <i className="fa fa-paper-plane" aria-hidden="true"></i>{' '}
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* data view */}
        <div className="container">
          <div className="row mt-4">
            <div className="col-md-9 col-sm-6 mx-auto">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {filterPokemon.map((pokemon) => (
                    <tr key={pokemon._id}>
                      <td>
                        <img src={pokemon.image} width="170px" height="100px" />
                      </td>
                      <td>{pokemon.name}</td>
                      <td>{pokemon.description}</td>
                      <td>
                        <button
                          type="button"
                          className="btn "
                          onClick={(e) => this.updateData(pokemon._id)}
                          data-toggle="modal"
                          data-target="#exampleModal"
                        >
                          <i
                            className="fa fa-pencil-square-o fa-lg"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn"
                          onClick={(e) => this.deleteData(pokemon._id)}
                        >
                          <i
                            className="fa fa-trash fa-lg"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            {pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <p onClick={() => paginate(number)} className="page-link">
                  {number}
                </p>
              </li>
            ))}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

export default App;
