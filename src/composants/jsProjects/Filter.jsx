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
      case 'username':
        array.sort((a,b) => {
          return (a.login.username < b.login.username) ? -1 : 1;
        })
        break;
      case 'email':
        array.sort((a,b) => {
          return (a.email < b.email) ? -1 : 1;
        })
        break;
      case 'phone':
        array.sort((a,b) => {
          return (a.phone < b.phone) ? -1 : 1;
        })
        break;
      case 'city':
        array.sort((a,b) => {
          return (a.location.city < b.location.city) ? -1 : 1;
        })
        break;
      case 'state':
        array.sort((a,b) => {
          return (a.location.state < b.location.state) ? -1 : 1;
        })
        break;
      case 'country':
        array.sort((a,b) => {
          return (a.location.country < b.location.country) ? -1 : 1;
        })
        break;
      default:
        break;
    }
    return array;
  }

  const buildUserLines = () => {
    let array = [...arrayRequest];
    array = arraySortBy(array);
    maleFemale !== 'all' && (array = array.filter(e => e.gender === maleFemale));
    !Array.from(document.querySelectorAll('th')).some(e => e.className.includes('rotate')) && (array = array.reverse());
    setUsersArray([...array]);
  }

  useEffect(() => {
    arrayRequest.length && buildUserLines();
  }, [arrayRequest])

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
              {(searchBy === 'name' || searchBy === 'email') && <td>
                <p>{user.phone}</p>
              </td>}
              {searchBy === 'username' && <td>
                <p>{user.login.username}</p>
              </td>}
              {searchBy === 'city' && <td>
                <p>{user.location.city}</p>
              </td>}
              {searchBy === 'state' && <td>
                <p>{user.location.state}</p>
              </td>}
              {searchBy === 'country' && <td>
                <p>{user.location.country}</p>
              </td>}
            </tr>
          )
        })
    )
  }

  const checkMaleFemale = e => setMaleFemale(e.target.id === "all-gender" ? "all" : e.target.id);
  
  const searchByInput = e => setSearchBy(e.target.id.split('-category')[0]);

  useEffect(() => {
    const input = searchInput ? searchInput : document.querySelector('.search-bar input').value;
    input ? filterSearch(input) : buildUserLines();
  }, [maleFemale,searchBy])
  

  const filterSearch = value => {
    const wordsArray = value.split(' ');
    const first = wordsArray.join('').toLowerCase();
    const reverse = wordsArray.reverse().join('').toLowerCase();
    let usersStored = [...arrayRequest];
    switch (searchBy) {
        case 'name' :
          usersStored = usersStored.filter(e => (e.name.first+e.name.last).toLowerCase().includes(first) || (e.name.first+e.name.last).includes(reverse));
          break;
        case 'username' :
          usersStored = usersStored.filter(e => e.login.username.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'email' :
          usersStored = usersStored.filter(e => e.email.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'city' :
          usersStored = usersStored.filter(e => e.location.city.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'state' :
          usersStored = usersStored.filter(e => e.location.state.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'country' :
          usersStored = usersStored.filter(e => e.location.country.toLowerCase().includes(value.toLowerCase()));
          break;
        default:
          break;
    }
    maleFemale !== 'all' && (usersStored = usersStored.filter(e => e.gender === maleFemale));
    usersStored = arraySortBy(usersStored);
    !Array.from(document.querySelectorAll('th')).some(e => e.className.includes('rotate')) && (usersStored = usersStored.reverse());
    setUsersArray([...usersStored]);
  }

  const inputHandle = e => {
    const input = e.target.value;
    setSearchInput(input);
    input ? filterSearch(input) : buildUserLines();
  }

  const handleSort = column => {
    const thDiv = document.querySelectorAll('th');
    const changeArrowSort = (selectedId,id2,id3) => {
      thDiv.forEach(e => e.classList.remove('selected'));
      thDiv[id2].classList.remove('rotate');
      thDiv[id3].classList.remove('rotate');
      thDiv[selectedId].classList.add('selected');
      thDiv[selectedId].classList.toggle('rotate');
    }
    let reverse = false;
    switch (column) {
      case 0:
        thDiv[0].className.includes('selected') ? reverse = true : setSortBy('name');
        changeArrowSort(0,1,2);
        break;
        case 1:
          thDiv[1].className.includes('selected') ? reverse = true : setSortBy('email');
        changeArrowSort(1,0,2);
        break;
      case 2:
        thDiv[2].className.includes('selected') ? reverse = true : setSortBy('phone');
        changeArrowSort(2,1,0);
        break;
      case 3:
        thDiv[2].className.includes('selected') ? reverse = true : setSortBy('username');
        changeArrowSort(2,1,0);
        break;
      case 4:
        thDiv[2].className.includes('selected') ? reverse = true : setSortBy('city');
        changeArrowSort(2,1,0);
        break;
      case 5:
        thDiv[2].className.includes('selected') ? reverse = true : setSortBy('state');
        changeArrowSort(2,1,0);
        break;
      case 6:
        thDiv[2].className.includes('selected') ? reverse = true : setSortBy('country');
        changeArrowSort(2,1,0);
        break;
      default:
        break;
    }
    if (reverse) {
      const array = ([...usersArray]).reverse();    
      setUsersArray([...array]);
    }
  }
  
  useEffect(() => {
    let array = arraySortBy([...usersArray]);
    setUsersArray([...array]);
  }, [sortBy])
  

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
              <input type="text" placeholder="recherchez un utilisateur" onChange={inputHandle} value={searchInput} />
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
                <th className="selected rotate" onClick={e => handleSort(0)}><h3>Nom</h3><div className="order"></div></th>
                <th className="" onClick={e => handleSort(1)}><h3>Email</h3><div className="order"></div></th>
                {(searchBy === 'name' || searchBy === 'email') && <th className="" onClick={e => handleSort(2)}><h3>Téléphone</h3><div className="order"></div></th>}
                {(searchBy === 'username') && <th className="" onClick={e => handleSort(3)}><h3>Pseudo</h3><div className="order"></div></th>}
                {(searchBy === 'city') && <th className="" onClick={e => handleSort(4)}><h3>Ville</h3><div className="order"></div></th>}
                {(searchBy === 'state') && <th className="" onClick={e => handleSort(5)}><h3>Département</h3><div className="order"></div></th>}
                {(searchBy === 'country') && <th className="" onClick={e => handleSort(6)}><h3>Pays</h3><div className="order"></div></th>}
              </tr>
            </thead>
            <tbody>
              {usersArray.length ? <Users /> : null}
            </tbody>
          </table>
        </section>
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
