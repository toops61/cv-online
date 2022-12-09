import { useState } from "react"

export default function Scroll() {
  const [apiKey, setApiKey] = useState('');
  
  return (
    <div className="scroll-page">
      <main className="main-scroll">
      <h1>Clone Unsplash</h1>
      <form className="search-bar">
        <label htmlFor="search">
          <p>Votre recherche</p>
          <button type="submit" className="search-button"></button>
        </label>
        <input type="text" name="search" id="search" />
        <p className="error-message hide-message"></p>
      </form>
      <section className="photos-container">
      </section>
    </main>
    <div className="arrow hide"></div>
    </div>
  )
}