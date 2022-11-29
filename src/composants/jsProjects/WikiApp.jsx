export default function WikiApp() {
  return (
    <main className="wiki-page">
      <div className="loader hide">
      <div className="point-container">
        <div className="point"></div>
        <div className="point"></div>
        <div className="point"></div>
      </div>
    </div>
    <div className="error-window hide">
      <div className="error">
        <p>Attention, remplissez la barre de recherche</p>
      </div>
    </div>
    <section>
      <div className="logo">
        <img src="./ressources/wiki-logo.png" alt="wikipedia" />
      </div>
      <label htmlFor="searchInput"><h1>Recherche <span>Wikipedia</span></h1></label>
      <div className="search">
        <input type="text" id="searchInput" name="searchInput" placeholder="nouvelle recherche" />
        <div className="reset"><p>X</p></div>
        <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg></button>
      </div>
      <div className="result-container">
      </div>
    </section>
    </main>
  )
}
