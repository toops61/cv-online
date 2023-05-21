import hiphopee from '../assets/carouselCovers/hiphopee1.webp';
import mehdi from '../assets/carouselCovers/djmehdi-storyofespion.webp';
import urgence from '../assets/carouselCovers/113-urgence.webp';
import fout from '../assets/carouselCovers/113-fout.webp';
import sniper from '../assets/carouselCovers/Grave-dans-la-roche.webp';
import ministerJohnny from '../assets/carouselCovers/ministereJohnny.webp';
import roce from '../assets/carouselCovers/topdepart.webp';
import revolution from '../assets/carouselCovers/passi-revolution.webp';
import evolution from '../assets/carouselCovers/passi-evolution.webp';
import bisso from '../assets/carouselCovers/bisso.webp';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SoundEngineer() {
  document.querySelector('.button-container')?.classList.remove('hide');
  document.querySelector('.back')?.classList.remove('hide');

  const [selected, setSelected] = useState(0);
  const [albumsArray, setAlbumsArray] = useState([]);
  const [albumPosition, setAlbumPosition] = useState([]);
  class Album {
    constructor(name,artist,year,content,cover) {
      this.name = name;
      this.artist = artist;
      this.year = year;
      this.content = content;
      this.cover = cover;
    }
  }
  class PositionAlbum {
    constructor(posX,posY,zIndex,blurCover) {
      this.transform = `translate(${posX}em,${posY}em)`;
      this.zIndex = zIndex;
      this.filter = `blur(${blurCover}px)`;
    }
  }

  const initialiseCoverFlow = (ind,array) => {
    array.push(new PositionAlbum(2*ind,ind,99-ind,ind));
  }

  useEffect(() => {
    const array = [];
    const arrayPos = [];

    array.push(new Album('L\'hip-hopée','Compilation',2000,'Recording',hiphopee));
    array.push(new Album('The story of Espion','DJ Mehdi',2001,'Recording',mehdi));
    array.push(new Album('Top départ','Rocé',2001,'Recording',roce));
    array.push(new Album('Fout la merde','113',2002,'Recording',fout));
    array.push(new Album('Dans l\'urgence','113',2003,'Recording',urgence));
    array.push(new Album('Gravé dans la roche','Sniper',2003,'Recording/mixing',sniper));
    array.push(new Album('Le temps passe','Ministère Amer Johhny Hallyday',2005,'Recording',ministerJohnny));
    array.push(new Album('Révolution','Passi',2007,'Recording/mixing',revolution));
    array.push(new Album('Evolution','Passi',2007,'Recording/mixing',evolution));
    array.push(new Album('Africa','Bisso Na Bisso',2009,'Recording/mixing',bisso));

    array.sort((a,b) => a.year - b.year);

    array.map((e,index) => initialiseCoverFlow(index,arrayPos));

    setAlbumsArray(array);
    setAlbumPosition(arrayPos);
  }, [])

  const selectAlbum = ind => {
    setSelected(ind);
    const albumsPosArray = albumsArray.map((e,index) => {
      const difference = ind - index;
      const zIndex = (99 - Math.abs(difference));
      const posX = - difference*2;
      const posY = Math.abs(difference);
      const blurCover = Math.abs(difference);
      const objectPos = {
        transform:`translate(${posX}em,${posY}em)`,
        zIndex:zIndex,
        filter:`blur(${blurCover}px)`
      }
      return objectPos;
    })
    setAlbumPosition(albumsPosArray);
  }
  
  if (albumsArray.length > 0 && albumPosition.length > 0) {
    var arrayAlbums = albumsArray.map((album,index) => {

      return (
        <div className={index === selected ? "album selected" : "album"} key={uuidv4()} onClick={e => selectAlbum(index)} style={{...albumPosition[index]}}>
          <img src={album.cover} alt={album.name} />
        </div>
      )
    })
  }

  const albumSelected = albumsArray[selected];

  return (
    <main className="sound-engineer">
      {albumsArray.length < 0 ? <div className="image-background">
        <img src={albumsArray[selected].cover} alt="background" />
      </div> : <></>}
      <section className="carousel">
        <div className="albums">
          {arrayAlbums}
          {albumsArray.length > 0 ? <div className="album-infos">
            <h1>{albumSelected.artist}</h1>
            <h2>"{albumSelected.name}"</h2>
            <p>({albumSelected.year})</p>
            <p>{albumSelected.content}</p>
          </div> : <></>}
        </div>
      </section>
    </main>
  )
}
