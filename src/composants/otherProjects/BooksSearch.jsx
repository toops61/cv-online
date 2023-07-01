import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { updateGeneralParams } from "../../redux";

export default function BooksSearch() {
    const [searchIsbn, setSearchIsbn] = useState('');
    const [bookSearch, setBookSearch] = useState('');

    document.querySelector('.button-container')?.classList.add('hide');

    const dispatch = useDispatch();

    const queryDynamic = async isbnNumber => {
        const result = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnNumber}&jscmd=details&format=json`);
        return result.json();
    }

    const handleData = result => {
        const resultObject = result && result['ISBN:'+searchIsbn] && result['ISBN:'+searchIsbn].details ? result['ISBN:'+searchIsbn].details : '';
        const tempObject = resultObject ? {
            author: resultObject.authors && resultObject.authors.length && resultObject.authors[0].name ? resultObject.authors[0].name : '',
            title:resultObject.title,
            publish_date:resultObject.publish_date,
            pages:resultObject.pagination,
            publisher:resultObject.publishers[0],
            subject:resultObject.subjects && resultObject.subjects.length ? resultObject.subjects[0] : ''
        } : '';
        //setBook(tempObject);
        return tempObject;
    }

    const { data,isLoading,error } = useQuery({
        queryKey: [searchIsbn],
        queryFn: () => searchIsbn ? queryDynamic(searchIsbn) : console.log('no ISBN'),
        refetchOnMount: false,
        /* onSuccess: data => handleData(data), */
        select: data => handleData(data)
    })


    /* useEffect(() => {
        if (data && data['ISBN:'+searchIsbn] && data['ISBN:'+searchIsbn].details) {
            handleData();
        }
    }, [data]) */

    const handleInput = e => {
        let isbnEntered = e.target.value;
        setBookSearch(isbnEntered);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const isbn = e.target[0].value;
        setSearchIsbn(isbn);
    }

    useEffect(() => {
        dispatch(updateGeneralParams({darkMode:true}));
    }, [])

  return (
    <main className="books-page">
        <h1>Books Search</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="country">ISBN : </label>
            <input type="text" name="country" id="country" onChange={handleInput} value={bookSearch} />
            <button type="submit">Rechercher</button>
        </form>
        <section className="infos-container">
            {isLoading ? <Loader /> : <></>}
            {data ? <>
                <h3><span>Titre :</span> {data.title}</h3>
                <p><span>Auteur(s) :</span> {data.author}</p>
                <p><span>Année de publication :</span> {data.publish_date}</p>
                <p>{data.pages}</p>
                <p><span>Editions :</span> {data.publisher}</p>
                <p><span>Catégorie :</span> {data.subject}</p>
            </> : <></>}
            {data && !data['title'] ? <h2>Pas de résultat</h2> : <></>}
            {!searchIsbn ? <h2>Entrez une recherche</h2> : <></>}
            {error ? <h2>{error}</h2> : <></>}
        </section>
    </main>
  )
}
