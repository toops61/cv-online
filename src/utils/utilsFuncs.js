export const transformString = e => {
    let newString = e.toLowerCase();
    newString = newString.replace(/[éèêë]/ig,'e');
    newString = newString.replace(/[âáàåäã]/ig,'a');
    newString = newString.replace(/[îìïí]/ig,'i');
    newString = newString.replace(/[ôóòõøö]/ig,'o');
    newString = newString.replace(/[-]/ig,' ');
    return newString;
}

export const compareStrings = (a,b) => transformString(a) === transformString(b) ? true : false;