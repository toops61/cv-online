import { Link } from "react-router-dom";
import logo from '../../assets/ressourcesFilter/logo.svg';
import dashboard from '../../assets/ressourcesFilter/dashboard.svg';
import bubble from '../../assets/ressourcesFilter/speech-bubble.svg';
import imageServer from '../../assets/ressourcesFilter/server.svg';
import calendar from '../../assets/ressourcesFilter/calendar.svg';
import searchIcon from '../../assets/ressourcesFilter/search.svg';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Filter() {
  const [arrayRequest, setArrayRequest] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [maleFemale, setMaleFemale] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [sortBy, setSortBy] = useState('name');
  
  //fetch call to API
  const getUsers = async () => {
    try {
        const result = await fetch('https://randomuser.me/api/?nat=fr&results=100');
        if (!result.ok) {
            throw new Error(`Erreur HTTP : ${result.status}`);
        };
        const data = await result.json();
        data.results.length && setArrayRequest([...data.results]);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  const arraySortBy = array => {
    switch (sortBy) {
      case 'name':
        array.sort((a,b) => {
          return (a.name.last < b.name.last) ? -1 : 1;
        })
        break;
    }
    return array;
  }

  const buildUserLines = () => {
    let array = [...arrayRequest];
    array = arraySortBy(array);
    maleFemale !== 'all' && (array = array.filter(e => e.gender === maleFemale));
    setUsersArray([...array]);
  }

  useEffect(() => {
    arrayRequest.length && buildUserLines();
  }, [arrayRequest,maleFemale])

  const Users = () => {
    return (
        usersArray.map((user,index) => {
          return (
            <tr className={index%2 === 0 ? 'user-row green' : 'user-row'} key={uuidv4()}>
              <td className="name-container">
                <div className="photo-profil">
                  <img src={user.picture.thumbnail} alt="profil" />
                </div>
                <div className="bigger-picture">
                  <img src={user.picture.medium} alt="profil bigger" />
                </div>
                <p>{user.name.last} {user.name.first}</p>
              </td>
              <td>
                <p>{user.email}</p>
              </td>
              <td>
                <p>{user.phone}</p>
              </td>
            </tr>
          )
        })
    )
  }

  const checkMaleFemale = e => setMaleFemale(e.target.id === "all-gender" ? "all" : e.target.id);
  
  const searchByInput = e => setSearchBy(e.target.id.split('-category')[0]);

  const filterSearch = e => {
    const input = e.target.value;
    setSearchInput(e.target.value);
    const wordsArray = input.split(' ');
    const first = wordsArray.join('').toLowerCase();
    const reverse = wordsArray.reverse().join('').toLowerCase();
    let usersStored = [...arrayRequest];
    switch (searchBy) {
        case 'name' :
          usersStored = usersStored.filter(e => (e.name.first+e.name.last).toLowerCase().includes(first) || (e.name.first+e.name.last).includes(reverse));
          break;
        case 'username' :
          usersStored = usersStored.filter(e => e.login.username.toLowerCase().includes(input.toLowerCase()));
          break;
        case 'email' :
          usersStored = usersStored.filter(e => e.email.toLowerCase().includes(input.toLowerCase()));
          break;
        case 'city' :
          usersStored = usersStored.filter(e => e.location.city.toLowerCase().includes(input.toLowerCase()));
          break;
        case 'state' :
          usersStored = usersStored.filter(e => e.location.state.toLowerCase().includes(input.toLowerCase()));
          break;
        case 'country' :
          usersStored = usersStored.filter(e => e.location.country.toLowerCase().includes(input.toLowerCase()));
          break;
    }
    maleFemale !== 'all' && (usersStored = usersStored.filter(e => e.gender === maleFemale));
    setUsersArray([...usersStored]);
  }

  return (
    <div className="filter-page">
      <main className="main-filter">
        <section className="nav-section">
          <div className="title">
            <div className="logo">
              <img src={logo} alt="logo-users" />
            </div>
            <h1>Users</h1>
          </div>
          <nav className="users-menu">
            <ul>
              <li>
                <div className="logo">
                  <img src={dashboard} alt="logo-dashboard" />
                </div>
                <h3>Dashboard</h3>
              </li>
              <li>
                <div className="logo">
                  <img src={bubble} alt="logo-messenger" />
                </div>
                <h3>Messenger</h3>
              </li>
              <li>
                <div className="logo">
                  <img src={imageServer} alt="logo-database" />
                </div>
                <h3>Database</h3>
              </li>
              <li>
                <div className="logo">
                  <img src={calendar} alt="logo-calendar" />
                </div>
                <h3>Calendar</h3>
              </li>
            </ul>
          </nav>
        </section>
        <section className="users-section">
          <div className="search-section">
            <div className="search-bar">
              <div className="search-bar__logo">
                <img src={searchIcon} alt="loop" />
              </div>
              <input type="text" placeholder="recherchez un utilisateur" onChange={filterSearch} value={searchInput} />
            </div>
            <div className="woman-man">
              <div>
                <input type="radio" name="man-woman" id="female" value="female" onChange={checkMaleFemale} />
                <label htmlFor="female">
                  femme
                </label>
              </div>
              <div>
                <input type="radio" name="man-woman" id="male" value="male" onChange={checkMaleFemale} />
                <label htmlFor="male">
                  homme
                </label>
              </div>
              <div>
                <input type="radio" name="man-woman" id="all-gender" value="all-gender" onChange={checkMaleFemale} defaultChecked />
                <label htmlFor="all-gender">
                  Tous
                </label>
              </div>
            </div>
            <div className="search-category">
              <h3>rechercher par :</h3>
              <div className="radios-box">
                <div>
                  <input type="radio" name="category" id="name-category" value="name-category" onChange={searchByInput} defaultChecked />
                  <label htmlFor="name-category">
                    nom / prénom
                  </label>
                </div>
                <div>
                  <input type="radio" name="category" id="username-category" value="username-category" onChange={searchByInput} />
                  <label htmlFor="username-category">
                    pseudo
                  </label>
                </div>
                <div>
                  <input type="radio" name="category" id="email-category" value="email-category" onChange={searchByInput} />
                  <label htmlFor="email-category">
                    email
                  </label>
                </div>
                <div>
                  <input type="radio" name="category" id="city-category" value="city-category" onChange={searchByInput} />
                  <label htmlFor="city-category">
                    ville
                  </label>
                </div>
                <div>
                  <input type="radio" name="category" id="state-category" value="state-category" onChange={searchByInput} />
                  <label htmlFor="state-category">
                    département
                  </label>
                </div>
                <div>
                  <input type="radio" name="category" id="country-category" value="country-category" onChange={searchByInput} />
                  <label htmlFor="country-category">
                    pays
                  </label>
                </div>
              </div>
            </div>
          </div>
          <h2>Résultats</h2>
          <p className="total-users">Total : <span>{usersArray.length}</span></p>
          <table>
            <thead>
              <tr>
                <th className="selected rotate"><h3>Nom</h3><div className="order"></div></th>
                <th className=""><h3>Email</h3><div className="order"></div></th>
                <th className=""><h3>Téléphone</h3><div className="order"></div></th>
              </tr>
            </thead>
            <tbody>
              {usersArray.length ? <Users /> : null}
            </tbody>
          </table>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
