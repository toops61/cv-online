import mehdi from '../assets/carouselCovers/djmehdi-storyofespion.webp';
import urgence from '../assets/carouselCovers/113-urgence.webp';
import sniper from '../assets/carouselCovers/Grave-dans-la-roche.webp';
import ministerJohnny from '../assets/carouselCovers/ministereJohnny.webp';
import roce from '../assets/carouselCovers/topdepart.webp';
import revolution from '../assets/carouselCovers/passi-revolution.webp';
import evolution from '../assets/carouselCovers/passi-evolution.webp';
import bisso from '../assets/carouselCovers/bisso.webp';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SoundEngineer() {
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
      this.transform = `translate(${posX},${posY})`;
      this.zIndex = zIndex;
      this.filter = `blur(${blurCover})`;
    }
  }

  useEffect(() => {
    const array = [];
    const arrayPos = [];
    array.push(new Album('The story of Espion','DJ Mehdi',2001,'Recording',mehdi));
    arrayPos.push(new PositionAlbum(0,0,99,0));

    array.push(new Album('Dans l\'urgence','113',2001,'Recording',urgence));
    arrayPos.push(new PositionAlbum('2em','1em',98,'1px'));

    array.push(new Album('Gravé dans la roche','Sniper',2001,'Recording/mixing',sniper));
    arrayPos.push(new PositionAlbum('4em','2em',97,'2px'));

    array.push(new Album('Top départ','Rocé',2001,'Recording',roce));
    arrayPos.push(new PositionAlbum('8em','3em',96,'3px'));

    array.push(new Album('Le temps passe','Ministère Amer Johhny Hallyday',2008,'Recording',ministerJohnny));
    arrayPos.push(new PositionAlbum('10em','4em',95,'4px'));

    array.push(new Album('Révolution','Passi',2009,'Recording/mixing',revolution));
    arrayPos.push(new PositionAlbum('12em','5em',94,'5px'));

    array.push(new Album('Evolution','Passi',2010,'Recording/mixing',evolution));
    arrayPos.push(new PositionAlbum('14em','6em',93,'6px'));

    array.push(new Album('Africa','Bisso Na Bisso',2011,'Recording/mixing',bisso));
    arrayPos.push(new PositionAlbum('16em','7em',92,'7px'));

    setAlbumsArray(array);
    setAlbumPosition(arrayPos);
  }, [])

  const selectAlbum = ind => {
    setSelected(ind);
    const albumsPosArray = albumsArray.map((e,index) => {
      const difference = ind - index;
      const zIndex = (99 - Math.abs(difference));
      const posX = (- difference*2)+'em';
      const posY = Math.abs(difference)+'em';
      const blurCover = Math.abs(difference)+'px';
      const objectPos = {
        transform:`translate(${posX},${posY})`,
        zIndex:zIndex,
        filter:`blur(${blurCover})`
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
      <section className="carousel">
        <div className="albums">
          {arrayAlbums}
          {albumsArray.length > 0 && <div className="album-infos">
            <h1>{albumSelected.artist}</h1>
            <h2>"{albumSelected.name}"</h2>
            <p>({albumSelected.year})</p>
            <p>{albumSelected.content}</p>
          </div>}
        </div>
      </section>
    </main>
  )
}
