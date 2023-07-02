import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { updateGeneralParams } from "../../redux";

export default function BooksSearch() {
    const [bookSearch, setBookSearch] = useState('');
    const [searchIsbn, setSearchIsbn] = useState('');
    const [inputValid, setInputValid] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const isbnArray = [9780385086950,2010095847,2800112484,9782070619894,9782922148107,9782253183822,9782070601592,9782070612925]

    document.querySelector('.button-container')?.classList.add('hide');

    const dispatch = useDispatch();

    //fetch function
    const queryDynamic = async ({ queryKey }) => {
        const isbn = queryKey[1];
        const result = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`);
        return result.json();
    }

    //adapt response structure
    const handleData = (result) => {
        const resultFirst = result && result['ISBN:'+searchIsbn] ? result['ISBN:'+searchIsbn] : '';
        const resultObject = resultFirst && resultFirst.details ? resultFirst.details : '';
        const infos = resultFirst && resultFirst.info_url ? resultFirst.info_url : '';
        const tempObject = resultObject ? {
            author: resultObject.authors && resultObject.authors.length && resultObject.authors[0].name ? resultObject.authors[0].name : '',
            title:resultObject.title,
            publish_date:resultObject.publish_date,
            pages:resultObject.number_of_pages,
            publisher:resultObject.publishers[0],
            subject:resultObject.subjects && resultObject.subjects.length ? resultObject.subjects[0] : '',
            coverURL:resultObject.covers && resultObject.covers.length ? `https://covers.openlibrary.org/b/id/${resultObject.covers[0]}-M.jpg`: '',
            bigCoverURL:resultObject.covers && resultObject.covers.length ? `https://covers.openlibrary.org/b/id/${resultObject.covers[0]}-L.jpg`: '',
            infos
        } : '';
        return tempObject;
    }

    const { data,isLoading,error,refetch } = useQuery(['ISBN',searchIsbn],
        queryDynamic,{
        enabled: false,
        select: data => handleData(data),
        cacheTime: 1800000
        /*queryKey: ['ISBN:',searchIsbn],
        queryFn: () => searchIsbn ? queryDynamic(searchIsbn) : '',
        refetchOnMount: false,
        onSuccess: data => handleData(data), */
    })

    const handleInput = e => {
        let isbnEntered = e.target.value;
        setBookSearch(isbnEntered);
        let input = isbnEntered;
        const regExp = new RegExp(/[0-9]/);
        input = input.replace(/-/gi,'');
        const valid = (regExp.test(input) && (input.length === 10 || input.length === 13)) ? true : false;
        setInputValid(valid ? true : false);
    }

    const researchIsbn = e => {
        e.preventDefault();
        setSearchIsbn(inputValid ? bookSearch : '');
    }

    useEffect(() => {
        dispatch(updateGeneralParams({darkMode:true}));
        console.log(isbnArray);
    }, [])

    useEffect(() => {
      searchIsbn && refetch();
    }, [searchIsbn])
    

  return (
    <main className="books-page">
        <h1>Books Search</h1>
        <form onSubmit={researchIsbn}>
            <label htmlFor="country">ISBN : </label>
            <input 
                type="text" 
                name="country" 
                id="country" 
                onChange={handleInput} 
                value={bookSearch} 
                className={inputValid ? "valid" : ""} 
            />
            <button>Rechercher</button>
        </form>
        <section className="infos-container">
            {isLoading ? <Loader /> : <></>}
            {data ? <div className="infos-text">
                <h3><span>Titre :</span> {data.title}</h3>
                <p><span>Auteur(s) :</span> {data.author}</p>
                <p><span>Année de publication :</span> {data.publish_date}</p>
                {data.pages ? <p>{data.pages} pages</p> : <></>}
                <p><span>Editions :</span> {data.publisher}</p>
                {data.subject ? <p><span>Catégorie :</span> {data.subject}</p> : <></>}
                {data.infos ? <p><span>Plus d'infos sur </span> <a href={data.infos} target="_blank" rel="noreferrer">openlibrary</a></p> : <></>}
            </div> : <></>}
            {data?.coverURL ? <div className="cover">
                <img src={data.coverURL} alt="couverture" onClick={() => setFullScreen(true)} />
            </div> : <></>}
            {!data ? <h2>Pas de résultat</h2> : <></>}
            {!searchIsbn ? <h2>Entrez un numéro ISBN valide (10 ou 13)</h2> : <></>}
            {error ? <h2>{error}</h2> : <></>}
        </section>
        {fullScreen && data?.bigCoverURL ? <div className="fullscreen-image">
            <div className="large-cover">
                <img src={data.bigCoverURL} alt="couverture-large" />
                <div className="close" onClick={() => setFullScreen(false)}></div>
            </div>
            <h2>{data.author} : {data.title}</h2>
        </div> : <></>}
    </main>
  )
}
